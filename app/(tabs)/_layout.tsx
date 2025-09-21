// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />

            {/* NEW entry for the platform screen */}
            <Tabs.Screen
                name="platform"
                options={{
                    title: 'Platform',
                    tabBarLabel: 'Platform',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'layers' : 'layers-outline'} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="pallet"
                options={{
                    title: 'Pallet',
                    tabBarLabel: 'Pallet',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'grid' : 'grid-outline'} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="box"
                options={{
                    title: 'Box',
                    tabBarLabel: 'Box',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'cube' : 'cube-outline'} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="bookshelf"
                options={{
                    title: 'Bookshelf',
                    tabBarLabel: 'Bookshelf',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'library' : 'library-outline'} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarLabel: 'Explore',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'compass' : 'compass-outline'} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
