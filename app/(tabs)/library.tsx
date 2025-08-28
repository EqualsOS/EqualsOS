import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Renderer, THREE } from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Dimensions, ScaledSize, Platform, Text, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBookCover } from '@/components/3d/LibraryBook';

interface WindowScreenDimensions {
    window: ScaledSize;
    screen: ScaledSize;
}

export default function LibraryScreen() {
    const [dimensionsText, setDimensionsText] = useState('');
    const insets = useSafeAreaInsets();

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

    const bookCover = useMemo(() => createBookCover(), []);

    const handleContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        );
        camera.position.z = 500;

        scene.add(bookCover);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 100);
        scene.add(light);

        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) {
                startTime = timestamp;
            }
            const time = (timestamp - startTime) / 1000;

            bookCover.rotation.y = Math.sin(time) * 4;

            // Keep this line as is
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

            setDimensionsText(
                `Canvas: ${gl.drawingBufferWidth} x ${gl.drawingBufferHeight}\n` +
                `Window: ${Dimensions.get('window').width} x ${Dimensions.get('window').height}\n` +
                `Screen: ${Dimensions.get('screen').width} x ${Dimensions.get('screen').height}`
            );

            renderer.render(scene, camera);
            gl.endFrameEXP();

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        const handleResize = (width: number, height: number) => {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        const dimensionsResizeListener = (dimensions: WindowScreenDimensions)=>{
            handleResize(dimensions.window.width, dimensions.window.height);
        };
        const browserHandleResize = ()=>{
            handleResize(window.innerWidth, window.innerHeight);
        };
        const resizeListener = () => {
            browserHandleResize();
        };
        const fullscreenchangeListener = () => {
            browserHandleResize();
        };

        const subscription = Dimensions.addEventListener('change', dimensionsResizeListener);
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', resizeListener);
            window.addEventListener('fullscreenchange', fullscreenchangeListener);
        }

        return () => {
            subscription?.remove();
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', resizeListener);
                window.removeEventListener('fullscreenchange', fullscreenchangeListener);
            }
        };

    }, [bookCover]);

    return (
        <View style={{ flex: 1 }}>
            <Text style={{
                position: 'absolute',
                top: insets.top,
                left: insets.left + 10,
                color: 'white',
                zIndex: 1
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
