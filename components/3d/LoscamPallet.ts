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
    const PLANK_THICKNESS = 22;
    const LEAD_BOARD_WIDTH = 145; // Wider boards on the edges
    const STANDARD_BOARD_WIDTH = 100; // Narrower boards in the middle

    const BEARER_HEIGHT = 106; // Pallet height - top and bottom plank thickness
    const BEARER_WIDTH = 145;

    // --- 1. Create Top Deck Planks ---
    const topPlankWidths = [
        LEAD_BOARD_WIDTH,       // Back lead board
        STANDARD_BOARD_WIDTH,
        STANDARD_BOARD_WIDTH,
        STANDARD_BOARD_WIDTH,
        STANDARD_BOARD_WIDTH,
        STANDARD_BOARD_WIDTH,
        LEAD_BOARD_WIDTH        // Front lead board
    ];

    const totalTopPlankWidth = topPlankWidths.reduce((sum, width) => sum + width, 0);
    const topGapSize = (PALLET_DEPTH - totalTopPlankWidth) / (topPlankWidths.length - 1);
    const topDeckY = (PALLET_HEIGHT / 2) - (PLANK_THICKNESS / 2);

    let currentZ = -PALLET_DEPTH / 2;

    topPlankWidths.forEach(width => {
        const plankGeometry = new THREE.BoxGeometry(PALLET_WIDTH, PLANK_THICKNESS, width);
        const plank = new THREE.Mesh(plankGeometry, woodMaterial);

        // Position the plank based on the widths of the previous planks and gaps
        const zPos = currentZ + (width / 2);
        plank.position.set(0, topDeckY, zPos);
        pallet.add(plank);

        // Move the starting point for the next plank
        currentZ += width + topGapSize;
    });

    // --- 2. Create Bearers (Stringers) ---
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

    // --- 3. Create Bottom Boards (with corrected spacing) ---
    const bottomBoardY = -(PALLET_HEIGHT / 2) + (PLANK_THICKNESS / 2);

    // Create geometries for the two types of bottom boards
    const bottomLeadBoardGeom = new THREE.BoxGeometry(PALLET_WIDTH, PLANK_THICKNESS, LEAD_BOARD_WIDTH);
    const bottomStandardBoardGeom = new THREE.BoxGeometry(PALLET_WIDTH, PLANK_THICKNESS, STANDARD_BOARD_WIDTH);

    // Define the exact z-positions for the 5 bottom boards to match the spec
    const backPos = -(PALLET_DEPTH / 2) + (LEAD_BOARD_WIDTH / 2);
    const frontPos = (PALLET_DEPTH / 2) - (LEAD_BOARD_WIDTH / 2);

    const bottomBoardPositions = [
        backPos,          // Back lead board
        -150,           // Adjusted position for the board between back and middle
        0,                // Middle standard board
        150,            // Adjusted position for the board between middle and front
        frontPos          // Front lead board
    ];

    bottomBoardPositions.forEach((pos, index) => {
        // Use lead board geometry for the first and last boards, standard for the rest
        const isLeadBoard = (index === 0 || index === bottomBoardPositions.length - 1);
        const boardGeometry = isLeadBoard ? bottomLeadBoardGeom : bottomStandardBoardGeom;

        const board = new THREE.Mesh(boardGeometry, woodMaterial);
        board.position.set(0, bottomBoardY, pos);
        pallet.add(board);
    });

    return pallet;
}
