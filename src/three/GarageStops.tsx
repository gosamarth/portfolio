import { Image as DreiImage, Float, useVideoTexture } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cars, type Car } from '../data/cars'
import { PAGE_DEPTH, zAtPage, carPageStart } from '../journey'

const SCREEN_W = 9.6
const SCREEN_H = SCREEN_W * (9 / 16)
const STAGE_AHEAD = PAGE_DEPTH * 0.72 // how far ahead of the camera stop the stage sits

/** Distance-based visibility: far ghosts in as a teaser, near fades before fly-through. */
function screenOpacity(dist: number) {
  const fadeInFar = 24
  const fullFar = 17
  const fullNear = 4.5
  const fadeOutNear = 1.6
  if (dist >= fadeInFar || dist <= fadeOutNear) return 0
  if (dist > fullFar) return 1 - (dist - fullFar) / (fadeInFar - fullFar)
  if (dist < fullNear) return (dist - fadeOutNear) / (fullNear - fadeOutNear)
  return 1
}

/** Neon portal ring framing each car stage. */
function PortalRing({ z, color }: { z: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 2.2 + Math.sin(state.clock.elapsedTime * 2 + z) * 0.6
    }
  })
  return (
    <mesh ref={ref} position={[0, 1.4, z]}>
      <torusGeometry args={[7.4, 0.055, 12, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.2}
        toneMapped={false}
      />
    </mesh>
  )
}

/** Turntable video screen — plays only when the camera is near its stage. */
function VideoScreen({ car, z }: { car: Car; z: number }) {
  const texture = useVideoTexture(car.video!, {
    muted: true,
    loop: true,
    start: false,
    crossOrigin: 'anonymous',
  })
  const matRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ camera }) => {
    const dist = Math.abs(camera.position.z - z)
    const o = screenOpacity(dist)
    if (matRef.current) matRef.current.opacity = o
    const video = texture.image as HTMLVideoElement
    if (video) {
      if (dist < 22 && video.paused) video.play().catch(() => {})
      else if (dist >= 22 && !video.paused) video.pause()
    }
  })

  return (
    <mesh position={[0, 1.55, z]}>
      <planeGeometry args={[SCREEN_W, SCREEN_H]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        toneMapped={false}
        transparent
        opacity={0}
      />
    </mesh>
  )
}

function ImageScreen({ car, z }: { car: Car; z: number }) {
  const imgRef = useRef<any>(null)
  useFrame(({ camera }) => {
    const dist = Math.abs(camera.position.z - z)
    if (imgRef.current?.material) {
      imgRef.current.material.transparent = true
      imgRef.current.material.opacity = screenOpacity(dist)
    }
  })
  return (
    <DreiImage
      ref={imgRef}
      url={car.image}
      scale={[SCREEN_W, SCREEN_H]}
      position={[0, 1.55, z]}
      radius={0.12}
      toneMapped={false}
    />
  )
}

/** One car "stage": floating screen (turntable video for heroes) + under-glow + portal. */
function CarStage({ carIndex }: { carIndex: number }) {
  const car = cars[carIndex]
  const page = carPageStart + carIndex
  const z = zAtPage(page) - STAGE_AHEAD
  const owned = car.status === 'owned'
  const accent = owned ? '#6ee7ff' : '#f0abfc'

  const glowRef = useRef<THREE.Mesh>(null)
  const [videoNear, setVideoNear] = useState(false)
  useFrame(({ camera }) => {
    const dist = Math.abs(camera.position.z - z)
    if (glowRef.current) {
      const m = glowRef.current.material as THREE.MeshStandardMaterial
      m.transparent = true
      m.opacity = screenOpacity(dist)
    }
    // mount the video element only when approaching — keeps initial load light
    if (car.video && !videoNear && dist < 30) setVideoNear(true)
  })

  return (
    <group>
      <PortalRing z={z - 1.4} color={accent} />

      <Float speed={1.1} rotationIntensity={0.04} floatIntensity={0.35}>
        {car.video && videoNear ? (
          <Suspense fallback={<ImageScreen car={car} z={z} />}>
            <VideoScreen car={car} z={z} />
          </Suspense>
        ) : (
          <ImageScreen car={car} z={z} />
        )}
      </Float>

      {/* Under-glow bar beneath the screen — reflects in the floor */}
      <mesh ref={glowRef} position={[0, -0.98, z]}>
        <boxGeometry args={[SCREEN_W * 0.85, 0.05, 0.05]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Stage lights for this stop */}
      <pointLight position={[-5, 3.5, z + 3]} intensity={26} color="#6ee7ff" />
      <pointLight position={[5, 2.5, z + 3]} intensity={26} color="#d946ef" />
    </group>
  )
}

export function GarageStops() {
  return (
    <>
      {cars.map((c, i) => (
        <CarStage key={c.slug} carIndex={i} />
      ))}
    </>
  )
}
