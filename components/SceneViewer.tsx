// Create a new file at 'components/SceneViewer.tsx'
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { View, StyleSheet, PanResponder, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import createGridHelper from '@/components/3d/GridHelper';
import createAxisLines from '@/components/3d/AxisLines';

// Camera Controller remains the same
function CameraController({ angleRef, distanceRef }: { angleRef: React.MutableRefObject<number>, distanceRef: React.MutableRefObject<number> }) {
    useFrame(({ camera }) => {
        camera.position.x = Math.sin(angleRef.current) * distanceRef.current;
        camera.position.z = Math.cos(angleRef.current) * distanceRef.current;
        camera.position.y = 800;
        camera.lookAt(0, 0, 0);
    });
    return null;
}

// Models for helpers that appear in every scene
const AxisLinesModel = () => <primitive object={useMemo(() => createAxisLines(1000), [])} />;
const GridHelperModel = () => <primitive object={useMemo(() => createGridHelper(), [])} />;

// The main reusable component
export default function SceneViewer({ children }: { children: React.ReactNode }) {
    const cameraAngle = useRef(0);
    const startAngle = useRef(0);
    const cameraDistance = useRef(2500);
    const startCameraDistance = useRef(0);
    const startPinchDistance = useRef(0);

    // Screen rotation and zoom effects remain the same
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
                const newDistance = cameraDistance.current + event.deltaY * 1.5;
                cameraDistance.current = Math.max(500, Math.min(3500, newDistance));
            };
            window.addEventListener('wheel', handleWheel);
            return () => window.removeEventListener('wheel', handleWheel);
        }
    }, []);

    // PanResponder gesture controls remain the same
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
                    const dist = Math.hypot(dx, dy);
                    if (startPinchDistance.current === 0) startPinchDistance.current = dist;
                    const scaleFactor = dist / startPinchDistance.current;
                    cameraDistance.current = Math.max(500, Math.min(3500, startCameraDistance.current / scaleFactor));
                } else if (gestureState.numberActiveTouches === 1) {
                    startPinchDistance.current = 0;
                    cameraAngle.current = startAngle.current - gestureState.dx * 0.01;
                }
            },
            onPanResponderRelease: () => { startPinchDistance.current = 0; },
        })
    ).current;

    return (
        <View style={styles.container}>
            <Canvas camera={{ fov: 50, far: 10000 }}>
                <CameraController angleRef={cameraAngle} distanceRef={cameraDistance} />
                <ambientLight intensity={0.8} />
                <directionalLight position={[500, 1000, 750]} intensity={1.5} />
                <GridHelperModel />
                <AxisLinesModel />
                {/* This is where the specific scene model will be rendered */}
                {children}
            </Canvas>
            <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111111' },
});
