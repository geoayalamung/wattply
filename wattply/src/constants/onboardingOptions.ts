import type { Appliance, HomeType, Province } from '../types/onboarding';

export const provinceOptions: { value: Province; label: string; description: string }[] = [
  { value: 'bc', label: 'British Columbia', description: 'BC Hydro patterns (condo mode).' },
  { value: 'ontario', label: 'Ontario', description: 'Ontario residential patterns.' },
];

export const homeOptions: { value: HomeType; label: string; description: string }[] = [
  { value: 'condo', label: 'Condo', description: 'Shared walls, smaller footprint.' },
  { value: 'house', label: 'House', description: 'Detached or semi-detached home.' },
];

export const evOptions = [
  { value: false, label: 'No EV charging' },
  { value: true, label: 'Yes, I charge an EV' },
];

export const applianceOptions: { value: Appliance; label: string }[] = [
  { value: 'laundry', label: 'Laundry' },
  { value: 'dishwasher', label: 'Dishwasher' },
  { value: 'electricStove', label: 'Electric stove' },
  { value: 'electricOven', label: 'Electric oven' },
];

export const quietStartOptions = ['9 PM', '10 PM', '11 PM'];
export const quietEndOptions = ['6 AM', '7 AM', '8 AM'];
