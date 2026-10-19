import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { PresentationView } from './components/PresentationView';
import { DailyRouteView } from './components/DailyRouteView';
import { DoctorPipelineView } from './components/DoctorPipelineView';
import { SpecialtyPitchesView } from './components/SpecialtyPitchesView';
import { B2BFollowUpView } from './components/B2BFollowUpView';
import { B2BPromptSheetsView } from './components/B2BPromptSheetsView';
import { AiCoPilotDrawer } from './components/AiCoPilotDrawer';
import { ShieldCheck, Stethoscope, Building2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('roteiro');
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAi={() => setIsAiOpen(true)}
      />

      {/* Main Operational Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === 'apresentacao' && (
          <PresentationView onGoToCrm={() => setActiveTab('roteiro')} />
        )}

        {activeTab === 'roteiro' && (
          <DailyRouteView />
        )}

        {activeTab === 'pipeline_medicos' && (
          <DoctorPipelineView />
        )}

        {activeTab === 'scripts_especialidades' && (
          <SpecialtyPitchesView />
        )}

        {activeTab === 'followup_b2b' && (
          <B2BFollowUpView />
        )}

        {activeTab === 'prompt_sheets' && (
          <B2BPromptSheetsView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">PlanePrev</span>
            <span>• Prospecção &amp; Parcerias com Médicos e Clínicas</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Prospecção de Clínicas B2B</span>
            </span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conformidade Ética CFM</span>
            </span>
          </div>
        </div>
      </footer>

      {/* AI Assistant Drawer */}
      <AiCoPilotDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />
    </div>
  );
}
