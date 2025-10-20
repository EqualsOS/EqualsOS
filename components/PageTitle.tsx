// components/PageTitle.tsx

import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// --- 1. Import the LogoImage component ---
import { LogoImage } from '@/components/LogoImage';

type PageTitleProps = {
  title: string;
  // Make iconName optional as we won't always use it
  iconName?: React.ComponentProps<typeof TabBarIcon>['name'] | 'brand';
};

export function PageTitle({ title, iconName }: PageTitleProps) {
  return (
    <ThemedView style={styles.titleContainer}>
      {/* --- 2. Conditionally render the icon or logo --- */}
      {iconName === 'brand' ? (
        // If iconName is 'brand', show the LogoImage
        <LogoImage
          style={styles.logoStyle}
        />
      ) : iconName ? (
        // Otherwise, if an iconName is provided, show the TabBarIcon
        <TabBarIcon
          name={iconName}
          color='#fff'
          style={styles.iconStyle}
        />
      ) : null /* Optionally render nothing if no iconName */}
      <ThemedText type='title' style={styles.textStyle}>{title}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    //marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10, // Use gap for consistent spacing
  },
  textStyle: {
    //paddingBottom: 10,
  },
  // --- 1. Style for icon. ---
  iconStyle: {
    marginRight: 6,
    transform: 'translateY(6%), scale(1.15)'
  },
  // --- 2. Style for logo. ---
  logoStyle: {
    transform: 'translate(-1%, -3%)',
  }
});
