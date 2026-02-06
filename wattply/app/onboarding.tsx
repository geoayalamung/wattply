import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

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

const { width } = Dimensions.get('window');
const steps = ['Intro', 'Province', 'Home type', 'EV charging', 'Appliances', 'Quiet hours', 'Message'];

// Animated progress bar component
function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: current / total,
      tension: 50,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [current, total]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
            <LinearGradient
                colors={[colors.brandGold, colors.brandOrange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradient}
            />
          </Animated.View>
        </View>
        <Text style={styles.progressText}>
          {current} of {total}
        </Text>
      </View>
  );
}

// Enhanced option pill with animation
function AnimatedOptionPill({
                              label,
                              description,
                              selected,
                              onPress,
                            }: {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(selected ? 1 : 0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: selected ? 1.02 : 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: selected ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selected]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: selected ? 1 : 1.02,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
      <Pressable onPress={handlePress}>
        <Animated.View
            style={[
              styles.animatedOption,
              description && styles.animatedOptionWithDescription,
              selected && styles.animatedOptionSelected,
              { transform: [{ scale }], opacity },
            ]}
        >
          {selected && (
              <LinearGradient
                  colors={[colors.brandGold, colors.brandOrange]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
              />
          )}
          <View style={styles.animatedOptionContent}>
            <Text style={[styles.animatedOptionLabel, selected && styles.animatedOptionLabelSelected]}>
              {label}
            </Text>
            {description && (
                <Text style={[styles.animatedOptionDescription, selected && styles.animatedOptionDescriptionSelected]}>
                  {description}
                </Text>
            )}
          </View>
        </Animated.View>
      </Pressable>
  );
}

// Step container with slide animation
function StepContainer({ children, stepIndex }: { children: React.ReactNode; stepIndex: number }) {
  const slideX = useRef(new Animated.Value(width)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slideX.setValue(width);
    fadeIn.setValue(0);

    Animated.parallel([
      Animated.spring(slideX, {
        toValue: 0,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [stepIndex]);

  return (
      <Animated.View
          style={{
            opacity: fadeIn,
            transform: [{ translateX: slideX }],
          }}
      >
        {children}
      </Animated.View>
  );
}

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
  const totalSteps = showMessageStep ? steps.length - 1 : steps.length - 2;
  const currentStep = Math.min(stepIndex, totalSteps);
  const isLastStep = stepIndex === steps.length - 1 || (!showMessageStep && stepIndex === steps.length - 2);

  const stepContent = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return (
            <StepContainer stepIndex={stepIndex}>
              <View style={styles.intro}>
                <View style={styles.introIconContainer}>
                  <LinearGradient
                      colors={[colors.brandGold, colors.brandOrange]}
                      style={styles.introIconGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.introIcon}>⚡</Text>
                  </LinearGradient>
                </View>

                <Text style={styles.introTitle}>Quick setup</Text>
                <Text style={styles.introBody}>
                  This is not a registration. Wattply doesn't connect to your utility or change your electricity
                  plan. We only use these answers to give better timing tips on your phone.
                </Text>

                <View style={styles.trustRow}>
                  {['No account', 'No utility connection', 'Local only'].map((item) => (
                      <View key={item} style={styles.trustPillContainer}>
                        <LinearGradient
                            colors={[colors.goldSoft15, colors.orangeSoft15]}
                            style={styles.trustPillGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                          <Text style={styles.trustPill}>{item}</Text>
                        </LinearGradient>
                      </View>
                  ))}
                </View>

                <PrimaryButton
                    label="Continue"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setIntroDone(true);
                      setStepIndex(1);
                    }}
                />
              </View>
            </StepContainer>
        );

      case 1:
        return (
            <StepContainer stepIndex={stepIndex}>
              <View>
                <Text style={styles.question}>Which province are you in?</Text>
                <Text style={styles.helper}>Used to tailor peak windows and messaging.</Text>
                <View style={styles.optionStack}>
                  {provinceOptions.map((option) => (
                      <AnimatedOptionPill
                          key={option.value}
                          label={option.label}
                          description={option.description}
                          selected={province === option.value}
                          onPress={() => setProvince(option.value)}
                      />
                  ))}
                </View>
              </View>
            </StepContainer>
        );

      case 2:
        return (
            <StepContainer stepIndex={stepIndex}>
              <View>
                <Text style={styles.question}>Where do you live?</Text>
                <Text style={styles.helper}>This helps tailor your tips.</Text>
                <View style={styles.optionStack}>
                  {homeOptions.map((option) => (
                      <AnimatedOptionPill
                          key={option.value}
                          label={option.value === 'condo' ? 'Apartment / Condo' : 'House / Townhome'}
                          selected={homeType === option.value}
                          onPress={() => setHomeType(option.value)}
                      />
                  ))}
                </View>
              </View>
            </StepContainer>
        );

      case 3:
        return (
            <StepContainer stepIndex={stepIndex}>
              <View>
                <Text style={styles.question}>Do you have EV charging at home?</Text>
                <Text style={styles.helper}>This affects how much timing can matter.</Text>
                <View style={styles.pillRow}>
                  {evOptions.map((option) => (
                      <AnimatedOptionPill
                          key={option.label}
                          label={option.value ? 'Yes' : 'No'}
                          selected={hasEVCharging === option.value}
                          onPress={() => setHasEVCharging(option.value)}
                      />
                  ))}
                </View>
              </View>
            </StepContainer>
        );

      case 4:
        return (
            <StepContainer stepIndex={stepIndex}>
              <View>
                <Text style={styles.question}>Which appliances do you use regularly?</Text>
                <Text style={styles.helper}>Choose all that apply.</Text>
                <View style={styles.pillRow}>
                  {applianceOptions.map((option) => {
                    const selected = appliances.includes(option.value);
                    return (
                        <AnimatedOptionPill
                            key={option.value}
                            label={option.label}
                            selected={selected}
                            onPress={() =>
                                setAppliances((prev) =>
                                    selected ? prev.filter((item) => item !== option.value) : [...prev, option.value]
                                )
                            }
                        />
                    );
                  })}
                </View>
              </View>
            </StepContainer>
        );

      case 5:
        return (
            <StepContainer stepIndex={stepIndex}>
              <View>
                <Text style={styles.question}>Do you have quiet hours?</Text>
                <Text style={styles.helper}>Used to avoid suggesting noisy tasks at night.</Text>
                <View style={styles.pillRow}>
                  <AnimatedOptionPill
                      label="Yes"
                      selected={hasQuietHours}
                      onPress={() => setHasQuietHours(true)}
                  />
                  <AnimatedOptionPill
                      label="No"
                      selected={!hasQuietHours}
                      onPress={() => setHasQuietHours(false)}
                  />
                </View>

                {hasQuietHours && (
                    <View style={styles.quietRow}>
                      <Text style={styles.quietDefault}>Default is 10 PM – 7 AM.</Text>

                      <View style={styles.quietBlock}>
                        <View style={styles.quietLabelRow}>
                          <Text style={styles.quietLabel}>Start</Text>
                          <Text style={styles.quietSelected}>{quietStart}</Text>
                        </View>
                        <View style={styles.pillRow}>
                          {quietStartOptions.map((option) => (
                              <AnimatedOptionPill
                                  key={option}
                                  label={option}
                                  selected={quietStart === option}
                                  onPress={() => setQuietStart(option)}
                              />
                          ))}
                        </View>
                      </View>

                      <View style={styles.quietBlock}>
                        <View style={styles.quietLabelRow}>
                          <Text style={styles.quietLabel}>End</Text>
                          <Text style={styles.quietSelected}>{quietEnd}</Text>
                        </View>
                        <View style={styles.pillRow}>
                          {quietEndOptions.map((option) => (
                              <AnimatedOptionPill
                                  key={option}
                                  label={option}
                                  selected={quietEnd === option}
                                  onPress={() => setQuietEnd(option)}
                              />
                          ))}
                        </View>
                      </View>
                    </View>
                )}
              </View>
            </StepContainer>
        );

      default:
        if (!showMessageStep) return null;

        return (
            <StepContainer stepIndex={stepIndex}>
              <View style={styles.message}>
                <View style={styles.messageIconContainer}>
                  <Text style={styles.messageIcon}>ℹ️</Text>
                </View>
                <Text style={styles.messageTitle}>
                  {province === 'bc'
                      ? 'In apartments and condos, time-based pricing may offer limited savings.'
                      : 'Electricity prices in Alberta can change often.'}
                </Text>
                <Text style={styles.messageBody}>
                  {province === 'bc'
                      ? 'Wattply focuses on avoiding peak demand and helping you make better timing decisions.'
                      : 'Wattply helps you stay aware of high- and low-price periods.'}
                </Text>
              </View>
            </StepContainer>
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
    if (!introDone) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStepIndex((p) => p - 1);
  };

  return (
      <Screen style={styles.screen}>
        <View style={styles.yellowBlob} />

        <ScrollView contentContainerStyle={styles.container}>
          {stepIndex === 0 ? (
              stepContent
          ) : (
              <>
                <View style={styles.header}>
                  <Text style={styles.kicker}>SETUP</Text>
                  <Text style={styles.title}>Personalize Wattply</Text>
                  <ProgressBar current={currentStep} total={totalSteps} />
                </View>

                {stepContent}

                <View style={styles.buttonRow}>
                  {stepIndex > 1 ? (
                      <PrimaryButton label="Back" variant="secondary" onPress={handleBack} />
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
    flex: 1,
    backgroundColor: colors.brandBg,
  },
  yellowBlob: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: colors.brandGold,
    opacity: 0.22,
  },
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },

  // Intro screen
  intro: {
    paddingTop: spacing.xl * 2,
    gap: spacing.lg,
  },
  introIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.brandGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  introIconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introIcon: {
    fontSize: 40,
  },
  introTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.brandText,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  introBody: {
    fontSize: 16,
    color: colors.brandSubtext,
    lineHeight: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  trustPillContainer: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  trustPillGradient: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.goldSoft30,
    borderRadius: 999,
  },
  trustPill: {
    color: colors.brandGold,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Header with progress
  header: {
    marginBottom: spacing.xl,
  },
  kicker: {
    color: colors.brandMuted,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.brandText,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: spacing.md,
    letterSpacing: -0.6,
  },

  // Progress bar
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.brandCard,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressGradient: {
    flex: 1,
  },
  progressText: {
    color: colors.brandMuted,
    fontSize: 13,
    fontWeight: '800',
    minWidth: 50,
    textAlign: 'right',
  },

  // Questions
  question: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.brandText,
    marginBottom: spacing.sm,
    letterSpacing: -0.4,
  },
  helper: {
    color: colors.brandSubtext,
    fontSize: 15,
    marginBottom: spacing.lg,
    fontWeight: '600',
    lineHeight: 21,
  },

  // Animated option pills
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionStack: {
    gap: spacing.md,
  },
  animatedOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.brandBorder,
    backgroundColor: colors.brandCard,
    overflow: 'hidden',
  },
  animatedOptionWithDescription: {
    paddingVertical: spacing.lg,
  },
  animatedOptionSelected: {
    borderColor: colors.brandGold,
    shadowColor: colors.brandGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  animatedOptionContent: {
    gap: spacing.xs,
  },
  animatedOptionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.brandText,
    letterSpacing: -0.2,
  },
  animatedOptionLabelSelected: {
    color: colors.textStrong,
  },
  animatedOptionDescription: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brandSubtext,
    lineHeight: 18,
  },
  animatedOptionDescriptionSelected: {
    color: colors.blackSoft70,
  },

  // Quiet hours
  quietRow: {
    gap: spacing.xl,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.brandCard,
    borderWidth: 1,
    borderColor: colors.brandBorder,
  },
  quietDefault: {
    color: colors.brandSubtext,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  quietBlock: {
    gap: spacing.md,
  },
  quietLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quietLabel: {
    color: colors.brandMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '900',
  },
  quietSelected: {
    color: colors.brandGold,
    fontSize: 14,
    fontWeight: '800',
  },

  // Message step
  message: {
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: 20,
    backgroundColor: colors.brandCard,
    borderWidth: 1,
    borderColor: colors.goldSoft20,
  },
  messageIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.goldSoft15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  messageIcon: {
    fontSize: 32,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.brandText,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  messageBody: {
    fontSize: 15,
    color: colors.brandSubtext,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl * 2,
  },
  buttonSpacer: {
    width: 100,
  },
});
