import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, spacing } from '../theme';

type OptionPillProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionPill({ label, selected, onPress }: OptionPillProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: '#E8F1FB',
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedLabel: {
    color: colors.accent,
  },
  pressed: {
    opacity: 0.8,
  },
});
