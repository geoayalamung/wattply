import AsyncStorage from '@react-native-async-storage/async-storage';

import type { OnboardingData } from '../types/onboarding';

const STORAGE_KEY = 'wattply.onboarding';

export async function getOnboarding(): Promise<OnboardingData | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return null;
  }
}

export async function saveOnboarding(data: OnboardingData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function clearOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
