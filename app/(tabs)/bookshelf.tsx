import React, { useMemo } from 'react';
import SceneContainer from '@/components/SceneContainer';

import createBookshelf from '@/components/3d/Bookshelf';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

function BookshelfModel() {
    const model = useMemo(() => createBookshelf(), []);
    // The bookshelf is already positioned to sit at the origin
    return <primitive object={model} />;
}

function AxisLinesModel() {
    const model = useMemo(() => createAxisLines(1500), []); // Made axes larger for this scene
    return <primitive object={model} />;
}

function GridHelperModel() {
    const model = useMemo(() => createGridHelper(3000, 60), []); // Made grid larger for this scene
    return <primitive object={model} />;
}

export default function BookshelfScreen() {
    return (
        <SceneContainer>
            <GridHelperModel />
            <AxisLinesModel />
            <BookshelfModel />
        </SceneContainer>
    );
}
