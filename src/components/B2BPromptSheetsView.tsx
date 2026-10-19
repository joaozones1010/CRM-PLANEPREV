import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Code, 
  Building2, 
  Stethoscope
} from 'lucide-react';
import { buildB2BMasterPrompt } from '../data/b2bProspectingData';

export const B2BPromptSheetsView: React.FC = () => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'planilhas' | 'script'>('prompt');

  const b2bPrompt = buildB2BMasterPrompt();

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(b2bPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadPrompt = () => {
    const blob = new Blob([b2bPrompt], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PlanePrev_Prospeccao_Medicos_Clinicas_B2B.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCsvDoctors = () => {
    const prospects = typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('planeprev_carteira_medicos_v1') || '[]')) : [];
    
    const header = [
      'ID_Medico', 'Nome_Medico', 'CRM_UF', 'Especialidade',
      'Clinica_Hospital', 'Endereco', 'Bairro_Cidade', 'Secretaria',
      'Telefone_Secretaria', 'Telefone_Medico', 'Melhor_Horario',
      'Status_Parceria', 'Data_Ultima_Visita', 'Proxima_Visita',
      'Material_Entregue', 'Termo_Assinado', 'Potencial_Volume', 'Observacoes'
    ].join(';');

    const rows = (prospects.length > 0 ? prospects : []).map((d: any) => [
      d.id, `"${d.nome}"`, d.crm, `"${d.especialidade}"`,
      `"${d.clinica}"`, `"${d.endereco}"`, `"${d.cidadeBairro}"`,
      `"${d.secretaria}"`, d.telefoneSecretaria, d.telefoneMedico,
      `"${d.melhorHorario}"`, d.statusParceria, d.dataUltimaVisita,
      d.proximaVisita, `"${d.materialEntregue}"`, d.termoAssinado ? 'SIM' : 'NÃO',
      d.potencialVolume, `"${d.observacoes}"`
    ].join(';'));

    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PlanePrev_Carteira_Medicos_Clinicas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const b2bAppsScript = `/**
 * PLANEPREV - GOOGLE APPS SCRIPT DE PROSPECÇÃO B2B (MÉDICOS & CLÍNICAS)
 * Envia lembretes diários das visitas agendadas para o representante externo.
 */
function dailyDoctorVisitsReminder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('01_Carteira_Medicos_Clinicas');
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const hoje = Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd');
  let visitasHoje = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const medico = row[1];
    const clinica = row[4];
    const secretaria = row[7];
    const telSecretaria = row[8];
    const melhorHorario = row[10];
    const proximaVisita = row[13];

    let dataFormatada = '';
    if (proximaVisita instanceof Date) {
      dataFormatada = Utilities.formatDate(proximaVisita, 'GMT-3', 'yyyy-MM-dd');
    } else {
      dataFormatada = proximaVisita.toString();
    }

    if (dataFormatada === hoje) {
      visitasHoje.push({
        medico: medico,
        clinica: clinica,
        secretaria: secretaria,
        tel: telSecretaria,
        horario: melhorHorario
      });
    }
  }

  if (visitasHoje.length > 0) {
    let emailText = 'PlanePrev - Roteiro de Visitas Médicas de Hoje (' + visitasHoje.length + ' clínicas):\\n\\n';
    visitasHoje.forEach(v => {
      emailText += '• ' + v.medico + ' (' + v.clinica + ') - Horário: ' + v.horario + ' | Secretária: ' + v.secretaria + ' (' + v.tel + ')\\n';
    });
    MailApp.sendEmail('representante@planeprev.com.br', '🩺 Roteiro de Prospecção Médica: ' + visitasHoje.length + ' Visitas Agendadas Hoje', emailText);
  }
}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Super Prompt B2B &amp; Planilhas Google Sheets</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prompt estruturado para o Google AI Studio e planilhas focadas 100% em prospecção de médicos e clínicas parceiras.
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
            Super Prompt B2B (AI Studio)
          </button>
          <button
            onClick={() => setActiveTab('planilhas')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'planilhas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Baixar Planilha (CSV)
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
              <h3 className="text-sm font-bold text-slate-900">Prompt Mestre de Prospecção B2B para o Google AI Studio</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Otimizado para geração de roteiros, argumentos com médicos e clínicas, sem menção a honorários ou clientes pessoa física.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyPrompt}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition cursor-pointer"
              >
                {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPrompt ? 'Prompt Copiado!' : 'Copiar Prompt B2B'}</span>
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

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs overflow-hidden">
            <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200">
              {b2bPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 2: CSV */}
      {activeTab === 'planilhas' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Exportar Carteira de Médicos &amp; Clínicas para Google Sheets</h3>
            <p className="text-xs text-slate-500">
              Importe este arquivo no seu Google Drive para gerenciar sua carteira de parceiros médicos em formato de planilha.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">PlanePrev_Carteira_Medicos_Clinicas.csv</h4>
              <p className="text-xs text-slate-500">
                Colunas: Nome do Médico, CRM, Especialidade, Clínica, Endereço, Secretária, Telefone Direto, Melhor Horário, Status do Termo e Materiais
              </p>
            </div>
            <button
              onClick={handleDownloadCsvDoctors}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Planilha CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: APPS SCRIPT */}
      {activeTab === 'script' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Google Apps Script: Notificações de Visitas a Clínicas</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispara um e-mail com as clínicas e médicos que você tem agendado para visitar hoje de manhã.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(b2bAppsScript);
                setCopiedScript(true);
                setTimeout(() => setCopiedScript(false), 2000);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition cursor-pointer"
            >
              {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedScript ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200">
              {b2bAppsScript}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
