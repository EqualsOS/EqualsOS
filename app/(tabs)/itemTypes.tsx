import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Item Types</ThemedText>
        </ThemedView>

        <ThemedView style={styles.linkContainer}>
          <ThemedText>Select an Item Type to view:</ThemedText>
          <Link href="/app/scenes/platform" asChild>
            <Pressable style={styles.link}>
              <TabBarIcon name="layers-outline" color="#fff" />
              <ThemedText style={styles.linkText}>Platform</ThemedText>
            </Pressable>
          </Link>
          <Link href="/app/scenes/pallet" asChild>
            <Pressable style={styles.link}>
              <TabBarIcon name="grid-outline" color="#fff" />
              <ThemedText style={styles.linkText}>Pallet</ThemedText>
            </Pressable>
          </Link>
          <Link href="/app/scenes/box" asChild>
            <Pressable style={styles.link}>
              <TabBarIcon name="cube-outline" color="#fff" />
              <ThemedText style={styles.linkText}>Box</ThemedText>
            </Pressable>
          </Link>
          <Link href="/app/scenes/bookshelf" asChild>
            <Pressable style={styles.link}>
              <TabBarIcon name="library-outline" color="#fff" />
              <ThemedText style={styles.linkText}>Bookshelf</ThemedText>
            </Pressable>
          </Link>
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
