import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const parameters = {
    houseWallColor: '#ac8e82',
    houseRoofColor: '#b35f45',
    houseDoorColor: '#aa7b7b',
    bushColor: '#89c854',
    graveColor: '#b2b6b1',
    doorLightColor: '#ff7d46',
    fogColor: '#262837',
    ghost1Light: '#ff00ff',
    ghost2Light: '#00ffff',
    ghost3Light: '#ffff00'
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusioTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

const grassRepeat = 8

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassColorTexture.repeat.x = grassRepeat
grassColorTexture.repeat.y = grassRepeat

grassAmbientOcclusioTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusioTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusioTexture.repeat.x = grassRepeat
grassAmbientOcclusioTexture.repeat.y = grassRepeat

grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.repeat.x = grassRepeat
grassNormalTexture.repeat.y = grassRepeat

grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.repeat.x = grassRepeat
grassRoughnessTexture.repeat.y = grassRepeat

/**
 * House
 */
// Makes a parent for everything
const house = new THREE.Group()

// Walls
const wallsMaterial = new THREE.MeshStandardMaterial({
    // color: parameters.houseWallColor,
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
    // displacementMap: bricksAmbientOcclusionTexture,
    // displacementScale: 0.01
})
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4 /*, 50, 50, 50*/),
  wallsMaterial
)
// Make sure to clone the current uv into the uv2 for lightmaps(in this case ao)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
gui.addColor(parameters, 'houseWallColor').onChange((val) => wallsMaterial.color = new THREE.Color(val))
walls.position.y = 1.25
walls.castShadow = true
walls.receiveShadow = true
house.add(walls)

// Roof
const roofMaterial = new THREE.MeshStandardMaterial({ color: parameters.houseRoofColor })
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  roofMaterial
)
gui.addColor(parameters, 'houseRoofColor').onChange((val) => roofMaterial.color = new THREE.Color(val))
roof.rotation.y = Math.PI * 0.25
// 2.5, because the roof walls are 2.5
// 0.5 because the cone is 1 unit high (and we need to move it up to half its height).
roof.position.y = 2.5 + 0.5
// roof.castShadow = true
roof.receiveShadow = true
house.add(roof)

// Door
const doorMaterial = new THREE.MeshStandardMaterial({
    // color: parameters.houseDoorColor,
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    normalMap: doorNormalTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
})
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  doorMaterial
)
// Make sure to clone the current uv into the uv2 for lightmaps(in this case ao)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
// gui.addColor(parameters, 'houseDoorColor').onChange((val) => doorMaterial.color = new THREE.Color(val))
door.position.y = 1
door.position.z = 2 + 0.01

house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: parameters.bushColor })
gui.addColor(parameters, 'bushColor').onChange((val) => bushMaterial.color = new THREE.Color(val))

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.castShadow = true
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.castShadow = true
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.castShadow = true
bush3.position.set(- 0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.castShadow = true
bush4.position.set(- 1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group()

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: parameters.graveColor })
gui.addColor(parameters, 'graveColor').onChange((val) => graveMaterial.color = new THREE.Color(val))

for(let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6

    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    grave.position.set(x, 0.3, z)

    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.castShadow = true

    graves.add(grave)
}

scene.add(graves)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 1000, 1000),
    new THREE.MeshStandardMaterial({
        // color: '#a9c388',
        map: grassColorTexture,
        aoMap: grassAmbientOcclusioTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
        displacementMap: grassColorTexture,
        displacementScale: 0.03
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true
scene.add(floor)

/**
 * Lights
 */
// Ambient light
// const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
// const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door point light
const doorLight = new THREE.PointLight(parameters.doorLightColor, 1, 7)
gui.addColor(parameters, 'doorLightColor').onChange((val) => doorLight.color = new THREE.Color(val))
gui.add(doorLight, 'intensity').min(0).max(1).step(0.001).name('doorLightIntensity')
doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

scene.add(house)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight(parameters.ghost1Light)
gui.addColor(parameters, 'ghost1Light').onChange((val) => ghost1.color = new THREE.Color(val))
gui.add(ghost1, 'intensity').min(0).max(1).step(0.001).name('ghost1Intensity')
const ghost1LightHelper = new THREE.PointLightHelper(ghost1);
ghost1LightHelper.visible = false
gui.add(ghost1LightHelper, 'visible').name('ghost1Helper')
ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7
scene.add(ghost1, ghost1LightHelper)

const ghost2 = new THREE.PointLight(parameters.ghost2Light)
const ghost2LightHelper = new THREE.PointLightHelper(ghost2);
ghost2LightHelper.visible = false
gui.add(ghost2LightHelper, 'visible').name('ghost2Helper')
gui.addColor(parameters, 'ghost2Light').onChange((val) => ghost2.color = new THREE.Color(val))
gui.add(ghost2, 'intensity').min(0).max(1).step(0.001).name('ghost2Intensity')
ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7
scene.add(ghost2, ghost2LightHelper)

const ghost3 = new THREE.PointLight(parameters.ghost3Light)
const ghost3LightHelper = new THREE.PointLightHelper(ghost3);
ghost3LightHelper.visible = false
gui.add(ghost3LightHelper, 'visible').name('ghost3Helper')
gui.addColor(parameters, 'ghost3Light').onChange((val) => ghost3.color = new THREE.Color(val))
gui.add(ghost3, 'intensity').min(0).max(1).step(0.001).name('ghost3Intensity')
ghost3.castShadow = true
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
scene.add(ghost3, ghost3LightHelper)

/**
 * Fog
 */
const fog = new THREE.Fog(parameters.fogColor, 1, 15)
gui.addColor(parameters, 'fogColor').onChange((val) => {
    fog.color = new THREE.Color(val)
    renderer.setClearColor(val)
})
gui.add(fog, 'near').min(0).max(50).step(0.01).name('fogNear')
gui.add(fog, 'far').min(0).max(50).step(0.01).name('fogFar')
scene.fog = fog

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
renderer.setClearColor(parameters.fogColor)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = -elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
