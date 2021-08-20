import * as THREE from "three";
import "./style.css"
import {OrbitControls} from"three/examples/jsm/controls/OrbitControls";

//console.log(imageSource)
const loadingManager = new THREE.LoadingManager()
// loadingManager.onStart=()=>{
//     console.log("onStart")

// }
// loadingManager.onLoaded=()=>{
//     console.log("onLoaded")
// }
// loadingManager.onProgress=()=>{
//     console.log("onProgress")
// }
// loadingManager.onError=()=>{
//     console.log("onError")
// }
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load("/textures/minecraft.png",)
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const heightTexture = textureLoader.load("/textures/door/height.jpg")
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const normalTexture = textureLoader.load("/textures/door/normal.jpg")
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg")
const ambientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")


// colorTexture.repeat.x=4
// colorTexture.repeat.y=3
// colorTexture.wrapS =THREE.MirrorRepeatWrapping
// colorTexture.wrapt =THREE.MirrorRepeatWrapping

// colorTexture.offset.x=0.5
// colorTexture.offset.y=0.5

// colorTexture.rotation.y=Math.PI/4
// colorTexture.center.x=0.5
// colorTexture.center.y=0.5


//no need of mipmapping on nearestfilter
colorTexture.mipmaps =false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter


const scene = new THREE.Scene()
const canvas = document.querySelector(".webgl")
const geometry=new THREE.BoxBufferGeometry(1,1,1,5,5,5)
const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({map: colorTexture})
)


scene.add(mesh)

const sizes ={
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener("resize",()=>{
    sizes.width= window.innerWidth
    sizes.height=window.innerHeight

    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

const aspectRatio = sizes.width/sizes.height



const camera = new THREE.PerspectiveCamera(75,aspectRatio,0.1,100)
camera.position.z =2
camera.position.x=1
camera.position.y =1

scene.add(camera)

const controls = new OrbitControls(camera,canvas)
controls.enableDamping=true


const renderer = new THREE.WebGLRenderer({canvas})

renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))


const clock = new THREE.Clock()

const tick =()=>{

    const elapsedTime = clock.getElapsedTime()

    controls.update()

    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}

tick()