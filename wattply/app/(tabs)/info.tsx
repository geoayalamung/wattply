import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, spacing } from '../../src/theme';

export default function Info() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>About Wattply</Text>
        <Text style={styles.subtitle}>Quick details about the app.</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>What this does</Text>
        <Text style={styles.cardBody}>
          Wattply helps you time energy-heavy appliances with BC Hydro traffic-light guidance.
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>How to use</Text>
        <Text style={styles.cardBody}>
          Check the Home tab for the current status, then adjust Settings to personalize tips.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: spacing.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardBody: {
    fontSize: 14,
    color: colors.subtext,
  },
});
