import { THREE } from 'expo-three';

export default function createRedRockDeliBox(): THREE.Group {
    const boxGroup = new THREE.Group();

    const BOX_WIDTH = 350;
    const BOX_HEIGHT = 240;
    const BOX_DEPTH = 455;

    const cardboardColour = 0xD2B48C;
    const grayColour = 0x708090; // Updated to Slate Gray
    //const blueColour = 0xB7D8E5;

    const boxGeometry = new THREE.BoxGeometry(BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH);

    // Use MeshStandardMaterial for proper lighting
    const materials = [
        new THREE.MeshStandardMaterial({ color: grayColour }),
        new THREE.MeshStandardMaterial({ color: grayColour }),
        new THREE.MeshStandardMaterial({ color: cardboardColour }),
        new THREE.MeshStandardMaterial({ color: cardboardColour }),
        new THREE.MeshStandardMaterial({ color: cardboardColour }),
        new THREE.MeshStandardMaterial({ color: grayColour })
    ];

    const boxMesh = new THREE.Mesh(boxGeometry, materials);

    boxGroup.add(boxMesh);

    return boxGroup;
}
