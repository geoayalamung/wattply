import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, spacing } from '../../src/theme';

export default function Info() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Tips</Text>
        <Text style={styles.subtitle}>Simple ways to save during the day.</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Green hours</Text>
        <Text style={styles.cardBody}>
          Run laundry, dishwasher, or EV charging when the light is green.
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Yellow hours</Text>
        <Text style={styles.cardBody}>
          Normal demand. Use essentials now, save heavy loads for green hours.
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Red hours</Text>
        <Text style={styles.cardBody}>
          High demand. Avoid heavy appliances if possible and wait for the next change.
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
