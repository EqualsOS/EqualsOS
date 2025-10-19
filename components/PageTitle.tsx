import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

type PageTitleProps = {
  title: string;
  iconName: React.ComponentProps<typeof TabBarIcon>['name'];
};

export function PageTitle({ title, iconName }: PageTitleProps) {
  return (
    <ThemedView style={styles.titleContainer}>
      {/* --- UPDATED: Added marginBottom to the icon's style --- */}
      <TabBarIcon
        name={iconName}
        color='#fff'
        style={{ marginRight: 12, marginBottom: 2 }} // Adjust '2' as needed
      />
      <ThemedText type='title'>{title}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
