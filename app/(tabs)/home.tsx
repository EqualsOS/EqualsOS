import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- 1. Import the new NotificationHandler ---
import NotificationHandler from '@/utils/NotificationHandler';
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
    // --- 2. Add the function to call the handler ---
    const handleSendNotification = async () => {
        await NotificationHandler.sendLocalNotification(
          'Equals OS',
          'Hello World! 👋'
        );
    };

    return (
      <SafeAreaView style={styles.container}>
          <ScrollableView>
              <ThemedView style={styles.outerThemedView}>
                  <PageTitle iconName='home' title='Home' />

                  <ThemedView style={styles.linkContainer}>
                      <ThemedText>Welcome!</ThemedText>
                      <Link href="/itemTypes" asChild>
                          <Pressable style={styles.link}>
                              <TabBarIcon name="folder-open-outline" color="#fff" />
                              <ThemedText style={styles.linkText}>Item Types</ThemedText>
                          </Pressable>
                      </Link>
                      <Link href="/convos" asChild>
                          <Pressable style={styles.link}>
                              <TabBarIcon name="chatbubbles-outline" color="#fff" />
                              <ThemedText style={styles.linkText}>Convos</ThemedText>
                          </Pressable>
                      </Link>
                      <Link href="/scenes" asChild>
                          <Pressable style={styles.link}>
                              <TabBarIcon name="film-outline" color="#fff" />
                              <ThemedText style={styles.linkText}>Scenes</ThemedText>
                          </Pressable>
                      </Link>
                  </ThemedView>

                  {/* --- 3. Add the new button --- */}
                  <ThemedView style={styles.actionContainer}>
                      <Pressable style={styles.link} onPress={handleSendNotification}>
                          <TabBarIcon name="notifications-outline" color="#fff" />
                          <ThemedText style={styles.linkText}>Send Notification</ThemedText>
                      </Pressable>
                  </ThemedView>
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
    outerThemedView: {
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
