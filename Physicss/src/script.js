import * as THREE from "three"
import dat from "dat.gui"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import CANNON from "cannon"

const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep =true
world.gravity.set(0,-9.82,0)

const gui =new dat.GUI()
const debugObject = {}
debugObject.createSphere =() =>{
    createSphere(Math.random() *0.5,
                     {x:(Math.random() -0.5) *3, y:3 ,z:(Math.random()-0.5) *4})
}

debugObject.createBox =() =>{
    createBox(Math.random() *0.5,
                Math.random() *0.5,
                Math.random() *0.5,
                     {x:(Math.random() -0.5) *3, y:3 ,z:(Math.random()-0.5) *4})
}

debugObject.reset=()=>{
    for(const object of objectsToUpdate){
        //remove body
        object.body.removeEventListener("collide",playHitSound)
        world.remove(object.body)
        //remove mesh
        scene.remove(object.mesh)
    }
}
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')
//sounds
const hitSound = new Audio("/sounds/hit.mp3")
const playHitSound =(event)=>{
    const impactStrength =event.contact.getImpactVelocityAlongNormal()
    if(impactStrength >1.3){
        hitSound.volume =Math.random()
        hitSound.currentTime =0
        hitSound.play()
    }    
}
//create different sound atleast 3
//adding some delay on playing sound
//scale the volume according to impactStrength above
    //Cannon js further
        //Constrains ->HingeConstraint creating like a door
                    //-> DistanceConstraint
                    //LockConstraint
                    //PointToPointConstraint
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.5,
        restitution: 0.7   //for bounce
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial =defaultContactMaterial


const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass =0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI*0.5,
)
world.addBody(floorBody)

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

const textureLoader =new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10,10),
    new THREE.MeshStandardMaterial({
        color: 0x777770,
        roughness: 0.3,
        metalness: 0.4,
        envMap: environmentMapTexture
    })
)

floor.receiveShadow = true
floor.rotation.x = -Math.PI *0.5
scene.add(floor)


const sphereGeometry = new THREE.SphereBufferGeometry(1,32,32)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness:0.1,
    envMap: environmentMapTexture
})
const objectsToUpdate =[]
const createSphere =(radius,position) =>{
    const mesh = new THREE.Mesh(sphereGeometry,sphereMaterial)
    mesh.castShadow =true
    mesh.scale.set(radius,radius,radius)
    mesh.position.copy(mesh)
    scene.add(mesh)

    //cannon sphere
    
    const phySphere = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass :1,
        shape: phySphere,
        position: new CANNON.Vec3(0,3,0),
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener("collide",playHitSound)
    world.addBody(body)

    objectsToUpdate.push({
        mesh: mesh,
        body: body,
    })
}

createSphere(0.5, {x: 0,y: 3,z: 0})


const boxGeometry = new THREE.BoxBufferGeometry(1,1,1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness:0.4,
    envMap: environmentMapTexture
})

const createBox =(length,breadth,depth,position) =>{
    const mesh = new THREE.Mesh(boxGeometry,boxMaterial)
    mesh.castShadow =true
    mesh.scale.set(length,breadth,depth)
    mesh.position.copy(position)
    scene.add(mesh)

    //cannon box
    
    const physicsBox = new CANNON.Box(new CANNON.Vec3(length/2,breadth/2,depth/2)) //takes distance from centner of object
    const body = new CANNON.Body({
        mass :1,
        shape: physicsBox,
        position: new CANNON.Vec3(0,3,0),
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener("collide",playHitSound)
    world.addBody(body)

    objectsToUpdate.push({
        mesh: mesh,
        body: body,
    })
}


const ambientLight = new THREE.AmbientLight(0xfffff,0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
directionalLight.castShadow= true
directionalLight.shadow.mapSize.set(1024,1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(0, 3,5)
scene.add(directionalLight)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize',()=>{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
     //camera
     camera.aspect = sizes.width/sizes.height
     camera.updateProjectionMatrix()

     renderer.setSize(sizes.width,sizes.height)

})

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height, 0.1, 100)
camera.position.set(-3,3,3)
scene.add(camera)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.render(scene,camera)

const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true
const clock = new THREE.Clock()
let oldElapsedTime =0

const tick =()=>{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime =elapsedTime
    //update physics world
    //sphereBody.applyForce(new CANNON.Vec3(-0.5,0,0), sphereBody.position)
     world.step(1/60,deltaTime,3)
    for(const object of objectsToUpdate){
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    //sphere.position.copy(sphereBody.position)

    controls.update()

    renderer.render(scene,camera)

    window.requestAnimationFrame(tick)
}
tick()