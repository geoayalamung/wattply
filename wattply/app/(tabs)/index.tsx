import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { TrafficLight } from '../../src/components/TrafficLight';
import {
  formatTime,
  getEnergyStatus,
  getEstimatedSavings,
  getNextChange,
  getRecommendation,
} from '../../src/logic/energy';
import { getOnboarding } from '../../src/storage/onboarding';
import { colors, radii, spacing } from '../../src/theme';
import type { OnboardingData } from '../../src/types/onboarding';

export default function Home() {
  const [profile, setProfile] = useState<OnboardingData | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let mounted = true;
    getOnboarding().then((data) => {
      if (mounted) {
        setProfile(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const status = useMemo(() => getEnergyStatus(now), [now]);
  const nextChange = useMemo(() => getNextChange(now), [now]);
  const recommendation = useMemo(
    () => getRecommendation(status.state, profile?.appliances ?? []),
    [status.state, profile?.appliances],
  );
  const indicatorStyle =
    status.state === 'green' ? styles.green : status.state === 'yellow' ? styles.yellow : styles.red;

  return (
    <Screen>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Wattply</Text>
          <Text style={styles.title}>Energy traffic light</Text>
          <Text style={styles.subtitle}>BC Hydro condo mode</Text>
        </View>
        <Link href="/settings" style={styles.settingsLink}>
          Settings
        </Link>
      </View>

      <Card>
        <View style={styles.heroRow}>
          <TrafficLight state={status.state} />
          <View style={styles.heroText}>
            <Text style={styles.statusTitle}>{status.title}</Text>
            <Text style={styles.statusDetail}>{status.detail}</Text>
            <Text style={styles.nextChange}>Next change at {formatTime(nextChange)}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.recoRow}>
          <View style={[styles.dot, indicatorStyle]} />
          <View style={styles.recoText}>
            <Text style={styles.recoTitle}>Right now</Text>
            <Text style={styles.recoBody}>{recommendation}</Text>
            <Text style={styles.estimate}>{getEstimatedSavings(status.state)}</Text>
          </View>
        </View>
      </Card>

      {!profile && (
        <View style={styles.onboardingCta}>
          <Text style={styles.ctaTitle}>Personalize your recommendations</Text>
          <Text style={styles.ctaBody}>
            Tell us about your home and appliances to tailor the advice.
          </Text>
          <Link href="/onboarding" asChild>
            <PrimaryButton label="Start onboarding" />
          </Link>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  kicker: {
    color: colors.muted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.subtext,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  settingsLink: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    paddingTop: 6,
  },
  heroRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
    gap: spacing.xs,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statusDetail: {
    color: colors.subtext,
    fontSize: 14,
  },
  nextChange: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  recoRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 6,
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
  recoText: {
    flex: 1,
    gap: spacing.xs,
  },
  recoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  recoBody: {
    fontSize: 14,
    color: colors.subtext,
  },
  estimate: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  onboardingCta: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: '#EAF1FB',
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  ctaBody: {
    fontSize: 14,
    color: colors.subtext,
  },
});
