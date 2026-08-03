import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  ContactShadows,
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { useRef } from "react";

function Bunny() {
  const model = useGLTF("/models/cute_rabbit.glb");
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;

    const rotacaoBase = 0;

    const rotacaoY = rotacaoBase + state.pointer.x * 0.25;
    const rotacaoX = -state.pointer.y * 0.08;

    group.current.rotation.y +=
      (rotacaoY - group.current.rotation.y) * 0.05;

    group.current.rotation.x +=
      (rotacaoX - group.current.rotation.x) * 0.05;
  });

  return (
    <group
      ref={group}
      rotation={[0, 0, 0]}
      position={[-0.28, -0.35, 0]}
      scale={2.4}
    >
      <primitive object={model.scene} />
    </group>
  );
}

export default function Avatar3D() {
  return (
    <div className="avatar3d">
      <Canvas
        camera={{
          position: [0, 0.35, 8,8],
          fov: 48,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.5} />

        <directionalLight
          intensity={2}
          position={[4, 5, 4]}
        />

        <pointLight
          intensity={25}
          position={[0, 2, 2]}
          color="#a855f7"
        />

        <Environment preset="city" />

        <Float
          speed={2}
          rotationIntensity={0.15}
          floatIntensity={0.35}
        >
          <Bunny />
        </Float>

        <mesh position={[-0.28, -2.65, 0]}>
          <cylinderGeometry args={[1, 1, 0.12, 64]} />

          <meshStandardMaterial
            color="#c084fc"
            emissive="#7c3aed"
            emissiveIntensity={0.35}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>

        <Sparkles
          count={80}
          size={2}
          speed={0.3}
          scale={5}
          color="#d8b4fe"
        />

        <ContactShadows
          position={[0, -2.95, 0]}
          blur={2.5}
          opacity={0.45}
          scale={5}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/cute_rabbit.glb");
