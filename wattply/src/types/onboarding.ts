export type HomeType = 'condo' | 'house';
export type Province = 'bc' | 'ontario' | 'alberta';

export type Appliance = 'laundry' | 'dishwasher' | 'electricStove' | 'electricOven';

export type QuietHours = {
  start: string;
  end: string;
};

export type OnboardingData = {
  province: Province;
  homeType: HomeType;
  hasEVCharging: boolean;
  hasQuietHours: boolean;
  appliances: Appliance[];
  quietHours: QuietHours;
};
