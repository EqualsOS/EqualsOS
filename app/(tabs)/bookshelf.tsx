// This file is located at 'app/(tabs)/bookshelf.tsx'
import React, { useMemo } from 'react';
import SceneViewer from '@/components/SceneViewer';

// --- 1. Import your actual bookshelf component ---
// Note: You may need to adjust the path to where your Bookshelf.ts file is located.
import createBookshelf from '@/components/3d/Bookshelf';

// --- 2. Create a component that renders your bookshelf model ---
// This follows the same pattern as your PlatformModel.
function BookshelfModel() {
    const bookshelf = useMemo(() => createBookshelf(), []);
    return <primitive object={bookshelf} />;
}

// --- 3. Render your model inside the SceneViewer ---
export default function BookshelfScene() {
    return (
        <SceneViewer>
            <BookshelfModel />
        </SceneViewer>
    );
}
