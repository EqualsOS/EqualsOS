// app/(tabs)/explore.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Collapsible } from '@/components/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ExploreScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">Explore</ThemedText>
                </ThemedView>
                <ThemedText>This app includes example code to help you get started.</ThemedText>
                <Collapsible title="File-based routing">
                    <ThemedText>
                        This app has three screens: <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>,{' '}
                        <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>, and{' '}
                        <ThemedText type="defaultSemiBold">app/modal.tsx</ThemedText>.
                    </ThemedText>
                    <ThemedText>
                        The layout of the app is defined in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>.
                    </ThemedText>
                </Collapsible>
                <Collapsible title="Assets">
                    <ThemedText>
                        This template includes an example of an image asset.
                    </ThemedText>
                    <ThemedText>
                        The <ThemedText type="defaultSemiBold">@/assets</ThemedText> directory contains static assets for the app.
                    </ThemedText>
                </Collapsible>
                <Collapsible title="Components">
                    <ThemedText>
                        This template includes example code for different components.
                    </ThemedText>
                </Collapsible>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111111',
    },
    contentContainer: {
        padding: 32,
        gap: 16,
    },
    titleContainer: {
        gap: 8,
    },
});
