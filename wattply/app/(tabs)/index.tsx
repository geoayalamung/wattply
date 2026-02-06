import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import { AppContainer } from '../../src/components/AppContainer';
import { PrimaryButton } from '../../src/components/PrimaryButton';
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
import { colors, spacing } from '../../src/theme';
import type { OnboardingData } from '../../src/types/onboarding';

// Simple card with fade-in animation
function Card({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      delay,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
      <Animated.View style={[styles.card, { opacity: fadeIn }]}>
        {children}
      </Animated.View>
  );
}

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
      [status.state, profile?.appliances]
  );
  const province = profile?.province ?? 'bc';
  const currentAdjustment = getRateAdjustment(status.state, province);
  const nextAdjustment = getNextRateAdjustment(now, province);

  return (
      <AppContainer style={styles.screen} >
        <StatusBar style="dark" />

        {/* Background accent */}
        <View style={styles.accentBlob} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
                source={require('../../assets/LogoWattply-removebg-preview.png')}
                style={styles.logo}
                resizeMode="contain"
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>WATTPLY</Text>
            <Text style={styles.title}>Energy Dashboard</Text>
          </View>
        </View>

          {/* Main status card */}
          <Card delay={100}>
            <View style={styles.statusCard}>
              <TrafficLight state={status.state} />
              <View style={styles.statusText}>
                <Text style={styles.statusTitle}>{status.title}</Text>
                <Text style={styles.statusDetail}>{status.detail}</Text>
                <Text style={styles.nextChange}>Changes at {formatTime(nextChange)}</Text>
              </View>
            </View>
          </Card>

          {/* Recommendation card */}
          <Card delay={200}>
            <Text style={styles.cardLabel}>Right now</Text>
            <Text style={styles.recommendation}>{recommendation}</Text>
            <Text style={styles.estimate}>{getEstimatedSavings(status.state)}</Text>
          </Card>

          {/* Rate adjustments */}
          <Card delay={300}>
            <View style={styles.rateGrid}>
              <View style={styles.rateItem}>
                <Text style={styles.rateLabel}>Current rate</Text>
                <Text style={styles.rateValue}>{formatAdjustment(currentAdjustment)}</Text>
              </View>
              <View style={styles.rateDivider} />
              <View style={styles.rateItem}>
                <Text style={styles.rateLabel}>Next rate</Text>
                <Text style={styles.rateValue}>{formatAdjustment(nextAdjustment)}</Text>
                <Text style={styles.rateHint}>At {formatTime(nextChange)}</Text>
              </View>
            </View>
          </Card>

          {/* Green window */}
          <Card delay={400}>
            <Text style={styles.cardLabel}>Next green window</Text>
            <Text style={styles.windowValue}>
              {formatTime(nextGreenWindow.start)} – {formatTime(nextGreenWindow.end)}
            </Text>
          </Card>

          {/* Onboarding CTA */}
          {!profile && (
              <Card delay={500}>
                <View style={styles.ctaCard}>
                  <Text style={styles.ctaTitle}>Personalize your experience</Text>
                  <Text style={styles.ctaBody}>
                    Tell us about your home and appliances to get tailored recommendations.
                  </Text>
                  <Link href="/onboarding" asChild>
                    <PrimaryButton label="Start setup" />
                  </Link>
                </View>
              </Card>
          )}
      </AppContainer>
  );
}

function formatAdjustment(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}$${Math.abs(value).toFixed(2)}/kWh`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },

  accentBlob: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.brandGold,
    opacity: 0.08,
  },

  // Header
  header: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerText: {
    flex: 1,
  },
  kicker: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.textMuted,
    fontWeight: '800',
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textStrong,
    letterSpacing: -0.5,
  },

  // Cards
  card: {
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Status card
  statusCard: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
  },
  statusText: {
    flex: 1,
    gap: spacing.xs,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textStrong,
    letterSpacing: -0.3,
  },
  statusDetail: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
    lineHeight: 20,
  },
  nextChange: {
    fontSize: 13,
    color: colors.accentWarm,
    fontWeight: '700',
    marginTop: spacing.xs,
  },

  // Card labels
  cardLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.textLight,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },

  // Recommendation
  recommendation: {
    fontSize: 15,
    color: colors.textBody,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  estimate: {
    fontSize: 13,
    color: colors.accentWarm,
    fontWeight: '700',
  },

  // Rate grid
  rateGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  rateItem: {
    flex: 1,
  },
  rateDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  rateLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.textLight,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textStrong,
    letterSpacing: -0.3,
  },
  rateHint: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: spacing.xs,
  },

  // Window
  windowValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textStrong,
    letterSpacing: -0.3,
  },

  // CTA
  ctaCard: {
    gap: spacing.md,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textStrong,
    letterSpacing: -0.3,
  },
  ctaBody: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
    lineHeight: 20,
  },
});
