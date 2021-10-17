import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
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
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)
//
// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

const parameters = {
    lightHelpers: true,
    ambientLightColor: 0xffffff,
    hemisphereSkyColor: 0xff0000,
    hemisphereGroundColor: 0x0000ff,
    // hemisphereSkyColor: 0xffffff,
    // hemisphereGroundColor: 0x00fffc,
    directLightColor: 0x00fffc,
    directLightX: 1,
    directLightY: 0.25,
    directLightZ: 0,
    pointLightColor: 0xff9000,
    pointLightX: 1,
    pointLightY: 0.25,
    pointLightZ: 0,
    rectAreaColor: 0x4e00ff,
    rectLightX: -1.5,
    rectLightY: 0,
    rectLightZ: 1.5,
    spotLightColor: 0x78ff00,
    spotLightX: 0,
    spotLightY: 2,
    spotLightZ: 3,
}

const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(parameters.ambientLightColor)
gui.add(ambientLight, 'visible').name('ambientLightVisible')
gui.addColor(parameters, 'ambientLightColor').onChange((val) => ambientLight.color = new THREE.Color(val))
ambientLight.intensity = 0.5
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambientLightIntensity')
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(parameters.directLightColor, 0.3)
directionalLight.visible = true
directionalLight.position.set(parameters.directLightX, parameters.directLightY, parameters.directLightZ)
gui.add(directionalLight, 'visible').name('directLightVisible')
gui.addColor(parameters, 'directLightColor').onChange((val) => directionalLight.color = new THREE.Color(val))
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('directLightIntensity')
gui.add(parameters, 'directLightX').min(-5).max(5).step(0.1).onChange((val) => directionalLight.position.x = val)
gui.add(parameters, 'directLightY').min(-5).max(5).step(0.1).onChange((val) => directionalLight.position.y = val)
gui.add(parameters, 'directLightZ').min(-5).max(5).step(0.1).onChange((val) => directionalLight.position.z = val)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(parameters.hemisphereSkyColor, parameters.hemisphereGroundColor, 0.3)
hemisphereLight.visible = true
gui.add(hemisphereLight, 'visible').name('hemisphereLightVisible')
gui.addColor(parameters, 'hemisphereSkyColor').onChange((val) => hemisphereLight.color = new THREE.Color(val))
gui.addColor(parameters, 'hemisphereGroundColor').onChange((val) => hemisphereLight.groundColor = new THREE.Color(val))
gui.add(hemisphereLight, 'intensity').min(0).max(1).step(0.001).name('hemisphereLightIntensity')
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(parameters.pointLightColor, 0.5, 10, 2)
pointLight.visible = true
gui.add(pointLight, 'visible').name('pointLightVisible')
gui.addColor(parameters, 'pointLightColor').onChange((val) => pointLight.color = new THREE.Color(val))
gui.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('pointLightIntensity')
gui.add(pointLight, 'distance').min(0).max(20).step(0.1).name('pointLightDistance')
gui.add(pointLight, 'decay').min(0).max(5).step(0.1).name('pointLightDecay')
gui.add(parameters, 'pointLightX').min(-5).max(5).step(0.1).onChange((val) => pointLight.position.x = val)
gui.add(parameters, 'pointLightY').min(-5).max(5).step(0.1).onChange((val) => pointLight.position.y = val)
gui.add(parameters, 'pointLightZ').min(-5).max(5).step(0.1).onChange((val) => pointLight.position.z = val)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(parameters.rectAreaColor, 2, 1, 1)
rectAreaLight.visible = true
rectAreaLight.position.set(parameters.rectLightX, parameters.rectLightY, parameters.rectLightZ)
rectAreaLight.lookAt(new THREE.Vector3())
gui.add(rectAreaLight, 'visible').name('rectLightVisible')
gui.addColor(parameters, 'rectAreaColor').onChange((val) => rectAreaLight.color = new THREE.Color(val))
gui.add(parameters, 'rectLightX').min(-5).max(5).step(0.1).onChange((val) => {
    rectAreaLight.position.x = val
    rectAreaLight.lookAt(new THREE.Vector3())
})
gui.add(parameters, 'rectLightY').min(-5).max(5).step(0.1).onChange((val) => {
    rectAreaLight.position.y = val
    rectAreaLight.lookAt(new THREE.Vector3())
})
gui.add(parameters, 'rectLightZ').min(-5).max(5).step(0.1).onChange((val) => {
    rectAreaLight.position.z = val
    rectAreaLight.lookAt(new THREE.Vector3())
})
scene.add(rectAreaLight)

const spotlight = new THREE.SpotLight(parameters.spotLightColor, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotlight.visible = true
spotlight.position.set(parameters.spotLightX, parameters.spotLightY, parameters.spotLightZ)
gui.add(spotlight, 'visible').name('spotLightVisible')
gui.addColor(parameters, 'spotLightColor').onChange((val) => spotlight.color = new THREE.Color(val))
scene.add(spotlight.target)
scene.add(spotlight)

/**
 * Helpers
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotlight)
scene.add(spotLightHelper)
window.requestAnimationFrame(() =>
{
    spotLightHelper.update()
})

// the strength
gui.add(spotlight, 'intensity').min(0).max(1).step(0.001).name('spotLightIntensity').onChange(() => spotLightHelper.update())
// the distance at which the intensity drops to 0
gui.add(spotlight, 'distance').min(0).max(20).step(0.1).name('spotLightDistance').onChange(() => spotLightHelper.update())
// how large is the beam
gui.add(spotlight, 'angle').min(0).max(Math.PI*2).step(0.1).name('spotLightAngle').onChange(() => spotLightHelper.update())
// how diffused is the contour of the beam
gui.add(spotlight, 'penumbra').min(0).max(10).step(0.1).name('spotLightPenumbra').onChange(() => spotLightHelper.update())
// how fast the light dims
gui.add(spotlight, 'decay').min(0).max(5).step(0.1).name('spotLightDecay').onChange(() => spotLightHelper.update())
gui.add(parameters, 'spotLightX').min(-5).max(5).step(0.1).onChange((val) => {
    spotlight.position.x = val
    spotLightHelper.update()
})
gui.add(parameters, 'spotLightY').min(-5).max(5).step(0.1).onChange((val) => {
    spotlight.position.y = val
    spotLightHelper.update()
})
gui.add(parameters, 'spotLightZ').min(-5).max(5).step(0.1).onChange((val) => {
    spotlight.position.z = val
    spotLightHelper.update()
})

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

gui.add(parameters, 'lightHelpers').onChange((val) => {
    hemisphereLightHelper.visible = val;
    directionalLightHelper.visible = val;
    pointLightHelper.visible = val;
    spotLightHelper.visible = val;
    rectAreaLightHelper.visible = val;
})

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
