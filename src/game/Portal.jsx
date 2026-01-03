// src/game/Portal.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Text } from "@react-three/drei";

const Portal = ({ position, label, onInteract, isNear }) => {
  const portalRef = useRef();

  useFrame(({ clock }) => {
    if (portalRef.current) {
      portalRef.current.rotation.y = clock.getElapsedTime();
      portalRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.2 + 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Portal Frame */}
      <Box args={[2, 3, 0.2]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      
      {/* Portal Energy */}
      <Box ref={portalRef} args={[1.5, 2.5, 0.1]} position={[0, 1.5, 0]}>
        <meshStandardMaterial 
          color={isNear ? "#00ff00" : "#ffffff"} 
          wireframe 
          transparent 
          opacity={0.6}
        />
      </Box>

      {/* Label */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Interaction Prompt */}
      {isNear && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.2}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
        >
          [E] to Enter
        </Text>
      )}

      {/* Base platform */}
      <Box args={[2.5, 0.2, 2.5]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>
    </group>
  );
};

export default Portal;