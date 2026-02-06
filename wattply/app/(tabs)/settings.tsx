import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Switch, Text, View } from 'react-native';

import { AppContainer } from '../../src/components/AppContainer';
import { OptionPill } from '../../src/components/OptionPill';
import { PrimaryButton } from '../../src/components/PrimaryButton';
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
    <AppContainer style={styles.screen} contentContainerStyle={styles.container}>
      {/* Background accent */}
      <View style={styles.accentBlob} />

      {/* Header */}
      <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
      </View>
      <Text style={styles.subtitle}>Simple preferences for your home.</Text>

      {!profile ? (
        <View style={styles.card}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No setup data yet</Text>
            <Text style={styles.emptyBody}>
              Complete onboarding to personalize your recommendations.
            </Text>
            <PrimaryButton label="Start onboarding" onPress={() => router.push('/onboarding')} />
          </View>
        </View>
      ) : (
        <View style={styles.stack}>
          <View style={styles.card}>
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

          <View style={styles.card}>
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
                    trackColor={{ false: colors.borderLight, true: colors.brandGold }}
                    thumbColor={colors.white}
                  />
                </View>
              );
            })}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Quiet hours</Text>
            <Text style={styles.sectionHint}>Current: {quietStart} – {quietEnd}</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Enabled</Text>
              <Switch
                value={hasQuietHours}
                onValueChange={setHasQuietHours}
                trackColor={{ false: colors.borderLight, true: colors.brandGold }}
                thumbColor={colors.white}
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

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Home</Text>
            <Text style={styles.sectionLabel}>Home type</Text>
            <View style={styles.pillRow}>
              {homeOptions.map((option) => (
                <OptionPill
                  key={option.value}
                  label={option.label}
                  selected={profile.homeType === option.value}
                  onPress={() =>
                    setProfile((prev) => (prev ? { ...prev, homeType: option.value } : prev))
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
                trackColor={{ false: colors.borderLight, true: colors.brandGold }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          <PrimaryButton label="Save settings" onPress={handleSave} />
        </View>
      )}
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },
  container: {
    paddingBottom: spacing.xs,
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
  header: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,

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
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,

  },
  stack: {
    gap: spacing.lg,
  },
  card: {
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textStrong,
    marginBottom: spacing.sm,
  },
  sectionHint: {
    fontSize: 13,
    color: colors.textMuted,
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
    color: colors.textLight,
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
    color: colors.textStrong,
  },
  emptyState: {
    paddingVertical: spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textStrong,
    marginBottom: spacing.sm,
  },
  emptyBody: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
});
