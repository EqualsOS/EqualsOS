// app/(tabs)/box.tsx

import React, { useMemo } from 'react';
import SceneContainer from '@/components/SceneContainer';

import createRedRockDeliBox from '@/components/3d/RedRockDeliBox';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

function AxisLinesModel() {
    const model = useMemo(() => createAxisLines(1000), []);
    return <primitive object={model} />;
}

function GridHelperModel() {
    const model = useMemo(() => createGridHelper(), []);
    return <primitive object={model} />;
}

export default function BoxScreen() {
    return (
        <SceneContainer
            createModel={createRedRockDeliBox}
            modelPosition={[0, 240 / 2, 0]} // Position the box on the grid floor
        >
            <GridHelperModel />
            <AxisLinesModel />
        </SceneContainer>
    );
}
