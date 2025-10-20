import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// --- 1. Imports for Notifications ---
import React, { useEffect } from 'react';

export default function TabLayout() {
  const [loaded, error] = useFonts({
    'Gordita-Light': require('../assets/fonts/gordita/gordita-light.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

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
