import { THREE } from 'expo-three';

/**
 * Creates a 3D model of a base platform with an angled ramp attached.
 * The entire object is centered around the base platform's origin.
 */
export default function createAngledPlatform(): THREE.Group {
    const platformGroup = new THREE.Group();

    // --- Materials ---
    const platformMaterial = new THREE.MeshLambertMaterial({
        color: 0xADD8E6, // Light blue
        emissive: 0xADD8E6,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
    });

    // --- Dimensions (in mm) ---
    const BASE_WIDTH = 1000;
    const BASE_HEIGHT = 50;
    const BASE_DEPTH = 1000;

    const RAMP_LENGTH = 1200;
    const RAMP_ANGLE = Math.PI / 12; // 15 degrees

    // --- 1. Create the Base Platform ---
    const baseGeometry = new THREE.BoxGeometry(BASE_WIDTH, BASE_HEIGHT, BASE_DEPTH);
    const basePlatform = new THREE.Mesh(baseGeometry, platformMaterial);
    platformGroup.add(basePlatform);

    // --- 2. Create the Angled Ramp ---
    const rampGeometry = new THREE.BoxGeometry(BASE_WIDTH, BASE_HEIGHT, RAMP_LENGTH);
    const ramp = new THREE.Mesh(rampGeometry, platformMaterial);

    // Calculate position for the ramp to connect to the side of the base
    ramp.position.set(
        0,
        BASE_HEIGHT * 3, // Adjusted Y position
        RAMP_LENGTH / 2 * Math.cos(RAMP_ANGLE) - BASE_DEPTH / 2 + BASE_WIDTH
    );

    ramp.rotation.x = -RAMP_ANGLE; // Rotate around X-axis to lean upwards
    platformGroup.add(ramp);

    return platformGroup;
}
