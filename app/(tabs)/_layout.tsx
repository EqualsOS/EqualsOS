// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
            <Tabs.Screen name="index" options={{ title: 'Home', tabBarLabel: 'Home', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />), }} />

            {/* --- Simple scenes get unmountOnBlur --- */}
            <Tabs.Screen name="platform" options={{ title: 'Platform', tabBarLabel: 'Platform', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'layers' : 'layers-outline'} color={color} />), }} />
            <Tabs.Screen name="pallet" options={{ title: 'Pallet', tabBarLabel: 'Pallet', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'grid' : 'grid-outline'} color={color} />), }} />
            <Tabs.Screen name="box" options={{ title: 'Box', tabBarLabel: 'Box', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'cube' : 'cube-outline'} color={color} />), }} />

            {/* --- Heavy scenes DO NOT get unmountOnBlur --- */}
            <Tabs.Screen name="bookshelf" options={{ title: 'Bookshelf', tabBarLabel: 'Bookshelf', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'library' : 'library-outline'} color={color} />), }} />
            <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarLabel: 'Explore', tabBarIcon: ({ color, focused }) => (<TabBarIcon name={focused ? 'compass' : 'compass-outline'} color={color} />), }} />
        </Tabs>
    );
}
