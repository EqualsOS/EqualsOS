import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import SceneWrapper from '@/components/SceneWrapper';
import { useModel } from '@/hooks/use-model';

import createLoscamPallet from '@/components/3d/LoscamPallet';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

// Helper components for accessories
function AxisLinesModel() {
    const model = useMemo(() => createAxisLines(1000), []);
    return <primitive object={model} />;
}

function GridHelperModel() {
    const model = useMemo(() => createGridHelper(), []);
    return <primitive object={model} />;
}

export default function PalletScreen() {
    // Use the hook to load the main model. It returns the model, or null if loading.
    const palletModel = useModel(createLoscamPallet);

    // Conditionally render the loader or the scene
    if (!palletModel) {
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
            <primitive object={palletModel} position={[0, 150 / 2, 0]} />
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
        marginTop: 10,
        color: '#ffffff',
        fontSize: 16,
        fontStyle: 'italic',
    },
});
