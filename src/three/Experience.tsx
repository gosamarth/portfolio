import { MeshReflectorMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useRef } from 'react'
import * as THREE from 'three'
import { Starfield } from './Starfield'
import { SpeedTunnel } from './SpeedTunnel'
import { GarageStops } from './GarageStops'
import { PAGES, PAGE_DEPTH, CAM_START_Z } from '../journey'
import { scrollState } from '../scrollBridge'

const CAM_TRAVEL = (PAGES - 1) * PAGE_DEPTH

/** Reflective showroom floor running the full length of the journey. */
function Floor() {
  const length = CAM_TRAVEL + 40
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.2, CAM_START_Z - length / 2 + 10]}
    >
      <planeGeometry args={[44, length]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={38}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#07080d"
        metalness={0.55}
        mirror={0.75}
      />
    </mesh>
  )
}

export function Experience() {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const o = scrollState.offset
    const desiredZ = CAM_START_Z - o * CAM_TRAVEL
    const px = state.pointer.x * 1.1
    const py = state.pointer.y * 0.7

    const ease = 1 - Math.pow(0.0015, delta)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, ease)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, px, ease)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, py * 0.6 + 0.4, ease)

    target.current.set(px * 0.3, py * 0.3 + 0.5, camera.position.z - 10)
    camera.lookAt(target.current)
  })

  return (
    <>
      <color attach="background" args={['#05060a']} />
      <fog attach="fog" args={['#05060a', 6, 30]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 6]} intensity={0.9} />

      <Starfield count={500} />
      <SpeedTunnel />
      <Floor />
      <GarageStops />

      <EffectComposer>
        <Bloom intensity={1.0} luminanceThreshold={0.28} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </>
  )
}
