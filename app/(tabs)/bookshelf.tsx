// app/(tabs)/bookshelf.tsx

import React, { useMemo } from 'react';
import SceneContainer from '@/components/SceneContainer';

import createBookshelf from '@/components/3d/Bookshelf';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

function AxisLinesModel() {
    const model = useMemo(() => createAxisLines(1500), []);
    return <primitive object={model} />;
}

function GridHelperModel() {
    const model = useMemo(() => createGridHelper(3000, 60), []);
    return <primitive object={model} />;
}

export default function BookshelfScreen() {
    return (
        // --- UPDATED: Pass a function that calls createBookshelf(true) ---
        <SceneContainer createModel={() => createBookshelf(true)}>
            <GridHelperModel />
            <AxisLinesModel />
        </SceneContainer>
    );
}
