import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, spacing } from '../src/theme';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 260;

interface CarouselCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  index: number;
}

function CarouselCard({ title, description, icon, color, index }: CarouselCardProps) {
  const slideUp = useRef(new Animated.Value(100)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 150;

    Animated.parallel([
      Animated.spring(slideUp, {
        toValue: 0,
        delay,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        delay,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
    ).start();
  }, []);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
      <Animated.View
          style={[
            styles.carouselCard,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            },
          ]}
      >
        <LinearGradient
            colors={[color, `${color}CC`]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.cardIconContainer, { transform: [{ rotate: rotation }] }]}>
            <Text style={styles.cardIcon}>{icon}</Text>
          </Animated.View>

          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </LinearGradient>
      </Animated.View>
  );
}

export default function Welcome() {
  const headerScale = useRef(new Animated.Value(0.8)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const bottomSlide = useRef(new Animated.Value(height * 0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(bottomSlide, {
        toValue: 0,
        delay: 400,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
      <View style={styles.container}>
        {/* Yellow background blob */}
        <View style={styles.yellowBlob} />

        {/* Header */}
        <Animated.View
            style={[
              styles.header,
              {
                opacity: headerOpacity,
                transform: [{ scale: headerScale }],
              },
            ]}
        >
          <View style={styles.logoWrapper}>
            <Image
                source={require('../assets/LogoWattply-removebg-preview.png')}
                style={styles.logo}
                resizeMode="contain"
            />
          </View>

          <Text style={styles.appTitle}>Wattply</Text>
          <Text style={styles.appSubtitle}>Smarter timing for everyday energy</Text>
        </Animated.View>

        {/* Carousel Cards */}
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + spacing.lg}
            contentContainerStyle={styles.carouselContainer}
        >
          <CarouselCard
              title="Instant Energy Signal"
              description="A simple traffic light shows whether it’s a good time to run heavy appliances."
              icon="🚦"
              color={colors.brandGold}
              index={0}
          />

          <CarouselCard
              title="Smart Reminders"
              description="Get optional alerts before peak hours and when cheaper windows begin."
              icon="⏰"
              color={colors.brandOrange}
              index={1}
          />

          <CarouselCard
              title="Honest Impact"
              description="Track peak windows avoided and see a conservative, clearly-labeled estimated impact."
              icon="📈"
              color={colors.brandOrangeDeep}
              index={2}
          />
        </ScrollView>

        {/* Bottom CTA Sheet */}
        <Animated.View style={[styles.bottomCTA, { transform: [{ translateY: bottomSlide }] }]}>
          <View style={styles.ctaHandle} />

          <Text style={styles.ctaTitle}>Ready to get started?</Text>
          <Text style={styles.ctaSubtitle}>
            Quick setup — no account, no utility connection.
          </Text>

          <Link href="/onboarding" asChild>
            <Pressable style={styles.mainCTA}>
              <LinearGradient
                  colors={[colors.brandGold, colors.brandOrange]}
                  style={styles.ctaGradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaButtonText}>Start setup</Text>
              </LinearGradient>
            </Pressable>
          </Link>

        </Animated.View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandBg,
  },
  yellowBlob: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.brandGold,
    opacity: 0.3,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.sm,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.brandGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    width: 70,
    height: 70,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.brandText,
    marginBottom: spacing.xs,
    letterSpacing: -1.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.brandSubtext,
    fontWeight: '600',
  },
  carouselContainer: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
    paddingVertical: spacing.sm,
  },
  carouselCard: {
    width: CARD_WIDTH,
    marginRight: spacing.lg,
    height: CARD_HEIGHT,
  },
  cardGradient: {
    borderRadius: 24,
    padding: spacing.xl,
    height: '100%',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  cardIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.whiteSoft30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardIcon: {
    fontSize: 36,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textStrong,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  cardDescription: {
    fontSize: 16,
    color: colors.blackSoft80,
    fontWeight: '600',
    lineHeight: 24,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    paddingBottom: spacing.xl + 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 20,
  },
  ctaHandle: {
    width: 40,
    height: 5,
    backgroundColor: colors.divider,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textStrong,
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  ctaSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontWeight: '500',
  },
  mainCTA: {
    marginBottom: spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.brandGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaGradientButton: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textStrong,
  },
  skipCTA: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textLight,
  },
});
