import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { AdditiveBlending } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
const properties = {}
properties.sizes = 0.0001
properties.count = 5000
properties.radius = 5
properties.branches = 3
properties.spin = 1
properties.randomness = 0.2
properties.randomnessPower = 3
properties.insideColor = "#ff6030"
properties.outsideColor = "#1b3984"

let geometry = null
let material = null
let points = null

const generategalexy = () => {

    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()


    material = new THREE.PointsMaterial({
        size: properties.sizes,
        sizeAttenuation: true,
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true
    })

    const positions = new Float32Array(properties.count * 3)
    const colors = new Float32Array(properties.count * 3)

    const inSideColor = new THREE.Color(properties.insideColor)
    const outSideColor = new THREE.Color(properties.outsideColor)
    for (let i = 0; i < properties.count; i++) {
        const radius = Math.random() * properties.radius
        const branchAngle = (i % properties.branches) / properties.branches * Math.PI * 2
        const spinAngle = radius * properties.spin
        const randomX = Math.pow(Math.random(), properties.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        const randomY = Math.pow(Math.random(), properties.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), properties.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        let i3 = i * 3
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        //color
        const mixedColor = inSideColor.clone()
        mixedColor.lerp(outSideColor, radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    points = new THREE.Points(geometry, material)
    scene.add(points)
}


generategalexy()

//gui
gui.add(properties, 'count').min(500).max(10000).step(10).onFinishChange(generategalexy)
gui.add(properties, 'sizes').min(0.0001).max(0.1).step(0.0001).onFinishChange(generategalexy)
gui.add(properties, 'radius').min(0.01).max(50).step(0.1).onFinishChange(generategalexy)
gui.add(properties, 'branches').min(2).max(20).step(1).onFinishChange(generategalexy)
gui.add(properties, 'spin').min(-5).max(5).step(0.01).onFinishChange(generategalexy)
gui.add(properties, 'randomness').min(0).max(2).step(0.001).onFinishChange(generategalexy)
gui.add(properties, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generategalexy)
gui.addColor(properties, 'insideColor').onFinishChange(generategalexy)
gui.addColor(properties, 'outsideColor').onFinishChange(generategalexy)


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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()