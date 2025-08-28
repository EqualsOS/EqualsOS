import React, { useMemo, useCallback } from 'react';
import { Renderer, THREE } from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Dimensions } from 'react-native';

const dummy = new THREE.Object3D();

export default function LibraryScreen() {
    const bookCover = useMemo(() => {
        const bookCoverMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 1
        });

        const bookWidth = 150;
        const bookHeight = 220;
        const bookDepth = 100;
        const bookObject = new THREE.Object3D();

        const coverWidth = bookWidth;
        const coverHeight = bookHeight;
        const coverDepth = 5;

        const coverGeometry = new THREE.BoxGeometry(coverWidth, coverHeight, coverDepth);

        const bookFrontCover = new THREE.Mesh(coverGeometry, bookCoverMaterial);
        bookFrontCover.position.set(0, 0, bookDepth * 0.5 - coverDepth * 0.5);

        const bookBackCover = new THREE.Mesh(coverGeometry, bookCoverMaterial);
        bookBackCover.position.set(0, 0, bookDepth * -0.5 + coverDepth * 0.5);

        bookObject.add(bookFrontCover);
        bookObject.add(bookBackCover);

        const triangleShape = new THREE.Shape();
        triangleShape.moveTo(-20, 0);
        triangleShape.lineTo(0, 0);
        triangleShape.lineTo(-10, 20);
        triangleShape.closePath();

        const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            metalness: 0.8,
            roughness: 0.2,
        });
        const triangleZ = bookDepth / 2 + 1;
        const triangle = new THREE.Mesh(triangleGeometry, goldMaterial);
        triangle.position.set(0, 0, triangleZ);
        const triangle2 = triangle.clone();
        triangle2.position.set(20, 0, triangleZ);
        const triangle3 = triangle.clone();
        triangle3.position.set(10, 20, triangleZ);

        bookObject.add(triangle, triangle2, triangle3);

        const curve = new THREE.EllipseCurve(0, 0, bookDepth * 0.5, bookDepth * 0.25, 0, Math.PI, false, 0);
        const points = curve.getPoints(50);
        const geometry = new THREE.ExtrudeGeometry(new THREE.Shape(points), {
            depth: bookHeight,
            bevelEnabled: false
        });
        const spine = new THREE.Mesh(geometry, bookCoverMaterial);
        spine.position.x = bookWidth * -0.5;
        spine.position.y = bookHeight * 0.5;
        spine.rotation.set(Math.PI / 2, 0, Math.PI / 2);
        bookObject.add(spine);

        const pageMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        const pageThickness = 0.1;
        const availableInnerBookDepth = bookDepth - (coverDepth * 2);
        const numPages = Math.floor(availableInnerBookDepth / pageThickness);
        const pageHeight = bookHeight - 10;
        const pageWidth = bookWidth - 10;
        const pageGeometry = new THREE.PlaneGeometry(pageWidth, pageHeight);

        const pages = new THREE.InstancedMesh(pageGeometry, pageMaterial, numPages);

        for (let i = 0; i < numPages; i++) {
            dummy.position.set(0, 0, (i * pageThickness) - availableInnerBookDepth / 2);
            dummy.updateMatrix();
            pages.setMatrixAt(i, dummy.matrix);
        }

        bookObject.add(pages);

        return bookObject;
    }, []);

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

            // 2025-08-29 Figure out when to call this so it isn't constantly getting set within animate.
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

            renderer.render(scene, camera);
            gl.endFrameEXP();

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        const handleResize = (width: number, height: number) => {
            /*if (typeof(prms.window) === 'undefined') {
                const windowDimensions = Dimensions.get('window');
                console.log(`windowDimensions.width: ${windowDimensions.width}, windowDimensions.height: ${windowDimensions.height}`);
                console.log(`window.innerWidth: ${window.innerWidth}, window.innerHeight: ${window.innerHeight}`);
                console.log(`drawingBufferWidth: ${gl.drawingBufferWidth}, drawingBufferHeight: ${gl.drawingBufferHeight}`);
                return;
            }*/
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            // 2025-08-29 Need to figure out when to call renderer.setSize() since
            // gl.drawingBufferWidth and gl.drawingBufferHeight are not correct when
            // the browser is maximised or the developer console is opened/closed.
            //renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        };

        const dimensionsResizeListener = ({ window })=>{
            handleResize(window.width, window.height);
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
        <GLView
            style={{ flex: 1 }}
            onContextCreate={handleContextCreate}
        />
    );
}
