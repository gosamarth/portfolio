import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A deep field of drifting points that gives the journey a sense of speed.
 * Wrapped in a long tunnel along -z so the camera always has stars ahead.
 */
export function Starfield({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 26 // ring radius
      const a = Math.random() * Math.PI * 2
      arr[i * 3] = Math.cos(a) * r
      arr[i * 3 + 1] = Math.sin(a) * r * 0.6
      arr[i * 3 + 2] = -Math.random() * 190 + 12 // spread along the tunnel
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        color="#9fd8ff"
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}
