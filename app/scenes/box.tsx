// app/(tabs)/box.tsx

import React, { useMemo } from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';

import SceneWrapper from '@/components/SceneWrapper'; // Import the new wrapper
import { useModel } from '@/hooks/use-model';
import createRedRockDeliBox from '@/components/3d/RedRockDeliBox';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

function AxisLinesModel() {
    const model = useMemo(() => createAxisLines(1000), []);
    return <primitive object={model} />;
}

function GridHelperModel() {
    const model = useMemo(() => createGridHelper(), []);
    return <primitive object={model} />;
}

export default function BoxScreen() {
    const boxModel = useModel(createRedRockDeliBox);

    if (!boxModel) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Building Model...</Text>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <SceneWrapper>
            <GridHelperModel />
            <AxisLinesModel />
            <primitive object={boxModel} position={[0, 240 / 2, 0]} />
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
        marginBottom: 20, // Changed from marginTop to marginBottom
        color: '#ffffff',
        fontSize: 16,
        fontStyle: 'italic',
    },
});
