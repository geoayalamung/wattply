import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { OptionPill } from '../src/components/OptionPill';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import {
  applianceOptions,
  evOptions,
  homeOptions,
  provinceOptions,
  quietEndOptions,
  quietStartOptions,
} from '../src/constants/onboardingOptions';
import { saveOnboarding } from '../src/storage/onboarding';
import { colors, spacing } from '../src/theme';
import type { Appliance, HomeType, Province } from '../src/types/onboarding';

const steps = ['Intro', 'Province', 'Home type', 'EV charging', 'Appliances', 'Quiet hours', 'Message'];

export default function Onboarding() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [province, setProvince] = useState<Province>('bc');
  const [homeType, setHomeType] = useState<HomeType>('condo');
  const [hasEVCharging, setHasEVCharging] = useState(false);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [hasQuietHours, setHasQuietHours] = useState(true);
  const [quietStart, setQuietStart] = useState('10 PM');
  const [quietEnd, setQuietEnd] = useState('7 AM');

  const showMessageStep = province === 'bc' || province === 'alberta';
  const isLastStep = stepIndex === steps.length - 1 || (!showMessageStep && stepIndex === steps.length - 2);

  const stepContent = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return (
          <View style={styles.intro}>
            <Text style={styles.introTitle}>Quick setup</Text>
            <Text style={styles.introBody}>
              This is not a registration. Wattply doesn’t connect to your utility or change your electricity
              plan. We only use these answers to give better timing tips on your phone.
            </Text>
            <PrimaryButton
              label="Continue"
              onPress={() => {
                setIntroDone(true);
                setStepIndex(1);
              }}
            />
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={styles.question}>Which province are you in?</Text>
            <Text style={styles.helper}>Used for pricing and peak windows.</Text>
            <View style={styles.optionStack}>
              {provinceOptions.map((option) => (
                <View key={option.value} style={styles.optionRow}>
                  <OptionPill
                    label={option.label}
                    selected={province === option.value}
                    onPress={() => setProvince(option.value)}
                  />
                  <Text style={styles.optionHint}>{option.description}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.question}>Where do you live?</Text>
            <Text style={styles.helper}>This helps tailor your tips.</Text>
            <View style={styles.optionStack}>
              {homeOptions.map((option) => (
                <View key={option.value} style={styles.optionRow}>
                  <OptionPill
                    label={option.value === 'condo' ? 'Apartment / Condo' : 'House / Townhome'}
                    selected={homeType === option.value}
                    onPress={() => setHomeType(option.value)}
                  />
                </View>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.question}>Do you have EV charging at home?</Text>
            <View style={styles.pillRow}>
              {evOptions.map((option) => (
                <OptionPill
                  key={option.label}
                  label={option.value ? 'Yes' : 'No'}
                  selected={hasEVCharging === option.value}
                  onPress={() => setHasEVCharging(option.value)}
                />
              ))}
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.question}>Which appliances do you use regularly?</Text>
            <Text style={styles.helper}>Choose all that apply.</Text>
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
          </View>
        );
      case 5:
        return (
          <View>
            <Text style={styles.question}>Do you have quiet hours?</Text>
            <View style={styles.pillRow}>
              <OptionPill label="Yes" selected={hasQuietHours} onPress={() => setHasQuietHours(true)} />
              <OptionPill label="No" selected={!hasQuietHours} onPress={() => setHasQuietHours(false)} />
            </View>
            {hasQuietHours ? (
              <View style={styles.quietRow}>
                <Text style={styles.helper}>Default is 10 PM – 7 AM.</Text>
                <View style={styles.quietBlock}>
                  <Text style={styles.quietLabel}>Start</Text>
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
                </View>
                <View style={styles.quietBlock}>
                  <Text style={styles.quietLabel}>End</Text>
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
                </View>
              </View>
            ) : null}
          </View>
        );
      default:
        if (!showMessageStep) {
          return null;
        }
        return (
          <View style={styles.message}>
            <Text style={styles.question}>
              {province === 'bc'
                ? 'In apartments and condos, time-based pricing may offer limited savings.'
                : 'Electricity prices in Alberta can change often.'}
            </Text>
            <Text style={styles.helper}>
              {province === 'bc'
                ? 'Wattply focuses on avoiding peak demand and helping you make better timing decisions.'
                : 'Wattply helps you stay aware of high- and low-price periods.'}
            </Text>
          </View>
        );
    }
  }, [
    appliances,
    hasEVCharging,
    hasQuietHours,
    homeType,
    province,
    quietEnd,
    quietStart,
    showMessageStep,
    stepIndex,
  ]);

  const handleNext = async () => {
    if (!introDone) {
      return;
    }
    if (!isLastStep) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    await saveOnboarding({
      province,
      homeType,
      hasEVCharging,
      hasQuietHours,
      appliances,
      quietHours: { start: quietStart, end: quietEnd },
    });
    router.replace('/(tabs)');
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {stepIndex === 0 ? (
          stepContent
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.kicker}>Setup</Text>
              <Text style={styles.title}>Personalize Wattply</Text>
              <Text style={styles.subtitle}>
                Step {Math.min(stepIndex, steps.length - (showMessageStep ? 1 : 2))} of{' '}
                {showMessageStep ? steps.length - 1 : steps.length - 2}
              </Text>
            </View>

            {stepContent}

            <View style={styles.buttonRow}>
              {stepIndex > 1 ? (
                <PrimaryButton
                  label="Back"
                  variant="secondary"
                  onPress={() => setStepIndex((prev) => prev - 1)}
                />
              ) : (
                <View style={styles.buttonSpacer} />
              )}
              <PrimaryButton label={isLastStep ? 'Finish setup' : 'Next'} onPress={handleNext} />
            </View>
          </>
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
  intro: {
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  introTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  introBody: {
    fontSize: 15,
    color: colors.subtext,
    lineHeight: 22,
  },
  header: {
    marginBottom: spacing.lg,
  },
  kicker: {
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.subtext,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  helper: {
    color: colors.subtext,
    fontSize: 15,
    marginBottom: spacing.md,
  },
  message: {
    gap: spacing.sm,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionStack: {
    gap: spacing.sm,
  },
  optionRow: {
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  optionHint: {
    color: colors.subtext,
    fontSize: 13,
  },
  quietRow: {
    gap: spacing.lg,
  },
  quietBlock: {
    gap: spacing.sm,
  },
  quietLabel: {
    color: colors.muted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonSpacer: {
    width: 120,
  },
});
