import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppContainer } from '../../src/components/AppContainer';
import { Card } from '../../src/components/Card';
import { colors, spacing } from '../../src/theme';

type Level = 'green' | 'yellow' | 'red';

type TipCardProps = {
  level: Level;
  title: string;
  subtitle: string;
  doItems: string[];
  avoidItems: string[];
  examples: string;
};

function levelMeta(level: Level) {
  switch (level) {
    case 'green':
      return {
        icon: 'flash' as const,
        pillText: 'Best time',
        accentBg: 'rgba(52, 211, 153, 0.12)', // emerald-ish
        accentBorder: 'rgba(52, 211, 153, 0.25)',
      };
    case 'yellow':
      return {
        icon: 'sunny-outline' as const,
        pillText: 'Normal',
        accentBg: 'rgba(255, 204, 0, 0.10)', // your yellow vibe
        accentBorder: 'rgba(255, 204, 0, 0.22)',
      };
    case 'red':
      return {
        icon: 'warning-outline' as const,
        pillText: 'Avoid heavy loads',
        accentBg: 'rgba(248, 113, 113, 0.10)', // red-ish
        accentBorder: 'rgba(248, 113, 113, 0.22)',
      };
  }
}

function Bullet({ text }: { text: string }) {
  return (
      <View style={styles.bullet}>
        <View style={styles.dot} />
        <Text style={styles.bulletText}>{text}</Text>
      </View>
  );
}

function TipCard({ level, title, subtitle, doItems, avoidItems, examples }: TipCardProps) {
  const meta = levelMeta(level);

  return (
      <Card>
        {/* Header row */}
        <View style={styles.tipHeader}>
          <View style={[styles.iconBadge, { backgroundColor: meta.accentBg, borderColor: meta.accentBorder }]}>
            <Ionicons name={meta.icon} size={18} color={colors.yellow} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>

          <View style={[styles.pill, { borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.06)' }]}>
            <Text style={styles.pillText}>{meta.pillText}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.colLabel}>Do</Text>
            {doItems.map((t) => (
                <Bullet key={t} text={t} />
            ))}
          </View>

          <View style={styles.col}>
            <Text style={styles.colLabel}>Avoid</Text>
            {avoidItems.map((t) => (
                <Bullet key={t} text={t} />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.examplesLabel}>Examples</Text>
        <Text style={styles.cardBody}>{examples}</Text>
      </Card>
  );
}

export default function Tips() {
  return (
      <AppContainer contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tips</Text>
          <Text style={styles.subtitle}>Simple rules you can follow without overthinking.</Text>
        </View>

        <TipCard
            level="green"
            title="Green hours"
            subtitle="Best time to run heavy appliances."
            doItems={[
              'Laundry / dryer',
              'Dishwasher',
              'EV charging (if you have it)',
            ]}
            avoidItems={[
              'Nothing special—this is the best window',
              'Just don’t stack everything at once if it’s inconvenient',
            ]}
            examples="If you see a green window coming up, queue your dishwasher or laundry to start then. Even a 30–60 minute shift can help."
        />

        <TipCard
            level="yellow"
            title="Yellow hours"
            subtitle="Normal demand—fine for essentials."
            doItems={[
              'Cooking, lights, normal use',
              'Small loads if needed',
            ]}
            avoidItems={[
              'Back-to-back heavy cycles (dryer + dishwasher + EV)',
              'Preheating large appliances unnecessarily',
            ]}
            examples="Use yellow for normal life. If a green window is soon, hold off on heavy loads and run them then."
        />

        <TipCard
            level="red"
            title="Red hours"
            subtitle="High demand—pause heavy loads if possible."
            doItems={[
              'Only essentials',
              'Wait for the next change if you can',
            ]}
            avoidItems={[
              'Laundry / dryer',
              'Dishwasher',
              'EV charging',
            ]}
            examples="If it’s red, treat it like a ‘delay heavy loads’ signal. The easiest win is simply waiting until the next green/yellow window."
        />
      </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtext,
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.subtext,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
    marginTop: 2,
  },

  twoCol: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  col: {
    flex: 1,
  },
  colLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.xs,
  },

  bullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 19,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: spacing.md,
  },

  examplesLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardBody: {
    fontSize: 13,
    color: colors.subtext,
    lineHeight: 19,
  },
});
