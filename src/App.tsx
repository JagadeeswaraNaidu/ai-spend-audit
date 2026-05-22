import { useState } from 'react';
import { SpendForm } from './components/SpendForm';
import { AuditResults } from './components/AuditResults';
import { runComprehensiveAudit } from '../lib/audit';
import { AuditInput, AuditResult } from '../lib/audit/types';
import { ShieldCheck, BarChart3, Coins } from 'lucide-react';

function App() {
  const [auditResults, setAuditResults] = useState<AuditResult | null>(null);

  const handleCalculateAudit = (input: AuditInput) => {
    const computedReport = runComprehensiveAudit(input);
    setAuditResults(computedReport);
    // Smoothly scroll back to the top of the viewport to display the results hero element
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFormState = () => {
    setAuditResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* GLOBAL APPLICATION GLOWING MARKETING NAVBAR */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-md shadow-indigo-500/20">
              <Coins size={18} />
            </div>
            <span className="font-black text-lg tracking-tight text-white">
              Credex <span className="text-indigo-400 font-medium text-sm">SpendAudit</span>
            </span>
          </div>
          
          <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Pure Client-Side Math</span>
            <span className="flex items-center gap-1.5"><BarChart3 size={14} className="text-indigo-400" /> 2026 Reference Calibrated</span>
          </div>
        </div>
      </header>

      {/* CORE WRAPPER SCENE AREA */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!auditResults ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Contextual Landing Sub-Hero section */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                Audit Your Team's <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">AI Spend</span> Instantly
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Stop leaking budget on redundant developer seats, untracked API keys, and mismatched plans. Run our standalone engine to see what you should be paying.
              </p>
            </div>

            <SpendForm onAuditSubmit={handleCalculateAudit} />
          </div>
        ) : (
          <AuditResults results={auditResults} onReset={handleResetFormState} />
        )}
      </main>

      {/* MINIMALIST COMPLIANT RUNTIME FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 text-center py-6 text-xs text-slate-600 tracking-wide mt-12">
        &copy; 2026 Credex Corporate Infrastructure Systems. All rights reserved. Secure open-source pipeline distribution.
      </footer>
    </div>
  );
}

export default App;