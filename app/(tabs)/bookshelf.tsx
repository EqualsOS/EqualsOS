import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import SceneWrapper from '@/components/SceneWrapper';
import { useModel } from '@/hooks/use-model';

import createBookshelf from '@/components/3d/Bookshelf';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

function AxisLinesModel() {
    const model = useMemo(() => createAxisLines(1500), []);
    return <primitive object={model} />;
}

function GridHelperModel() {
    const model = useMemo(() => createGridHelper(3000, 60), []);
    return <primitive object={model} />;
}

export default function BookshelfScreen() {
    // Use the hook to load the main model.
    // The 'true' flag tells it to build the version with the moved book.
    const bookshelfModel = useModel(() => createBookshelf(true));

    // Conditionally render the loader or the scene
    if (!bookshelfModel) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Building Bookshelf...</Text>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <SceneWrapper>
            <GridHelperModel />
            <AxisLinesModel />
            <primitive object={bookshelfModel} />
        </SceneWrapper>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#111111',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginBottom: 20,
        color: '#ffffff',
        fontSize: 16,
        fontStyle: 'italic',
    },
});
