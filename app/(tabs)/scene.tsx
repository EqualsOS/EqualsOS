import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Renderer, THREE } from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Platform, Text, View, useWindowDimensions, LayoutChangeEvent, PanResponder } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';
//import createBookshelf from '@/components/3d/Bookshelf';
//import createPallet from '@/components/3d/LoscamPallet';
import createAngledPlatform from '@/components/3d/AngledPlatform';

export default function RenderScene() {
    // --- Existing Hooks and State ---
    const { scale } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [renderer, setRenderer] = useState<Renderer | null>(null);
    const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // --- Refs for Touch Interaction ---
    const cameraAngle = useRef(0);
    const startAngle = useRef(0);
    const cameraDistance = useRef(1500); // Increased initial distance to see the whole bookshelf
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
                // Case 1: Pinch-to-Zoom
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
                }
                // Case 2: Drag-to-Rotate
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

    // --- NEW: useEffect for Mouse Wheel Zoom (Web Only) ---
    useEffect(() => {
        // This effect only runs on the web platform.
        if (Platform.OS !== 'web') return;

        const handleWheel = (event: WheelEvent) => {
            const zoomSensitivity = 1;
            // Adjust camera distance based on scroll direction (event.deltaY)
            const newDistance = cameraDistance.current + event.deltaY * zoomSensitivity;
            // Clamp the distance to prevent zooming too far in or out.
            cameraDistance.current = Math.max(300, Math.min(5000, newDistance));
        };

        // Add the event listener when the component mounts.
        window.addEventListener('wheel', handleWheel);

        // Return a cleanup function to remove the listener when the component unmounts.
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, []); // Empty dependency array means this runs once on mount.


    useEffect(() => {
        if (renderer && camera && canvasSize.width > 0 && canvasSize.height > 0) {
            const newWidth = canvasSize.width * scale;
            const newHeight = canvasSize.height * scale;
            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
        }
    }, [canvasSize, scale, renderer, camera]);

    const handleContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
        const sceneRenderer = new Renderer({ gl });
        setRenderer(sceneRenderer);
        const sceneCamera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 10000);
        sceneCamera.position.y = 800; // Raise camera to look down slightly
        setCamera(sceneCamera);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111); // Dark background

        const gridHelper = createGridHelper();
        scene.add(gridHelper);

        const axes = createAxisLines();
        scene.add(axes);

        //const bookshelf = createBookshelf();
        //scene.add(bookshelf);
        //const pallet = createPallet();
        //scene.add(pallet);
        const angledPlatform = createAngledPlatform();
        scene.add(angledPlatform);

        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(500, 1000, 750);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const animate = () => {
            requestAnimationFrame(animate);
            const currentAngle = cameraAngle.current;
            const currentDistance = cameraDistance.current;

            sceneCamera.position.x = Math.sin(currentAngle) * currentDistance;
            sceneCamera.position.z = Math.cos(currentAngle) * currentDistance;
            sceneCamera.lookAt(0, 0, 0);

            sceneRenderer.render(scene, sceneCamera);
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
            {/* --- NEW: UI Group for top-left corner info --- */}
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
                {/* --- NEW: Coloured Axis Labels --- */}
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
