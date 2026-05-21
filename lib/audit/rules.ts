import { ToolInput, ToolRecommendation, ToolPlan } from './types';
import { PRICING_2026 } from './pricing';

// Calculate exact internal baseline spend to prevent conflicting/incorrect user manual inputs
export function calculateBaseSpend(
  plan: ToolPlan,
  seats: number,
  declaredSpend: number
): number {
  if (plan === 'none' || plan === 'free' || seats === 0) {
    return 0;
  }

  // API usage remains variable consumption pricing
  if (plan === 'api') {
    return declaredSpend;
  }

  // Use declared spend if valid
  if (declaredSpend > 0) {
    return declaredSpend;
  }

  // Safe fallback estimation
  return 20 * seats;
}

export function auditCursor(input: ToolInput): ToolRecommendation {
  const current = calculateBaseSpend(input.plan, input.seats, input.declaredMonthlySpend);
  let recommended = current;
  let reason = "Your configuration looks fully optimized.";

  if (current > 0 || input.seats > 0) {
    if (input.plan === 'pro' && input.seats > 1) {
      recommended = input.seats * PRICING_2026.cursor.business;
      reason = `Consolidate ${input.seats} individual Pro accounts into Cursor Business to support unified workspace context ($${PRICING_2026.cursor.business}/seat).`;
    } else if (input.plan === 'business') {
      const officialExpectedSpend = input.seats * PRICING_2026.cursor.business;
      if (current > officialExpectedSpend) {
        recommended = officialExpectedSpend;
        reason = `Overpaying standard retail tier limits for Cursor Business. Optimize configuration down to flat-rate seat pricing ($${PRICING_2026.cursor.business}/seat).`;
      }
    }
  } else {
    reason = "Not currently utilized.";
  }

  return { 
    currentSpend: current, 
    recommendedSpend: recommended, 
    savings: Math.max(0, current - recommended), 
    reason 
  };
}

export function auditCopilot(
  input: ToolInput,
  teamSize: number
): ToolRecommendation {
  const current = calculateBaseSpend(
    input.plan,
    input.seats,
    input.declaredMonthlySpend
  );

  let recommended = current;
  let reason =
    'Spend allocation matches baseline tiers perfectly.';

  if (input.plan === 'business' && teamSize < 5) {
    const individualCost =
      input.seats *
      PRICING_2026.githubCopilot.individual;

    if (individualCost < current) {
      recommended = individualCost;

      reason =
        'Downgrade to Individual seats; advanced administrative features are unnecessary at your scale.';
    }
  }

  return {
    currentSpend: current,
    recommendedSpend: recommended,
    savings: Math.max(0, current - recommended),
    reason,
  };
}

export function auditClaude(
  input: ToolInput
): ToolRecommendation {
  const current = calculateBaseSpend(
    input.plan,
    input.seats,
    input.declaredMonthlySpend
  );

  let recommended = current;
  let reason =
    'Claude workspace tiers are properly aligned.';

  if (input.plan === 'pro' && input.seats >= 5) {
    // Claude Team = $20 per seat with minimum 5 seats
    const teamSeats = Math.max(input.seats, 5);

    const teamCost =
      teamSeats *
      PRICING_2026.claude.teamSeatPrice;

    if (teamCost < current) {
      recommended = teamCost;

      reason =
        'Transition into Claude Team to enable pooled organization token limits and shared spaces.';
    }
  }

  return {
    currentSpend: current,
    recommendedSpend: recommended,
    savings: Math.max(0, current - recommended),
    reason,
  };
}

export function auditChatGPT(
  input: ToolInput
): ToolRecommendation {
  const current = calculateBaseSpend(
    input.plan,
    input.seats,
    input.declaredMonthlySpend
  );

  let recommended = current;
  let reason =
    'ChatGPT seat assignments match optimized configurations.';

  if (current > 0) {
    if (input.plan === 'team') {
      // Team requires minimum 2 seats
      if (input.seats < 2) {
        recommended = PRICING_2026.chatgpt.plus;

        reason =
          'ChatGPT Team requires a 2-seat minimum. Shift to Plus to avoid paying empty seat premiums.';
      } else {
        const officialExpectedSpend =
          input.seats *
          PRICING_2026.chatgpt.team;

        if (current > officialExpectedSpend) {
          recommended = officialExpectedSpend;

          reason = `Overpaying standard retail tier limits for ChatGPT Team. Optimize billing down to official regular seat pricing ($${PRICING_2026.chatgpt.team}/seat).`;
        }
      }
    }
  } else {
    reason = 'Not currently utilized.';
  }

  return {
    currentSpend: current,
    recommendedSpend: recommended,
    savings: Math.max(0, current - recommended),
    reason,
  };
}

export function auditGenericTool(
  name: string,
  input: ToolInput
): ToolRecommendation {
  const current = calculateBaseSpend(
    input.plan,
    input.seats,
    input.declaredMonthlySpend
  );

  return {
    currentSpend: current,
    recommendedSpend: current,
    savings: 0,
    reason:
      current > 0
        ? `No major optimization opportunities detected for ${name}.`
        : 'Not currently utilized.',
  };
}