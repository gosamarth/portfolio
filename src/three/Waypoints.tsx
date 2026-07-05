import { Float } from '@react-three/drei'
import type { ReactNode } from 'react'

/** z-position of each journey stop. Index maps to a scroll section. */
export const WAYPOINT_Z = [0, -16, -32, -48, -64]

function Stop({
  z,
  x,
  children,
}: {
  z: number
  x: number
  children: ReactNode
}) {
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.8}>
      <group position={[x, 0, z]}>{children}</group>
    </Float>
  )
}

/**
 * Five distinct glowing objects placed along the tunnel — one per section.
 * They sit slightly off-center, alternating sides, so content has room.
 */
export function Waypoints() {
  return (
    <>
      {/* Home — icosahedron */}
      <Stop z={WAYPOINT_Z[0]} x={2.6}>
        <mesh>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial
            color="#6ee7ff"
            emissive="#164e63"
            metalness={0.6}
            roughness={0.2}
            flatShading
          />
        </mesh>
      </Stop>

      {/* About — torus knot */}
      <Stop z={WAYPOINT_Z[1]} x={-2.8}>
        <mesh>
          <torusKnotGeometry args={[0.9, 0.28, 160, 24]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#3b0764"
            metalness={0.5}
            roughness={0.25}
          />
        </mesh>
      </Stop>

      {/* Work — octahedron cluster */}
      <Stop z={WAYPOINT_Z[2]} x={2.9}>
        <mesh>
          <octahedronGeometry args={[1.35, 0]} />
          <meshStandardMaterial
            color="#f0abfc"
            emissive="#701a75"
            metalness={0.4}
            roughness={0.3}
            flatShading
          />
        </mesh>
      </Stop>

      {/* Skills — dodecahedron */}
      <Stop z={WAYPOINT_Z[3]} x={-2.7}>
        <mesh>
          <dodecahedronGeometry args={[1.25, 0]} />
          <meshStandardMaterial
            color="#7dd3fc"
            emissive="#0c4a6e"
            metalness={0.7}
            roughness={0.15}
            flatShading
          />
        </mesh>
      </Stop>

      {/* Contact — glowing sphere */}
      <Stop z={WAYPOINT_Z[4]} x={2.4}>
        <mesh>
          <sphereGeometry args={[1.2, 48, 48]} />
          <meshStandardMaterial
            color="#c4b5fd"
            emissive="#4c1d95"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </Stop>
    </>
  )
}
