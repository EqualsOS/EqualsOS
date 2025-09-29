import React, { useMemo } from 'react';
import SceneContainer from '@/components/SceneContainer';

import createAngledPlatform from '@/components/3d/AngledPlatform';
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

export default function PlatformScreen() {
    return (
        // Pass the model creation function as a prop.
        // The container will handle loading, disposal, and positioning.
        <SceneContainer createModel={createAngledPlatform}>
            {/* The grid and axes are passed as children */}
            <GridHelperModel />
            <AxisLinesModel />
        </SceneContainer>
    );
}
