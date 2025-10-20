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
    <ScrollView contentContainerStyle={[
      styles.scrollContentContainer
    ]}>
      <ThemedView style={[
        style,
        styles.scrollableThemedView
      ]} {...otherProps}>
        {children}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContentContainer: {
    padding: 0,
    flexGrow: 1
  },
  scrollableThemedView: {
    flex: 1,
    gap: 48,
  },
});
