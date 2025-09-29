// components/3d/LibraryBook.ts

import * as THREE from 'three';

export default function createBook(isOptimized = true) {
    const bookObject = new THREE.Object3D();

    // --- (Cover, Spine, and Decoration code is unchanged) ---
    const bookCoverMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 1 });
    const bookWidth = 150;
    const bookHeight = 220;
    const bookDepth = 100;
    const coverDepth = 5;
    const coverGeometry = new THREE.BoxGeometry(bookWidth, bookHeight, coverDepth);
    const bookFrontCover = new THREE.Mesh(coverGeometry, bookCoverMaterial);
    bookFrontCover.position.set(0, 0, bookDepth * 0.5 - coverDepth * 0.5);
    const bookBackCover = new THREE.Mesh(coverGeometry, bookCoverMaterial);
    bookBackCover.position.set(0, 0, bookDepth * -0.5 + coverDepth * 0.5);
    bookObject.add(bookFrontCover, bookBackCover);
    const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2, });
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(-20, 0);
    triangleShape.lineTo(0, 0);
    triangleShape.lineTo(-10, 20);
    triangleShape.closePath();
    const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
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
    const spine = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(points), { depth: bookHeight, bevelEnabled: false }), bookCoverMaterial);
    spine.position.x = bookWidth * -0.5;
    spine.position.y = bookHeight * 0.5;
    spine.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    bookObject.add(spine);

    // --- UPDATED: Create a single "page block" for the optimized version ---
    const pageMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const availableInnerBookDepth = bookDepth - (coverDepth * 2);
    const pageHeight = bookHeight - 10;
    const pageWidth = bookWidth - 10;

    if (!isOptimized) {
        // Full, slow version with instanced pages (for future use)
        const pageThickness = 0.1;
        const numPages = Math.floor(availableInnerBookDepth / pageThickness);
        const pageGeometry = new THREE.PlaneGeometry(pageWidth, pageHeight);
        const pages = new THREE.InstancedMesh(pageGeometry, pageMaterial, numPages);
        const dummy = new THREE.Object3D();
        for (let i = 0; i < numPages; i++) {
            dummy.position.set(0, 0, (i * pageThickness) - availableInnerBookDepth / 2);
            dummy.updateMatrix();
            pages.setMatrixAt(i, dummy.matrix);
        }
        bookObject.add(pages);
    } else {
        // Fast, optimized version with a single block for pages
        const pageBlockGeometry = new THREE.BoxGeometry(pageWidth, pageHeight, availableInnerBookDepth);
        const pageBlock = new THREE.Mesh(pageBlockGeometry, pageMaterial);
        bookObject.add(pageBlock);
    }

    return bookObject;
}
