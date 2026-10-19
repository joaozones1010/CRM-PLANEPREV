import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Code, 
  BookOpen, 
  FileText
} from 'lucide-react';
import { buildMasterPrompt, defaultPromptParams } from '../data/masterPrompt';
import { generateCsv, googleAppsScriptTemplate } from '../data/crmSheetsData';

export const SheetsPromptView: React.FC = () => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'planilhas' | 'script'>('prompt');

  const masterPrompt = buildMasterPrompt(defaultPromptParams);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(masterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadPrompt = () => {
    const blob = new Blob([masterPrompt], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PlanePrev_SuperPrompt_GoogleAIStudio.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCsv = (sheetKey: 'pipeline' | 'medicos' | 'cids' | 'followup') => {
    const csv = generateCsv(sheetKey);
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PlanePrev_${sheetKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(googleAppsScriptTemplate);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Super Prompt & Arquitetura Google Sheets</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Recursos estruturados para uso no Google AI Studio, planilhas do Google Sheets e automações com Google Apps Script.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'prompt' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Super Prompt AI Studio
          </button>
          <button
            onClick={() => setActiveTab('planilhas')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'planilhas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Baixar Modelos (CSV)
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'script' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Apps Script
          </button>
        </div>
      </div>

      {/* SECTION 1: PROMPT */}
      {activeTab === 'prompt' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Prompt Estruturado para o Google AI Studio</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Contém o modelo de gestão completo, regras do CRM, critérios de especialidades, playbook CFM e fluxos de urgência.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyPrompt}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPrompt ? 'Prompt Copiado!' : 'Copiar Prompt Completo'}</span>
              </button>

              <button
                onClick={handleDownloadPrompt}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Baixar .md</span>
              </button>
            </div>
          </div>

          {/* Prompt Viewer Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs overflow-hidden">
            <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200">
              {masterPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 2: CSV DOWNLOADS */}
      {activeTab === 'planilhas' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Exportar Estrutura das 5 Abas do Google Sheets</h3>
            <p className="text-xs text-slate-500">
              Faça o download dos arquivos no formato CSV e importe diretamente em uma nova planilha do Google Drive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">01_Pipeline_Leads.csv</h4>
                <p className="text-xs text-slate-500">Registro de pacientes, diagnósticos, CIDs, status e honorários</p>
              </div>
              <button
                onClick={() => handleDownloadCsv('pipeline')}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar CSV</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">02_Medicos_e_Clinicas.csv</h4>
                <p className="text-xs text-slate-500">CRM dos médicos parceiros, contato das secretárias e horários</p>
              </div>
              <button
                onClick={() => handleDownloadCsv('medicos')}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar CSV</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">03_Matriz_CIDs_Previdenciario.csv</h4>
                <p className="text-xs text-slate-500">Dicionário de doenças graves, leis e documentos periciais</p>
              </div>
              <button
                onClick={() => handleDownloadCsv('cids')}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar CSV</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">04_Regua_FollowUp.csv</h4>
                <p className="text-xs text-slate-500">Cronograma de mensagens D+0 a D+30 e gatilhos de nutrição</p>
              </div>
              <button
                onClick={() => handleDownloadCsv('followup')}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: APPS SCRIPT */}
      {activeTab === 'script' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Código Google Apps Script (Automação de Alertas)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cole no editor de scripts do seu Google Sheets (Extensões &gt; Apps Script) para receber e-mails diários de follow-up.
              </p>
            </div>

            <button
              onClick={handleCopyScript}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition cursor-pointer"
            >
              {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedScript ? 'Código Copiado!' : 'Copiar Código Apps Script'}</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200">
              {googleAppsScriptTemplate}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
