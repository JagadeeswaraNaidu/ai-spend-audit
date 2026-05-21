import { describe, test, expect } from 'vitest';
import { runComprehensiveAudit } from './index';
import { AuditInput, ToolInput } from './types';

// Helper to quickly generate a clean, zeroed-out tool stack for isolated test conditions
const createEmptyStack = (): Record<string, ToolInput> => ({
  cursor: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
  githubCopilot: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
  claude: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
  chatgpt: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
  anthropicApi: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
  openaiApi: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
  gemini: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
  windsurf: { plan: 'none', seats: 0, declaredMonthlySpend: 0 },
});

describe('Advanced Modular Audit Engine Tests', () => {

  test('Test 1: Return zero savings and categorize as optimized if stack is standard', () => {
    const input: AuditInput = {
      tools: createEmptyStack() as any,
      teamSize: 1,
      primaryUseCase: 'coding'
    };
    input.tools.cursor = { plan: 'pro', seats: 1, declaredMonthlySpend: 20 };
    input.tools.githubCopilot = { plan: 'pro', seats: 1, declaredMonthlySpend: 10 };

    const res = runComprehensiveAudit(input);
    expect(res.totalMonthlySavings).toBe(0);
    expect(res.totalAnnualSavings).toBe(0);
    expect(res.recommendationTier).toBe('optimized');
  });

  test('Test 2: Highlight individual Cursor Pro consolidation optimizations', () => {
    const input: AuditInput = {
      tools: createEmptyStack() as any,
      teamSize: 3,
      primaryUseCase: 'coding'
    };
    // 3 unlinked pro seats ($60 total declared)
    input.tools.cursor = { plan: 'pro', seats: 3, declaredMonthlySpend: 60 };

    const res = runComprehensiveAudit(input);
    // Business pricing is $40/seat. 3 seats * $40 = $120.
    expect(res.breakdown.cursor.recommendedSpend).toBe(120);
    expect(res.breakdown.cursor.savings).toBe(0); // Shifting up to Business adds value, doesn't cut spend
  });

  test('Test 3: Flag Copilot Business overspend for ultra-small engineering teams', () => {
    const input: AuditInput = {
      tools: createEmptyStack() as any,
      teamSize: 2,
      primaryUseCase: 'coding'
    };
    // Team of 2 paying for Business tier ($19 * 2 = $38)
    input.tools.githubCopilot = { plan: 'business', seats: 2, declaredMonthlySpend: 38 };

    const res = runComprehensiveAudit(input);
    // Should downgrade to Individual: 2 seats * $10 = $20
    expect(res.breakdown.githubCopilot.recommendedSpend).toBe(20);
    expect(res.breakdown.githubCopilot.savings).toBe(18);
  });

  test('Test 4: Protect against empty seat premiums on ChatGPT Team setups', () => {
    const input: AuditInput = {
      tools: createEmptyStack() as any,
      teamSize: 1,
      primaryUseCase: 'mixed'
    };
    // 1 user on a Team plan paying the 2-seat platform baseline minimum ($25 * 2 = $50)
    input.tools.chatgpt = { plan: 'team', seats: 1, declaredMonthlySpend: 50 };

    const res = runComprehensiveAudit(input);
    // Should downgrade to 1 Plus seat ($20)
    expect(res.breakdown.chatgpt.recommendedSpend).toBe(20);
    expect(res.breakdown.chatgpt.savings).toBe(30);
  });

  test('Test 5: Correctly trigger high_savings tier flag when monthly optimizations break $500 threshold', () => {
    const input: AuditInput = {
      tools: createEmptyStack() as any,
      teamSize: 10,
      primaryUseCase: 'coding'
    };
    // Simulating an extreme user entry error or massive manual budget overstatement
    input.tools.chatgpt = { plan: 'team', seats: 10, declaredMonthlySpend: 1000 };

    const res = runComprehensiveAudit(input);
    // Recommended standard spend for 10 seats * $25 = $250. Savings = $750.
    expect(res.totalMonthlySavings).toBe(750);
    expect(res.totalAnnualSavings).toBe(9000);
    expect(res.recommendationTier).toBe('high_savings'); // Perfectly catches assignment threshold rule
  });
});