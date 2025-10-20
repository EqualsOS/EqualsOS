import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import React
  from 'react';
import {
  PageTitle
} from '@/components/PageTitle';
import {
  DEFAULT_CONTAINER_BACKGROUND_COLOUR
} from '@/constants/theme';
import {
  ScrollableView
} from '@/components/ScrollableView';

export default function HomeScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollableView style={styles.scrollableThemedView}>
        <PageTitle iconName='folder-open' title='Item Types' />

        <ThemedView style={styles.linkContainer}>
          <ThemedText>Not finished yet!</ThemedText>
        </ThemedView>
      </ScrollableView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_CONTAINER_BACKGROUND_COLOUR,
  },
  scrollableThemedView: {
    padding: 32
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
    fontSize: 16,
  },
});
