import { THREE } from 'expo-three';

/**
 * Creates a 3D grid for the scene floor.
 * @param size The total size of the grid (width and depth).
 * @param divisions The number of divisions in the grid.
 * @param colorCenterLine The colour of the center lines (X and Z axes).
 * @param colorGrid The colour of the other grid lines.
 * @returns A THREE.GridHelper object.
 */
export default function createGridHelper(
    size = 2000,
    divisions = 40,
    colorCenterLine = 0x888888,
    colorGrid = 0x444444
): THREE.GridHelper {
    return new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
}
