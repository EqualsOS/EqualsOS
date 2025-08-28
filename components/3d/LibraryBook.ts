import { THREE } from 'expo-three';

const dummy = new THREE.Object3D();

export function createBookCover() {
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
}
