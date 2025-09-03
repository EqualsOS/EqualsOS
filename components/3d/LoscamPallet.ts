import { THREE } from 'expo-three';

/**
 * Creates a detailed 3D model of a standard 1165x1165mm block pallet.
 * The entire pallet is centered at (0, 0, 0).
 */
export default function createPallet(): THREE.Group {
    const pallet = new THREE.Group();

    // --- Materials ---
    const woodMaterial = new THREE.MeshLambertMaterial({ color: 0xc2b280 }); // Light brown wood
    const bearerMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 }); // Red/dark bearers

    // --- Pallet Dimensions (in mm) ---
    const PALLET_WIDTH = 1165;
    const PALLET_DEPTH = 1165;
    const PALLET_HEIGHT = 150;

    // Component dimensions
    const TOP_PLANK_THICKNESS = 22;
    const TOP_PLANK_WIDTH = 100;
    const NUM_TOP_PLANKS = 7;

    const BEARER_HEIGHT = 106; // Pallet height - top and bottom plank thickness
    const BEARER_WIDTH = 145;

    const BOTTOM_BOARD_THICKNESS = 22;
    const BOTTOM_BOARD_WIDTH = 145;

    // --- 1. Create Top Deck Planks ---
    const topPlankGeometry = new THREE.BoxGeometry(PALLET_WIDTH, TOP_PLANK_THICKNESS, TOP_PLANK_WIDTH);
    const gapBetweenPlanks = (PALLET_DEPTH - (NUM_TOP_PLANKS * TOP_PLANK_WIDTH)) / (NUM_TOP_PLANKS - 1);
    const topDeckY = (PALLET_HEIGHT / 2) - (TOP_PLANK_THICKNESS / 2);

    for (let i = 0; i < NUM_TOP_PLANKS; i++) {
        const plank = new THREE.Mesh(topPlankGeometry, woodMaterial);
        // Position planks from back to front
        const zPos = -(PALLET_DEPTH / 2) + (TOP_PLANK_WIDTH / 2) + i * (TOP_PLANK_WIDTH + gapBetweenPlanks);
        plank.position.set(0, topDeckY, zPos);
        pallet.add(plank);
    }

    // --- 2. Create Bottom Bearers (Stringers) ---
    const bearerGeometry = new THREE.BoxGeometry(BEARER_WIDTH, BEARER_HEIGHT, PALLET_DEPTH);
    const bearerY = 0; // Bearers are centered vertically
    const outerX = (PALLET_WIDTH / 2) - (BEARER_WIDTH / 2);

    const bearerPositions = [
        new THREE.Vector3(-outerX, bearerY, 0), // Left bearer
        new THREE.Vector3(0, bearerY, 0),       // Middle bearer
        new THREE.Vector3(outerX, bearerY, 0),  // Right bearer
    ];

    bearerPositions.forEach(pos => {
        const bearer = new THREE.Mesh(bearerGeometry, bearerMaterial);
        bearer.position.copy(pos);
        pallet.add(bearer);
    });

    // --- 3. Create Bottom Boards ---
    const bottomBoardGeometry = new THREE.BoxGeometry(PALLET_WIDTH, BOTTOM_BOARD_THICKNESS, BOTTOM_BOARD_WIDTH);
    const bottomBoardY = -(PALLET_HEIGHT / 2) + (BOTTOM_BOARD_THICKNESS / 2);

    const bottomBoardPositions = [
        new THREE.Vector3(0, bottomBoardY, -(PALLET_DEPTH / 2) + (BOTTOM_BOARD_WIDTH / 2)), // Back board
        new THREE.Vector3(0, bottomBoardY, 0),       // Middle board
        new THREE.Vector3(0, bottomBoardY, (PALLET_DEPTH / 2) - (BOTTOM_BOARD_WIDTH / 2)),  // Front board
    ];

    bottomBoardPositions.forEach(pos => {
        const board = new THREE.Mesh(bottomBoardGeometry, woodMaterial);
        board.position.copy(pos);
        pallet.add(board);
    });

    return pallet;
}
