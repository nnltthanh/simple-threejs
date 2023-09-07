import * as THREE from "three";
import {OrbitController, OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// camera.position.z = 5;
// camera.position.y = 5;
// camera.position.x = 5;

camera.position.set(-10, 30, 30);

//control camera
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// box
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00})

const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// wall, ground
const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide})

const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// sphere shape
// const sphereGeometry = new THREE.SphereGeometry(6, 15, 10);
const sphereGeometry = new THREE.SphereGeometry(4, 50 ,50);
// const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: false})
const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10, 10, 0)

//light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF,0.8);
scene.add(directionalLight)
directionalLight.position.set(-30, 50, 0)

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper)

//direction of light
const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(helper)

//add shadow
renderer.shadowMap.enabled = true;
plane.castShadow = true;
plane.receiveShadow = true; //show the shadow of  the sphere
sphere.castShadow = true;
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12; 

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

//GUI change color & wireframe status
const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    boxColor: '#20bcaf',
    wireframe: false,
    speed: 0.01
}

gui.addColor(options, 'sphereColor').onChange((e) => {
    sphere.material.color.set(e);
})
gui.addColor(options, 'boxColor').onChange((e) => {
    box.material.color.set(e);
})
gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
})
gui.add(options, 'speed', 0 , 0.1);

let step = 0;

function animate(time) {
    // box.rotation.x += 0.01;
    // box.rotation.y += 0.01;
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step)) + 6 //6 = r of sphere
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
