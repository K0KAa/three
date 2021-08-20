import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

//fog

const fog = new THREE.Fog("#262837", 7, 15)
scene.fog = fog
    /**
     * Textures
     */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load("textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("textures/door/alpha.jpg")
const doorHeightTexture = textureLoader.load("textures/door/height.jpg")
const doorAmbientOcclusionTexture = textureLoader.load("textures/door/ambientOcclusion.jpg")
const doorMetalnessTexture = textureLoader.load("textures/door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("textures/door/roughness.jpg")
const doorNormalTexture = textureLoader.load("textures/door/normal.jpg")

const brickColorTexture = textureLoader.load("textures/bricks/color.jpg")
const brickNormalTexture = textureLoader.load("textures/bricks/normal.jpg")
const brickRoughnessTexture = textureLoader.load("textures/bricks/roughness.jpg")
const brickAmbientOcclusionTexture = textureLoader.load("textures/bricks/ambientOcclusion.jpg")


const grassColorTexture = textureLoader.load("textures/grass/color.jpg")
const grassNormalTexture = textureLoader.load("textures/grass/normal.jpg")
const grassRoughnessTexture = textureLoader.load("textures/grass/roughness.jpg")
const grassAmbientOcclusionTexture = textureLoader.load("textures/grass/ambientOcclusion.jpg")

grassColorTexture.repeat.set(12, 12)
grassNormalTexture.repeat.set(12, 12)
grassRoughnessTexture.repeat.set(12, 12)
grassAmbientOcclusionTexture.repeat.set(12, 12)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)


const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        normalMap: brickNormalTexture,
        aoMap: brickAmbientOcclusionTexture,
        roughnessMap: brickRoughnessTexture
    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))

walls.position.y = 2.5 / 2
house.add(walls)


const walls2 = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        normalMap: brickNormalTexture,
        aoMap: brickAmbientOcclusionTexture,
        roughnessMap: brickRoughnessTexture
    })
)
walls2.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls2.geometry.attributes.uv.array, 2))

walls2.position.y = 7 / 2
house.add(walls2)

const roof1 = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: 0xb35f45 })
)
roof1.position.y = 3
roof1.rotation.y = Math.PI / 4
house.add(roof1)


const roof2 = new THREE.Mesh(
    new THREE.ConeBufferGeometry(4, 1, 4),
    new THREE.MeshStandardMaterial({ color: 0xb35f45 })
)
roof2.position.y = 5
roof2.rotation.y = Math.PI / 4
house.add(roof2)


const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.5, 2.5, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture
    })
)

door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1.2
door.position.z = 2.001
house.add(door)

//window


const window1 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.5, 2.5, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture
    })
)

window1.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(window1.geometry.attributes.uv.array, 2))
window1.scale.set(0.5, 0.25, 0.5)
window1.position.z = window1.position.z = 2.001
window1.position.y = 4
house.add(window1)
    // Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(30, 30),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        roughnessMap: grassRoughnessTexture,
        normalMap: grassNormalTexture,
        aoMap: grassAmbientOcclusionTexture
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })

const bush1 = new THREE.Mesh(
    bushGeometry, bushMaterial
)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.5, 0.3, 2.4)

const bush2 = new THREE.Mesh(
    bushGeometry, bushMaterial
)
bush2.scale.set(0.2, 0.2, 0.2)
bush2.position.set(1.3, 0.1, 2.8)

const bush3 = new THREE.Mesh(
    bushGeometry, bushMaterial
)
bush3.scale.set(0.3, 0.3, 0.3)
bush3.position.set(-1.3, 0.1, 3.3)


const bush4 = new THREE.Mesh(
    bushGeometry, bushMaterial
)
bush4.scale.set(0.4, 0.4, 0.4)
bush4.position.set(-0.9, 0.3, 3.3)


house.add(bush1, bush2, bush3, bush4)

const graves = new THREE.Group()
scene.add(graves)
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })
for (let i = 0; i < 100; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 9
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.3, z)
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.1)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.1)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight("#ff7d46", 1, 5)
doorLight.position.z = 2.2
doorLight.position.y = 2.3
house.add(doorLight)

const ghost1 = new THREE.PointLight("#ff0000", 1, 1)
const ghost2 = new THREE.PointLight("#00ff00", 1, 1)
const ghost3 = new THREE.PointLight("#0000ff", 1, 1)
scene.add(ghost1, ghost2, ghost3)
const ghost1AxisHelper = new THREE.PointLightHelper(ghost1)

//shadows
moonLight.castShadow = true
doorLight.castShadow = true
walls.castShadow = true
bush1.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
floor.receiveShadow = true


doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
    /**
     * Sizes
     */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.setClearColor("#262837")
    /**
     * Animate
     */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    const ghostAngle = elapsedTime * 0.4
    ghost1.position.x = Math.cos(ghostAngle)
    ghost2.position.z = Math.sin(ghostAngle)
        // Update controls
    controls.update()
        // Render
    renderer.render(scene, camera)
        // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()