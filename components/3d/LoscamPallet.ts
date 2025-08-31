import { THREE } from 'expo-three';

/**
 * Creates a detailed 3D model of a standard 1165x1165mm block pallet.
 * The entire pallet is centered at (0, 0, 0).
 */
export default function createPallet(): THREE.Group {
    const pallet = new THREE.Group();

    // --- Materials ---
    const woodMaterial = new THREE.MeshLambertMaterial({ color: 0xc2b280 }); // Light brown wood
    const blockMaterial = new THREE.MeshLambertMaterial({ color: 0x8b0000 }); // Red/dark blocks

    // --- Pallet Dimensions (in mm) ---
    const PALLET_WIDTH = 1165;
    const PALLET_DEPTH = 1165;
    const PALLET_HEIGHT = 150;

    // Component dimensions
    const TOP_PLANK_THICKNESS = 22;
    const TOP_PLANK_WIDTH = 100;
    const NUM_TOP_PLANKS = 7;

    const BLOCK_HEIGHT = 106; // Pallet height - top and bottom plank thickness
    const BLOCK_SIZE = 145;

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

    // --- 2. Create Support Blocks ---
    const blockGeometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_HEIGHT, BLOCK_SIZE);
    const blockY = 0; // Blocks are centered vertically
    const outerX = (PALLET_WIDTH / 2) - (BLOCK_SIZE / 2);
    const outerZ = (PALLET_DEPTH / 2) - (BLOCK_SIZE / 2);

    const blockPositions = [
        // Back row
        new THREE.Vector3(-outerX, blockY, -outerZ),
        new THREE.Vector3(0, blockY, -outerZ),
        new THREE.Vector3(outerX, blockY, -outerZ),
        // Middle row
        new THREE.Vector3(-outerX, blockY, 0),
        new THREE.Vector3(0, blockY, 0),
        new THREE.Vector3(outerX, blockY, 0),
        // Front row
        new THREE.Vector3(-outerX, blockY, outerZ),
        new THREE.Vector3(0, blockY, outerZ),
        new THREE.Vector3(outerX, blockY, outerZ),
    ];

    blockPositions.forEach(pos => {
        const block = new THREE.Mesh(blockGeometry, blockMaterial);
        block.position.copy(pos);
        pallet.add(block);
    });

    // --- 3. Create Bottom Boards ---
    const bottomBoardGeometry = new THREE.BoxGeometry(PALLET_WIDTH, BOTTOM_BOARD_THICKNESS, BOTTOM_BOARD_WIDTH);
    const bottomBoardY = -(PALLET_HEIGHT / 2) + (BOTTOM_BOARD_THICKNESS / 2);

    const bottomBoardPositions = [
        new THREE.Vector3(0, bottomBoardY, -outerZ), // Back board
        new THREE.Vector3(0, bottomBoardY, 0),       // Middle board
        new THREE.Vector3(0, bottomBoardY, outerZ),  // Front board
    ];

    bottomBoardPositions.forEach(pos => {
        const board = new THREE.Mesh(bottomBoardGeometry, woodMaterial);
        board.position.copy(pos);
        pallet.add(board);
    });

    return pallet;
}
