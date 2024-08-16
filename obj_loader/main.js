import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const objModels = [];

const positions = [
    new THREE.Vector3(-1.5, 0, 0),
    new THREE.Vector3(-0.5, 0, 0),
    new THREE.Vector3(0.5, 0, 0),
    new THREE.Vector3(1.5, 0, 0),
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(-0.5, 2, 0),
    new THREE.Vector3(0.5, 2, 0),
    new THREE.Vector3(0, 3, 0)
];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Transparent background

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const loader = new OBJLoader();
loader.load(
    'untitled.obj',
    function (object) {
        const baseScale = 0.5;
        
        positions.forEach((position) => {
            const instancedObj = object.clone();
            instancedObj.scale.set(baseScale, baseScale, baseScale);
            instancedObj.position.copy(position);
            instancedObj.children[0].material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
            scene.add(instancedObj);
            objModels.push(instancedObj);
        });
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error occurred while loading the OBJ file:', error);
    }
);

camera.position.set(0, 5, 10);
camera.lookAt(0, 1.5, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 0.5;
controls.panSpeed = 0.5;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2;

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    
    // Update vector field mouse position
    if (window.updateVectorFieldMouse) {
        window.updateVectorFieldMouse(mouseX, mouseY);
    }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    objModels.forEach(model => {
        model.rotation.x += 0.01;
        model.rotation.y += 0.01;
    });
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}