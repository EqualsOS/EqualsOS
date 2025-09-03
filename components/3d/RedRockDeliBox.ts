import { THREE } from 'expo-three';

/**
 * Creates a 3D model of a Red Rock Deli box.
 * The entire box is centered at (0, 0, 0).
 */
export default function createRedRockDeliBox(): THREE.Group {
    const boxGroup = new THREE.Group();

    // --- Material ---
    // Using a basic white wireframe material as previously discussed.
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

    // --- Box Dimensions (in mm) ---
    // Based on the standard Three.js BoxGeometry(width, height, depth) constructor:
    // 'length' (350) is mapped to width (x-axis)
    // 'tall' (240) is mapped to height (y-axis)
    // 'wide' (455) is mapped to depth (z-axis)
    const BOX_WIDTH = 350;
    const BOX_HEIGHT = 240;
    const BOX_DEPTH = 455;

    // --- 1. Create the Box Mesh ---
    const boxGeometry = new THREE.BoxGeometry(BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH);
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    // The BoxGeometry is already created centered at its local origin,
    // so the mesh's position is (0, 0, 0) within the group by default.
    boxGroup.add(boxMesh);

    return boxGroup;
}
