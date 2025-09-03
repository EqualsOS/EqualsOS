import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Renderer, THREE } from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Platform, Text, View, useWindowDimensions, LayoutChangeEvent, PanResponder } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import createAxisLines from '@/components/3d/AxisLines';
import createRedRockDeliBox from "@/components/3d/RedRockDeliBox";

export default function RenderScene() {
    // --- Existing Hooks and State ---
    const { scale } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [renderer, setRenderer] = useState<Renderer | null>(null);
    const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // --- 1. Refs for Touch Interaction ---
    // Refs store rotation and zoom values without causing re-renders.
    const cameraAngle = useRef(0);
    const startAngle = useRef(0);
    // --- NEW: Refs for Pinch-to-Zoom ---
    const cameraDistance = useRef(500); // Initial distance of the camera from the center.
    const startCameraDistance = useRef(0);
    const startPinchDistance = useRef(0);

    // --- 2. PanResponder for Touch Input (Rotation and Zoom) ---
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                // Store the starting angle and distance when a touch begins.
                startAngle.current = cameraAngle.current;
                startCameraDistance.current = cameraDistance.current;
            },
            onPanResponderMove: (evt, gestureState) => {
                // --- MODIFIED: Handle both zoom and rotation ---

                // Case 1: Two fingers are on the screen (Pinch-to-Zoom)
                if (gestureState.numberActiveTouches === 2) {
                    const touches = evt.nativeEvent.touches;
                    // Calculate the distance between the two fingers.
                    const dx = touches[0].pageX - touches[1].pageX;
                    const dy = touches[0].pageY - touches[1].pageY;
                    const currentPinchDistance = Math.hypot(dx, dy);

                    // If this is the first "move" frame of the pinch, store the initial finger distance.
                    if (startPinchDistance.current === 0) {
                        startPinchDistance.current = currentPinchDistance;
                    } else {
                        // Calculate the scale factor based on the change in finger distance.
                        const scale = currentPinchDistance / startPinchDistance.current;
                        // Adjust camera distance. Dividing by scale makes pinching out zoom in.
                        const newDistance = startCameraDistance.current / scale;
                        // Clamp the distance to prevent zooming too far in or out.
                        cameraDistance.current = Math.max(150, Math.min(2000, newDistance));
                    }
                }
                // Case 2: One finger is on the screen (Drag-to-Rotate)
                else if (gestureState.numberActiveTouches === 1) {
                    // Reset pinch distance if user lifts one finger.
                    startPinchDistance.current = 0;
                    // Update rotation angle based on horizontal drag.
                    const sensitivity = 0.01;
                    cameraAngle.current = startAngle.current - gestureState.dx * sensitivity;
                }
            },
            onPanResponderRelease: () => {
                // --- NEW: Reset pinch state when all fingers are lifted ---
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
        if (renderer && camera && canvasSize.width > 0 && canvasSize.height > 0) {
            const newWidth = canvasSize.width * scale;
            const newHeight = canvasSize.height * scale;
            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;
            // The initial camera position is now fully controlled by the animation loop.
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
        const redRockDeliBox = createRedRockDeliBox();
        scene.add(redRockDeliBox);
        //const pallet = createPallet();
        //scene.add(pallet);
        //const book = createBookCover();
        //scene.add(book);
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 100);
        scene.add(light);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // --- 3. Updated Animation Loop (using both angle and distance) ---
        const animate = () => {
            // --- MODIFIED: Read both angle and distance from refs ---
            const currentAngle = cameraAngle.current;
            const currentDistance = cameraDistance.current;

            // Update camera position using polar coordinates (angle and distance).
            sceneCamera.position.x = Math.sin(currentAngle) * currentDistance;
            sceneCamera.position.z = Math.cos(currentAngle) * currentDistance;
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
