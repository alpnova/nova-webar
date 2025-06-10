import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer, controls;
let novaParticles;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1.5; // Move camera back to see the hologram

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    document.body.appendChild(renderer.domElement);

    // OrbitControls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.5;
    controls.maxDistance = 5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x88ccff, 3);
    pointLight.position.set(0, 0, 0.5);
    scene.add(pointLight);

    // --- Create Nova Hologram Body ---
    createNovaBody();

    // Handle window resizing
    window.addEventListener('resize', onWindowResize);
}

function createNovaBody() {
    const particleCount = 20000; // Number of particles
    const radius = 0.5; // Radius of the sphere

    const positions = [];
    const colors = [];

    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        // Create a random point in a sphere (Fibonacci sphere would be more even, but random is fine for now)
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = Math.pow(Math.random(), 1 / 3) * radius;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions.push(x, y, z);

        // Set color - blue/cyan gradient
        const green = 0.5 + Math.random() * 0.5; // 0.5 to 1.0
        const blue = 0.8 + Math.random() * 0.2; // 0.8 to 1.0
        color.setRGB(0, green, blue);
        colors.push(color.r, color.g, color.b);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.008,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending, // Makes particles glow
        depthWrite: false // Important for transparency
    });

    novaParticles = new THREE.Points(geometry, material);
    scene.add(novaParticles);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Future home of hologram animation logic
    if (novaParticles) {
        novaParticles.rotation.y += 0.0005;
    }

    controls.update(); // Required for damping
    renderer.render(scene, camera);
}
