import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { OptionPill } from '../../src/components/OptionPill';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import {
  applianceOptions,
  homeOptions,
  provinceOptions,
  quietEndOptions,
  quietStartOptions,
} from '../../src/constants/onboardingOptions';
import { getOnboarding, saveOnboarding } from '../../src/storage/onboarding';
import { colors, spacing } from '../../src/theme';
import type { Appliance, OnboardingData, Province } from '../../src/types/onboarding';

export default function Settings() {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingData | null>(null);
  const [province, setProvince] = useState<Province>('bc');
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [hasQuietHours, setHasQuietHours] = useState(true);
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
        setProvince(data.province ?? 'bc');
        setAppliances(data.appliances);
        setHasQuietHours(data.hasQuietHours ?? true);
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
      province,
      hasQuietHours,
      appliances,
      quietHours: { start: quietStart, end: quietEnd },
    };
    await saveOnboarding(nextProfile);
    setProfile(nextProfile);
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Simple preferences for your home.</Text>

        {!profile ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No setup data yet</Text>
            <Text style={styles.emptyBody}>
              Complete onboarding to personalize your recommendations.
            </Text>
            <PrimaryButton label="Start onboarding" onPress={() => router.push('/onboarding')} />
          </View>
        ) : (
          <View style={styles.stack}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <Text style={styles.sectionHint}>Used for pricing and peak windows.</Text>
              <View style={styles.pillRow}>
                {provinceOptions.map((option) => (
                  <OptionPill
                    key={option.value}
                    label={option.label}
                    selected={province === option.value}
                    onPress={() => setProvince(option.value)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Appliances</Text>
              {applianceOptions.map((option) => {
                const selected = appliances.includes(option.value);
                return (
                  <View key={option.value} style={styles.row}>
                    <Text style={styles.rowLabel}>{option.label}</Text>
                    <Switch
                      value={selected}
                      onValueChange={() =>
                        setAppliances((prev) =>
                          selected
                            ? prev.filter((item) => item !== option.value)
                            : [...prev, option.value],
                        )
                      }
                      trackColor={{ false: colors.border, true: colors.green }}
                      thumbColor={colors.card}
                    />
                  </View>
                );
              })}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quiet hours</Text>
              <Text style={styles.sectionHint}>Current: {quietStart} – {quietEnd}</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Enabled</Text>
                <Switch
                  value={hasQuietHours}
                  onValueChange={setHasQuietHours}
                  trackColor={{ false: colors.border, true: colors.green }}
                  thumbColor={colors.card}
                />
              </View>
              {hasQuietHours ? (
                <>
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
                </>
              ) : null}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Home</Text>
              <Text style={styles.sectionLabel}>Home type</Text>
              <View style={styles.pillRow}>
                {homeOptions.map((option) => (
                  <OptionPill
                    key={option.value}
                    label={option.label}
                    selected={profile.homeType === option.value}
                    onPress={() =>
                      setProfile((prev) =>
                        prev ? { ...prev, homeType: option.value } : prev,
                      )
                    }
                  />
                ))}
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>EV charging</Text>
                <Switch
                  value={profile.hasEVCharging}
                  onValueChange={(value) =>
                    setProfile((prev) => (prev ? { ...prev, hasEVCharging: value } : prev))
                  }
                  trackColor={{ false: colors.border, true: colors.green }}
                  thumbColor={colors.card}
                />
              </View>
            </View>

            <PrimaryButton label="Save settings" onPress={handleSave} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.neutralBg,
  },
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
  section: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionHint: {
    fontSize: 13,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.text,
  },
  emptyState: {
    paddingVertical: spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing.md,
  },
});
