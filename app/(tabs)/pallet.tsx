import React, { useMemo } from 'react';
import SceneContainer from '@/components/SceneContainer';

import createLoscamPallet from '@/components/3d/LoscamPallet';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

function PalletModel() {
    const model = useMemo(() => createLoscamPallet(), []);
    // Position the pallet so it sits on top of the grid
    return <primitive object={model} position={[0, 150 / 2, 0]} />;
}

function AxisLinesModel() {
    const model = useMemo(() => createAxisLines(1000), []);
    return <primitive object={model} />;
}

function GridHelperModel() {
    const model = useMemo(() => createGridHelper(), []);
    return <primitive object={model} />;
}

export default function PalletScreen() {
    return (
        <SceneContainer>
            <GridHelperModel />
            <AxisLinesModel />
            <PalletModel />
        </SceneContainer>
    );
}
