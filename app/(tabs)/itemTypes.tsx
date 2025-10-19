import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import React
  from "react";
import {
  PageTitle
} from "@/components/PageTitle";

export default function HomeScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <PageTitle iconName='folder-open' title='Item Types' />

        <ThemedView style={styles.linkContainer}>
          <ThemedText>Not finished yet!</ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  scrollContentContainer: {
    padding: 32,
    gap: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  linkContainer: {
    gap: 16,
  },
  // --- 4. Add the style for the new button's container ---
  actionContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 24,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
