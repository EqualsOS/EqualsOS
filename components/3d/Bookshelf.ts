import { THREE } from 'expo-three';
import createBook from './LibraryBook'; // Assuming libraryBook.ts is in the same folder

export default function createBookshelf(): THREE.Group {
    const bookshelfGroup = new THREE.Group();

    // --- Dimensions ---
    const shelfColour = 0x8B4513; // Saddle Brown
    const shelfThickness = 25; // mm
    const shelfDepth = 315; // The front-to-back depth of the shelf
    const shelfGapHeight = 350; // The clear vertical space for books
    const innerShelfLength = 1200; // The usable length, set to fit 12 books (12 * 100mm)

    // --- Materials ---
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: shelfColour });

    // --- Calculate Total Height ---
    // 4 shelves and 3 gaps
    const totalHeight = (4 * shelfThickness) + (3 * shelfGapHeight);

    // --- Create Side Frames ---
    // The frame height now perfectly matches the total height of the shelf stack
    const frameGeometry = new THREE.BoxGeometry(shelfThickness, totalHeight, shelfDepth);
    const leftFrame = new THREE.Mesh(frameGeometry, shelfMaterial);
    leftFrame.position.set(-innerShelfLength / 2 - shelfThickness / 2, totalHeight / 2, 0);

    const rightFrame = new THREE.Mesh(frameGeometry, shelfMaterial);
    rightFrame.position.set(innerShelfLength / 2 + shelfThickness / 2, totalHeight / 2, 0);

    bookshelfGroup.add(leftFrame, rightFrame);

    // --- Create Shelves ---
    const shelfGeometry = new THREE.BoxGeometry(innerShelfLength, shelfThickness, shelfDepth);
    for (let i = 0; i < 4; i++) {
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        // Position each shelf based on the gaps and thickness below it
        shelf.position.y = i * (shelfGapHeight + shelfThickness) + shelfThickness / 2;
        bookshelfGroup.add(shelf);
    }

    // --- Place Books ---
    const bookDimensions = {
        height: 220,
        thickness: 100 // This is 'bookDepth' from the libraryBook file
    };
    const booksPerShelf = 12;

    // Loop through the 3 compartments (0, 1, 2)
    for (let shelfIndex = 0; shelfIndex < 3; shelfIndex++) {
        // Calculate the Y position for the bottom of the books on the current shelf
        const shelfTopY = (shelfIndex * (shelfGapHeight + shelfThickness)) + shelfThickness;
        const bookCenterY = shelfTopY + (bookDimensions.height / 2);

        // Loop through each of the 12 book positions
        for (let bookIndex = 0; bookIndex < booksPerShelf; bookIndex++) {
            const book = createBook();

            // Rotate the book to stand upright on the shelf
            book.rotation.y = Math.PI / 2;

            // Calculate the X position for the book
            const startX = -innerShelfLength / 2;
            const bookCenterX = startX + (bookIndex * bookDimensions.thickness) + (bookDimensions.thickness / 2);

            book.position.set(bookCenterX, bookCenterY, 0);
            bookshelfGroup.add(book);
        }
    }

    return bookshelfGroup;
}
