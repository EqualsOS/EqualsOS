import React, { useMemo, useEffect } from 'react';
import SceneContainer from '@/components/SceneContainer';
import * as THREE from 'three';

import createBookshelf from '@/components/3d/Bookshelf';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

// Helper to dispose of objects
function disposeModel(model: THREE.Object3D | null) {
    if (!model) return;
    model.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh) {
            mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(material => material.dispose());
            } else if (mesh.material) {
                mesh.material.dispose();
            }
        }
    });
}

// A simple component that creates one complete bookshelf
function BookshelfModel({ position, rotation, hasMovedBook }: {
    position: [number, number, number];
    rotation?: [number, number, number];
    hasMovedBook?: boolean;
}) {
    const model = useMemo(() => createBookshelf(hasMovedBook), [hasMovedBook]);

    // Cleanup effect to prevent memory leaks
    useEffect(() => {
        return () => {
            requestAnimationFrame(() => {
                disposeModel(model);
            });
        };
    }, [model]);

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

type BookshelfProps = {
    position: [number, number, number];
    rotation?: [number, number, number];
    hasMovedBook?: boolean;
};

export default function ExploreScreen() {
    const bookshelfPositions: BookshelfProps[] = [
        // Back Row
        { position: [-637.5, 0, -862.5], rotation: [0, Math.PI / 2, 0] },
        { position: [637.5, 0, -862.5], rotation: [0, -Math.PI / 2, 0] },
        // Front Row
        { position: [-637.5, 0, 862.5], rotation: [0, Math.PI / 2, 0], hasMovedBook: true },
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
