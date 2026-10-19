import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Stethoscope, 
  Copy, 
  Check, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  AlertTriangle,
  Scale,
  FileCheck2,
  PhoneCall
} from 'lucide-react';
import { objectionCards, ObjectionCard } from '../data/playbookData';

export const PlaybookView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'Secretária / Recepção (Gatekeeper)' | 'Médico Parceiro'>('Secretária / Recepção (Gatekeeper)');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<ObjectionCard>(objectionCards[0]);

  const filteredCards = objectionCards.filter(c => c.categoria === activeCategory);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Playbook de Abordagem & Quebra de Barreiras</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Scripts testados e validados para transformar a recepcionista em aliada e apresentar a PlanePrev ao médico em total conformidade ética com o CFM.
          </p>
        </div>

        {/* Category Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setActiveCategory('Secretária / Recepção (Gatekeeper)');
              setSelectedCard(objectionCards.find(c => c.categoria === 'Secretária / Recepção (Gatekeeper)') || objectionCards[0]);
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeCategory === 'Secretária / Recepção (Gatekeeper)'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Secretária / Recepção</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('Médico Parceiro');
              setSelectedCard(objectionCards.find(c => c.categoria === 'Médico Parceiro') || objectionCards[3]);
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeCategory === 'Médico Parceiro'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Médico Parceiro</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Objections List + Deep View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List: Objections */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Objeções Mais Frequentes em Campo ({filteredCards.length})
          </h3>

          {filteredCards.map((card) => {
            const isSelected = selectedCard?.id === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-teal-400 text-white shadow-lg ring-1 ring-teal-400/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <HelpCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                  <div>
                    <h4 className="text-xs font-bold leading-snug">"{card.objecao}"</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {card.gatilhoMental}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail: Full Response & Strategy */}
        <div className="lg:col-span-7">
          {selectedCard && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5 shadow-xl">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {selectedCard.categoria}
                </span>
                <h3 className="text-base font-bold text-white mt-2">
                  Objeção: "{selectedCard.objecao}"
                </h3>
                <div className="mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold block mb-0.5">O que a pessoa realmente quer dizer (Subtexto):</span>
                  {selectedCard.subtexto}
                </div>
              </div>

              {/* Script Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Script Literal Recomendado de Resposta</span>
                  </span>

                  <button
                    onClick={() => handleCopy(selectedCard.id, selectedCard.respostaSugerida)}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-semibold bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40 transition cursor-pointer"
                  >
                    {copiedId === selectedCard.id ? <Check className="w-3 h-3 text-teal-300" /> : <Copy className="w-3 h-3 text-teal-300" />}
                    <span>{copiedId === selectedCard.id ? 'Copiado!' : 'Copiar Script'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/30 text-xs md:text-sm text-slate-100 font-sans leading-relaxed">
                  "{selectedCard.respostaSugerida}"
                </div>
              </div>

              {/* Strategy & Psychological Trigger */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-1.5 text-amber-300 font-semibold mb-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Gatilho Psicológico</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {selectedCard.gatilhoMental}
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-1.5 text-emerald-300 font-semibold mb-1">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Dica Prática de Postura em Campo</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {selectedCard.dicaPratica}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compliance Guidelines for Representatives */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center space-x-2 text-white font-bold text-base">
          <Scale className="w-5 h-5 text-teal-400" />
          <h3>Manual de Conformidade Ética PlanePrev com o CFM</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-teal-400 block">1. Zero Comissões a Médicos</span>
            <p className="text-slate-400 leading-relaxed">
              O artigo 68 do Código de Ética Médica proíbe recebimento de vantagens financeiras de terceiros. A PlanePrev nunca oferece divisão de honorários ou bonificações. A parceria é 100% de apoio assistencial ao paciente e desoneração do consultório.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-teal-400 block">2. Papel Restrito do Laudo Médico</span>
            <p className="text-slate-400 leading-relaxed">
              O médico não atua como perito ou juiz. Seu laudo apenas atesta a veracidade clínica da patologia, data dos primeiros sintomas e o CID. Todo o enquadramento na Lei 7.713/88 ou Lei 8.213/91 é conduzido exclusivamente pela equipe jurídica da PlanePrev.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-teal-400 block">3. Consentimento do Paciente (LGPD)</span>
            <p className="text-slate-400 leading-relaxed">
              Qualquer encaminhamento de paciente pela clínica deve conter a expressa autorização do titular ou de seu responsável familiar, garantindo respeito irrestrito à LGPD e ao sigilo médico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
