import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, OrbitControls, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';

function PulsingCore() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.08);
    ref.current.rotation.y = t * 0.3;
    ref.current.rotation.z = t * 0.1;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[1.3, 128, 128]} />
      <MeshDistortMaterial
        color="#5b21b6"
        distort={0.7}
        speed={3}
        roughness={0}
        metalness={1}
        emissive="#7c3aed"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

function OrbitingSphere({ radius, speed, size, color, offset }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.7) * radius * 0.5;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.rotation.x = t;
    ref.current.rotation.y = t * 0.7;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        roughness={0}
        metalness={1}
      />
    </mesh>
  );
}

function OrbitingRing({ radius, speed, offset, color, tilt }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.5) * radius * 0.4;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.rotation.x = t * 0.5 + tilt;
    ref.current.rotation.z = t * 0.3;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.45, 0.06, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5}
        metalness={1}
        roughness={0}
      />
    </mesh>
  );
}

function OrbitingCrystal({ radius, speed, offset, color }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.6) * radius * 0.6;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.rotation.x = t * 0.8;
    ref.current.rotation.y = t;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.3]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        roughness={0}
        metalness={1}
      />
    </mesh>
  );
}

function RotatingOuterRing({ tilt, color, speed }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.z = state.clock.elapsedTime * speed;
    ref.current.rotation.x = tilt;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.8, 0.025, 16, 200]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        metalness={1}
        roughness={0}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function WobblyMoon({ position, color, speed }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * speed;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.6;
  });
  return (
    <Float speed={2} floatIntensity={2} rotationIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.4, 64, 64]} />
        <MeshWobbleMaterial
          color={color}
          factor={0.5}
          speed={3}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0}
          metalness={1}
        />
      </mesh>
    </Float>
  );
}

function EnergyParticle({ index, count }) {
  const ref = useRef();
  const angle = (index / count) * Math.PI * 2;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const currentAngle = angle + t * 0.5;
    const r = 2.2 + Math.sin(t + index) * 0.3;
    ref.current.position.x = Math.cos(currentAngle) * r;
    ref.current.position.y = Math.sin(currentAngle * 2) * 0.8;
    ref.current.position.z = Math.sin(currentAngle) * r;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial
        color="#c4b5fd"
        emissive="#a855f7"
        emissiveIntensity={3}
      />
    </mesh>
  );
}

function EnergyParticles() {
  const count = 30;

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <EnergyParticle key={i} index={i} count={count} />
      ))}
    </>
  );
}

function Scene3D() {
  return (
    <div style={{ width: '100%', height: '520px', position: 'relative', zIndex: 1 }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }} style={{ background: 'transparent' }}>
        {/* Rich lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 4]} intensity={4} color="#a855f7" />
        <pointLight position={[5, 5, 2]} intensity={3} color="#7c3aed" />
        <pointLight position={[-5, -3, -2]} intensity={2} color="#c4b5fd" />
        <pointLight position={[0, -5, 0]} intensity={2} color="#6d28d9" />
        <pointLight position={[3, 2, -3]} intensity={1.5} color="#ddd6fe" />

        <Stars radius={80} depth={50} count={3000} factor={3} fade speed={0.5} />

        {/* Pulsing distorted core */}
        <PulsingCore />

        {/* Outer glowing orbit rings */}
        <RotatingOuterRing tilt={0} color="#8b5cf6" speed={0.4} />
        <RotatingOuterRing tilt={Math.PI / 3} color="#a855f7" speed={-0.3} />
        <RotatingOuterRing tilt={Math.PI / 6} color="#c4b5fd" speed={0.2} />

        {/* Orbiting spheres */}
        <OrbitingSphere radius={2.2} speed={0.6} size={0.25} color="#a855f7" offset={0} />
        <OrbitingSphere radius={2.2} speed={0.6} size={0.2} color="#c4b5fd" offset={2.1} />
        <OrbitingSphere radius={2.2} speed={0.6} size={0.18} color="#7c3aed" offset={4.2} />
        <OrbitingSphere radius={1.8} speed={-0.8} size={0.22} color="#ddd6fe" offset={1} />
        <OrbitingSphere radius={1.8} speed={-0.8} size={0.15} color="#8b5cf6" offset={3.5} />

        {/* Orbiting rings */}
        <OrbitingRing radius={2.5} speed={0.5} offset={0} color="#a855f7" tilt={0} />
        <OrbitingRing radius={2.5} speed={0.5} offset={3.14} color="#7c3aed" tilt={1} />

        {/* Orbiting crystals */}
        <OrbitingCrystal radius={3} speed={0.4} offset={0} color="#c4b5fd" />
        <OrbitingCrystal radius={3} speed={0.4} offset={2} color="#a855f7" />
        <OrbitingCrystal radius={3} speed={0.4} offset={4} color="#8b5cf6" />

        {/* Wobbling moons */}
        <WobblyMoon position={[-2.5, 1.5, 0]} color="#7c3aed" speed={0.8} />
        <WobblyMoon position={[2.5, -1.5, -0.5]} color="#a855f7" speed={1} />
        <WobblyMoon position={[0, 2.8, 0]} color="#6d28d9" speed={0.6} />

        {/* Energy particle ring */}
        <EnergyParticles />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}

export default Scene3D;