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

const donuts = []
const donutRandom = []

let text

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()
fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  (font) => {
      const textGeometry = new THREE.TextGeometry(
        '/assisrMatheus',
        {
            font,
            size: 0.3,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        }
      )

      /**
       * Manually center
       */
      // textGeometry.computeBoundingBox()
      // textGeometry.translate(
      //   - textGeometry.boundingBox.max.x * 0.5,
      //   - textGeometry.boundingBox.max.y * 0.5,
      //   - textGeometry.boundingBox.max.z * 0.5
      // )

      // textGeometry.translate(
      //   - (textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
      //   - (textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
      //   - (textGeometry.boundingBox.max.z - 0.03) * 0.5  // Subtract bevel thickness
      // )

      textGeometry.center()

      /**
       * Matcap
       */
      const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
      const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

      // const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
      text = new THREE.Mesh(textGeometry, textMaterial)
      scene.add(text)

      // const donutMaterial = new THREE.MeshMatcapMaterial({ matcap })
      const donutMaterial = textMaterial
      const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

      for(let i = 0; i < 100; i++)
      {
          const donut = new THREE.Mesh(donutGeometry, donutMaterial)

          donut.position.x = (Math.random() - 0.5) * 10
          donut.position.y = (Math.random() - 0.5) * 10
          donut.position.z = (Math.random() - 0.5) * 10

          donut.rotation.x = Math.random() * Math.PI
          donut.rotation.y = Math.random() * Math.PI

          const scale = Math.random()
          donut.scale.set(scale, scale, scale)

          donutRandom.push(Math.random()*(0.7-0.05+1)+0.05)
          donuts.push(donut)
          scene.add(donut)
      }
  }
)

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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

const parameters = {
    animMult: 0.9
}

gui.add(parameters, 'animMult').min(0).max(3).step(0.001)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const deltaTime = clock.getDelta()
    const elapsedTime = clock.getElapsedTime() + 131231

    donuts.forEach((donut, i) => {
        donut.rotation.x += deltaTime * parameters.animMult * 1.2 * donutRandom[i]
        donut.rotation.y += deltaTime * parameters.animMult * 1.2 * donutRandom[i]

        donut.position.x += (Math[donutRandom[i] > 0.45 ? 'sin' : 'cos'](elapsedTime * donutRandom[i]) * 0.002) * parameters.animMult
        donut.position.y += (Math[donutRandom[i] > 0.45 ? 'cos' : 'sin'](elapsedTime * donutRandom[i]) * 0.002) * parameters.animMult
    })

    // const rand = Math.random()*(0.7-0.05+1)+0.05;
    camera.position.x += (Math.cos(elapsedTime)/2) * parameters.animMult * .01
    camera.position.y += (Math.sin(elapsedTime)/2) * parameters.animMult * .01

    if(text)
        camera.lookAt(text)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
