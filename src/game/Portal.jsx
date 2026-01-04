// src/game/Portal.jsx
// ============================================
// PORTAL COMPONENT
// Animated gateway to different sections of the portfolio
// ============================================

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Text, Torus } from "@react-three/drei";

/**
 * PORTAL COMPONENT
 * An animated wireframe portal that players can enter
 * 
 * Features:
 * - Rotating animation
 * - Floating/bobbing motion
 * - Pulsing energy rings
 * - Interactive prompt when player is near
 * - Color-coded by destination
 */
const Portal = ({ 
  position,      // [x, y, z] world position
  label,         // Portal name (e.g., "ABOUT", "PROJECTS")
  color = '#00ff00', // Portal color
  onInteract,    // Function to call when entered
  isNear = false // Is player nearby?
}) => {
  
  // ============================================
  // REFS FOR ANIMATED PARTS
  // ============================================
  const portalFrameRef = useRef();  // Outer frame
  const portalEnergyRef = useRef(); // Inner energy field
  const ring1Ref = useRef();        // Orbiting ring 1
  const ring2Ref = useRef();        // Orbiting ring 2
  const ring3Ref = useRef();        // Orbiting ring 3
  const baseRef = useRef();         // Base platform

  // ============================================
  // ANIMATION LOOP
  // Runs every frame to animate portal
  // ============================================
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // ========== PORTAL FRAME ROTATION ==========
    if (portalFrameRef.current) {
      portalFrameRef.current.rotation.y = time * 0.3; // Slow rotation
    }

    // ========== ENERGY FIELD ANIMATION ==========
    if (portalEnergyRef.current) {
      // Faster rotation in opposite direction
      portalEnergyRef.current.rotation.y = -time * 0.8;
      
      // Floating/bobbing motion
      portalEnergyRef.current.position.y = 1.5 + Math.sin(time * 2) * 0.2;
      
      // Pulsing scale effect when player is near
      const pulseScale = isNear 
        ? 1 + Math.sin(time * 4) * 0.05 
        : 1;
      portalEnergyRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }

    // ========== ORBITING RINGS ==========
    // Each ring rotates at different speed and axis
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 1.5;
      ring1Ref.current.rotation.y = time * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -time * 1.2;
      ring2Ref.current.rotation.z = time * 0.8;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = time * 1.8;
      ring3Ref.current.rotation.z = -time * 0.6;
    }

    // ========== BASE PLATFORM GLOW ==========
    if (baseRef.current && isNear) {
      // Pulsing glow when player is near
      const glowIntensity = 0.5 + Math.sin(time * 3) * 0.3;
      baseRef.current.material.emissiveIntensity = glowIntensity;
    }
  });

  // ============================================
  // RENDER PORTAL
  // ============================================
  return (
    <group position={position}>
      
      {/* ========== BASE PLATFORM ========== */}
      {/* Platform the portal sits on */}
      <Box ref={baseRef} args={[3, 0.3, 3]} position={[0, 0.15, 0]}>
        <meshStandardMaterial 
          color={isNear ? color : "#333333"}
          emissive={isNear ? color : "#000000"}
          emissiveIntensity={isNear ? 0.5 : 0}
          wireframe 
        />
      </Box>

      {/* Decorative corner pillars on base */}
      {[
        [-1.2, 0.4, -1.2],
        [1.2, 0.4, -1.2],
        [-1.2, 0.4, 1.2],
        [1.2, 0.4, 1.2]
      ].map((pos, i) => (
        <Box key={i} args={[0.2, 0.8, 0.2]} position={pos}>
          <meshStandardMaterial color="#666666" wireframe />
        </Box>
      ))}

      {/* ========== PORTAL FRAME ========== */}
      {/* Outer solid frame */}
      <Box ref={portalFrameRef} args={[2.2, 3.2, 0.3]} position={[0, 1.6, 0]}>
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.7}
        />
      </Box>
      
      {/* ========== PORTAL ENERGY FIELD ========== */}
      {/* The actual "portal" - inner glowing part */}
      <Box ref={portalEnergyRef} args={[1.8, 3, 0.1]} position={[0, 1.5, 0]}>
        <meshStandardMaterial 
          color={isNear ? '#ffffff' : color}
          wireframe 
          transparent 
          opacity={isNear ? 0.9 : 0.6}
          emissive={color}
          emissiveIntensity={isNear ? 0.8 : 0.4}
        />
      </Box>

      {/* ========== ORBITING ENERGY RINGS ========== */}
      {/* Ring 1 - Largest */}
      <Torus 
        ref={ring1Ref}
        args={[1.2, 0.03, 8, 32]} 
        position={[0, 1.5, 0]}
      >
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </Torus>

      {/* Ring 2 - Medium */}
      <Torus 
        ref={ring2Ref}
        args={[0.9, 0.025, 8, 32]} 
        position={[0, 1.5, 0]}
      >
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </Torus>

      {/* Ring 3 - Smallest */}
      <Torus 
        ref={ring3Ref}
        args={[0.6, 0.02, 8, 32]} 
        position={[0, 1.5, 0]}
      >
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </Torus>

      {/* ========== PORTAL LIGHT SOURCE ========== */}
      {/* Emits colored light into the scene */}
      <pointLight 
        position={[0, 1.5, 0]} 
        intensity={isNear ? 2 : 1}
        distance={8}
        color={color}
      />

      {/* ========== LABEL TEXT ========== */}
      {/* Portal name displayed above */}
      <Text
        position={[0, 3.8, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/monospace.woff" // Optional: add custom font
      >
        {label}
      </Text>

      {/* Decorative line under label */}
      <Box args={[1.5, 0.02, 0.02]} position={[0, 3.4, 0]}>
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Box>

      {/* ========== INTERACTION PROMPT ========== */}
      {/* Shows when player is near */}
      {isNear && (
        <>
          {/* Animated arrow indicator */}
          <Text
            position={[0, 0.6, 0]}
            fontSize={0.3}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            ↓
          </Text>
          
          {/* Instruction text */}
          <Text
            position={[0, 0.2, 0]}
            fontSize={0.18}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            [E] to Enter
          </Text>

          {/* Glowing ring on ground indicating interaction zone */}
          <Torus args={[2.5, 0.05, 8, 32]} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.6}
            />
          </Torus>
        </>
      )}
    </group>
  );
};

export default Portal;