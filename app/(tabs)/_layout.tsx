// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
    useEffect(() => {
        async function allowScreenRotation() {
            if (Platform.OS !== 'web') {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
            }
        }
        allowScreenRotation();
        return () => {
            if (Platform.OS !== 'web') {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
        };
    }, []);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                // We remove the global unmountOnBlur from here
            }}>
            <Tabs.Screen name="index" options={{ title: 'Account', tabBarLabel: 'Account', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />), }} />
            <Tabs.Screen name="home" options={{ title: 'Home', tabBarLabel: 'Home', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />), }} />
            <Tabs.Screen name="itemTypes" options={{ title: 'Item Types', tabBarLabel: 'Item Types', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'folder-open' : 'folder-open-outline'} color={color} />), }} />
            <Tabs.Screen name="convos" options={{ title: 'Convos', tabBarLabel: 'Convos', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} />), }} />
            <Tabs.Screen name="scenes" options={{ title: 'Scenes', tabBarLabel: 'Scenes', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'film' : 'film-outline'} color={color} />), }} />
        </Tabs>
    );
}
