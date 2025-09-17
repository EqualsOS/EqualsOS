import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { View, StyleSheet, PanResponder, Text, useWindowDimensions, LayoutChangeEvent, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mesh } from 'three';
import * as ScreenOrientation from 'expo-screen-orientation';

// --- 1. Import your custom helper functions ---
import createAngledPlatform from '@/components/3d/AngledPlatform';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

// --- Camera Controller Component ---
function CameraController({ angleRef, distanceRef }: { angleRef: React.MutableRefObject<number>, distanceRef: React.MutableRefObject<number> }) {
    useFrame(({ camera }) => {
        camera.position.x = Math.sin(angleRef.current) * distanceRef.current;
        camera.position.z = Math.cos(angleRef.current) * distanceRef.current;
        camera.position.y = 800;
        camera.lookAt(0, 0, 0);
    });
    return null;
}

// --- Wrapper components for your 3D objects ---
function PlatformModel() {
    const platform = useMemo(() => createAngledPlatform(), []);
    return <primitive object={platform} />;
}

function AxisLinesModel() {
    const axes = useMemo(() => createAxisLines(1000), []); // Pass a size argument
    return <primitive object={axes} />;
}

function GridHelperModel() {
    const grid = useMemo(() => createGridHelper(), []);
    return <primitive object={grid} />;
}

// The main screen component
export default function HomeScreen() {
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
        async function allowScreenRotation() {
            if (Platform.OS !== 'web') {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
            }
        }
        allowScreenRotation();
        return () => {
            if (Platform.OS !== 'web') {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
        };
    }, []);

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

    return (
        <View style={styles.container} onLayout={onLayout}>
            <Canvas camera={{ fov: 50, far: 10000 }}>
                <CameraController angleRef={cameraAngle} distanceRef={cameraDistance} />
                <ambientLight intensity={0.8} />
                <directionalLight position={[500, 1000, 750]} intensity={1.5} />

                <GridHelperModel />
                <AxisLinesModel />
                <PlatformModel />
            </Canvas>
            <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />

            {/* --- UPDATED: UI Overlay View --- */}
            <View style={[styles.overlay, { top: insets.top, left: insets.left + 10 }]}>
                <Text style={styles.overlayText}>
                    {dimensionsText}
                </Text>

                {/* --- NEW: Coloured Axis Labels --- */}
                <View style={{ marginTop: 5, opacity: 0.8 }}>
                    <Text style={styles.overlayText}>
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>X</Text> (Horizontal)
                    </Text>
                    <Text style={styles.overlayText}>
                        <Text style={{ color: 'green', fontWeight: 'bold' }}>Y</Text> (Vertical)
                    </Text>
                    <Text style={styles.overlayText}>
                        <Text style={{ color: 'blue', fontWeight: 'bold' }}>Z</Text> (Depth)
                    </Text>
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
