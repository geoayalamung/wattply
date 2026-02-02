import type { Appliance } from '../types/onboarding';

export type EnergyState = 'green' | 'yellow' | 'red';

export type EnergyStatus = {
  state: EnergyState;
  title: string;
  detail: string;
};

const RED_START = 16 * 60;
const RED_END = 21 * 60;
const GREEN_START = 21 * 60;
const GREEN_END = 7 * 60;

export function getEnergyState(now: Date): EnergyState {
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes >= RED_START && minutes < RED_END) {
    return 'red';
  }
  if (minutes >= GREEN_START || minutes < GREEN_END) {
    return 'green';
  }
  return 'yellow';
}

export function getEnergyStatus(now: Date): EnergyStatus {
  const state = getEnergyState(now);
  switch (state) {
    case 'green':
      return {
        state,
        title: 'Lower-demand hours',
        detail: 'Good time to run appliances.',
      };
    case 'red':
      return {
        state,
        title: 'High-demand hours',
        detail: 'Avoid heavy appliances if you can.',
      };
    default:
      return {
        state,
        title: 'Normal demand',
        detail: 'Run essentials, save heavy loads for green hours.',
      };
  }
}

export function getNextChange(now: Date): Date {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const next = new Date(now);

  if (minutes >= RED_START && minutes < RED_END) {
    next.setHours(21, 0, 0, 0);
    return next;
  }

  if (minutes >= GREEN_START) {
    next.setDate(next.getDate() + 1);
    next.setHours(7, 0, 0, 0);
    return next;
  }

  if (minutes < GREEN_END) {
    next.setHours(7, 0, 0, 0);
    return next;
  }

  next.setHours(16, 0, 0, 0);
  return next;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getRecommendation(state: EnergyState, appliances: Appliance[] = []): string {
  const applianceLabel = buildApplianceLabel(appliances);
  if (state === 'green') {
    return applianceLabel
      ? `Good time to run ${applianceLabel}.`
      : 'Good time to run energy-heavy appliances.';
  }
  if (state === 'red') {
    return applianceLabel
      ? `High demand right now. Avoid ${applianceLabel} if you can.`
      : 'High demand right now. Avoid heavy appliances if you can.';
  }
  return applianceLabel
    ? `Normal demand. Run essentials; save ${applianceLabel} for green hours.`
    : 'Normal demand. Run essentials; save heavy loads for green hours.';
}

export function getEstimatedSavings(state: EnergyState): string {
  switch (state) {
    case 'green':
      return 'Estimated savings: Higher if you run appliances now.';
    case 'red':
      return 'Estimated savings: Low right now. Wait if you can.';
    default:
      return 'Estimated savings: Moderate depending on your usage.';
  }
}

function buildApplianceLabel(appliances: Appliance[]): string {
  const labels = appliances.map((item) => {
    switch (item) {
      case 'laundry':
        return 'laundry';
      case 'dishwasher':
        return 'the dishwasher';
      case 'electricStove':
        return 'the electric stove';
      case 'electricOven':
        return 'the electric oven';
      default:
        return '';
    }
  });

  const filtered = labels.filter(Boolean);
  if (!filtered.length) {
    return '';
  }
  if (filtered.length === 1) {
    return filtered[0];
  }
  if (filtered.length === 2) {
    return `${filtered[0]} and ${filtered[1]}`;
  }
  return `${filtered.slice(0, -1).join(', ')}, and ${filtered[filtered.length - 1]}`;
}
