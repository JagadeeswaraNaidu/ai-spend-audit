export type ToolName = 
  | 'cursor' 
  | 'githubCopilot' 
  | 'claude' 
  | 'chatgpt' 
  | 'anthropicApi' 
  | 'openaiApi' 
  | 'gemini' 
  | 'windsurf';

export type ToolPlan = 
  | 'free' 
  | 'plus' 
  | 'pro' 
  | 'team' 
  | 'business' 
  | 'enterprise' 
  | 'api' 
  | 'none';

export type PrimaryUseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolInput {
  plan: ToolPlan;
  seats: number;
  declaredMonthlySpend: number; // For comparative evaluation or variance tracking
}

export interface AuditInput {
  tools: Record<ToolName, ToolInput>;
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
}

export interface ToolRecommendation {
  currentSpend: number;
  recommendedSpend: number;
  savings: number;
  reason: string;
}

export type RecommendationTier = 'high_savings' | 'moderate' | 'optimized';

export interface AuditResult {
  totalCurrentSpend: number;
  totalRecommendedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendationTier: RecommendationTier;
  breakdown: Record<ToolName, ToolRecommendation>;
}