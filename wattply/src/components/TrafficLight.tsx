import { StyleSheet, View } from 'react-native';

import type { EnergyState } from '../logic/energy';
import { colors, radii, spacing } from '../theme';

type TrafficLightProps = {
  state: EnergyState;
};

const stateToIndex: Record<EnergyState, number> = {
  green: 0,
  yellow: 1,
  red: 2,
};

export function TrafficLight({ state }: TrafficLightProps) {
  const activeIndex = stateToIndex[state];
  return (
    <View style={styles.shell}>
      <View style={[styles.dot, activeIndex === 0 ? styles.green : styles.dim]} />
      <View style={[styles.dot, activeIndex === 1 ? styles.yellow : styles.dim]} />
      <View style={[styles.dot, activeIndex === 2 ? styles.red : styles.dim]} />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: 70,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: '#111827',
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  green: {
    backgroundColor: colors.green,
  },
  yellow: {
    backgroundColor: colors.yellow,
  },
  red: {
    backgroundColor: colors.red,
  },
  dim: {
    backgroundColor: '#2E2E2E',
  },
});
