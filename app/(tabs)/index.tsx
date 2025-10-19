// app/index.tsx

import React, { useEffect } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DEFAULT_CONTAINER_BACKGROUND_COLOUR
} from '@/constants/theme';

// This is necessary for the auth session to work correctly
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "791815690935-sfosouk9ial6kdnt6htgmaothsth5uj1.apps.googleusercontent.com",
    // Remember to add your other client IDs for iOS, web, etc.
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Authentication successful!', authentication);
      // On success, replace the current screen with the main tab layout
      router.replace('/home');
    } else if (response?.type === 'error') {
      console.error('Authentication error:', response.error);
    }
  }, [response]);

  const handleContinue = () => {
    // Replace the current screen with the main tab layout
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Equals OS</ThemedText>
          <ThemedText>Organize your world.</ThemedText>
        </ThemedView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            disabled={!request}
            onPress={() => promptAsync()}
          >
            <TabBarIcon name="logo-google" color="#fff" />
            <ThemedText style={styles.buttonText}>Sign in with Google</ThemedText>
          </Pressable>

          <Pressable style={styles.button} onPress={handleContinue}>
            <ThemedText style={styles.buttonText}>Continue without signing in</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_CONTAINER_BACKGROUND_COLOUR,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
    gap: 48,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
