import { THREE } from 'expo-three';

export default function createBookshelf(): THREE.Group {
    const bookshelfGroup = new THREE.Group();
    const shelfColour = 0x8B4513; // Saddle Brown
    const shelfThickness = 25; // mm
    const shelfWidth = 315; // mm
    const shelfHeight = 350; // mm

    // Total height of the frame
    const frameHeight = shelfHeight * 3 + shelfThickness;

    // --- Create Side Frames ---
    const frameGeometry = new THREE.BoxGeometry(shelfThickness, frameHeight, shelfWidth);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: shelfColour });

    const leftFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    leftFrame.position.set(-shelfWidth / 2 - shelfThickness / 2, frameHeight / 2, 0);

    const rightFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    rightFrame.position.set(shelfWidth / 2 + shelfThickness / 2, frameHeight / 2, 0);

    bookshelfGroup.add(leftFrame, rightFrame);

    // --- Create Shelves ---
    const shelfGeometry = new THREE.BoxGeometry(shelfWidth + shelfThickness * 2, shelfThickness, shelfWidth);
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: shelfColour });

    for (let i = 0; i < 4; i++) {
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.y = (i * shelfHeight) + shelfThickness / 2;
        bookshelfGroup.add(shelf);
    }

    // Set the origin to the bottom of the bottom shelf
    bookshelfGroup.position.y = 0;

    return bookshelfGroup;
}
