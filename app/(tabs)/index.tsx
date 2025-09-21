import { StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function HomeScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Scenes</ThemedText>
            </ThemedView>

            <ThemedView style={styles.linkContainer}>
                {/* --- Text added back --- */}
                <ThemedText>Select a scene to view:</ThemedText>

                <Link href="/platform" asChild>
                    <Pressable style={styles.link}>
                        <TabBarIcon name="layers-outline" color="#fff" />
                        <ThemedText style={styles.linkText}>Platform</ThemedText>
                    </Pressable>
                </Link>

                <Link href="/pallet" asChild>
                    <Pressable style={styles.link}>
                        <TabBarIcon name="grid-outline" color="#fff" />
                        <ThemedText style={styles.linkText}>Pallet</ThemedText>
                    </Pressable>
                </Link>

                <Link href="/box" asChild>
                    <Pressable style={styles.link}>
                        <TabBarIcon name="cube-outline" color="#fff" />
                        <ThemedText style={styles.linkText}>Box</ThemedText>
                    </Pressable>
                </Link>

                <Link href="/bookshelf" asChild>
                    <Pressable style={styles.link}>
                        <TabBarIcon name="library-outline" color="#fff" />
                        <ThemedText style={styles.linkText}>Bookshelf</ThemedText>
                    </Pressable>
                </Link>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        gap: 16,
    },
    titleContainer: {
        marginBottom: 8,
    },
    linkContainer: {
        gap: 16,
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
