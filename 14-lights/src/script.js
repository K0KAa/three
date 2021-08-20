import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 1;
pointLight.position.z = 4;
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

// const directionalLight = new THREE.DirectionalLight();
// directionalLight.color.set(0xff0000);
// scene.add(directionalLight);

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//     directionalLight,
//     0.2
// );
// scene.add(directionalLightHelper);

// const hemisphericLight = new THREE.HemisphereLight(0x00ff00, 0x0000ff);
// scene.add(hemisphericLight);

// const hemisphericLightHelper = new THREE.HemisphereLightHelper(
//     hemisphericLight,
//     0.2
// );
// scene.add(hemisphericLightHelper);

// const spotlight = new THREE.SpotLight()

const rectArealight = new THREE.RectAreaLight(0xff0000, 0.5, 3, 3);
//color,intensity,width,height
scene.add(rectArealight);
rectArealight.position.x = 1;
rectArealight.rotation.x = Math.PI * 0.25;
const rectAreaLightHelper = new RectAreaLightHelper(rectArealight);
scene.add(rectAreaLightHelper);
window.requestAnimationFrame(() => {
    rectAreaLightHelper.position.copy(rectArealight.position);
    rectAreaLightHelper.quaternion.copy(rectArealight.quaternion);
    rectAreaLightHelper.update();
});

const spotlight = new THREE.SpotLight(
    0xff0000,
    0.7,
    10,
    Math.PI * 0.25,
    0.25,
    1
);
scene.add(spotlight);

spotlight.position.set(1, 2, 2);
scene.add(spotlight.target);
spotlight.target.position.x = -0.75;
const spotlightHelper = new THREE.SpotLightHelper(spotlight, 0.2);
scene.add(spotlightHelper);
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
    material
);

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
    material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    cube.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    cube.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();