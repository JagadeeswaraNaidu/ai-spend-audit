import { ToolInput, ToolRecommendation, ToolPlan } from './types';
import { PRICING_2026 } from './pricing';

// Calculate exact internal baseline spend to prevent conflicting/incorrect user manual inputs
export function calculateBaseSpend(plan: ToolPlan, seats: number, declaredSpend: number): number {
  if (plan === 'none' || plan === 'free' || seats === 0) return 0;
  if (plan === 'api') return declaredSpend; // APIs remain completely variable consumption-based parameters
  return declaredSpend > 0 ? declaredSpend : 20 * seats; // Safety boundary fallback
}

export function auditCursor(input: ToolInput): ToolRecommendation {
  const current = calculateBaseSpend(input.plan, input.seats, input.declaredMonthlySpend);
  let recommended = current;
  let reason = "Your configuration looks fully optimized.";

  if (input.plan === 'pro' && input.seats > 1) {
    recommended = input.seats * PRICING_2026.cursor.business;
    reason = `Consolidate individual Pro accounts into Cursor Business to support unified workspace context.`;
  }
  return { currentSpend: current, recommendedSpend: recommended, savings: Math.max(0, current - recommended), reason };
}

export function auditCopilot(input: ToolInput, teamSize: number): ToolRecommendation {
  const current = calculateBaseSpend(input.plan, input.seats, input.declaredMonthlySpend);
  let recommended = current;
  let reason = "Spend allocation matches baseline tiers perfectly.";

  if (input.plan === 'business' && teamSize < 5) {
    recommended = input.seats * PRICING_2026.githubCopilot.individual;
    reason = "Downgrade to Individual seats; advanced administrative features are unnecessary at your scale.";
  }
  return { currentSpend: current, recommendedSpend: recommended, savings: Math.max(0, current - recommended), reason };
}

export function auditClaude(input: ToolInput): ToolRecommendation {
  const current = calculateBaseSpend(input.plan, input.seats, input.declaredMonthlySpend);
  let recommended = current;
  let reason = "Claude workspace tiers are properly aligned.";

  if (input.plan === 'pro' && input.seats >= 5) {
    recommended = input.seats * PRICING_2026.claude.team;
    reason = "Transition into Claude Team to enable pooled organization token limits and shared spaces.";
  }
  return { currentSpend: current, recommendedSpend: recommended, savings: Math.max(0, current - recommended), reason };
}

export function auditChatGPT(input: ToolInput): ToolRecommendation {
  const current = calculateBaseSpend(input.plan, input.seats, input.declaredMonthlySpend);
  let recommended = current;
  let reason = "ChatGPT seat assignments match optimized configurations.";

  if (input.plan === 'team' && input.seats < 2) {
    recommended = 1 * PRICING_2026.chatgpt.plus;
    reason = "ChatGPT Team requires a 2-seat minimum. Shift to Plus to avoid paying empty seat premiums.";
  }
  return { currentSpend: current, recommendedSpend: recommended, savings: Math.max(0, current - recommended), reason };
}

export function auditGenericTool(name: string, input: ToolInput): ToolRecommendation {
  const current = calculateBaseSpend(input.plan, input.seats, input.declaredMonthlySpend);
  return {
    currentSpend: current,
    recommendedSpend: current,
    savings: 0,
    reason: current > 0 ? `Utilization for ${name} looks highly adjusted for modern enterprise pipelines.` : "Not currently utilized."
  };
}