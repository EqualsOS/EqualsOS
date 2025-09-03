import { THREE } from 'expo-three';
import createBook from './LibraryBook';

export default function createBookshelf(): THREE.Group {
    const bookshelfGroup = new THREE.Group();

    // --- Dimensions ---
    const shelfColour = 0x8B4513; // Saddle Brown
    const shelfThickness = 25; // mm
    const shelfDepth = 315; // The front-to-back depth of the shelf
    const shelfGapHeight = 350; // The clear vertical space for books
    const innerShelfLength = 1200; // The usable length, set to fit 12 books

    // --- Materials ---
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: shelfColour });

    // --- Calculate Total Height ---
    const totalHeight = (4 * shelfThickness) + (3 * shelfGapHeight);

    // --- Create Side Frames ---
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
        shelf.position.y = i * (shelfGapHeight + shelfThickness) + shelfThickness / 2;
        bookshelfGroup.add(shelf);
    }

    // --- Place Books ---
    const bookDimensions = { height: 220, thickness: 100 };
    const booksPerShelf = 12;
    const removedBookShelf = 2; // Third shelf
    const removedBookIndex = 4; // Fifth book
    const leaningBookIndex = 3; // Fourth book

    for (let shelfIndex = 0; shelfIndex < 3; shelfIndex++) {
        const shelfTopY = (shelfIndex * (shelfGapHeight + shelfThickness)) + shelfThickness;
        const bookCenterY = shelfTopY + (bookDimensions.height / 2);

        for (let bookIndex = 0; bookIndex < booksPerShelf; bookIndex++) {
            if (shelfIndex === removedBookShelf && bookIndex === removedBookIndex) {
                continue; // Skip the removed book
            }

            const book = createBook();
            book.rotation.y = Math.PI / 2;

            const startX = -innerShelfLength / 2;
            const bookCenterX = startX + (bookIndex * bookDimensions.thickness) + (bookDimensions.thickness / 2);

            book.position.set(bookCenterX, bookCenterY, 0);

            if (shelfIndex === removedBookShelf && bookIndex === leaningBookIndex) {
                // Define the world axis for leaning (Z-axis points front-to-back)
                const leanAxis = new THREE.Vector3(0, 0, 1);

                // Define the angle to lean. A negative value leans to the right.
                const leanAngle = -Math.PI / 16; // ~11 degrees to the right

                // Apply the rotation around the world axis
                book.rotateOnWorldAxis(leanAxis, leanAngle);

                // Adjust the book's final position to have it rest in the gap
                book.position.x += 12;
                book.position.y -= 6;
            }

            bookshelfGroup.add(book);
        }
    }

    // --- Place Book on Top ---
    const bookOnTop = createBook();
    bookOnTop.rotation.x = Math.PI / 2;
    bookOnTop.position.set(0, totalHeight + bookDimensions.thickness / 2, 0);
    bookshelfGroup.add(bookOnTop);

    return bookshelfGroup;
}
