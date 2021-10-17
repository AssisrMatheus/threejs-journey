import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1)

/**
 * ************
 *  Various default geometries
 * ************
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
// const geometry = new THREE.SphereGeometry(1, 32, 32)


/**
 * ************
 *  Manually create geometry
 * ************
 */
const geometry = new THREE.BufferGeometry()

/**
 * ************
 *  Make vertices using index
 * ************
 */
// const positionsArray = new Float32Array(9)

// // First vertice
// positionsArray[0] = 0
// positionsArray[1] = 0
// positionsArray[2] = 0
//
// // Second vertice
// positionsArray[3] = 0
// positionsArray[4] = 1
// positionsArray[5] = 0
//
// // Third vertice
// positionsArray[6] = 1
// positionsArray[7] = 0
// positionsArray[8] = 0

/**
 * ************
 *  Make vertices directly
 * ************
 */
// const positionsArray = new Float32Array([
//     0, 0, 0, // First vertex
//     0, 1, 0, // Second vertex
//     1, 0, 0  // Third vertex
// ])

/**
 * ************
 *  Randomly generate vertices
 * ************
 */
 // Create 50 triangles (450 values)
const count = 50
// count * 3 * 3 = Each triangle is composed of 3 vertices and each vertex is composed of 3 values (x, y, and z)
const positionsArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 3 * 3; i++)
{
    positionsArray[i] = (Math.random() - 0.5) * 4
}

/**
 * ************
 *  Convert the linear array of vertices, in an attribute composed of X(3, xyz) values
 * ************
 */
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
// Add the result to the position attribute, as it's what three.js shader uses internally
geometry.setAttribute('position', positionsAttribute)

// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
