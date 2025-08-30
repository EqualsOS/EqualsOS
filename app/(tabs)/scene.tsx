import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Renderer, THREE } from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Platform, Text, View, useWindowDimensions, LayoutChangeEvent, PanResponder } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import createAxisLines from '@/components/3d/AxisLines';
import { createBookCover } from "@/components/3d/LibraryBook";

export default function RenderScene() {
    // --- Existing Hooks and State ---
    const { scale } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [renderer, setRenderer] = useState<Renderer | null>(null);
    const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // --- 1. Refs for Touch Rotation ---
    // We use refs to store the rotation angle. This is more performant than state
    // because it doesn't cause the component to re-render on every touch movement.
    const cameraAngle = useRef(0);
    const startAngle = useRef(0);

    // --- 2. PanResponder for Touch Input ---
    // This hook handles the drag gestures.
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true, // Activate responder on touch
            onPanResponderGrant: () => {
                // When a touch starts, store the current angle.
                startAngle.current = cameraAngle.current;
            },
            onPanResponderMove: (evt, gestureState) => {
                // As the finger moves, update the angle based on the horizontal drag (dx).
                // We subtract dx to make the rotation feel natural (drag right -> rotate right).
                const sensitivity = 0.01;
                cameraAngle.current = startAngle.current + gestureState.dx * sensitivity;
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
        if (renderer && camera && canvasSize.width > 0 && canvasSize.height > 0) {
            const newWidth = canvasSize.width * scale;
            const newHeight = canvasSize.height * scale;
            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;
            camera.position.set(0, 0, 500);
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();
        }
    }, [canvasSize, scale, renderer, camera]);

    const handleContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
        const sceneRenderer = new Renderer({ gl });
        setRenderer(sceneRenderer);
        const sceneCamera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 10000);
        setCamera(sceneCamera);
        const scene = new THREE.Scene();
        const axes = createAxisLines();
        scene.add(axes);
        const book = createBookCover();
        scene.add(book);
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 100);
        scene.add(light);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // --- 3. Updated Animation Loop ---
        // The animation loop now reads the angle from the ref on every frame
        // to position the camera, instead of running its own automatic animation.
        const animate = () => {
            const currentAngle = cameraAngle.current;

            sceneCamera.position.x = Math.cos(currentAngle) * 500;
            sceneCamera.position.z = Math.sin(currentAngle) * 500;
            sceneCamera.lookAt(0, 0, 0);

            sceneRenderer.render(scene, sceneCamera);
            gl.endFrameEXP();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, []);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setCanvasSize({ width, height });
    };

    // --- 4. Apply Pan Handlers to the View ---
    // The pan handlers are spread onto the main View, making the whole area draggable.
    return (
        <View style={{ flex: 1 }} onLayout={onLayout} {...panResponder.panHandlers}>
            <Text style={{
                position: 'absolute',
                top: insets.top,
                left: insets.left + 10,
                color: 'white',
                zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: 4,
                borderRadius: 4,
            }}>
                {dimensionsText}
            </Text>
            <GLView
                style={{ flex: 1 }}
                onContextCreate={handleContextCreate}
            />
        </View>
    );
}

