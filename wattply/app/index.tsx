import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../src/components/Screen';

export default function Home() {
  return (
    <Screen>
      <StatusBar style="light" />
      <View style={styles.hero}>
        <Text style={styles.kicker}>Wattply</Text>
        <Text style={styles.title}>Modern Expo Router starter</Text>
        <Text style={styles.body}>
          File-based routes live in app/. UI and logic belong in src/.
        </Text>
      </View>
      <Link href="/about" style={styles.link}>
        About this starter
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 12,
    paddingVertical: 16,
  },
  kicker: {
    color: '#9FA3B1',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F5F7FF',
    fontSize: 32,
    fontWeight: '700',
  },
  body: {
    color: '#B9BDCA',
    fontSize: 16,
    lineHeight: 22,
  },
  link: {
    marginTop: 12,
    color: '#7EE081',
    fontSize: 16,
    fontWeight: '600',
  },
});
