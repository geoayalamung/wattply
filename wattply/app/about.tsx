import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../src/components/Screen';

export default function About() {
  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>About</Text>
        <Text style={styles.body}>
          This app uses Expo Router with a Stack layout and TypeScript. Keep
          screens in app/ and everything else in src/.
        </Text>
      </View>
      <Link href="/" style={styles.link}>
        Back home
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#141520',
  },
  title: {
    color: '#F5F7FF',
    fontSize: 24,
    fontWeight: '700',
  },
  body: {
    color: '#B9BDCA',
    fontSize: 16,
    lineHeight: 22,
  },
  link: {
    marginTop: 16,
    color: '#7EE081',
    fontSize: 16,
    fontWeight: '600',
  },
});
