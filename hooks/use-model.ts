// hooks/use-model.ts

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as THREE from 'three';

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

export function useModel(createFn: () => THREE.Group) {
    const [model, setModel] = useState<THREE.Group | null>(null);

    useFocusEffect(
        useCallback(() => {
            let loadedModel: THREE.Group | null = null;
            const timerId = setTimeout(() => {
                loadedModel = createFn();
                setModel(loadedModel);
            }, 16); // Small delay to allow loader to show

            return () => {
                clearTimeout(timerId);
                disposeModel(loadedModel);
                setModel(null);
            };
        }, [createFn])
    );

    return model;
}
