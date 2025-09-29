import React, { useMemo } from 'react';
import SceneContainer from '@/components/SceneContainer';

import createBookshelf from '@/components/3d/Bookshelf';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

// This component accepts position and rotation props
function BookshelfModel({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
    const model = useMemo(() => createBookshelf(), []);
    return <primitive object={model} position={position} rotation={rotation} />;
}

function AxisLinesModel() {
    const model = useMemo(() => createAxisLines(3000), []);
    return <primitive object={model} />;
}

function GridHelperModel() {
    const model = useMemo(() => createGridHelper(6000, 120), []);
    return <primitive object={model} />;
}

// Define a type for our props for clarity
type BookshelfProps = {
    position: [number, number, number];
    rotation?: [number, number, number];
};

export default function ExploreScreen() {
    // --- UPDATED: Array for a 2x2 layout ---
    const bookshelfPositions: BookshelfProps[] = [
        // Back Row
        { position: [-637.5, 0, -862.5], rotation: [0, Math.PI / 2, 0] },
        { position: [637.5, 0, -862.5], rotation: [0, -Math.PI / 2, 0] },
        // Front Row
        { position: [-637.5, 0, 862.5], rotation: [0, Math.PI / 2, 0] },
        { position: [637.5, 0, 862.5], rotation: [0, -Math.PI / 2, 0] },
    ];

    return (
        <SceneContainer>
            <GridHelperModel />
            <AxisLinesModel />

            {bookshelfPositions.map((props, index) => (
                <BookshelfModel key={index} {...props} />
            ))}
        </SceneContainer>
    );
}
