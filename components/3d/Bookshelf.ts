import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import createBook from './LibraryBook';

export default function createBookshelf(hasMovedBook = false): THREE.Group {
    const bookshelfGroup = new THREE.Group();
    const dummy = new THREE.Object3D();

    // --- Dimensions and Materials ---
    const shelfColour = 0x8B4513;
    const shelfThickness = 25;
    const shelfDepth = 315;
    const shelfGapHeight = 350;
    const innerShelfLength = 1200;
    const totalHeight = (4 * shelfThickness) + (3 * shelfGapHeight);
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: shelfColour });

    // --- Create Frame and Shelves ---
    const frameGeometry = new THREE.BoxGeometry(shelfThickness, totalHeight, shelfDepth);
    const leftFrame = new THREE.Mesh(frameGeometry, shelfMaterial);
    leftFrame.position.set(-innerShelfLength / 2 - shelfThickness / 2, totalHeight / 2, 0);
    const rightFrame = new THREE.Mesh(frameGeometry, shelfMaterial);
    rightFrame.position.set(innerShelfLength / 2 + shelfThickness / 2, totalHeight / 2, 0);
    bookshelfGroup.add(leftFrame, rightFrame);
    const shelfGeometry = new THREE.BoxGeometry(innerShelfLength, shelfThickness, shelfDepth);
    for (let i = 0; i < 4; i++) {
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.y = i * (shelfGapHeight + shelfThickness) + shelfThickness / 2;
        bookshelfGroup.add(shelf);
    }

    // --- OPTIMIZED: Place Books using Instancing by Material ---
    const bookDimensions = { height: 220, width: 150, thickness: 100 };
    const booksPerShelf = 12;
    const coverDepth = 5;

    // 1. Explicitly create and merge geometries for each material type
    const greyMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 1 });
    const frontCoverGeom = new THREE.BoxGeometry(bookDimensions.width, bookDimensions.height, coverDepth)
        .translate(0, 0, bookDimensions.thickness * 0.5 - coverDepth * 0.5);
    const backCoverGeom = new THREE.BoxGeometry(bookDimensions.width, bookDimensions.height, coverDepth)
        .translate(0, 0, bookDimensions.thickness * -0.5 + coverDepth * 0.5);
    const spineGeom = new THREE.BoxGeometry(coverDepth, bookDimensions.height, bookDimensions.thickness)
        .translate(bookDimensions.width * -0.5, 0, 0);
    const mergedGreyGeom = BufferGeometryUtils.mergeGeometries([frontCoverGeom, backCoverGeom, spineGeom]);

    const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const availableInnerBookDepth = bookDimensions.thickness - (coverDepth * 2);
    const pageBlockGeom = new THREE.BoxGeometry(bookDimensions.width - 10, bookDimensions.height - 10, availableInnerBookDepth);

    const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2 });
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(-20, 0);
    triangleShape.lineTo(0, 0);
    triangleShape.lineTo(-10, 20);
    const triangleGeom1 = new THREE.ShapeGeometry(triangleShape).translate(0, 0, bookDimensions.thickness / 2 + 1);
    const triangleGeom2 = triangleGeom1.clone().translate(20, 0, 0);
    const triangleGeom3 = triangleGeom1.clone().translate(10, 20, 0);
    const mergedGoldGeom = BufferGeometryUtils.mergeGeometries([triangleGeom1, triangleGeom2, triangleGeom3]);

    // 2. Calculate matrices for all normal book positions
    const matrices: THREE.Matrix4[] = [];
    for (let shelfIndex = 0; shelfIndex < 3; shelfIndex++) {
        const bookCenterY = ((shelfIndex * (shelfGapHeight + shelfThickness)) + shelfThickness) + (bookDimensions.height / 2);
        for (let bookIndex = 0; bookIndex < booksPerShelf; bookIndex++) {
            if (hasMovedBook && shelfIndex === 2 && (bookIndex === 3 || bookIndex === 4)) {
                continue;
            }
            const bookCenterX = (-innerShelfLength / 2) + (bookIndex * bookDimensions.thickness) + (bookDimensions.thickness / 2);
            dummy.position.set(bookCenterX, bookCenterY, 0);
            dummy.rotation.set(0, Math.PI / 2, 0);
            dummy.updateMatrix();
            matrices.push(dummy.matrix.clone());
        }
    }

    // 3. Create an InstancedMesh for each material type
    const greyInstances = new THREE.InstancedMesh(mergedGreyGeom, greyMaterial, matrices.length);
    const whiteInstances = new THREE.InstancedMesh(pageBlockGeom, whiteMaterial, matrices.length);
    const goldInstances = new THREE.InstancedMesh(mergedGoldGeom, goldMaterial, matrices.length);

    matrices.forEach((matrix, i) => {
        greyInstances.setMatrixAt(i, matrix);
        whiteInstances.setMatrixAt(i, matrix);
        goldInstances.setMatrixAt(i, matrix);
    });
    bookshelfGroup.add(greyInstances, whiteInstances, goldInstances);

    // --- 4. UPDATED: Added the special book creation logic back in ---
    if (hasMovedBook) {
        const leaningBook = createBook(true);
        const shelfTopY = (2 * (shelfGapHeight + shelfThickness)) + shelfThickness;
        const bookCenterX = (-innerShelfLength / 2) + (3 * bookDimensions.thickness) + (bookDimensions.thickness / 2);
        const pivot = new THREE.Object3D();
        bookshelfGroup.add(pivot);
        pivot.position.set(bookCenterX + bookDimensions.thickness / 2, shelfTopY, 0);
        leaningBook.position.set(-bookDimensions.thickness / 2, bookDimensions.height / 2, 0);
        leaningBook.rotation.y = Math.PI / 2;
        pivot.add(leaningBook);
        const leanAngle = -Math.atan(bookDimensions.thickness / bookDimensions.height);
        pivot.rotation.z = leanAngle;

        const bookOnTop = createBook(true);
        const placementHelper = new THREE.Object3D();
        bookshelfGroup.add(placementHelper);
        placementHelper.rotation.y = -0.2;
        bookOnTop.rotation.x = Math.PI / 2;
        placementHelper.add(bookOnTop);
        const bookOnTopHeight = bookDimensions.thickness;
        placementHelper.position.set(-150, totalHeight + bookOnTopHeight / 2, -72.5);
    }

    return bookshelfGroup;
}
