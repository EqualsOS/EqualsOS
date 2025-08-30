import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Renderer, THREE } from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Platform, Text, View, useWindowDimensions } from 'react-native'; // Replaced Dimensions with useWindowDimensions
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBookCover } from '@/components/3d/LibraryBook';

export default function LibraryScreen() {
    // --- 1. HOOKS FOR DIMENSIONS AND STATE ---
    // Get screen dimensions dynamically. This hook automatically updates on rotation.
    const { width, height, scale } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // Store renderer and camera in state to access them in the resize effect.
    const [renderer, setRenderer] = useState<Renderer | null>(null);
    const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);

    // Memoize the book cover creation (your original code, which is good).
    const bookCover = useMemo(() => createBookCover(), []);

    // --- 2. DERIVED STATE FOR DEBUG TEXT ---
    // Use useMemo to efficiently create the debug text.
    // This prevents re-calculating on every frame.
    const dimensionsText = useMemo(() => {
        const canvasWidth = (width * scale).toFixed(0);
        const canvasHeight = (height * scale).toFixed(0);
        return `Canvas: ${canvasWidth} x ${canvasHeight}\nWindow: ${width.toFixed(0)} x ${height.toFixed(0)}`;
    }, [width, height, scale]);

    // --- 3. EFFECT FOR SCREEN ORIENTATION ---
    // Your original effect for handling screen orientation. No changes needed here.
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

    // --- 4. THE CORE FIX: EFFECT FOR DYNAMIC RESIZING ---
    // This effect runs whenever dimensions change, or after the renderer/camera are created.
    useEffect(() => {
        if (renderer && camera) {
            // Get the new physical pixel dimensions.
            const newWidth = width * scale;
            const newHeight = height * scale;

            // Update the renderer size.
            renderer.setSize(newWidth, newHeight);

            // Update the camera's aspect ratio to prevent stretching.
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
        }
    }, [width, height, scale, renderer, camera]); // Dependencies array

    // --- 5. INITIAL SCENE SETUP ---
    // This function runs only once when the GL context is created.
    const handleContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
        // Create renderer and camera, then save them to state.
        const sceneRenderer = new Renderer({ gl });
        setRenderer(sceneRenderer);

        const sceneCamera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight, // Use initial aspect ratio
            0.1,
            1000
        );
        sceneCamera.position.z = 500;
        setCamera(sceneCamera);

        const scene = new THREE.Scene();
        scene.add(bookCover);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 100);
        scene.add(light);

        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const time = (timestamp - startTime) / 1000;

            bookCover.rotation.y = Math.sin(time) * 4;

            // Render the scene and end the frame.
            sceneRenderer.render(scene, sceneCamera);
            gl.endFrameEXP();

            // Request the next frame.
            requestAnimationFrame(animate);
        };
        animate(0);

        // No need to return a cleanup function with event listeners anymore.
    }, [bookCover]); // Only depends on bookCover

    // --- 6. RENDER JSX ---
    return (
        <View style={{ flex: 1 }}>
            <Text style={{
                position: 'absolute',
                top: insets.top,
                left: insets.left + 10,
                color: 'white',
                zIndex: 1,
                // Adding a background for better readability
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: 4,
                borderRadius: 4,
            }}>
                {dimensionsText}
            </Text>
            <GLView
                style={{ flex: 1 }}
                onContextCreate={handleContextCreate}
                // Adding a key is no longer necessary with the useEffect approach,
                // which provides a smoother, more performant resize.
            />
        </View>
    );
}
