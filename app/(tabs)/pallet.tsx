import React, { useMemo } from 'react';
import SceneContainer from '@/components/SceneContainer';

import createLoscamPallet from '@/components/3d/LoscamPallet';
import createAxisLines from '@/components/3d/AxisLines';
import createGridHelper from '@/components/3d/GridHelper';

// These helpers can stay as they are "accessories" to the main scene
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
        // Pass the model creation function and position as props.
        // The container will handle loading, disposal, and positioning.
        <SceneContainer
            createModel={createLoscamPallet}
            modelPosition={[0, 150 / 2, 0]}
        >
            {/* The grid and axes are passed as children */}
            <GridHelperModel />
            <AxisLinesModel />
        </SceneContainer>
    );
}
