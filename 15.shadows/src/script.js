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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

/**
 * Lights
 */
// Ambient light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true
gui.add(directionalLight, 'castShadow').name('lightCastShadow')
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)


// Resolution, improves quality
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

// Clip panes, may improve performance and help with light bugs
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

// Amplitude, "lowers the size of camera", the smaller the values, the more precise the shadow will be. But if it's too small, the shadows will just be cropped.
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2

// Shadow blur
directionalLight.shadow.radius = 10
gui.add(directionalLight.shadow, 'radius').min(0).max(150).name('shadowRadius')

scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
gui.add(directionalLightCameraHelper, 'visible').name('shadowMapCamera')
// gui.add(directionalLight.shadow.camera, 'near').min(0).max(20).step(0.2).name('shadowMapCameraNear')
// gui.add(directionalLight.shadow.camera, 'far').min(0).max(20).step(0.2).name('shadowMapCameraFar')
scene.add(directionalLightCameraHelper)

// Spotlight
// const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)
spotLight.castShadow = true
gui.add(spotLight, 'castShadow').name('spotLightCastShadow')

// Resolution, improves quality
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

// Spotlight uses perspective camera, so we have fov, "lowers the size of camera", the smaller the values, the more precise the shadow will be. But if it's too small, the shadows will just be cropped.
spotLight.shadow.camera.fov = 15

// Clip panes, may improve performance and help with light bugs
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

spotLight.position.set(0,2,2)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
gui.add(spotLightCameraHelper, 'visible').name('spotMapCamera')
scene.add(spotLightCameraHelper)

// Point light
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true
gui.add(pointLight, 'castShadow').name('pointLightCastShadow')

pointLight.position.set(-1,1,0)
scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
gui.add(pointLightCameraHelper, 'visible').name('pointMapCamera')
scene.add(pointLightCameraHelper)

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true
gui.add(sphere, 'castShadow').name('sphereCastShadow')

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
)

/**
 * Baking shadows
 */
// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   new THREE.MeshBasicMaterial({
//       map: bakedShadow
//   })
// )
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true
gui.add(plane, 'receiveShadow').name('planeReceiveShadow')



const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      alphaMap: simpleShadow
  })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + .01

scene.add(sphere, sphereShadow, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

// Enables shadow maps
// renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// gui.add(renderer.shadowMap, 'enabled').name('shadowMaps')
// gui.add(renderer.shadowMap, 'type').name('mapType').options([THREE.BasicShadowMap, THREE.PCFShadowMap, THREE.PCFSoftShadowMap, THREE.VSMShadowMap]).onChange((val) => renderer.shadowMap.type = val)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Update the shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
