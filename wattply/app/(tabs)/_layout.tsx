import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../src/theme';

const TAB_HEIGHT = 63;

export default function TabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: colors.yellow,
                tabBarInactiveTintColor: colors.muted,

                tabBarStyle: {
                    height: TAB_HEIGHT + insets.bottom,
                    paddingTop: 0,

                    backgroundColor: '#0B0B0B',
                    borderTopWidth: 1,
                    borderRadius:20,
                    borderTopColor: 'rgba(255,255,255,0.08)',
                },

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                },

                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'index') {
                        // ⚡ electricidad / rayo
                        iconName = focused ? 'flash' : 'flash-outline';
                    } else if (route.name === 'settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'impact') {
                        iconName = focused ? 'leaf' : 'leaf-outline';
                    } else {
                        iconName = focused
                            ? 'information-circle'
                            : 'information-circle-outline';
                    }

                    return (
                        <Ionicons
                            name={iconName}
                            size={focused ? size + 2 : size}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tabs.Screen name="index" options={{ title: 'Home' }} />
            <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
            <Tabs.Screen name="impact" options={{ title: 'Impact' }} />
            <Tabs.Screen name="info" options={{ title: 'Tips' }} />
        </Tabs>
    );
}
