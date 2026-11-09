import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  ContactShadows,
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

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
      position={[-0.28, 0.7, 0]}
      scale={2.4}
    >
      <primitive object={model.scene} />
    </group>
  );
}

export default function Avatar3D() {
  const reducedMotion = useReducedMotion();
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 950px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 950px)");
    const resize = () => setMobile(query.matches);
    query.addEventListener("change", resize);
    return () => {
      query.removeEventListener("change", resize);
    };
  }, []);
  return (
    <div className="avatar3d" role="img" aria-label="Coelho 3D interativo">
      <Canvas
        camera={{
          position: [0, 0.35, 8],
          fov: 48,
        }}
        dpr={mobile ? 1 : [1, 1.5]}
        frameloop={reducedMotion ? "demand" : "always"}
        style={{ touchAction: "pan-y" }}
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
          speed={reducedMotion ? 0 : 2}
          rotationIntensity={reducedMotion ? 0 : 0.15}
          floatIntensity={reducedMotion ? 0 : 0.35}
        >
          <Bunny />
        </Float>

        <mesh position={[-0.28, -1.60, 0]}>
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
          count={reducedMotion ? 0 : mobile ? 24 : 80}
          size={2}
          speed={0.3}
          scale={5}
          color="#d8b4fe"
        />

        <ContactShadows
          position={[0, -2.10, 0]}
          frames={mobile || reducedMotion ? 1 : Infinity}
          resolution={mobile ? 128 : 512}
          blur={2.5}
          opacity={0.45}
          scale={4}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/cute_rabbit.glb");
