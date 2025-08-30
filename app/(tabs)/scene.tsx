import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Renderer, THREE } from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Platform, Text, View, useWindowDimensions, LayoutChangeEvent } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import createAxisLines from '@/components/3d/AxisLines';
import { createBookCover } from "@/components/3d/LibraryBook";

export default function RenderScene() {
    // We still use this for the pixel density `scale`.
    const { scale } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // State to hold the renderer and camera.
    const [renderer, setRenderer] = useState<Renderer | null>(null);
    const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);

    // ✅ **FIX 1: State to hold the ACTUAL canvas size.**
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const dimensionsText = useMemo(() => {
        // We now display the size from our state for accuracy.
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

    // ✅ **FIX 2: This useEffect now uses the correct canvasSize.**
    useEffect(() => {
        if (renderer && camera && canvasSize.width > 0 && canvasSize.height > 0) {
            // These are now the accurate pixel dimensions of the GLView.
            const newWidth = canvasSize.width * scale;
            const newHeight = canvasSize.height * scale;

            // Update renderer and aspect ratio
            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;
            camera.position.set(0, 0, 500);
            camera.lookAt(0, 0, 0);

            // Apply all changes
            camera.updateProjectionMatrix();
        }
    }, [canvasSize, scale, renderer, camera]);

    const handleContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
        const sceneRenderer = new Renderer({ gl });
        setRenderer(sceneRenderer);

        const sceneCamera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            10000
        );
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

        const animate = () => {
            const time = Date.now() * 0.0005;

            if (book) {
                book.rotation.x = time;
                book.rotation.y = time;
            }

            axes.rotation.x = time;
            axes.rotation.y = time;

            sceneRenderer.render(scene, sceneCamera);
            gl.endFrameEXP();
            requestAnimationFrame(animate);
        };
        animate();
    }, []);

    // ✅ **FIX 3: The onLayout prop measures the View.**
    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        // Update our state with the true dimensions.
        setCanvasSize({ width, height });
    };

    return (
        <View style={{ flex: 1 }} onLayout={onLayout}>
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
