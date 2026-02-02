import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { OptionPill } from '../../src/components/OptionPill';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import {
  applianceOptions,
  quietEndOptions,
  quietStartOptions,
} from '../../src/constants/onboardingOptions';
import { getOnboarding, saveOnboarding } from '../../src/storage/onboarding';
import { colors, spacing } from '../../src/theme';
import type { Appliance, OnboardingData } from '../../src/types/onboarding';

export default function Settings() {
  const [profile, setProfile] = useState<OnboardingData | null>(null);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [quietStart, setQuietStart] = useState('10 PM');
  const [quietEnd, setQuietEnd] = useState('7 AM');

  useEffect(() => {
    let mounted = true;
    getOnboarding().then((data) => {
      if (!mounted) {
        return;
      }
      setProfile(data);
      if (data) {
        setAppliances(data.appliances);
        setQuietStart(data.quietHours.start);
        setQuietEnd(data.quietHours.end);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (!profile) {
      return;
    }
    const nextProfile: OnboardingData = {
      ...profile,
      appliances,
      quietHours: { start: quietStart, end: quietEnd },
    };
    await saveOnboarding(nextProfile);
    setProfile(nextProfile);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Preferences</Text>
        <Text style={styles.subtitle}>Adjust quiet hours and appliance tracking.</Text>

        {!profile ? (
          <Card>
            <Text style={styles.cardTitle}>No setup data yet</Text>
            <Text style={styles.cardBody}>
              Complete onboarding to personalize your recommendations.
            </Text>
            <Link href="/onboarding" asChild>
              <PrimaryButton label="Start onboarding" />
            </Link>
          </Card>
        ) : (
          <View style={styles.stack}>
            <Card>
              <Text style={styles.cardTitle}>Quiet hours</Text>
              <Text style={styles.cardBody}>Current: {quietStart} – {quietEnd}</Text>
              <Text style={styles.sectionLabel}>Start</Text>
              <View style={styles.pillRow}>
                {quietStartOptions.map((option) => (
                  <OptionPill
                    key={option}
                    label={option}
                    selected={quietStart === option}
                    onPress={() => setQuietStart(option)}
                  />
                ))}
              </View>
              <Text style={styles.sectionLabel}>End</Text>
              <View style={styles.pillRow}>
                {quietEndOptions.map((option) => (
                  <OptionPill
                    key={option}
                    label={option}
                    selected={quietEnd === option}
                    onPress={() => setQuietEnd(option)}
                  />
                ))}
              </View>
            </Card>

            <Card>
              <Text style={styles.cardTitle}>Appliances</Text>
              <Text style={styles.cardBody}>Choose the appliances you run often.</Text>
              <View style={styles.pillRow}>
                {applianceOptions.map((option) => {
                  const selected = appliances.includes(option.value);
                  return (
                    <OptionPill
                      key={option.value}
                      label={option.label}
                      selected={selected}
                      onPress={() =>
                        setAppliances((prev) =>
                          selected
                            ? prev.filter((item) => item !== option.value)
                            : [...prev, option.value],
                        )
                      }
                    />
                  );
                })}
              </View>
            </Card>

            <Card>
              <Text style={styles.cardTitle}>Home details</Text>
              <Text style={styles.cardBody}>Home type: {profile.homeType === 'condo' ? 'Condo' : 'House'}</Text>
              <Text style={styles.cardBody}>
                EV charging: {profile.hasEVCharging ? 'Yes' : 'No'}
              </Text>
            </Card>

            <PrimaryButton label="Save settings" onPress={handleSave} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
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
    marginBottom: spacing.lg,
  },
  stack: {
    gap: spacing.lg,
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
    marginBottom: spacing.sm,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.muted,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
});
