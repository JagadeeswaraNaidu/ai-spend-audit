import React, { useEffect, useState } from 'react';
import { AuditInput, ToolName, ToolPlan, PrimaryUseCase } from '../lib/audit/types';

interface SpendFormProps {
  onAuditSubmit: (input: AuditInput) => void;
}

const INITIAL_STATE: AuditInput = {
  teamSize: 1,
  primaryUseCase: 'coding',
  tools: {
    cursor: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
    githubCopilot: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
    claude: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
    chatgpt: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
    anthropicApi: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
    openaiApi: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
    gemini: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
    windsurf: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
  }
};

const LOCAL_STORAGE_KEY = 'credex_audit_form_state';

export const SpendForm: React.FC<SpendFormProps> = ({ onAuditSubmit }) => {
  const [formData, setFormData] = useState<AuditInput>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  // Automatically persist state across browser updates or reloads
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleToolChange = (
    tool: ToolName,
    field: 'plan' | 'seats' | 'declaredMonthlySpend',
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        [tool]: {
          ...prev.tools[tool],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuditSubmit(formData);
  };

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
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl shadow-xl max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Configure Your AI Software Stack</h2>
        <p className="text-slate-400 text-sm">Enter your current plan distributions and declared costs to compute optimization models.</p>
      </div>

      {/* Meta Metrics Configuration Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">Total Core Team Size</label>
          <input
            type="number"
            min="1"
            value={formData.teamSize}
            onChange={(e) => setFormData(prev => ({ ...prev, teamSize: Math.max(1, parseInt(e.target.value) || 1) }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">Primary Use Case Context</label>
          <select
            value={formData.primaryUseCase}
            onChange={(e) => setFormData(prev => ({ ...prev, primaryUseCase: e.target.value as PrimaryUseCase }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="coding">Engineering & Coding Operations</option>
            <option value="writing">Content Writing & Marketing</option>
            <option value="data">Data Processing & Analytics</option>
            <option value="research">Academic & Market Research</option>
            <option value="mixed">Mixed Multidisciplinary Workspace</option>
          </select>
        </div>
      </div>

      {/* Dynamic Tool Input Segment Rows */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
        {Object.keys(formData.tools).map((key) => {
          const toolName = key as ToolName;
          const currentTool = formData.tools[toolName];
          const isApi = toolName === 'anthropicApi' || toolName === 'openaiApi';

          return (
            <div key={toolName} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-950/60 p-4 border border-slate-800/80 rounded-xl">
              <div className="sm:col-span-3 font-medium text-white text-sm">{toolLabels[toolName]}</div>
              
              <div className="sm:col-span-3">
                <select
                  value={currentTool.plan}
                  onChange={(e) => handleToolChange(toolName, 'plan', e.target.value as ToolPlan)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="none">Not Used (None)</option>
                  <option value="free">Free Tier</option>
                  {!isApi && <option value="pro">Pro Tier</option>}
                  {!isApi && <option value="team">Team Tier</option>}
                  {!isApi && <option value="business">Business Tier</option>}
                  {!isApi && <option value="enterprise">Enterprise Tier</option>}
                  {isApi && <option value="api">API Access Integration</option>}
                </select>
              </div>

              <div className="sm:col-span-3">
                <input
                  type="number"
                  placeholder="Seats/Users"
                  min="0"
                  disabled={currentTool.plan === 'none'}
                  value={currentTool.seats || ''}
                  onChange={(e) => handleToolChange(toolName, 'seats', Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="number"
                  placeholder="Monthly Spend ($)"
                  min="0"
                  disabled={currentTool.plan === 'none'}
                  value={currentTool.declaredMonthlySpend || ''}
                  onChange={(e) => handleToolChange(toolName, 'declaredMonthlySpend', Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-md hover:shadow-indigo-500/20 active:scale-[0.98] transition-all"
        >
          Run Spend Audit Engine
        </button>
      </div>
    </form>
  );
};