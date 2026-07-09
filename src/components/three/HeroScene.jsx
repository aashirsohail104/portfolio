import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'

function FloatingMesh({ mouse }) {
  const meshRef = useRef()
  const lightRef = useRef()

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
      meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2
    }
    if (lightRef.current) {
      lightRef.current.position.x = (mouse.current.x - 0.5) * 6
      lightRef.current.position.y = (mouse.current.y - 0.5) * 6
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight ref={lightRef} position={[2, 3, 4]} intensity={1.5} color="#00E5FF" />
      <directionalLight position={[-2, -1, 3]} intensity={0.8} color="#7C3AED" />
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 1]} />
          <MeshPhysicalMaterial
            color="#00E5FF"
            wireframe
            transparent
            opacity={0.15}
            metalness={0.3}
            roughness={0.8}
          />
        </mesh>
      </Float>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[2, -1, -1]}>
          <torusKnotGeometry args={[0.6, 0.2, 64, 8]} />
          <MeshPhysicalMaterial
            color="#7C3AED"
            wireframe
            transparent
            opacity={0.1}
            metalness={0.2}
            roughness={0.9}
          />
        </mesh>
      </Float>
    </>
  )
}

export default function HeroScene({ mouse }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <FloatingMesh mouse={mouse} />
    </Canvas>
  )
}