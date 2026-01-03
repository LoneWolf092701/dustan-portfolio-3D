// src/game/Player.jsx
import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";

const Player = ({ position, onMove, onInteract }) => {
  const playerRef = useRef();
  const keys = useRef({ w: false, a: false, s: false, d: false, e: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key)) {
        keys.current[key] = true;
        if (key === 'e') onInteract();
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(key)) {
        keys.current[key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onInteract]);

  useFrame(() => {
    if (!playerRef.current) return;

    const speed = 0.1;
    let newX = playerRef.current.position.x;
    let newZ = playerRef.current.position.z;

    if (keys.current.w) newZ -= speed;
    if (keys.current.s) newZ += speed;
    if (keys.current.a) newX -= speed;
    if (keys.current.d) newX += speed;

    // Boundary checks
    newX = Math.max(-15, Math.min(15, newX));
    newZ = Math.max(-15, Math.min(15, newZ));

    playerRef.current.position.x = newX;
    playerRef.current.position.z = newZ;

    onMove({ x: newX, y: 0.5, z: newZ });
  });

  return (
    <group ref={playerRef} position={position}>
      {/* Body */}
      <Box args={[0.6, 1.2, 0.4]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>
      
      {/* Head */}
      <Box args={[0.4, 0.4, 0.4]} position={[0, 1.4, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>
      
      {/* Direction indicator */}
      <Box args={[0.2, 0.2, 0.6]} position={[0, 0.6, -0.5]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
    </group>
  );
};

export default Player;