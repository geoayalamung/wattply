import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { TrafficLight } from '../../src/components/TrafficLight';
import {
  formatTime,
  getEnergyStatus,
  getEstimatedSavings,
  getNextChange,
  getNextGreenWindow,
  getNextRateAdjustment,
  getRateAdjustment,
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
  const nextGreenWindow = useMemo(() => getNextGreenWindow(now), [now]);
  const recommendation = useMemo(
    () => getRecommendation(status.state, profile?.appliances ?? []),
    [status.state, profile?.appliances],
  );
  const indicatorStyle =
    status.state === 'green' ? styles.green : status.state === 'yellow' ? styles.yellow : styles.red;
  const province = profile?.province ?? 'bc';
  const currentAdjustment = getRateAdjustment(status.state, province);
  const nextAdjustment = getNextRateAdjustment(now, province);

  return (
    <Screen>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Image
          source={require('../../assets/LogoWattply-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.kicker}>Wattply</Text>
          <Text style={styles.title}>Energy traffic light</Text>
          <Text style={styles.subtitle}>Clear status and pricing at a glance</Text>
        </View>
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

      <Card>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>Current adjustment</Text>
            <Text style={styles.priceValue}>{formatAdjustment(currentAdjustment)}</Text>
          </View>
          <View>
            <Text style={styles.priceLabel}>Next adjustment</Text>
            <Text style={styles.priceValue}>{formatAdjustment(nextAdjustment)}</Text>
            <Text style={styles.priceHint}>At {formatTime(nextChange)}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.priceLabel}>Next green window</Text>
        <Text style={styles.windowValue}>
          {formatTime(nextGreenWindow.start)} – {formatTime(nextGreenWindow.end)}
        </Text>
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

function formatAdjustment(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}$${Math.abs(value).toFixed(2)}/kWh`;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 44,
    height: 44,
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
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  priceLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.muted,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  priceHint: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing.xs,
  },
  windowValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
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
