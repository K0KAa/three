import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const canvas= document.querySelector(".webgl")
const cursor ={
    x: 0,
    y:0
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener("resize",()=>{
    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update Camera
    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()

    //Update renderer
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

window.addEventListener("dblclick", ()=>{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if(!document.fullscreenElement)
    {
        if(canvas.requestFullscreen())
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen())
        {
            canvas.webkitRequestFullscreen()
        }
        
    }
    else
    {
        if(document.exitFullscreen())
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen())
        {
            document.webkitExitFullscreen()
        }
        
    }
})

const aspectRatio = sizes.width/sizes.height
const scene = new THREE.Scene()
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)

scene.add(mesh)

const camera = new THREE.PerspectiveCamera(75,aspectRatio,0.1,100)
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera,canvas)
// controls.enabled =false
controls.enableDamping =true

const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width,sizes.height)

const clock = new THREE.Clock()

const tick = () =>{
    const elapsedTime = clock.getElapsedTime()


    controls.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}

tick()