import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  BookOpen, 
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { mockCidLaws, CidLawItem } from '../data/crmSheetsData';

export const CidGuideView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [copiedCid, setCopiedCid] = useState<string | null>(null);

  const filteredCids = mockCidLaws.filter(c => {
    return c.patologia.toLowerCase().includes(query.toLowerCase()) ||
           c.cid.toLowerCase().includes(query.toLowerCase()) ||
           c.servico.toLowerCase().includes(query.toLowerCase());
  });

  const handleCopyDocs = (cid: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCid(cid);
    setTimeout(() => setCopiedCid(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900">Guia Rápido de CIDs & Direitos Previdenciários</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Consulte em segundos qual direito protege o paciente, o enquadramento na lei e os documentos clínicos que devem constar no laudo.
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['Câncer', 'Rim', 'Infarto', 'Fratura', 'Parkinson'].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Big Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Digite o nome da doença ou código do CID (Ex: C61, Neoplasia, Infarto, Fratura de fêmur, Rim...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white shadow-inner"
          />
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredCids.map((item, idx) => {
          const isUrgent = item.urgencia === 'P1-Crítica';

          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                    CID {item.cid}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{item.patologia}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    isUrgent ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {item.urgencia}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {item.servico}
                  </span>
                </div>
              </div>

              {/* Legal & Medical Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-900 block flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Enquadramento Legal & Jurisprudência:</span>
                  </span>
                  <p className="text-slate-800 font-medium">{item.enquadramentoLegal}</p>
                  <p className="text-slate-600 italic text-[11px] pt-1 border-t border-slate-200/80">
                    {item.jurisprudencia}
                  </p>
                </div>

                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Documentos Médicos a Solicitar:</span>
                    </span>

                    <button
                      onClick={() => handleCopyDocs(item.cid, item.documentosMandatorios)}
                      className="text-[11px] text-teal-700 hover:text-teal-900 flex items-center space-x-1 cursor-pointer font-medium"
                    >
                      {copiedCid === item.cid ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCid === item.cid ? 'Copiado' : 'Copiar Lista'}</span>
                    </button>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {item.documentosMandatorios}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCids.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            Nenhuma patologia encontrada para "{query}". Tente buscar por "câncer", "joelho", "infarto" ou "rim".
          </div>
        )}
      </div>
    </div>
  );
};
