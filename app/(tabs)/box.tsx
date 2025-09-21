import React, { useMemo } from 'react';
import SceneContainer from '@/components/SceneContainer';

import createRedRockDeliBox from '@/components/3d/RedRockDeliBox';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

function BoxModel() {
    const model = useMemo(() => createRedRockDeliBox(), []);
    // Position the box so it sits on top of the grid
    return <primitive object={model} position={[0, 240 / 2, 0]} />;
}

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
        <SceneContainer>
            <GridHelperModel />
            <AxisLinesModel />
            <BoxModel />
        </SceneContainer>
    );
}
