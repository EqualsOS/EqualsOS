import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import SceneWrapper from '@/components/SceneWrapper';
import * as THREE from 'three';
import { useFocusEffect } from 'expo-router';

import createBookshelf from '@/components/3d/Bookshelf';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

// This is a new component that will build the entire complex scene
function ExploreSceneContent() {
    const bookshelfPositions = useMemo(() => [
        { position: [-637.5, 0, -862.5], rotation: [0, Math.PI / 2, 0] },
        { position: [637.5, 0, -862.5], rotation: [0, -Math.PI / 2, 0] },
        { position: [-637.5, 0, 862.5], rotation: [0, Math.PI / 2, 0], hasMovedBook: true },
        { position: [637.5, 0, 862.5], rotation: [0, -Math.PI / 2, 0] },
    ], []);

    // Memoize the models to prevent re-creation
    const bookshelves = useMemo(() => bookshelfPositions.map(props => createBookshelf(props.hasMovedBook)), [bookshelfPositions]);

    // Cleanup logic
    React.useEffect(() => {
        return () => {
            bookshelves.forEach(b => disposeModel(b));
        };
    }, [bookshelves]);

    return (
        <>
            <GridHelperModel />
            <AxisLinesModel />
            {bookshelves.map((model, index) => (
                <primitive
                    key={index}
                    object={model}
                    position={bookshelfPositions[index].position}
                    rotation={bookshelfPositions[index].rotation}
                />
            ))}
        </>
    );
}


export default function ExploreScreen() {
    const [isReady, setIsReady] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setIsReady(false);
            const timerId = setTimeout(() => {
                setIsReady(true);
            }, 16);
            return () => {
                clearTimeout(timerId);
            };
        }, [])
    );

    if (!isReady) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Building Explore Scene...</Text>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <SceneWrapper>
            <ExploreSceneContent />
        </SceneWrapper>
    );
}

// --- Helper components and functions ---

// Helper to dispose of objects
function disposeModel(model: THREE.Object3D | null) {
    if (!model) return;
    model.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh) {
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(material => material.dispose());
            } else if (mesh.material) {
                mesh.material.dispose();
            }
        }
    });
}

function AxisLinesModel() {
    const model = useMemo(() => createAxisLines(3000), []);
    return <primitive object={model} />;
}

function GridHelperModel() {
    const model = useMemo(() => createGridHelper(6000, 120), []);
    return <primitive object={model} />;
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
