import { THREE } from 'expo-three';

function createPallet() {
    const pallet = new THREE.Group();

    // Wood color (light brown)
    const woodColor = 0xc2b280;
    const woodMaterial = new THREE.MeshLambertMaterial({ color: woodColor });

    // Red support color
    const redColor = 0x8b0000;
    const redMaterial = new THREE.MeshLambertMaterial({ color: redColor });

    // Pallet top boards
    const topBoardGeometry = new THREE.BoxGeometry(1165, 25, 1165);
    const topBoard = new THREE.Mesh(topBoardGeometry, woodMaterial);
    topBoard.position.y = 137.5; // Position the top boards

    // Pallet support beams (example dimensions, adjust as needed)
    const bearerGeometry = new THREE.BoxGeometry(1165, 125, 25);
    const bearer1 = new THREE.Mesh(bearerGeometry, redMaterial);
    bearer1.position.y = 62.5;

    const bearer2 = new THREE.Mesh(bearerGeometry, redMaterial);
    bearer2.position.y = 62.5;
    bearer2.position.z = 388.33; // Position the support beams

    const bearer3 = new THREE.Mesh(bearerGeometry, redMaterial);
    bearer3.position.y = 62.5;
    bearer3.position.z = -388.33; // Position the support beams

    pallet.add(topBoard);
    pallet.add(bearer1);
    pallet.add(bearer2);
    pallet.add(bearer3);

    return pallet;
}

export default createPallet;
