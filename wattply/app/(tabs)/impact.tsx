import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppContainer } from '../../src/components/AppContainer';
import { Card } from '../../src/components/Card';
import { colors, spacing } from '../../src/theme';

type MetricPillProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent?: string;
};

function MetricPill({ icon, label, value, accent }: MetricPillProps) {
  return (
      <View style={[styles.pill, { borderColor: 'rgba(255,255,255,0.10)' }]}>
        <Ionicons name={icon} size={16} color={accent ?? colors.yellow} />
        <View style={{ marginLeft: spacing.sm }}>
          <Text style={styles.pillLabel}>{label}</Text>
          <Text style={styles.pillValue}>{value}</Text>
        </View>
      </View>
  );
}

type StatRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  subtitle?: string;
  badge?: string;
};

function StatRow({ icon, title, value, subtitle, badge }: StatRowProps) {
  return (
      <View style={styles.statRow}>
        <View style={styles.statIcon}>
          <Ionicons name={icon} size={18} color={colors.yellow} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.statTopLine}>
            <Text style={styles.cardTitle}>{title}</Text>
            {badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
            ) : null}
          </View>

          <Text style={styles.cardValue}>{value}</Text>
          {subtitle ? <Text style={styles.cardBody}>{subtitle}</Text> : null}
        </View>
      </View>
  );
}

export default function Impact() {
  // TODO: later, replace these with real computed values from your store/backend
  const avoidedWindows = '4–6 this week';
  const savingsRange = '$2.40–$6.80';
  const shiftedEnergy = '0.8–1.6 kWh';
  const co2 = '0.2–0.6 kg CO₂e';

  return (
      <AppContainer contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Impact</Text>
          <Text style={styles.subtitle}>
            A clear view of what you avoided and what you likely saved.
          </Text>
        </View>

        {/* SUMMARY */}
        <Card>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <Ionicons name="flash" size={18} color={colors.yellow} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryTitle}>Estimated savings</Text>
              <Text style={styles.summaryValue}>{savingsRange}</Text>
            </View>
            <View style={styles.summaryChip}>
              <Text style={styles.summaryChipText}>This week</Text>
            </View>
          </View>

          <View style={styles.pillRow}>
            <MetricPill icon="time-outline" label="Peak windows avoided" value={avoidedWindows} />
            <MetricPill icon="stats-chart-outline" label="Energy shifted" value={shiftedEnergy} />
          </View>

          <View style={[styles.pillRow, { marginTop: spacing.sm }]}>
            <MetricPill icon="leaf-outline" label="CO₂ impact" value={co2} accent={colors.subtext} />
            <MetricPill icon="shield-checkmark-outline" label="Confidence" value="Conservative" accent={colors.subtext} />
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>What this means</Text>
          <Text style={styles.cardBody}>
            You successfully moved some usage away from higher-cost windows. The range is intentionally conservative so it
            stays trustworthy—even if your real-world usage varies.
          </Text>
        </Card>

        {/* METRICS */}
        <Card>
          <StatRow
              icon="alert-circle-outline"
              title="Peak windows avoided"
              value={avoidedWindows}
              badge="Good"
              subtitle="We count a window only when you had an appliance selected and the app flagged a red period."
          />
        </Card>

        <Card>
          <StatRow
              icon="cash-outline"
              title="Estimated impact range"
              value={savingsRange}
              badge="Range"
              subtitle="Based on typical appliance usage and peak vs off-peak pricing. Real savings may be higher or lower."
          />
        </Card>

        {/* ACTIONABLE INSIGHTS */}
        <Card>
          <Text style={styles.sectionLabel}>Next suggestion</Text>

          <View style={styles.bullet}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.yellow} />
            <Text style={styles.bulletText}>
              If you’re running laundry or dishwasher today, aim for the next green window to maximize savings.
            </Text>
          </View>

          <View style={styles.bullet}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.yellow} />
            <Text style={styles.bulletText}>
              Keep one “high-impact” appliance selected so we can track avoided windows more accurately.
            </Text>
          </View>
        </Card>

        {/* HOW WE CALCULATE */}
        <Card>
          <Text style={styles.sectionLabel}>How we estimate</Text>
          <Text style={styles.cardBody}>
            We compare peak vs off-peak prices and apply modest assumptions for each selected appliance (typical kWh per
            cycle). We show a range to reflect uncertainty rather than over-claiming.
          </Text>
        </Card>
      </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 204, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 204, 0, 0.25)',
  },
  summaryTitle: {
    fontSize: 13,
    color: colors.subtext,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    marginTop: 2,
  },
  summaryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  summaryChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.subtext,
  },

  pillRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.subtext,
  },
  pillValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: spacing.md,
  },

  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  statTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 204, 0, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255, 204, 0, 0.25)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.yellow,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    marginTop: 4,
    marginBottom: spacing.xs,
  },
  cardBody: {
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 19,
  },

  bullet: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginTop: spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 19,
  },
});
