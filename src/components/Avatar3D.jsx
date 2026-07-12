import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import { Suspense } from "react";

function Model() {
  const { scene } = useGLTF("/models/cute_rabbit.glb"); 
  return (
    <Center>
      <primitive object={scene} scale={1.2} /> {/* Reduzi um pouco a escala para não cortar as orelhas */}
    </Center>
  );
}

export default function Avatar3D() {
  return (
    <div className="avatar3d" style={{ width: "100%", height: "750px" }}>

      <Canvas camera={{ position:[0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.5} />
        
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <pointLight position={[-5, -5, -5]} intensity={1} />


        <Suspense fallback={null}>
          <Model />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={1.5} 
        />
      </Canvas>
    </div>
  );
}
