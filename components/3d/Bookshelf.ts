import { THREE } from 'expo-three';

export default function createBookshelf(): THREE.Group {
    const bookshelfGroup = new THREE.Group();
    const shelfColour = 0x8B4513; // Saddle Brown
    const shelfThickness = 25; // mm
    const shelfWidth = 315; // mm
    const shelfHeight = 350; // mm

    // Calculate total bookshelf height
    const totalHeight = shelfHeight * 3;

    // Create frame (simplified, no back)
    const frameGeometry = new THREE.BoxGeometry(shelfThickness, totalHeight, shelfWidth); // Match shelf depth
    const frameMaterial = new THREE.MeshStandardMaterial({ color: shelfColour });

    const leftFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    leftFrame.position.x = -shelfWidth / 2 - shelfThickness / 2;
    leftFrame.position.y = totalHeight / 2; // Center vertically

    const rightFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    rightFrame.position.x = shelfWidth / 2 + shelfThickness / 2;
    rightFrame.position.y = totalHeight / 2; // Center vertically

    bookshelfGroup.add(leftFrame, rightFrame);

    // Create shelves
    const shelfGeometry = new THREE.BoxGeometry(shelfWidth + shelfThickness * 2, shelfThickness, shelfWidth);
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: shelfColour });

    // Original shelves
    for (let i = 0; i < 3; i++) {
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.y = i * shelfHeight;
        bookshelfGroup.add(shelf);
    }

    // Mirrored top shelf
    const mirroredShelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
    mirroredShelf.position.y = totalHeight; // Position above the original top shelf, attached to the frame
    bookshelfGroup.add(mirroredShelf);

    // Set the origin to the center of the original bottom shelf, touching the ground
    bookshelfGroup.position.y = shelfHeight / 2;
    bookshelfGroup.rotation.x = Math.PI; // Rotate 180 degrees around the X axis

    return bookshelfGroup;
}
