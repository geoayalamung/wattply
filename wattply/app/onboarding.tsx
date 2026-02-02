import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../src/components/Card';
import { OptionPill } from '../src/components/OptionPill';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import {
  applianceOptions,
  evOptions,
  homeOptions,
  quietEndOptions,
  quietStartOptions,
} from '../src/constants/onboardingOptions';
import { saveOnboarding } from '../src/storage/onboarding';
import { colors, radii, spacing } from '../src/theme';
import type { Appliance, HomeType } from '../src/types/onboarding';

const steps = ['Home type', 'EV charging', 'Appliances', 'Quiet hours'];

export default function Onboarding() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [homeType, setHomeType] = useState<HomeType>('condo');
  const [hasEVCharging, setHasEVCharging] = useState(false);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [quietStart, setQuietStart] = useState('10 PM');
  const [quietEnd, setQuietEnd] = useState('7 AM');

  const isLastStep = stepIndex === steps.length - 1;

  const stepContent = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return (
          <Card>
            <Text style={styles.cardTitle}>Do you live in a condo or house?</Text>
            <View style={styles.optionStack}>
              {homeOptions.map((option) => (
                <View key={option.value} style={styles.optionRow}>
                  <OptionPill
                    label={option.label}
                    selected={homeType === option.value}
                    onPress={() => setHomeType(option.value)}
                  />
                  <Text style={styles.optionHint}>{option.description}</Text>
                </View>
              ))}
            </View>
          </Card>
        );
      case 1:
        return (
          <Card>
            <Text style={styles.cardTitle}>Do you have EV charging?</Text>
            <View style={styles.pillRow}>
              {evOptions.map((option) => (
                <OptionPill
                  key={option.label}
                  label={option.label}
                  selected={hasEVCharging === option.value}
                  onPress={() => setHasEVCharging(option.value)}
                />
              ))}
            </View>
          </Card>
        );
      case 2:
        return (
          <Card>
            <Text style={styles.cardTitle}>Which appliances do you use regularly?</Text>
            <Text style={styles.cardSubtitle}>Choose all that apply.</Text>
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
        );
      default:
        return (
          <Card>
            <Text style={styles.cardTitle}>Set your quiet hours</Text>
            <Text style={styles.cardSubtitle}>Default is 10 PM – 7 AM.</Text>
            <View style={styles.quietRow}>
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
          </Card>
        );
    }
  }, [appliances, hasEVCharging, homeType, quietEnd, quietStart, stepIndex]);

  const handleNext = async () => {
    if (!isLastStep) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    await saveOnboarding({
      homeType,
      hasEVCharging,
      appliances,
      quietHours: { start: quietStart, end: quietEnd },
    });
    router.replace('/');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Setup</Text>
          <Text style={styles.title}>Personalize Wattply</Text>
          <Text style={styles.subtitle}>Step {stepIndex + 1} of {steps.length}</Text>
        </View>

        {stepContent}

        <View style={styles.buttonRow}>
          {stepIndex > 0 ? (
            <PrimaryButton
              label="Back"
              variant="secondary"
              onPress={() => setStepIndex((prev) => prev - 1)}
            />
          ) : (
            <View style={styles.buttonSpacer} />
          )}
          <PrimaryButton label={isLastStep ? 'Save & finish' : 'Next'} onPress={handleNext} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardSubtitle: {
    color: colors.subtext,
    fontSize: 14,
    marginBottom: spacing.sm,
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
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FAFBFF',
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
