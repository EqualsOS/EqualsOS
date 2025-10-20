// components/ScrollableView.tsx

import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedView, ThemedViewProps } from '@/components/themed-view';

// This allows the component to accept all standard ScrollView props
interface ScrollableViewProps extends ThemedViewProps {
  children: React.ReactNode;
}

export function ScrollableView({ children, style, ...otherProps }: ScrollableViewProps) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      <ThemedView style={style} {...otherProps}>
        {children}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /*scrollContentContainer: {
    minHeight: '100%', // Ensure content can be centered if it's short
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 32,
    gap: 48,
  },
  outerContainer: {
    flex: 1,
    justifyContent: 'center', // Vertically center the scroll content
  },*/
  scrollContentContainer: {
    minHeight: '100%',
    //flex: 1,
    //gap: 0,
    padding: 0
  },
  outerThemedView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //padding: 32,
    gap: 0,
  },
});
