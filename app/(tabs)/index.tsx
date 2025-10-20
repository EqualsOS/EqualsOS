// app/index.tsx

import React, {
  useEffect,
  useState
} from 'react';
import {
  StyleSheet,
  Pressable,
  View
} from 'react-native';
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
import {
  PageTitle
} from '@/components/PageTitle';
import {
  ScrollableView
} from '@/components/ScrollableView';
// --- 1. Import SecureStore ---
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// This is necessary for the auth session to work correctly
WebBrowser.maybeCompleteAuthSession();
const getCredentials = ()=>{
  if (__DEV__) {
    return {
      webClientId: Constants.expoConfig?.extra?.googleSignIn?.devWebClientId,
      androidClientId: Constants.expoConfig?.extra?.googleSignIn?.devAndroidClientId
      // Remember to add your other client IDs for iOS, web, etc.
    };
  }
  return {
    webClientId: Constants.expoConfig?.extra?.googleSignIn?.prodWebClientId,
    androidClientId: Constants.expoConfig?.extra?.googleSignIn?.prodAndroidClientId
    // Remember to add your other client IDs for iOS, web, etc.
  };
};

export default function LoginScreen() {
  const router = useRouter();
  // --- 2. Add state to hold user info ---
  const [userInfo, setUserInfo] = useState<any>(null); // Use a more specific type if known

  const [request, response, promptAsync] = Google.useAuthRequest(getCredentials());

  useEffect(() => {
    // --- 3. Updated logic for successful response ---
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication) {
        console.log('Authentication successful:', authentication);

        // Securely store tokens (example: store refresh token)
        if (authentication.refreshToken) {
          SecureStore.setItemAsync('googleRefreshToken', authentication.refreshToken);
        }

        // Fetch user info using the access token
        fetchUserInfo(authentication.accessToken);

        // Navigate to home screen after successful login and fetching info
        router.replace('/home');
      }
    } else if (response?.type === 'error') {
      console.error('Authentication error:', response.error);
    }
  }, [response, router]);

  // --- 4. Function to fetch user info ---
  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      console.log('User Info:', user);
      setUserInfo(user); // Store user info in state
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const handleContinue = () => {
    // Replace the current screen with the main tab layout
    router.replace('/home');
  };
  let suffix = '';
  //suffix = 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww1'
  const brandName = `Equals OS${suffix}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollableView style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <PageTitle iconName='brand' title={brandName} />
          <ThemedText style={styles.subtitleText}>Organize your world.</ThemedText>
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
      </ScrollableView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_CONTAINER_BACKGROUND_COLOUR,
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 48,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 0,
    gap: 0,
  },
  subtitleText: {
    paddingVertical: 10,
  },
  buttonContainer: {
    gap: 16,
    marginTop: 25
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
    fontSize: 16,
  },
});
