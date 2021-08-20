import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


/**
 * Loaders
 */

//all the textures loaded from GLTFLoader dont need sRGBEncoding ,it takes care of it
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObjects ={}


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials =() =>{
    scene.traverse(child=>{
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMap =environmentMap
            child.material.envMapIntensity = debugObjects.envMapIntensity
            child.material.needsUpdate =true
            child.castShadow = true
            child.receiveShadow =true 
        }
    })
}

/**
 *Environment Map
 */
const environmentMap = cubeTextureLoader.load([
    "/textures/environmentMaps/2/px.jpg",
    "/textures/environmentMaps/2/nx.jpg",
    "/textures/environmentMaps/2/py.jpg",
    "/textures/environmentMaps/2/ny.jpg",
    "/textures/environmentMaps/2/pz.jpg",
    "/textures/environmentMaps/2/nz.jpg",
])

//use sRGBEncoding on the texture you can see on screen
environmentMap.encoding =THREE.sRGBEncoding
scene.background = environmentMap
//scene.environment = environmentMap  we can jus update envMap on all meshes without using traverse 
debugObjects.envMapIntensity =5
gui.add(debugObjects,"envMapIntensity").min(0).max(10).step(0.001).onChange(updateAllMaterials)

/**
 * Models
 */
gltfLoader.load(
    "/models/FlightHelmet/glTF/FlightHelmet.gltf",
    ({scene:modelScene})=>{
        modelScene.scale.set(10,10,10)
        modelScene.position.set(0,-4,0)
        scene.rotation.y= Math.PI * 0.5
        scene.add(modelScene)

        gui.add(modelScene.rotation,"y")
            .name("modelRotation")
            .min(-Math.PI)
            .max(Math.PI*2)
            .step(0.1)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff,3)
directionalLight.position.set(0.25,3,2.25)
directionalLight.castShadow =true
directionalLight.shadow.camera.far =15
directionalLight.shadow.mapSize.set(1024, 1024)

//to remove atristic effect due to happening of shadow on itself
directionalLight.shadow.normalBias =0.03
scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)
gui.add(directionalLight,"intensity").name("lightIntensity").min(0).max(1).step(0.001)
gui.add(directionalLight.position,"x").name("lightX").min(-5).max(10).step(0.001)
gui.add(directionalLight.position,"y").name("lightY").min(-5).max(10).step(0.001)
gui.add(directionalLight.position,"z").name("lightZ").min(-5).max(10).step(0.001)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights =true
//changes the light intensity to be realistic 
//default is linearEncoding
renderer.outputEncoding = THREE.sRGBEncoding

//converts High Dynamic Range (HDR) to Low Dynamic Range (LDR) color values
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure =3
renderer.shadowMap.enabled =true
renderer.shadowMap.type =THREE.PCFShadowMap


gui.add(renderer,"toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    ACESFilmic:THREE.ACESFilmicToneMapping,
    Cineon: THREE.CineonToneMapping
})
.onFinishChange(()=>{
    renderer.toneMapping= Number(renderer.toneMapping)
    updateAllMaterials()
})

gui.add(renderer,"toneMappingExposure").min(0).max(8).step(0.001)

//use sRGBEncoding on color texture either on env or normal texture 
// dont use on textures like normal/ other
/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()