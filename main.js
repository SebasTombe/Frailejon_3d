import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// Crear la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🌞 **Iluminación Natural** 🌞
// Luz ambiental para iluminación suave
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz general (suave)
scene.add(ambientLight);

// Luz hemisférica (simula cielo y suelo)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.6);
hemiLight.position.set(0, 10, 0);
scene.add(hemiLight);

// Luz direccional con sombras suaves
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(3, 5, -2);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

//Fondo
const loader_background = new THREE.TextureLoader();
const background_texture = loader_background.load('/Paramo.jpg');
scene.background = background_texture;

// Agregar controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Suaviza el movimiento
controls.dampingFactor = 0.05;  
controls.screenSpacePanning = false;
controls.minDistance = 1;  // Distancia mínima de zoom
controls.maxDistance = 10; // Distancia máxima de zoom
controls.target.set(0, 0, 0); // Centra el modelo en el foco
controls.update();

// Cargar el modelo GLB
const loader = new GLTFLoader();
loader.load(
    '/frailejon.glb',
    function (gltf) {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0, 0, 0); // Ajusta la posición si es necesario
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% cargado');
    },
    function (error) {
        console.error('Error al cargar el modelo:', error);
    }
);

// Posicionar la cámara
camera.position.set(0, 2, 5);

// Animar la escena
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Necesario para el movimiento suave
    renderer.render(scene, camera);
}

animate();

// Ajustar tamaño de la ventana al redimensionar
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
