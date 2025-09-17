import * as THREE from 'three';
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
    const removedBookShelf = 2; // The third shelf (indices start at 0)
    const removedBookIndex = 4; // The fifth book (indices start at 0)
    const leaningBookIndex = 3; // The fourth book, which will lean

    for (let shelfIndex = 0; shelfIndex < 3; shelfIndex++) {
        const shelfTopY = (shelfIndex * (shelfGapHeight + shelfThickness)) + shelfThickness;
        const bookCenterY = shelfTopY + (bookDimensions.height / 2);

        for (let bookIndex = 0; bookIndex < booksPerShelf; bookIndex++) {
            if (shelfIndex === removedBookShelf && bookIndex === removedBookIndex) {
                continue;
            }

            const book = createBook();
            book.rotation.y = Math.PI / 2; // Stand the book upright

            const startX = -innerShelfLength / 2;
            const bookCenterX = startX + (bookIndex * bookDimensions.thickness) + (bookDimensions.thickness / 2);

            if (shelfIndex === removedBookShelf && bookIndex === leaningBookIndex) {
                // Use a helper "pivot" object for a physically accurate lean.
                const pivot = new THREE.Object3D();
                bookshelfGroup.add(pivot);

                // 1. Position the pivot at the book's bottom-right corner.
                pivot.position.set(bookCenterX + bookDimensions.thickness / 2, shelfTopY, 0);

                // 2. Add the book to the pivot, positioned relative to the pivot point.
                book.position.set(-bookDimensions.thickness / 2, bookDimensions.height / 2, 0);
                pivot.add(book);

                // 3. Calculate the exact angle needed to touch the next book.
                //const leanAngle = -Math.atan(bookDimensions.thickness / bookDimensions.height);

                // 4. Rotate the pivot, which swings the book perfectly.
                pivot.rotation.z = -Math.atan(bookDimensions.thickness / bookDimensions.height);

            } else {
                // This is a normal book, position and add it directly.
                book.position.set(bookCenterX, bookCenterY, 0);
                bookshelfGroup.add(book);
            }
        }
    }

    // --- Place the "removed" book on top of the bookshelf ---

    // Use a helper object to manage rotation and placement cleanly.
    const placementHelper = new THREE.Object3D();
    bookshelfGroup.add(placementHelper);

    // 1. Set the final orientation of the book using the helper.
    placementHelper.rotation.y = -0.2;

    // 2. Create the book itself.
    const bookOnTop = createBook();

    // 3. Make the book lie flat on its back. This is its only rotation.
    bookOnTop.rotation.x = Math.PI / 2;

    // 4. Add the flat book to the rotated helper.
    placementHelper.add(bookOnTop);

    // After rotating, the book's original 'depth'/'thickness' becomes its height.
    const bookOnTopHeight = bookDimensions.thickness;

    // 5. Position the entire helper group.
    placementHelper.position.set(
        -150, // Kept left of center
        totalHeight + bookOnTopHeight / 2,
        -22.5 // Positioned so its back edge is just before the bookcase's back edge
    );

    return bookshelfGroup;
}
