import * as THREE from 'three';

// --- START NEW DEBUG CODE ---
function debugLog(message) {
    let debugBox = document.getElementById('debug-box');
    if (!debugBox) {
        debugBox = document.createElement('div');
        debugBox.id = 'debug-box';
        debugBox.style.position = 'absolute';
        debugBox.style.top = '10px';
        debugBox.style.left = '10px';
        debugBox.style.padding = '10px';
        debugBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        debugBox.style.color = 'lime';
        debugBox.style.fontFamily = 'monospace';
        debugBox.style.fontSize = '12px';
        debugBox.style.zIndex = '100';
        debugBox.style.maxWidth = 'calc(100% - 40px)';
        debugBox.style.wordWrap = 'break-word';
        document.body.appendChild(debugBox);
    }
    debugBox.innerHTML += message + '<br>';
    console.log(message); // Also log to console
}
// --- END NEW DEBUG CODE ---
import { ARButton } from 'three/addons/webxr/ARButton.js';

let camera, scene, renderer;
let controller;
let reticle;
let hitTestSource = null;
let hitTestSourceRequested = false;

let placedObject = null; // To store our placed cube (later Nova)

init();
animate();

function init() {
    debugLog('Nova WebAR Debugger v2'); // Start logging
    const container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    scene.add(camera); // Add camera to scene for AR

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    const arButtonElement = ARButton.createButton(renderer, {
        requiredFeatures: ['hit-test', 'dom-overlay'], // dom-overlay for custom button
        domOverlay: { root: document.body } // Specify root for DOM overlay
    });
    
    arButtonElement.style.display = 'none'; // Hide the default ARButton
    document.body.appendChild(arButtonElement);

    const customARButton = document.getElementById('ar-button');

    if (navigator.xr) {
        debugLog('navigator.xr object found.');
        navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
            debugLog(`'immersive-ar' supported: ${supported}`);
            if (supported) {
                customARButton.disabled = false;
                customARButton.textContent = 'Start AR';
                customARButton.onclick = () => {
                    arButtonElement.onclick();
                };
            } else {
                customARButton.disabled = true;
                customARButton.textContent = 'AR Not Supported';
                debugLog('Reason: isSessionSupported returned false.');
            }
        }).catch((err) => {
            customARButton.disabled = true;
            customARButton.textContent = 'AR Not Supported';
            debugLog(`Error checking support: ${err.message || err}`);
        });
    } else {
        customARButton.disabled = true;
        customARButton.textContent = 'AR Not Supported';
        debugLog('Reason: navigator.xr object not found.');
    }

    renderer.xr.addEventListener('sessionstart', () => {
        customARButton.textContent = 'Exit AR';
    });
    renderer.xr.addEventListener('sessionend', () => {
        customARButton.textContent = 'Start AR';
        reticle.visible = false;
        hitTestSourceRequested = false;
        hitTestSource = null;
    });

    reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.07, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xffffff }) // White reticle
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    window.addEventListener('resize', onWindowResize);
}

function onSelect() {
    if (reticle.visible) {
        if (!placedObject) { 
            const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
            placedObject = new THREE.Mesh(geometry, material);
            placedObject.position.setFromMatrixPosition(reticle.matrix);
            scene.add(placedObject);
            console.log('Cube placed!');
        } else {
            placedObject.position.setFromMatrixPosition(reticle.matrix);
            console.log('Cube moved!');
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (!hitTestSource && !hitTestSourceRequested && session) {
            session.requestReferenceSpace('viewer').then((viewerSpace) => {
                session.requestHitTestSource({ space: viewerSpace }).then((source) => {
                    hitTestSource = source;
                }).catch(err => console.error('Error requesting hit test source:', err));
            }).catch(err => console.error('Error requesting viewer reference space:', err));
            hitTestSourceRequested = true; 
        }

        if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            if (hitTestResults.length) {
                const hit = hitTestResults[0];
                if (hit && referenceSpace) {
                    const pose = hit.getPose(referenceSpace);
                    if (pose) {
                        reticle.visible = true;
                        reticle.matrix.fromArray(pose.transform.matrix);
                    } else {
                        reticle.visible = false;
                    }
                } else {
                    reticle.visible = false;
                }
            } else {
                reticle.visible = false;
            }
        }
    }

    renderer.render(scene, camera);
}

console.log('Nova WebAR script v2 loaded.');
