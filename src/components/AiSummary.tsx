import React, { useState, useEffect } from 'react';
import { AuditResult, PrimaryUseCase } from '../lib/audit/types';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface AiSummaryProps {
  results: AuditResult;
  useCase: PrimaryUseCase;
}

export const AiSummary: React.FC<AiSummaryProps> = ({ results, useCase }) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Generate a clean, numbers-driven fallback paragraph if the API fails or is rate-limited
  const getDeterministicFallback = (): string => {
    const useCaseMap: Record<PrimaryUseCase, string> = {
      coding: "heavy engineering velocity and developer-centric workflows",
      writing: "intensive content creation and marketing distribution channels",
      data: "large-scale analytical pipelines and complex data processing tasks",
      research: "deep context information retrieval and comprehensive market research",
      mixed: "multidisciplinary operations across a highly varied software stack"
    };

    return `Based on an architectural analysis of your stack optimized for ${useCaseMap[useCase]}, your organization is currently displaying a structural spending pattern of $${results.totalCurrentSpend.toFixed(2)}/mo. By implementing our specific seat consolidation strategies and transitioning individual subscriptions into pooled team licensing accounts, you can immediately capture $${results.totalMonthlySavings.toFixed(2)} in monthly leakage. This adjustment reduces unnecessary seat premiums while fully protecting your baseline operational throughput, building a projected annual financial recovery of $${results.totalAnnualSavings.toFixed(2)}/yr back into your bottom-line budget.`;
  };

  const fetchAiSummary = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // client-side fetch payload targeting a lightweight serverless edge function or direct API gateway mesh
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': (import.meta.env.VITE_ANTHROPIC_API_KEY || ''),
          'anthropic-version': '2023-06-01',
          'dangerouslyAllowBrowser': 'true' // Explicit frontend pass-through confirmation
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: `Generate an executive financial summary paragraph (strictly around 100 words) for a company spend audit. 
            Current spend: $${results.totalCurrentSpend}. Recommended spend: $${results.totalRecommendedSpend}. 
            Monthly savings: $${results.totalMonthlySavings}. Annual savings: $${results.totalAnnualSavings}. 
            Primary Use Case context: ${useCase}. 
            Focus on the exact mathematical savings potential and give an analytical corporate tone. Do not include introductory conversational text.`
          }]
        })
      });

      if (!response.ok) throw new Error('API Request Variance Detected');

      const data = await response.json();
      setSummary(data.content[0].text);
    } catch (error) {
      console.warn("AI API limit hit or key missing. Engaging clean mathematical fallback text block seamlessly.");
      setHasError(true);
      setSummary(getDeterministicFallback());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAiSummary();
  }, [results, useCase]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Sparkles size={16} />
          </div>
          <h3 className="font-bold text-white text-sm tracking-tight">AI-Generated Personalized Insights</h3>
        </div>
        
        {hasError && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <AlertCircle size={10} /> Local Fail-safe Mode Active
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2.5 animate-pulse py-2">
          <div className="h-3.5 bg-slate-800 rounded w-full"></div>
          <div className="h-3.5 bg-slate-800 rounded w-11/12"></div>
          <div className="h-3.5 bg-slate-800 rounded w-4/5"></div>
        </div>
      ) : (
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
          {summary}
        </p>
      )}

      {!isLoading && (
        <div className="flex justify-end pt-1">
          <button
            onClick={fetchAiSummary}
            className="flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase text-slate-400 hover:text-white transition"
          >
            <RefreshCw size={10} /> Regenerate Analysis
          </button>
        </div>
      )}
    </div>
  );
};