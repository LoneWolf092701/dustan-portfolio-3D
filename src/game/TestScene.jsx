// src/game/TestScene.jsx
// SIMPLE TEST SCENE - Use this to verify Three.js is working
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

function RotatingCube() {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#00ff00" wireframe />
    </mesh>
  );
}

const TestScene = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000000' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#222222" />
        </mesh>

        {/* Test Cube */}
        <RotatingCube />

        <OrbitControls />
      </Canvas>

      {/* Test Text Overlay */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '24px',
        pointerEvents: 'none',
        textAlign: 'center'
      }}>
        <div>THREE.JS TEST SCENE</div>
        <div style={{ fontSize: '14px', marginTop: '10px' }}>
          If you see a rotating green cube, Three.js is working!
        </div>
      </div>
    </div>
  );
};

export default TestScene;