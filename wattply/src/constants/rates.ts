import type { Province } from '../types/onboarding';

export type RateAdjustment = {
  green: number;
  yellow: number;
  red: number;
};

export const provinceRateAdjustments: Record<Province, RateAdjustment> = {
  bc: { green: -0.05, yellow: 0, red: 0.05 },
  ontario: { green: -0.03, yellow: 0, red: 0.03 },
  alberta: { green: -0.03, yellow: 0, red: 0.03 },
};
