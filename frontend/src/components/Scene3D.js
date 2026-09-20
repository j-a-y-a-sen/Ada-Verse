import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';

/*
  ADAverse Home 3D model
  - Replaces the old purple abstract orbital model.
  - Uses the same cream / forest-green palette as the new Home design.
  - No external 3D model or asset is required.
*/

function LaptopScreen() {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.45) * 0.035;
    ref.current.rotation.x = -0.10 + Math.sin(t * 0.35) * 0.012;
  });

  return (
    <group ref={ref} position={[0, 1.0, 0]}>
      {/* Laptop display frame */}
      <mesh>
        <boxGeometry args={[3.7, 2.35, 0.16]} />
        <meshStandardMaterial
          color="#18392B"
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>

      {/* Cream display bezel */}
      <mesh position={[0, 0, 0.095]}>
        <boxGeometry args={[3.35, 1.98, 0.035]} />
        <meshStandardMaterial color="#DAD7CD" roughness={0.65} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[3.08, 1.72, 0.025]} />
        <meshStandardMaterial
          color="#EEF0E7"
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>

      {/* Screen top bar */}
      <mesh position={[-0.92, 0.65, 0.145]}>
        <boxGeometry args={[1.05, 0.12, 0.02]} />
        <meshStandardMaterial color="#A3B18A" roughness={0.6} />
      </mesh>

      {/* Screen side menu */}
      <mesh position={[-1.12, 0.05, 0.145]}>
        <boxGeometry args={[0.42, 1.0, 0.02]} />
        <meshStandardMaterial color="#DAD7CD" roughness={0.6} />
      </mesh>

      {[0.48, 0.18, -0.12, -0.42].map((y, i) => (
        <mesh key={i} position={[-1.12, y, 0.17]}>
          <boxGeometry args={[0.20, 0.07, 0.02]} />
          <meshStandardMaterial color="#588157" roughness={0.5} />
        </mesh>
      ))}

      {/* Algorithm chart bars */}
      {[
        [-0.35, 0.18, 0.38],
        [0.05, 0.38, 0.78],
        [0.45, 0.10, 0.22],
        [0.85, 0.52, 1.05],
      ].map(([x, y, h], i) => (
        <mesh key={i} position={[x, -0.38 + h / 2, 0.17]}>
          <boxGeometry args={[0.25, h, 0.05]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#3A5A40' : '#588157'}
            roughness={0.45}
          />
        </mesh>
      ))}

      {/* Chart baseline */}
      <mesh position={[0.35, -0.38, 0.17]}>
        <boxGeometry args={[1.65, 0.025, 0.035]} />
        <meshStandardMaterial color="#344E41" />
      </mesh>

      {/* Small chart label */}
      <mesh position={[0.88, 0.55, 0.17]}>
        <boxGeometry args={[0.45, 0.08, 0.025]} />
        <meshStandardMaterial color="#18392B" />
      </mesh>

      {/* Camera */}
      <mesh position={[0, 0.98, 0.19]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#0D1B16" />
      </mesh>
    </group>
  );
}

function LaptopBase() {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.45) * 0.035;
  });

  return (
    <group ref={ref} position={[0, -0.35, 0]}>
      {/* Base */}
      <mesh rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[4.15, 0.25, 2.65]} />
        <meshStandardMaterial
          color="#A3B18A"
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Keyboard panel */}
      <mesh position={[0, 0.14, -0.12]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[3.65, 0.055, 1.45]} />
        <meshStandardMaterial color="#DAD7CD" roughness={0.7} />
      </mesh>

      {/* Keyboard rows */}
      {[0.43, 0.15, -0.13, -0.41].map((z, row) => (
        <group key={row}>
          {Array.from({ length: row === 3 ? 7 : 9 }).map((_, i) => {
            const count = row === 3 ? 7 : 9;
            const width = 2.95 / count;
            return (
              <mesh
                key={i}
                position={[
                  -1.475 + width * i + width / 2,
                  0.19,
                  z,
                ]}
              >
                <boxGeometry args={[width - 0.035, 0.035, 0.18]} />
                <meshStandardMaterial
                  color={i === 1 && row === 0 ? '#588157' : '#344E41'}
                  roughness={0.65}
                />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Trackpad */}
      <mesh position={[0, 0.20, 0.55]}>
        <boxGeometry args={[1.0, 0.035, 0.62]} />
        <meshStandardMaterial color="#EEF0E7" roughness={0.7} />
      </mesh>

      {/* Front edge */}
      <mesh position={[0, -0.13, 1.30]}>
        <boxGeometry args={[3.9, 0.06, 0.08]} />
        <meshStandardMaterial color="#588157" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Laptop() {
  return (
    <group rotation={[0, -0.10, 0]} scale={0.92}>
      <LaptopScreen />
      <LaptopBase />
    </group>
  );
}

function Book({ position, rotation, scale = 1, color = '#18392B', labelColor = '#DAD7CD' }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <boxGeometry args={[2.15, 0.30, 1.15]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[1.88, 0.025, 0.92]} />
        <meshStandardMaterial color={labelColor} roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.18, 0.47]}>
        <boxGeometry args={[1.25, 0.025, 0.025]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Books() {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.8) * 0.035;
    ref.current.rotation.y = Math.sin(t * 0.35) * 0.025;
  });

  return (
    <group ref={ref} position={[2.55, -1.0, 0.05]} rotation={[0, -0.08, -0.03]}>
      <Book position={[0, 0, 0]} rotation={[0, 0, 0.02]} color="#18392B" />
      <Book position={[0.08, 0.32, 0]} rotation={[0, 0, -0.03]} color="#3A5A40" />
      <Book position={[-0.03, 0.64, 0]} rotation={[0, 0, 0.015]} color="#588157" />
    </group>
  );
}

function CoffeeCup() {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <group ref={ref} position={[3.05, -1.18, 0.72]}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.34, 0.62, 48]} />
        <meshStandardMaterial color="#18392B" roughness={0.65} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
        <torusGeometry args={[0.42, 0.075, 16, 48]} />
        <meshStandardMaterial color="#A3B18A" roughness={0.6} />
      </mesh>

      <mesh position={[0.47, 0, 0]}>
        <torusGeometry args={[0.20, 0.065, 16, 32]} />
        <meshStandardMaterial color="#18392B" roughness={0.65} />
      </mesh>

      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.015, 48]} />
        <meshStandardMaterial color="#3A5A40" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Notebook() {
  return (
    <group position={[1.05, -1.12, 1.05]} rotation={[-0.04, 0.12, -0.10]}>
      <mesh>
        <boxGeometry args={[1.65, 0.12, 1.15]} />
        <meshStandardMaterial color="#DAD7CD" roughness={0.85} />
      </mesh>

      {[0.22, -0.02, -0.26].map((z, i) => (
        <mesh key={i} position={[0.05, 0.075, z]}>
          <boxGeometry args={[1.05, 0.018, 0.025]} />
          <meshStandardMaterial color="#588157" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Plant() {
  return (
    <group position={[3.0, -0.65, -0.15]} scale={0.82}>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.38, 0.48, 0.65, 32]} />
        <meshStandardMaterial color="#18392B" roughness={0.75} />
      </mesh>

      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.045, 0.06, 1.45, 12]} />
        <meshStandardMaterial color="#3A5A40" roughness={0.8} />
      </mesh>

      <mesh position={[-0.25, 0.72, 0]} rotation={[0, 0, -0.45]} scale={[0.42, 0.16, 0.08]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#588157" roughness={0.8} />
      </mesh>

      <mesh position={[0.28, 0.95, 0]} rotation={[0, 0, 0.45]} scale={[0.45, 0.17, 0.08]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#3A5A40" roughness={0.8} />
      </mesh>

      <mesh position={[0.08, 1.20, 0]} rotation={[0, 0, 0.05]} scale={[0.38, 0.15, 0.07]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#A3B18A" roughness={0.8} />
      </mesh>
    </group>
  );
}

function FloatingDots() {
  const dots = [
    [-3.1, 1.8, 0.2],
    [-3.3, -0.7, 0.4],
    [3.25, 1.9, -0.2],
    [2.3, 2.15, 0.2],
    [-2.4, 1.25, 0.6],
  ];

  return (
    <>
      {dots.map((position, i) => (
        <Float key={i} speed={1 + i * 0.15} floatIntensity={0.25}>
          <mesh position={position}>
            <sphereGeometry args={[0.055 + (i % 2) * 0.025, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#588157' : '#A3B18A'}
              roughness={0.55}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Scene3D() {
  return (
    <div
      style={{
        width: '100%',
        height: '520px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Canvas
        camera={{
          position: [0, 0.15, 9],
          fov: 48,
        }}
        style={{
          background: 'transparent',
        }}
      >
        <ambientLight intensity={1.2} />

        <directionalLight
          position={[4, 7, 6]}
          intensity={2.2}
          color="#FFF8E8"
        />

        <pointLight
          position={[-4, 3, 4]}
          intensity={1.8}
          color="#A3B18A"
        />

        <pointLight
          position={[4, -2, 2]}
          intensity={1.4}
          color="#588157"
        />

        <Float
          speed={1.15}
          floatIntensity={0.18}
          rotationIntensity={0.12}
        >
          <Laptop />
        </Float>

        <Float
          speed={0.8}
          floatIntensity={0.22}
          rotationIntensity={0.08}
        >
          <Books />
        </Float>

        <Float
          speed={0.9}
          floatIntensity={0.18}
          rotationIntensity={0.10}
        >
          <CoffeeCup />
        </Float>

        <Float
          speed={0.7}
          floatIntensity={0.12}
          rotationIntensity={0.06}
        >
          <Notebook />
        </Float>

        <Float
          speed={0.65}
          floatIntensity={0.15}
          rotationIntensity={0.04}
        >
          <Plant />
        </Float>

        <FloatingDots />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35}
        />
      </Canvas>
    </div>
  );
}

export default Scene3D;
