// components/3d/Bookshelf.ts

import * as THREE from 'three';
import createBook from './LibraryBook';

// The function now accepts a boolean to control the special effect
export default function createBookshelf(hasMovedBook = false): THREE.Group {
    const bookshelfGroup = new THREE.Group();

    // --- Dimensions ---
    const shelfColour = 0x8B4513;
    const shelfThickness = 25;
    const shelfDepth = 315;
    const shelfGapHeight = 350;
    const innerShelfLength = 1200;
    const totalHeight = (4 * shelfThickness) + (3 * shelfGapHeight);

    // --- Materials ---
    const shelfMaterial = new THREE.MeshStandardMaterial({ color: shelfColour });

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

    // If this specific bookshelf should have the moved book effect...
    if (hasMovedBook) {
        const removedBookShelf = 2;
        const removedBookIndex = 4;
        const leaningBookIndex = 3;

        // Build the 3 shelves of books with the gap and leaning book
        for (let shelfIndex = 0; shelfIndex < 3; shelfIndex++) {
            const shelfTopY = (shelfIndex * (shelfGapHeight + shelfThickness)) + shelfThickness;
            const bookCenterY = shelfTopY + (bookDimensions.height / 2);
            for (let bookIndex = 0; bookIndex < booksPerShelf; bookIndex++) {
                if (shelfIndex === removedBookShelf && bookIndex === removedBookIndex) {
                    continue;
                }
                const book = createBook();
                book.rotation.y = Math.PI / 2;
                const startX = -innerShelfLength / 2;
                const bookCenterX = startX + (bookIndex * bookDimensions.thickness) + (bookDimensions.thickness / 2);

                if (shelfIndex === removedBookShelf && bookIndex === leaningBookIndex) {
                    const pivot = new THREE.Object3D();
                    bookshelfGroup.add(pivot);
                    pivot.position.set(bookCenterX + bookDimensions.thickness / 2, shelfTopY, 0);
                    book.position.set(-bookDimensions.thickness / 2, bookDimensions.height / 2, 0);
                    pivot.add(book);
                    const leanAngle = -Math.atan(bookDimensions.thickness / bookDimensions.height);
                    pivot.rotation.z = leanAngle;
                } else {
                    book.position.set(bookCenterX, bookCenterY, 0);
                    bookshelfGroup.add(book);
                }
            }
        }

        // Place the "removed" book on top
        const placementHelper = new THREE.Object3D();
        bookshelfGroup.add(placementHelper);
        placementHelper.rotation.y = -0.2;
        const bookOnTop = createBook();
        bookOnTop.rotation.x = Math.PI / 2;
        placementHelper.add(bookOnTop);
        const bookOnTopHeight = bookDimensions.thickness;
        placementHelper.position.set(-150, totalHeight + bookOnTopHeight / 2, -72.5);
    }
    // Otherwise, build a full bookshelf
    else {
        for (let shelfIndex = 0; shelfIndex < 3; shelfIndex++) {
            const shelfTopY = (shelfIndex * (shelfGapHeight + shelfThickness)) + shelfThickness;
            const bookCenterY = shelfTopY + (bookDimensions.height / 2);
            for (let bookIndex = 0; bookIndex < booksPerShelf; bookIndex++) {
                const book = createBook();
                book.rotation.y = Math.PI / 2;
                const startX = -innerShelfLength / 2;
                const bookCenterX = startX + (bookIndex * bookDimensions.thickness) + (bookDimensions.thickness / 2);
                book.position.set(bookCenterX, bookCenterY, 0);
                bookshelfGroup.add(book);
            }
        }
    }

    return bookshelfGroup;
}
