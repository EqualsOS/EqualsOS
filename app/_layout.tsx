import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// --- 1. Imports for Notifications ---
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false, // Hides the title bar at the top
      tabBarActiveTintColor: 'white',
      tabBarStyle: {
        backgroundColor: '#1c1c1c',
        borderTopColor: '#333',
        display: 'none'
      }
    }}>
    </Tabs>
  );
}
