import * as THREE from 'three';

export default function createRedRockDeliBox(): THREE.Group {
    const boxGroup = new THREE.Group();

    const BOX_WIDTH = 350;
    const BOX_HEIGHT = 240;
    const BOX_DEPTH = 455;

    const cardboardColour = 0xD2B48C;
    const grayColour = 0x708090;

    const boxGeometry = new THREE.BoxGeometry(BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH);

    // Using an array of materials to color each face is the correct approach
    const materials = [
        new THREE.MeshStandardMaterial({ color: grayColour }),      // Right face
        new THREE.MeshStandardMaterial({ color: grayColour }),      // Left face
        new THREE.MeshStandardMaterial({ color: cardboardColour }), // Top face
        new THREE.MeshStandardMaterial({ color: cardboardColour }), // Bottom face
        new THREE.MeshStandardMaterial({ color: cardboardColour }), // Front face
        new THREE.MeshStandardMaterial({ color: grayColour })       // Back face
    ];

    const boxMesh = new THREE.Mesh(boxGeometry, materials);

    boxGroup.add(boxMesh);

    return boxGroup;
}
