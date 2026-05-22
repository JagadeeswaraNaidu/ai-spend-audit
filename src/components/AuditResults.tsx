import React from 'react';
import { AuditResult, ToolName } from '../lib/audit/types';
import { ArrowDownRight, CheckCircle2, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

interface AuditResultsProps {
  results: AuditResult;
  onReset: () => void;
}

export const AuditResults: React.FC<AuditResultsProps> = ({ results, onReset }) => {
  const toolLabels: Record<ToolName, string> = {
    cursor: 'Cursor',
    githubCopilot: 'GitHub Copilot',
    claude: 'Claude AI',
    chatgpt: 'ChatGPT',
    anthropicApi: 'Anthropic API',
    openaiApi: 'OpenAI API',
    gemini: 'Google Gemini',
    windsurf: 'Windsurf / v0',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-slate-100">
      {/* 1. HERO METRIC DISPLAY AREA */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <TrendingUp size={160} className="text-indigo-400" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <span className="bg-indigo-500/20 text-indigo-300 font-semibold text-xs tracking-wider uppercase px-3 py-1 rounded-full border border-indigo-500/30">
            Audit Executive Summary
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight">Your Custom AI Spending Report</h1>
          <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
            We analyzed your engineering footprint against official 2026 enterprise licensing benchmarks to extract hidden inefficiencies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Identified Monthly Savings</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1 flex items-baseline gap-1">
                ${results.totalMonthlySavings.toFixed(2)}
                <span className="text-xs text-slate-400 font-normal">/ mo</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Projected Annual Savings</div>
              <div className="text-3xl font-extrabold text-indigo-400 mt-1 flex items-baseline gap-1">
                ${results.totalAnnualSavings.toFixed(2)}
                <span className="text-xs text-slate-400 font-normal">/ yr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONDITIONAL SAVINGS-DRIVEN BANNER LOGIC */}
      {results.recommendationTier === 'high_savings' && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/40 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-start text-center sm:text-left">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl mt-0.5">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Massive Savings Detected! Let Credex Handle It.</h3>
              <p className="text-slate-300 text-sm mt-0.5">Your organization is overpaying retail SaaS prices by over $500/mo. Talk to our pipeline experts to fully automate your software procurement pipelines.</p>
            </div>
          </div>
          <button className="whitespace-nowrap bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-[0.98]">
            Claim Your Free Optimization Session
          </button>
        </div>
      )}

      {results.recommendationTier === 'optimized' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex gap-4 items-center">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Your AI Stack is Fully Optimized</h3>
            <p className="text-slate-400 text-sm mt-0.5">Fantastic hygiene! Your current allocations align perfectly with standard baseline vendor rates. There is zero bloated overhead left to cut.</p>
          </div>
        </div>
      )}

      {/* 3. PER-TOOL ITEM BREAKDOWN SUMMARY GRID */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">Granular Stack Analysis</h2>
        
        <div className="divide-y divide-slate-800/60">
          {Object.keys(results.breakdown).map((key) => {
            const toolName = key as ToolName;
            const details = results.breakdown[toolName];
            if (details.currentSpend === 0 && details.recommendedSpend === 0) return null; // Hide unused tools to maintain layout cleanliness

            return (
              <div key={toolName} className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-3">
                  <div className="font-semibold text-white text-sm">{toolLabels[toolName]}</div>
                  {details.savings > 0 && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded mt-1">
                      <ArrowDownRight size={12} /> Optimization Available
                    </span>
                  )}
                </div>

                <div className="md:col-span-4 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Current Spend</span>
                    <span className="font-mono font-medium text-slate-200">${details.currentSpend.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Recommended</span>
                    <span className="font-mono font-medium text-emerald-400">${details.recommendedSpend.toFixed(2)}</span>
                  </div>
                </div>

                <div className="md:col-span-5 flex gap-2 items-start bg-slate-950/40 p-2.5 border border-slate-800/40 rounded-lg text-xs text-slate-300">
                  <AlertTriangle size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{details.reason}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER ACTION CONTROL BAR */}
      <div className="flex justify-between items-center pt-2">
        <p className="text-xs text-slate-500">Credex Spend Evaluator Engine Version 1.0.0 (Client-side Standard Pure Math Model)</p>
        <button
          onClick={onReset}
          className="border border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-300 font-medium text-xs px-4 py-2 rounded-lg transition"
        >
          Modify Stack Data
        </button>
      </div>
    </div>
  );
};