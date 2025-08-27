import React from 'react';
import {
    Renderer,
    THREE
} from 'expo-three';
import {
    ExpoWebGLRenderingContext,
    GLView
} from 'expo-gl';

export default function LibraryScreen() {
    let handleResize = () => {};
    const handleContextCreate = (gl: ExpoWebGLRenderingContext)=>{
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

        // 1. Scene.
        const scene = new THREE.Scene();

        // 2. Camera.
        const camera = new THREE.PerspectiveCamera(
            75,
            //Dimensions.get('window').width / Dimensions.get('window').height,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        );
        camera.position.z = 500;

        // 3. Book cover material.
        const bookCoverMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 1
        });

        // 4. Book cover.
        const bookWidth = 150; // 15cm
        const bookHeight = 220; // 22cm
        const bookDepth = 100; // 10cm
        const bookCover = new THREE.Object3D();

        const coverWidth = bookWidth;
        const coverHeight = bookHeight;
        const coverDepth = 5; // 5mm

        const coverGeometry = new THREE.BoxGeometry(coverWidth, coverHeight, coverDepth);

        // 5. Book front cover.
        const bookFrontCover = new THREE.Mesh(coverGeometry, bookCoverMaterial);
        bookFrontCover.position.set(0, 0, bookDepth * 0.5 - coverDepth * 0.5);

        // 6. Book back cover.
        const bookBackCover = new THREE.Mesh(coverGeometry, bookCoverMaterial);
        bookBackCover.position.set(0, 0, bookDepth * -0.5 + coverDepth * 0.5);

        bookCover.add(bookFrontCover);
        bookCover.add(bookBackCover);

        // 7. Triforce.
        const triangleShape = new THREE.Shape();
        triangleShape.moveTo(-20, 0);
        triangleShape.lineTo(0, 0);
        triangleShape.lineTo(-10, 20);
        triangleShape.closePath();

        const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700, // Gold color
            metalness: 0.8, // Adjust for metallic look
            roughness: 0.2, // Adjust for shininess
        });

        const triangleZ = bookDepth / 2 + 1; // Position the Triforce on the front cover
        const triangle = new THREE.Mesh(triangleGeometry, goldMaterial);
        triangle.position.set(0, 0, triangleZ);
        scene.add(triangle);

        const triangle2 = triangle.clone();
        triangle2.position.set(20, 0, triangleZ);
        scene.add(triangle2);

        const triangle3 = triangle.clone();
        triangle3.position.set(10, 20, triangleZ);
        scene.add(triangle3);

        // Make the triangles relative to the book front cover.
        bookCover.add(triangle);
        bookCover.add(triangle2);
        bookCover.add(triangle3);

        // 8. Curved spine.
        const curve = new THREE.EllipseCurve(
            0, 0, // ax, aY
            bookDepth * 0.5, bookDepth * 0.25, // xRadius, yRadius
            0, Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise
            0 // aRotation
        );
        const points = curve.getPoints(50);
        const geometry = new THREE.ExtrudeGeometry(new THREE.Shape(points), {
            depth: bookHeight,
            bevelEnabled: false
        });
        const spine = new THREE.Mesh(geometry, bookCoverMaterial);
        spine.position.x = bookWidth * -0.5;
        spine.position.y = bookHeight * 0.5;
        spine.rotation.x = Math.PI / 2;
        spine.rotation.y = 0;
        spine.rotation.z = Math.PI / 2;
        bookCover.add(spine);

        // 9. Pages.
        const pageMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff, // White for pages
            side: THREE.DoubleSide
        });

        const pageThickness = 0.1; // 0.1mm per page
        const availableInnerBookDepth = bookDepth - (coverDepth * 2);
        const numPages = Math.floor(availableInnerBookDepth / pageThickness); // Calculate number of pages
        const pageHeight = bookHeight - 10;
        const pageWidth = bookWidth - 10;
        const pageGeometry = new THREE.PlaneGeometry(pageWidth, pageHeight);

        for (let i = 0; i < numPages; i++) {
            const page = new THREE.Mesh(pageGeometry, pageMaterial);
            page.position.set(0, 0, (i * pageThickness) - availableInnerBookDepth / 2);
            bookCover.add(page);
        }

        scene.add(bookCover);

        // 10. Light.
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 100);
        scene.add(light);

        // 11. Handle resize.
        handleResize = () => {
            // Update your camera and renderer here.
            //camera.aspect = Dimensions.get('window').width / Dimensions.get('window').height;
            camera.aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
            camera.updateProjectionMatrix();
            //renderer.setSize(Dimensions.get('window').width, Dimensions.get('window').height);
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        };

        let time = 0;

        const animate = () => {
            handleResize();
            time += 0.01;
            bookCover.rotation.y = Math.sin(time) * 4; // Adjust for sway.
            renderer.render(scene, camera);

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    };
    return (
        <GLView
            style={{ flex: 1 }}
            onContextCreate={handleContextCreate}
        />
    );
}
