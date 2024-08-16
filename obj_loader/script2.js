import * as THREE from 'three';

export function createVectorField(scene) {
    // Create a vector field that points at the mouse
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const vectorField = new THREE.Group();
    const fieldSize = 20;
    const fieldResolution = 1;

    // Create vector arrows
    for (let x = -fieldSize / 2; x <= fieldSize / 2; x += fieldResolution) {
        for (let y = -fieldSize / 2; y <= fieldSize / 2; y += fieldResolution) {
            const arrow = new THREE.ArrowHelper(
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(x, y, -10),  // Move field behind other objects
                0.5,
                0x00ff00
            );
            vectorField.add(arrow);
        }
    }

    scene.add(vectorField);

    // Update mouse position
    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    window.addEventListener('mousemove', onMouseMove, false);

    // Update vector field
    function updateVectorField() {
        raycaster.setFromCamera(mouse, scene.getObjectByName('camera'));
        const intersects = raycaster.intersectObject(vectorField, true);

        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            vectorField.children.forEach((arrow) => {
                const direction = new THREE.Vector3().subVectors(intersectionPoint, arrow.position).normalize();
                arrow.setDirection(direction);
            });
        }
    }

    return {
        update: updateVectorField
    };
}