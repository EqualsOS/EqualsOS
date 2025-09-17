// This file is located at 'app/platform.tsx'
import React, { useMemo } from 'react';
import SceneViewer from '@/components/SceneViewer'; // Import the reusable viewer
import createAngledPlatform from '@/components/3d/AngledPlatform';

// Your original PlatformModel component
function PlatformModel() {
    const platform = useMemo(() => createAngledPlatform(), []);
    return <primitive object={platform} />;
}

export default function PlatformScene() {
    return (
        <SceneViewer>
            <PlatformModel />
        </SceneViewer>
    );
}
