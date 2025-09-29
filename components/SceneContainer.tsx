// components/SceneContainer.tsx

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { View, StyleSheet, PanResponder, Text, useWindowDimensions, LayoutChangeEvent, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as THREE from 'three';
// --- 1. NEW: Import useFocusEffect ---
import { useFocusEffect } from 'expo-router';

// Helper function to clean up 3D objects from memory
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

// Camera Controller Component
function CameraController({ angleRef, distanceRef }: { angleRef: React.MutableRefObject<number>, distanceRef: React.MutableRefObject<number> }) {
    useFrame(({ camera }) => {
        camera.position.x = Math.sin(angleRef.current) * distanceRef.current;
        camera.position.z = Math.cos(angleRef.current) * distanceRef.current;
        camera.position.y = 800;
        camera.lookAt(0, 0, 0);
    });
    return null;
}

// The main container component
export default function SceneContainer({ createModel, modelPosition, children }: {
    createModel?: () => THREE.Group;
    modelPosition?: [number, number, number];
    children?: React.ReactNode;
}) {
    const [model, setModel] = useState<THREE.Group | null>(null);

    // --- 2. UPDATED: Swapped useEffect for useFocusEffect ---
    useFocusEffect(
        useCallback(() => {
            let modelToDispose: THREE.Group | null = null;
            if (createModel) {
                // Use a timeout to allow the loading spinner to render first
                const timerId = setTimeout(() => {
                    const loadedModel = createModel();
                    modelToDispose = loadedModel;
                    setModel(loadedModel);
                }, 16);

                // The cleanup function now runs when the screen loses focus
                return () => {
                    clearTimeout(timerId);
                    disposeModel(modelToDispose);
                    setModel(null); // Reset state for next visit
                };
            }
        }, [createModel])
    );

    // --- The rest of the component is unchanged ---
    const cameraAngle = useRef(0);
    const startAngle = useRef(0);
    const cameraDistance = useRef(2500);
    const startCameraDistance = useRef(0);
    const startPinchDistance = useRef(0);
    const { scale } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setCanvasSize({ width, height });
    };

    const dimensionsText = useMemo(() => {
        const canvasWidth = (canvasSize.width * scale).toFixed(0);
        const canvasHeight = (canvasSize.height * scale).toFixed(0);
        return `Canvas: ${canvasWidth} x ${canvasHeight}`;
    }, [canvasSize, scale]);

    useEffect(() => {
        if (Platform.OS === 'web') {
            const handleWheel = (event: WheelEvent) => {
                const zoomSensitivity = 1.5;
                const newDistance = cameraDistance.current + event.deltaY * zoomSensitivity;
                cameraDistance.current = Math.max(500, Math.min(3500, newDistance));
            };
            window.addEventListener('wheel', handleWheel);
            return () => window.removeEventListener('wheel', handleWheel);
        }
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                startAngle.current = cameraAngle.current;
                startCameraDistance.current = cameraDistance.current;
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.numberActiveTouches === 2) {
                    const touches = evt.nativeEvent.touches;
                    const dx = touches[0].pageX - touches[1].pageX;
                    const dy = touches[0].pageY - touches[1].pageY;
                    const currentPinchDistance = Math.hypot(dx, dy);

                    if (startPinchDistance.current === 0) {
                        startPinchDistance.current = currentPinchDistance;
                    } else {
                        const scaleFactor = currentPinchDistance / startPinchDistance.current;
                        const newDistance = startCameraDistance.current / scaleFactor;
                        cameraDistance.current = Math.max(500, Math.min(3500, newDistance));
                    }
                }
                else if (gestureState.numberActiveTouches === 1) {
                    startPinchDistance.current = 0;
                    const sensitivity = 0.01;
                    cameraAngle.current = startAngle.current - gestureState.dx * sensitivity;
                }
            },
            onPanResponderRelease: () => {
                startPinchDistance.current = 0;
            },
        })
    ).current;

    const isLoading = createModel && !model;

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <View style={styles.container} onLayout={onLayout}>
            <Canvas camera={{ fov: 50, far: 10000 }}>
                <CameraController angleRef={cameraAngle} distanceRef={cameraDistance} />
                <ambientLight intensity={0.8} />
                <directionalLight position={[500, 1000, 750]} intensity={1.5} />
                {model && <primitive object={model} position={modelPosition} />}
                {children}
            </Canvas>
            <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
            <View style={[styles.overlay, { top: insets.top, left: insets.left + 10 }]}>
                <Text style={styles.overlayText}>
                    {dimensionsText}
                </Text>
                <View style={{ marginTop: 5, opacity: 0.8 }}>
                    <Text style={styles.overlayText}><Text style={{ color: 'red', fontWeight: 'bold' }}>X</Text> (Horizontal)</Text>
                    <Text style={styles.overlayText}><Text style={{ color: 'green', fontWeight: 'bold' }}>Y</Text> (Vertical)</Text>
                    <Text style={styles.overlayText}><Text style={{ color: 'blue', fontWeight: 'bold' }}>Z</Text> (Depth)</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111111',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#111111',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 5,
    },
    overlayText: {
        color: 'white',
        fontSize: 12,
    },
});
