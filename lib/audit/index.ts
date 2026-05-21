import { AuditInput, AuditResult, ToolName, RecommendationTier } from './types';
import { auditCursor, auditCopilot, auditClaude, auditChatGPT, auditGenericTool } from './rules';

export function runComprehensiveAudit(input: AuditInput): AuditResult {
  const breakdown = {} as Record<ToolName, any>;

  breakdown.cursor = auditCursor(input.tools.cursor);
  breakdown.githubCopilot = auditCopilot(input.tools.githubCopilot, input.teamSize);
  breakdown.claude = auditClaude(input.tools.claude);
  breakdown.chatgpt = auditChatGPT(input.tools.chatgpt);
  
  // Generic evaluation fallback rules matching mandatory evaluation targets
  breakdown.anthropicApi = auditGenericTool('Anthropic API', input.tools.anthropicApi);
  breakdown.openaiApi = auditGenericTool('OpenAI API', input.tools.openaiApi);
  breakdown.gemini = auditGenericTool('Gemini', input.tools.gemini);
  breakdown.windsurf = auditGenericTool('Windsurf/v0', input.tools.windsurf);

  let totalCurrentSpend = 0;
  let totalRecommendedSpend = 0;

  Object.keys(breakdown).forEach((key) => {
    const item = breakdown[key as ToolName];
    totalCurrentSpend += item.currentSpend;
    totalRecommendedSpend += item.recommendedSpend;
  });

  const totalMonthlySavings = Math.max(0, totalCurrentSpend - totalRecommendedSpend);
  const totalAnnualSavings = totalMonthlySavings * 12;

  // Exact threshold tier categorization matching requirements
  let recommendationTier: RecommendationTier = 'moderate';
  if (totalMonthlySavings > 500) {
    recommendationTier = 'high_savings';
  } else if (totalMonthlySavings < 100) {
    recommendationTier = 'optimized';
  }

  return {
    totalCurrentSpend,
    totalRecommendedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    recommendationTier,
    breakdown
  };
}