import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Grid, 
  FileText, 
  Bell, 
  Eye, 
  FileSpreadsheet, 
  Stethoscope, 
  Scale, 
  Search, 
  ClipboardCheck, 
  TrendingUp, 
  Handshake, 
  Shield, 
  Clock, 
  UserCheck, 
  BarChart2, 
  Sparkles,
  ExternalLink,
  Play,
  RotateCcw
} from 'lucide-react';

interface PresentationViewProps {
  onGoToCrm?: () => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ onGoToCrm }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = 9;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        }
        setShowOverview(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 md:p-8' : 'space-y-4'
      }`}
    >
      {/* Top Presentation Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
            Slide {currentSlide + 1} de {totalSlides}
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Use as setas do teclado (← / →) ou a barra de espaço para navegar
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Overview Toggle */}
          <button
            onClick={() => setShowOverview(!showOverview)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              showOverview 
                ? 'bg-teal-600 text-white border-teal-600' 
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
            title="Ver todos os 9 slides em grade"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visão Geral dos Slides</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            title="Modo Tela Cheia para Apresentação em Reunião"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Sair da Tela Cheia' : 'Modo Reunião (Tela Cheia)'}</span>
          </button>

          {/* Slide Navigation Buttons */}
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              title="Slide anterior (Seta esquerda)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-30 disabled:hover:bg-teal-600 text-white transition cursor-pointer shadow-xs"
              title="Próximo slide (Seta direita)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Canvas or Overview Grid */}
      {showOverview ? (
        /* Slide Grid Overview */
        <div className="bg-slate-100/70 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-800">Selecione qualquer slide para apresentar:</h3>
            <span className="text-xs text-slate-500">Clique para pular direto para o ponto desejado na reunião</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, i) => (
              <button
                key={num}
                onClick={() => {
                  setCurrentSlide(i);
                  setShowOverview(false);
                }}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between h-36 ${
                  currentSlide === i 
                    ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-md' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Slide {num}
                  </span>
                  {currentSlide === i && (
                    <span className="text-[10px] font-semibold text-teal-700">Ativo</span>
                  )}
                </div>
                <div className="my-auto">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {i === 0 && 'PlanePrev - Apresentação da ferramenta'}
                    {i === 1 && 'O desafio da rotina comercial'}
                    {i === 2 && 'A solução: três pilares'}
                    {i === 3 && 'CRM: do primeiro contato ao fechamento'}
                    {i === 4 && 'Matriz de especialidades médicas'}
                    {i === 5 && 'Qualificação previdenciária e tributária'}
                    {i === 6 && 'A ferramenta no dia a dia'}
                    {i === 7 && 'Benefícios para o representante'}
                    {i === 8 && 'Organização que vira resultado'}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400">Clique para abrir</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Widescreen 16:9 Slide Presentation Frame */
        <div className="relative w-full aspect-16/9 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col select-none">
          
          {/* SLIDE 1: Capa Institucional PlanePrev */}
          {currentSlide === 0 && (
            <div className="relative w-full h-full bg-[#0d272d] text-white p-8 md:p-16 flex flex-col justify-between overflow-hidden">
              {/* Organic geometric circular layers */}
              <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#174148] opacity-60 pointer-events-none" />
              <div className="absolute right-10 bottom-[-60px] w-80 h-80 rounded-full bg-[#27534c] opacity-50 pointer-events-none" />
              <div className="absolute right-[-40px] bottom-[-20px] w-64 h-64 rounded-full bg-[#1b3c41] opacity-70 pointer-events-none" />

              <div className="relative z-10 space-y-4 max-w-2xl">
                <span className="text-[11px] md:text-xs font-bold tracking-[0.3em] uppercase text-[#e9a159] block">
                  SAÚDE PREVIDENCIÁRIA
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-white leading-tight">
                  PlanePrev
                </h1>
                <p className="text-base md:text-2xl text-slate-200 font-light leading-snug pt-2">
                  CRM &amp; Gestão Comercial para representantes externos
                </p>
              </div>

              <div className="relative z-10 pt-8 border-t border-teal-900/40">
                <span className="text-xs md:text-sm text-slate-400 font-light">
                  Apresentação da ferramenta
                </span>
              </div>
            </div>
          )}

          {/* SLIDE 2: O desafio da rotina comercial */}
          {currentSlide === 1 && (
            <div className="w-full h-full bg-[#fafbfb] p-8 md:p-14 flex flex-col justify-between text-slate-800">
              <h2 className="text-2xl md:text-3xl font-serif font-black text-[#0f2e35] tracking-tight">
                O desafio da rotina comercial
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto items-center">
                {/* Left Highlight */}
                <div className="md:col-span-5 pr-4">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#0e3b43] leading-snug tracking-tight">
                    Vender saúde previdenciária exige organização e método
                  </h3>
                </div>

                {/* Right 3 Bullet Points with Icons */}
                <div className="md:col-span-7 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-11 h-11 rounded-full bg-[#0d5963] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Informação espalhada</h4>
                      <p className="text-xs md:text-sm text-slate-600 mt-0.5">
                        Contatos, propostas e histórico em vários lugares
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-11 h-11 rounded-full bg-[#0d5963] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Follow-up que escapa</h4>
                      <p className="text-xs md:text-sm text-slate-600 mt-0.5">
                        Retornos esquecidos viram oportunidades perdidas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-11 h-11 rounded-full bg-[#0d5963] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Pouca visibilidade</h4>
                      <p className="text-xs md:text-sm text-slate-600 mt-0.5">
                        Difícil enxergar o funil e priorizar o que importa
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                2
              </div>
            </div>
          )}

          {/* SLIDE 3: A solução: três pilares */}
          {currentSlide === 2 && (
            <div className="w-full h-full bg-[#fafbfb] p-8 md:p-14 flex flex-col justify-between text-slate-800">
              <h2 className="text-2xl md:text-3xl font-serif font-black text-[#0f2e35] tracking-tight">
                A solução: três pilares
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-auto">
                {/* Pillar 1 */}
                <div className="bg-[#f0f4f5] rounded-2xl p-6 flex flex-col justify-between h-56 md:h-64 shadow-2xs border border-slate-200/60">
                  <div className="w-12 h-12 rounded-xl bg-[#0d5963] text-white flex items-center justify-center mb-4">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      CRM no Google Sheets
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">
                      Gestão de contatos e oportunidades em planilha, acessível de qualquer lugar
                    </p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="bg-[#f0f4f5] rounded-2xl p-6 flex flex-col justify-between h-56 md:h-64 shadow-2xs border border-slate-200/60">
                  <div className="w-12 h-12 rounded-xl bg-[#0d5963] text-white flex items-center justify-center mb-4">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      Matriz de especialidades médicas
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">
                      Visão organizada das especialidades para direcionar a abordagem
                    </p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="bg-[#f0f4f5] rounded-2xl p-6 flex flex-col justify-between h-56 md:h-64 shadow-2xs border border-slate-200/60">
                  <div className="w-12 h-12 rounded-xl bg-[#0d5963] text-white flex items-center justify-center mb-4">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      Qualificação previdenciária e tributária
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">
                      Critérios para identificar o perfil e o potencial de cada lead
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                3
              </div>
            </div>
          )}

          {/* SLIDE 4: CRM: do primeiro contato ao fechamento */}
          {currentSlide === 3 && (
            <div className="w-full h-full bg-[#fafbfb] p-8 md:p-14 flex flex-col justify-between text-slate-800">
              <h2 className="text-2xl md:text-3xl font-serif font-black text-[#0f2e35] tracking-tight">
                CRM: do primeiro contato ao fechamento
              </h2>

              <div className="my-auto space-y-8">
                {/* 4 Connected Step Nodes */}
                <div className="flex items-center justify-between max-w-3xl mx-auto relative px-4">
                  {/* Dashed Connecting Line */}
                  <div className="absolute left-10 right-10 top-6 border-t-2 border-dashed border-slate-300 z-0" />

                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                      <span className="absolute -top-2 right-0 text-[10px] font-bold text-slate-500 font-mono">1</span>
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0d5963] text-white flex items-center justify-center shadow-sm">
                        <Search className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-900 mt-2">Prospecção</span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                      <span className="absolute -top-2 right-0 text-[10px] font-bold text-slate-500 font-mono">2</span>
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0d5963] text-white flex items-center justify-center shadow-sm">
                        <ClipboardCheck className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-900 mt-2">Qualificação</span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                      <span className="absolute -top-2 right-0 text-[10px] font-bold text-slate-500 font-mono">3</span>
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0d5963] text-white flex items-center justify-center shadow-sm">
                        <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-900 mt-2">Proposta</span>
                  </div>

                  {/* Step 4: Fechamento (Destaque em Laranja) */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                      <span className="absolute -top-2 right-0 text-[10px] font-bold text-slate-500 font-mono">4</span>
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#e9a159] text-white flex items-center justify-center shadow-sm">
                        <Handshake className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-900 mt-2">Fechamento</span>
                  </div>
                </div>

                {/* Bottom Callout Box */}
                <div className="bg-[#eef4f4] rounded-xl p-4 md:p-5 max-w-3xl mx-auto border border-teal-200/50">
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                    Cada oportunidade fica registrada na planilha, com status e histórico, para que nenhum contato se perca no caminho.
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                4
              </div>
            </div>
          )}

          {/* SLIDE 5: Matriz de especialidades médicas */}
          {currentSlide === 4 && (
            <div className="w-full h-full bg-[#fafbfb] p-8 md:p-14 flex flex-col justify-between text-slate-800">
              <h2 className="text-2xl md:text-3xl font-serif font-black text-[#0f2e35] tracking-tight">
                Matriz de especialidades médicas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto items-center">
                {/* Left Text */}
                <div className="md:col-span-5 space-y-6">
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    Organiza as especialidades para que o representante saiba como e com quem conversar.
                  </p>
                  <h3 className="text-xl md:text-2xl font-extrabold text-[#0e3b43] leading-snug">
                    Abordagem direcionada por perfil profissional
                  </h3>
                </div>

                {/* Right Specialty Pills Grid */}
                <div className="md:col-span-7 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="py-3 px-4 rounded-xl font-semibold text-center text-xs md:text-sm bg-[#0d5963] text-white shadow-xs">
                      Cardiologia
                    </div>
                    <div className="py-3 px-4 rounded-xl font-semibold text-center text-xs md:text-sm bg-[#eef3f4] text-slate-800 border border-slate-200/60">
                      Ortopedia
                    </div>

                    <div className="py-3 px-4 rounded-xl font-semibold text-center text-xs md:text-sm bg-[#eef3f4] text-slate-800 border border-slate-200/60">
                      Psiquiatria
                    </div>
                    <div className="py-3 px-4 rounded-xl font-semibold text-center text-xs md:text-sm bg-[#0d5963] text-white shadow-xs">
                      Oftalmologia
                    </div>

                    <div className="py-3 px-4 rounded-xl font-semibold text-center text-xs md:text-sm bg-[#eef3f4] text-slate-800 border border-slate-200/60">
                      Neurologia
                    </div>
                    <div className="py-3 px-4 rounded-xl font-semibold text-center text-xs md:text-sm bg-[#eef3f4] text-slate-800 border border-slate-200/60">
                      Clínica Geral
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 italic block text-center pt-1">
                    Exemplos de especialidades
                  </span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                5
              </div>
            </div>
          )}

          {/* SLIDE 6: Qualificação previdenciária e tributária */}
          {currentSlide === 5 && (
            <div className="w-full h-full bg-[#fafbfb] p-8 md:p-14 flex flex-col justify-between text-slate-800">
              <h2 className="text-2xl md:text-3xl font-serif font-black text-[#0f2e35] tracking-tight">
                Qualificação previdenciária e tributária
              </h2>

              <div className="my-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                  {/* Card 1: Perfil Previdenciário (Escuro/Teal) */}
                  <div className="bg-[#0d272d] text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#e9a159] text-white flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white">
                        Perfil previdenciário
                      </h3>
                    </div>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                      Entender a situação do profissional quanto à previdência e à proteção de renda
                    </p>
                  </div>

                  {/* Card 2: Perfil Tributário (Cinza Suave) */}
                  <div className="bg-[#f0f4f5] text-slate-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-4 shadow-2xs border border-slate-200/60">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0d5963] text-white flex items-center justify-center shrink-0">
                        <Scale className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-slate-900">
                        Perfil tributário
                      </h3>
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                      Mapear o enquadramento fiscal para avaliar aderência e potencial da oferta
                    </p>
                  </div>
                </div>

                {/* Bottom Result Highlight */}
                <div className="text-center pt-2">
                  <p className="text-xs md:text-sm font-bold text-[#0e3b43]">
                    Resultado: leads priorizados com critério, e tempo dedicado a quem tem mais potencial.
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                6
              </div>
            </div>
          )}

          {/* SLIDE 7: A ferramenta no dia a dia */}
          {currentSlide === 6 && (
            <div className="w-full h-full bg-[#fafbfb] p-8 md:p-14 flex flex-col justify-between text-slate-800">
              <h2 className="text-2xl md:text-3xl font-serif font-black text-[#0f2e35] tracking-tight">
                A ferramenta no dia a dia
              </h2>

              <div className="my-auto max-w-3xl mx-auto w-full">
                {/* 3 Step Timeline */}
                <div className="flex items-start justify-between relative px-2">
                  {/* Dashed line */}
                  <div className="absolute left-12 right-12 top-6 border-t-2 border-dashed border-slate-300 z-0" />

                  {/* Step 1: Início do dia */}
                  <div className="relative z-10 flex flex-col items-center text-center max-w-[180px]">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0d5963] text-white flex items-center justify-center shadow-sm">
                      <Clock className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 mt-3">Início do dia</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Consultar follow-ups e prioridades do dia
                    </p>
                  </div>

                  {/* Step 2: Durante os contatos */}
                  <div className="relative z-10 flex flex-col items-center text-center max-w-[180px]">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0d5963] text-white flex items-center justify-center shadow-sm">
                      <UserCheck className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 mt-3">Durante os contatos</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Qualificar o lead e registrar as informações na hora
                    </p>
                  </div>

                  {/* Step 3: Fim do dia */}
                  <div className="relative z-10 flex flex-col items-center text-center max-w-[180px]">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0d5963] text-white flex items-center justify-center shadow-sm">
                      <BarChart2 className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 mt-3">Fim do dia</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Atualizar status e planejar os próximos passos
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                7
              </div>
            </div>
          )}

          {/* SLIDE 8: Benefícios para o representante */}
          {currentSlide === 7 && (
            <div className="w-full h-full bg-[#fafbfb] p-8 md:p-14 flex flex-col justify-between text-slate-800">
              <h2 className="text-2xl md:text-3xl font-serif font-black text-[#0f2e35] tracking-tight">
                Benefícios para o representante
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto max-w-3xl mx-auto w-full">
                {/* Benefit 01 */}
                <div className="bg-[#f0f4f5] rounded-xl p-5 md:p-6 flex items-start space-x-4 border border-slate-200/60 shadow-2xs">
                  <span className="text-3xl md:text-4xl font-extrabold text-[#e9a159] font-sans leading-none shrink-0">
                    01
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Organização</h3>
                    <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                      Tudo centralizado em um só lugar
                    </p>
                  </div>
                </div>

                {/* Benefit 02 */}
                <div className="bg-[#f0f4f5] rounded-xl p-5 md:p-6 flex items-start space-x-4 border border-slate-200/60 shadow-2xs">
                  <span className="text-3xl md:text-4xl font-extrabold text-[#e9a159] font-sans leading-none shrink-0">
                    02
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Foco</h3>
                    <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                      Prioridade para os leads com mais potencial
                    </p>
                  </div>
                </div>

                {/* Benefit 03 */}
                <div className="bg-[#f0f4f5] rounded-xl p-5 md:p-6 flex items-start space-x-4 border border-slate-200/60 shadow-2xs">
                  <span className="text-3xl md:text-4xl font-extrabold text-[#e9a159] font-sans leading-none shrink-0">
                    03
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Acesso fácil</h3>
                    <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                      Google Sheets: simples, na nuvem e compartilhável
                    </p>
                  </div>
                </div>

                {/* Benefit 04 */}
                <div className="bg-[#f0f4f5] rounded-xl p-5 md:p-6 flex items-start space-x-4 border border-slate-200/60 shadow-2xs">
                  <span className="text-3xl md:text-4xl font-extrabold text-[#e9a159] font-sans leading-none shrink-0">
                    04
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Controle</h3>
                    <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                      Visão clara do funil e da evolução comercial
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                8
              </div>
            </div>
          )}

          {/* SLIDE 9: Conclusão - Organização que vira resultado */}
          {currentSlide === 8 && (
            <div className="relative w-full h-full bg-[#0d272d] text-white p-8 md:p-16 flex flex-col justify-between overflow-hidden">
              {/* Organic geometric circular layers */}
              <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#174148] opacity-60 pointer-events-none" />
              <div className="absolute right-10 bottom-[-60px] w-80 h-80 rounded-full bg-[#27534c] opacity-50 pointer-events-none" />

              <div className="relative z-10 space-y-4 max-w-2xl my-auto">
                <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-white leading-tight">
                  Organização que vira resultado
                </h2>
                <p className="text-sm md:text-lg text-slate-300 font-light">
                  PlanePrev: CRM &amp; Gestão Comercial em Saúde Previdenciária
                </p>

                <div className="pt-4">
                  <span className="inline-block px-6 py-2.5 rounded-full bg-[#e9a159] text-slate-950 font-bold text-xs md:text-sm tracking-wide shadow-md">
                    gestaocrm.ai.studio
                  </span>
                </div>
              </div>

              {onGoToCrm && (
                <div className="relative z-10 pt-4 flex justify-between items-center border-t border-teal-900/40">
                  <span className="text-xs text-slate-400">
                    Fim da apresentação institucional
                  </span>
                  <button
                    onClick={onGoToCrm}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-teal-200 border border-teal-500/30 transition cursor-pointer"
                  >
                    <span>Ir para o CRM Operacional</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Quick Jump Dots Bar */}
      {!showOverview && (
        <div className="flex items-center justify-center space-x-2 py-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx 
                  ? 'w-8 bg-teal-600' 
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
