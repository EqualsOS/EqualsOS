import * as THREE from 'three';

export default function createAxisLines(length = 100) {
    const group = new THREE.Group();
    const axes = ['x', 'y', 'z'];
    const colors = [0xff0000, 0x00ff00, 0x0000ff]; // RGB for X, Y, Z

    axes.forEach((axis, index) => {
        const material = new THREE.LineBasicMaterial({ color: colors[index] });
        const points: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];

        if (axis === 'x') points[1].x = length;
        if (axis === 'y') points[1].y = length;
        if (axis === 'z') points[1].z = length;

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        group.add(new THREE.Line(geometry, material));
    });

    return group;
}
