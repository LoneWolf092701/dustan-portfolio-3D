// src/game/DetailedPlayer.jsx
// ============================================
// DETAILED PLAYER CHARACTER - FIXED VERSION
// Wireframe humanoid character with animations and torch
// ============================================

import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * DETAILED PLAYER COMPONENT
 * A wireframe humanoid character that can move around the dungeon
 */
const DetailedPlayer = ({ 
  position,      // Starting position [x, y, z]
  onMove,        // Callback when player moves
  onInteract,    // Callback when player presses 'E'
  dungeonGrid    // The dungeon grid for collision detection
}) => {
  // ============================================
  // REFS FOR 3D OBJECTS
  // ============================================
  const playerRef = useRef();
  const torsoRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const torchRef = useRef();

  // ============================================
  // STATE FOR KEYBOARD INPUT - FIXED!
  // ============================================
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    e: false
  });

  const [isMoving, setIsMoving] = useState(false);

  // ============================================
  // KEYBOARD EVENT HANDLERS - FIXED!
  // ============================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      
      // Map arrow keys to WASD
      let mappedKey = key;
      if (key === 'arrowup') mappedKey = 'w';
      if (key === 'arrowdown') mappedKey = 's';
      if (key === 'arrowleft') mappedKey = 'a';
      if (key === 'arrowright') mappedKey = 'd';
      
      // Update key state
      if (keys.hasOwnProperty(mappedKey)) {
        setKeys(prev => ({ ...prev, [mappedKey]: true }));
      }
      
      // Handle interaction (E key)
      if (mappedKey === 'e' && onInteract) {
        onInteract();
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      
      // Map arrow keys to WASD
      let mappedKey = key;
      if (key === 'arrowup') mappedKey = 'w';
      if (key === 'arrowdown') mappedKey = 's';
      if (key === 'arrowleft') mappedKey = 'a';
      if (key === 'arrowright') mappedKey = 'd';
      
      if (keys.hasOwnProperty(mappedKey)) {
        setKeys(prev => ({ ...prev, [mappedKey]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onInteract]);

  // ============================================
  // SIMPLE COLLISION CHECK - FIXED!
  // ============================================
  const isWalkable = (x, z) => {
    if (!dungeonGrid) return true; // No grid = no collision
    
    const gridX = Math.floor(x / 2);
    const gridZ = Math.floor(z / 2);
    
    // Bounds check
    if (gridZ < 0 || gridZ >= dungeonGrid.length || 
        gridX < 0 || gridX >= dungeonGrid[0].length) {
      return false;
    }
    
    return dungeonGrid[gridZ][gridX] === 0; // 0 = floor = walkable
  };

  // ============================================
  // ANIMATION & MOVEMENT LOOP - FIXED!
  // ============================================
  useFrame(({ clock }) => {
    if (!playerRef.current) return;

    const time = clock.getElapsedTime();
    const speed = 0.15;
    let moving = false;

    // Get current position
    let newX = playerRef.current.position.x;
    let newZ = playerRef.current.position.z;

    // ========== HANDLE MOVEMENT - SIMPLIFIED ==========
    if (keys.w) {
      newZ -= speed;
      moving = true;
    }
    if (keys.s) {
      newZ += speed;
      moving = true;
    }
    if (keys.a) {
      newX -= speed;
      moving = true;
    }
    if (keys.d) {
      newX += speed;
      moving = true;
    }

    // ========== COLLISION DETECTION ==========
    if (moving) {
      if (isWalkable(newX, newZ)) {
        playerRef.current.position.x = newX;
        playerRef.current.position.z = newZ;
      } else {
        // Try just X movement
        if (isWalkable(newX, playerRef.current.position.z)) {
          playerRef.current.position.x = newX;
        }
        // Try just Z movement
        if (isWalkable(playerRef.current.position.x, newZ)) {
          playerRef.current.position.z = newZ;
        }
        moving = false;
      }
    }

    setIsMoving(moving);

    // ========== ANIMATIONS ==========
    
    // Bob up and down when moving
    if (moving && headRef.current) {
      headRef.current.position.y = 1.9 + Math.sin(time * 8) * 0.05;
      playerRef.current.position.y = 0.5 + Math.abs(Math.sin(time * 8)) * 0.03;
    } else if (headRef.current) {
      headRef.current.position.y = 1.9 + Math.sin(time * 2) * 0.02;
      playerRef.current.position.y = 0.5;
    }

    // Swing arms when walking
    if (moving) {
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(time * 8) * 0.5;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(time * 8 + Math.PI) * 0.5;
      }
      
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 8) * 0.3;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = Math.sin(time * 8 + Math.PI) * 0.3;
      }
    } else {
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }

    // Torch flicker
    if (torchRef.current) {
      const flicker = Math.sin(time * 10) * 0.05 + Math.sin(time * 23) * 0.03;
      torchRef.current.scale.y = 1 + flicker;
    }

    // Notify parent
    if (onMove) {
      onMove({ 
        x: playerRef.current.position.x, 
        y: 0.5, 
        z: playerRef.current.position.z 
      });
    }
  });

  // ============================================
  // RENDER PLAYER MODEL
  // ============================================
  return (
    <group ref={playerRef} position={position}>
      
      {/* TORSO */}
      <mesh ref={torsoRef} position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.9, 0.4]} />
        <meshStandardMaterial 
          color="#ffffff" 
          wireframe 
          wireframeLinewidth={2}
        />
      </mesh>

      {/* HEAD */}
      <mesh ref={headRef} position={[0, 1.9, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ffffff" wireframe />
      </mesh>

      {/* EYES (Glowing) */}
      <mesh position={[-0.15, 1.9, 0.26]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00" 
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0.15, 1.9, 0.26]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00" 
          emissiveIntensity={2}
        />
      </mesh>

      {/* LEFT ARM */}
      <mesh ref={leftArmRef} position={[-0.45, 1.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#ffffff" wireframe />
      </mesh>

      {/* RIGHT ARM */}
      <mesh ref={rightArmRef} position={[0.45, 1.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#ffffff" wireframe />
      </mesh>

      {/* LEFT LEG */}
      <mesh ref={leftLegRef} position={[-0.18, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#ffffff" wireframe />
      </mesh>

      {/* RIGHT LEG */}
      <mesh ref={rightLegRef} position={[0.18, 0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#ffffff" wireframe />
      </mesh>

      {/* TORCH */}
      <group position={[0.7, 1.4, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        
        <mesh ref={torchRef} position={[0, 0.15, 0]}>
          <coneGeometry args={[0.15, 0.3, 8]} />
          <meshStandardMaterial 
            color="#ff6600" 
            emissive="#ff6600" 
            emissiveIntensity={1.5}
          />
        </mesh>
        
        {/* BRIGHTER TORCH LIGHT - FIXED! */}
        <pointLight 
          position={[0, 0.2, 0]} 
          intensity={5} 
          distance={15} 
          color="#ff6600"
          castShadow
        />
      </group>

      {/* DIRECTION INDICATOR */}
      <mesh position={[0, 0.6, -0.5]} castShadow>
        <coneGeometry args={[0.15, 0.3, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

export default DetailedPlayer;