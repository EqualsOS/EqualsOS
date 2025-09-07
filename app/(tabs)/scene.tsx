import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Renderer, THREE } from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Platform, Text, View, useWindowDimensions, LayoutChangeEvent, PanResponder } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// --- NEW: Import postprocessing modules ---
import { EffectComposer, RenderPass, EffectPass, BloomEffect } from 'postprocessing';

import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';
import createAngledPlatform from '@/components/3d/AngledPlatform';

export default function RenderScene() {
    // --- Existing Hooks and State ---
    const { scale } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [renderer, setRenderer] = useState<Renderer | null>(null);
    const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // --- NEW: Ref to hold the EffectComposer ---
    const composerRef = useRef<EffectComposer | null>(null);

    // --- Refs for Touch Interaction ---
    const cameraAngle = useRef(0);
    const startAngle = useRef(0);
    const cameraDistance = useRef(1500);
    const startCameraDistance = useRef(0);
    const startPinchDistance = useRef(0);

    // --- PanResponder for Touch Input ---
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
                        cameraDistance.current = Math.max(300, Math.min(5000, newDistance));
                    }
                } else if (gestureState.numberActiveTouches === 1) {
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
        if (Platform.OS !== 'web') return;
        const handleWheel = (event: WheelEvent) => {
            const zoomSensitivity = 1;
            const newDistance = cameraDistance.current + event.deltaY * zoomSensitivity;
            cameraDistance.current = Math.max(300, Math.min(5000, newDistance));
        };
        window.addEventListener('wheel', handleWheel);
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []);

    // --- UPDATED: useEffect for resizing ---
    useEffect(() => {
        if (renderer && camera && canvasSize.width > 0 && canvasSize.height > 0) {
            const newWidth = canvasSize.width * scale;
            const newHeight = canvasSize.height * scale;
            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            // --- NEW: Resize the composer as well ---
            composerRef.current?.setSize(newWidth, newHeight);
        }
    }, [canvasSize, scale, renderer, camera]);

    // --- UPDATED: handleContextCreate ---
    const handleContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
        const sceneRenderer = new Renderer({ gl });
        setRenderer(sceneRenderer);
        const sceneCamera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 10000);
        sceneCamera.position.y = 800;
        setCamera(sceneCamera);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);

        const gridHelper = createGridHelper();
        scene.add(gridHelper);
        const axes = createAxisLines();
        scene.add(axes);
        const angledPlatform = createAngledPlatform();
        scene.add(angledPlatform);

        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(500, 1000, 750);
        scene.add(light);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // --- NEW: Setup EffectComposer ---
        const composer = new EffectComposer(sceneRenderer);
        composer.addPass(new RenderPass(scene, sceneCamera));

        // --- UPDATED: Increased intensity and luminance threshold ---
        const bloomEffect = new BloomEffect({
            intensity: 5.0,
            luminanceThreshold: 0.1,
            luminanceSmoothing: 0.2,
        });
        const effectPass = new EffectPass(sceneCamera, bloomEffect);
        composer.addPass(effectPass);

        composerRef.current = composer; // Store the composer in the ref

        // --- UPDATED: Animate Loop ---
        const animate = () => {
            requestAnimationFrame(animate);
            const currentAngle = cameraAngle.current;
            const currentDistance = cameraDistance.current;

            sceneCamera.position.x = Math.sin(currentAngle) * currentDistance;
            sceneCamera.position.z = Math.cos(currentAngle) * currentDistance;
            sceneCamera.lookAt(0, 0, 0);

            // --- UPDATED: Faster and less intense pulsing glow effect ---
            const time = performance.now() * 0.005; // Increased speed (0.005)
            //const pulseIntensity = Math.sin(time) * 0.3 + 2.7; // Reduced oscillation range (0.3)
            bloomEffect.intensity = Math.sin(time) * 0.3 + 2.7; // Reduced oscillation range (0.3)

            composer.render();
            gl.endFrameEXP();
        };
        animate();
    }, []);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setCanvasSize({ width, height });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#111111' }} onLayout={onLayout} {...panResponder.panHandlers}>
            {/* UI Group for top-left corner info */}
            <View style={{
                position: 'absolute',
                top: insets.top,
                left: insets.left + 10,
                zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: 8,
                borderRadius: 5,
            }}>
                <Text style={{ color: 'white', fontSize: 12 }}>
                    {dimensionsText}
                </Text>
                {/* Coloured Axis Labels */}
                <View style={{ marginTop: 5, opacity: 0.8 }}>
                    <Text style={{ color: 'white', fontSize: 12 }}>
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>X</Text> (Horizontal)
                    </Text>
                    <Text style={{ color: 'white', fontSize: 12 }}>
                        <Text style={{ color: 'green', fontWeight: 'bold' }}>Y</Text> (Vertical)
                    </Text>
                    <Text style={{ color: 'white', fontSize: 12 }}>
                        <Text style={{ color: 'blue', fontWeight: 'bold' }}>Z</Text> (Depth)
                    </Text>
                </View>
            </View>

            <GLView
                style={{ flex: 1 }}
                onContextCreate={handleContextCreate}
            />
        </View>
    );
}
