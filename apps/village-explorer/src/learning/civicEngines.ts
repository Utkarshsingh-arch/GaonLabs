import { SupportedGrade } from './curriculum/ncertRegistry';

// =============================================================================
// 1. HOSPITAL — GRADE-AWARE REPRODUCTIVE HEALTH GATING (Zero-PII, Discreet)
// =============================================================================

export type HealthEducationTier =
  | 'foundational'     // Class 6: growth, hygiene, nutrition, personal boundaries & consent
  | 'middle_puberty'   // Classes 7-8: puberty, physical/emotional changes, menstruation & hygiene, myths
  | 'secondary_repro'  // Classes 9-10: male/female reproductive systems, fertilisation, prenatal development
  | 'senior_biology';  // Classes 11-12: detailed menstrual hormonal phases & NCERT Class 12 reproductive health

const TIER_RANK: Record<HealthEducationTier, number> = {
  foundational: 1,
  middle_puberty: 2,
  secondary_repro: 3,
  senior_biology: 4,
};

export function getAllowedHealthTier(grade: SupportedGrade): HealthEducationTier {
  if (grade <= 6) return 'foundational';
  if (grade <= 8) return 'middle_puberty';
  if (grade <= 10) return 'secondary_repro';
  return 'senior_biology';
}

export function isHealthTopicAccessible(
  topicMinTier: HealthEducationTier,
  studentGrade: SupportedGrade
): boolean {
  const allowed = getAllowedHealthTier(studentGrade);
  return TIER_RANK[topicMinTier] <= TIER_RANK[allowed];
}

// =============================================================================
// 2. RAILWAY STATION — SPEED, DISTANCE, TIME, TIMETABLE & FARE MATH
// =============================================================================

export function calculateTrainSpeed(distanceKm: number, timeHours: number): {
  kmh: number;
  ms: number;
} {
  if (timeHours <= 0 || distanceKm < 0) return { kmh: 0, ms: 0 };
  const kmh = Number((distanceKm / timeHours).toFixed(2));
  const ms = Number((kmh / 3.6).toFixed(2));
  return { kmh, ms };
}

export function calculateJourneyMinutes(departureHHMM: string, arrivalHHMM: string): number {
  const [dh, dm] = departureHHMM.split(':').map(Number);
  const [ah, am] = arrivalHHMM.split(':').map(Number);
  const start = dh * 60 + dm;
  let end = ah * 60 + am;
  if (end < start) end += 24 * 60;
  return end - start;
}

export function formatMinutesToDuration(totalMinutes: number): string {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

export function calculateTrainFare(
  distanceKm: number,
  adults: number,
  children: number,
  discountPct: number = 0,
  ratePerKm: number = 1.5
): {
  adultUnitFare: number;
  childUnitFare: number;
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
} {
  const adultUnitFare = Math.max(10, Math.round(distanceKm * ratePerKm));
  const childUnitFare = Math.round(adultUnitFare * 0.5);
  const subtotal = adultUnitFare * adults + childUnitFare * children;
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);
  return { adultUnitFare, childUnitFare, subtotal, discountAmount, finalTotal };
}

// =============================================================================
// 3. VILLAGE MARKETPLACE — PROFIT/LOSS, DISCOUNTS & BILLING MATH
// =============================================================================

export function calculateProfitLoss(
  unitCostPrice: number,
  unitSellingPrice: number,
  quantity: number
): {
  totalCP: number;
  totalSP: number;
  amount: number;
  status: 'profit' | 'loss' | 'breakeven';
  percentage: number;
} {
  const totalCP = Math.round(unitCostPrice * quantity * 100) / 100;
  const totalSP = Math.round(unitSellingPrice * quantity * 100) / 100;
  const diff = Math.round((totalSP - totalCP) * 100) / 100;
  const status = diff > 0 ? 'profit' : diff < 0 ? 'loss' : 'breakeven';
  const percentage =
    totalCP > 0 ? Math.round((Math.abs(diff) / totalCP) * 1000) / 10 : 0;

  return {
    totalCP,
    totalSP,
    amount: Math.abs(diff),
    status,
    percentage,
  };
}

export function calculateDiscountedPrice(
  markedPrice: number,
  discountPercent: number
): {
  discountAmount: number;
  finalPrice: number;
} {
  const discountAmount = Math.round((markedPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, markedPrice - discountAmount);
  return { discountAmount, finalPrice };
}

export function calculateMarketBill(
  items: Array<{ unitPrice: number; qty: number }>,
  cashGiven: number
): { totalBill: number; change: number; isSufficient: boolean } {
  const totalBill = items.reduce((acc, item) => acc + item.unitPrice * item.qty, 0);
  const change = cashGiven - totalBill;
  return {
    totalBill: Math.round(totalBill * 100) / 100,
    change: Math.round(change * 100) / 100,
    isSufficient: change >= 0,
  };
}

// =============================================================================
// 4. COOPERATIVE BANK — SIMPLE INTEREST, COMPOUND INTEREST & BUDGETING
// =============================================================================

export function calculateSimpleInterest(
  principal: number,
  ratePercent: number,
  timeYears: number
): { interest: number; totalAmount: number } {
  const interest = Math.round(((principal * ratePercent * timeYears) / 100) * 100) / 100;
  return {
    interest,
    totalAmount: Math.round((principal + interest) * 100) / 100,
  };
}

export function calculateCompoundInterest(
  principal: number,
  ratePercent: number,
  timeYears: number
): { interest: number; totalAmount: number } {
  const totalAmount =
    Math.round(principal * Math.pow(1 + ratePercent / 100, timeYears) * 100) / 100;
  const interest = Math.round((totalAmount - principal) * 100) / 100;
  return { interest, totalAmount };
}

export function evaluateHouseholdBudget(
  monthlyIncome: number,
  allocations: {
    food: number;
    education: number;
    transport: number;
    healthcare: number;
    savings: number;
    other: number;
  }
): {
  totalAllocated: number;
  remaining: number;
  isWithinBudget: boolean;
  savingsPercent: number;
} {
  const totalAllocated =
    allocations.food +
    allocations.education +
    allocations.transport +
    allocations.healthcare +
    allocations.savings +
    allocations.other;
  const remaining = monthlyIncome - totalAllocated;
  const savingsPercent =
    monthlyIncome > 0 ? Math.round((allocations.savings / monthlyIncome) * 100) : 0;

  return {
    totalAllocated,
    remaining,
    isWithinBudget: remaining >= 0,
    savingsPercent,
  };
}
