// src/game/GameEngine.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from 'three';

// Simple mouse drag rotation
function MouseControls({ target, onRotationChange }) {
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const previousMouse = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleMouseDown = (e) => {
      setIsDragging(true);
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      
      setRotation(prev => {
        const newRotation = {
          x: Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev.x + deltaY * 0.005)),
          y: prev.y + deltaX * 0.005
        };
        
        // Pass rotation to parent for player movement
        if (onRotationChange) {
          onRotationChange(newRotation);
        }
        
        return newRotation;
      });
      
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, gl, onRotationChange]);
  
  useFrame(() => {
    const radius = 20;
    const offsetX = Math.sin(rotation.y) * Math.cos(rotation.x) * radius;
    const offsetY = Math.sin(rotation.x) * radius + 12;
    const offsetZ = Math.cos(rotation.y) * Math.cos(rotation.x) * radius;
    
    camera.position.x = target.x + offsetX;
    camera.position.y = target.y + offsetY;
    camera.position.z = target.z + offsetZ;
    
    camera.lookAt(target.x, target.y, target.z);
  });
  
  return null;
}

// Simple Box component
function Box({ args, position, color, wireframe, castShadow, receiveShadow, emissive, emissiveIntensity }) {
  return (
    <mesh position={position} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={args} />
      <meshStandardMaterial 
        color={color} 
        wireframe={wireframe}
        emissive={emissive || '#000000'}
        emissiveIntensity={emissiveIntensity || 0}
      />
    </mesh>
  );
}

// Player Component with camera-relative movement and smooth rotation
function Player({ position, onMove, onInteract, cameraRotation, dungeonGrid }) {
  const playerRef = useRef();
  const modelRef = useRef(); // Separate ref for the player model (for rotation)
  const [keys] = useState({ w: false, a: false, s: false, d: false, e: false });
  const targetRotation = useRef(0);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keys.w = true;
      if (key === 's' || key === 'arrowdown') keys.s = true;
      if (key === 'a' || key === 'arrowleft') keys.a = true;
      if (key === 'd' || key === 'arrowright') keys.d = true;
      
      // E key for interaction
      if (key === 'e') {
        keys.e = true;
        if (onInteract) {
          onInteract();
        }
      }
    };
    
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keys.w = false;
      if (key === 's' || key === 'arrowdown') keys.s = false;
      if (key === 'a' || key === 'arrowleft') keys.a = false;
      if (key === 'd' || key === 'arrowright') keys.d = false;
      if (key === 'e') keys.e = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onInteract]);
  
  useFrame(() => {
    if (!playerRef.current || !modelRef.current) return;
    
    const speed = 0.2;
    let moveX = 0;
    let moveZ = 0;
    
    // Get input direction
    if (keys.w) moveZ -= 1;
    if (keys.s) moveZ += 1;
    if (keys.a) moveX -= 1;
    if (keys.d) moveX += 1;
    
    // Only move and rotate if there's input
    if (moveX !== 0 || moveZ !== 0) {
      // Normalize diagonal movement
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;
      
      // Apply camera rotation to movement direction
      const camAngle = cameraRotation.y;
      const rotatedX = moveX * Math.cos(camAngle) - moveZ * Math.sin(camAngle);
      const rotatedZ = moveX * Math.sin(camAngle) + moveZ * Math.cos(camAngle);
      
      // Apply movement
      let newX = playerRef.current.position.x + rotatedX * speed;
      let newZ = playerRef.current.position.z + rotatedZ * speed;
      
      // Simple bounds
      newX = Math.max(-35, Math.min(35, newX));
      newZ = Math.max(-35, Math.min(35, newZ));
      
      playerRef.current.position.x = newX;
      playerRef.current.position.z = newZ;
      
      // Calculate target rotation (face movement direction)
      targetRotation.current = Math.atan2(rotatedX, rotatedZ);
      
      if (onMove) {
        onMove({ x: newX, y: 1, z: newZ });
      }
    }
    
    // Smoothly rotate player model to face target direction
    let currentRotation = modelRef.current.rotation.y;
    let rotationDiff = targetRotation.current - currentRotation;
    
    // Normalize rotation difference to [-PI, PI]
    while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
    while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;
    
    // Apply smooth rotation (lerp)
    modelRef.current.rotation.y += rotationDiff * 0.15;
  });
  
  return (
    <group ref={playerRef} position={position}>
      <group ref={modelRef}>
        {/* Body */}
        <Box args={[0.6, 1.2, 0.4]} position={[0, 1.2, 0]} color="#ffffff" wireframe castShadow />
        {/* Head */}
        <Box args={[0.5, 0.5, 0.5]} position={[0, 2, 0]} color="#ffffff" wireframe castShadow />
        {/* Eyes (forward facing) */}
        <mesh position={[-0.15, 2, 0.26]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.15, 2, 0.26]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={3} />
        </mesh>
        {/* Direction indicator (arrow pointing forward) */}
        <mesh position={[0, 1.2, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.2, 0.4, 3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Torch light */}
        <pointLight position={[0.7, 1.5, 0]} intensity={8} distance={20} color="#ff6600" />
      </group>
    </group>
  );
}

// Simple Floor
function Floor() {
  return (
    <>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Grid lines */}
      {Array.from({ length: 21 }, (_, i) => (
        <React.Fragment key={i}>
          <Box args={[100, 0.05, 0.05]} position={[0, 0.02, -50 + i * 5]} color="#404040" />
          <Box args={[0.05, 0.05, 100]} position={[-50 + i * 5, 0.02, 0]} color="#404040" />
        </React.Fragment>
      ))}
      
      {/* Boundary walls */}
      <Box args={[100, 4, 1]} position={[0, 2, -50]} color="#0a0a0a" wireframe />
      <Box args={[100, 4, 1]} position={[0, 2, 50]} color="#0a0a0a" wireframe />
      <Box args={[1, 4, 100]} position={[-50, 2, 0]} color="#0a0a0a" wireframe />
      <Box args={[1, 4, 100]} position={[50, 2, 0]} color="#0a0a0a" wireframe />
    </>
  );
}

// Simple Portal with proximity indicator
function Portal({ position, color, label, isNear }) {
  const portalRef = useRef();
  
  useFrame(({ clock }) => {
    if (portalRef.current) {
      portalRef.current.rotation.y = clock.getElapsedTime();
    }
  });
  
  return (
    <group position={position}>
      <Box args={[3, 0.3, 3]} position={[0, 0.15, 0]} color={isNear ? color : "#ffffff"} wireframe />
      <Box args={[2, 3, 0.3]} position={[0, 1.5, 0]} color="#333333" />
      <mesh ref={portalRef} position={[0, 1.5, 0]}>
        <boxGeometry args={[1.8, 2.8, 0.1]} />
        <meshStandardMaterial 
          color={isNear ? '#ffffff' : color} 
          wireframe 
          emissive={color}
          emissiveIntensity={isNear ? 1.2 : 0.6}
        />
      </mesh>
      <pointLight position={[0, 1.5, 0]} intensity={isNear ? 5 : 3} distance={10} color={color} />
      
      {/* Show [E] prompt when near */}
      {isNear && (
        <>
          <mesh position={[0, 3.5, 0]}>
            <boxGeometry args={[1.5, 0.3, 0.1]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.5, 0.3, 0.1]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
          </mesh>
        </>
      )}
    </group>
  );
}

// Camera Follow with smooth lerp
function CameraRig({ target }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Smooth camera follow
    const targetX = target.x + 15;
    const targetY = 15;
    const targetZ = target.z + 15;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    
    camera.lookAt(target.x, target.y, target.z);
  });
  
  return null;
}

// Main Game Engine
const GameEngine = ({ onPortalEnter }) => {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 1, z: 0 });
  const [currentSection, setCurrentSection] = useState('Main Hall');
  const [health] = useState(100);
  const [nearPortal, setNearPortal] = useState(null);
  const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0 });
  
  const [questLog, setQuestLog] = useState([
    { text: 'Explore the procedural dungeon', completed: false },
    { text: 'Find all 4 portals', completed: false },
    { text: 'Learn about skills', completed: false },
    { text: 'View project archive', completed: false }
  ]);

  const portals = [
    { position: [-20, 0, -20], label: 'ABOUT', color: '#00ff00', section: 'About Chamber' },
    { position: [20, 0, -20], label: 'PROJECTS', color: '#0088ff', section: 'Projects Archive' },
    { position: [-20, 0, 20], label: 'SKILLS', color: '#ff00ff', section: 'Skills Arena' },
    { position: [20, 0, 20], label: 'CONTACT', color: '#ffff00', section: 'Contact Crystal' }
  ];

  // Check proximity to portals
  useEffect(() => {
    let closest = null;
    let minDist = 5; // Interaction distance
    
    portals.forEach((portal, index) => {
      const dx = playerPosition.x - portal.position[0];
      const dz = playerPosition.z - portal.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist < minDist) {
        minDist = dist;
        closest = index;
      }
    });
    
    setNearPortal(closest);
  }, [playerPosition]);

  // Handle E key interaction
  const handleInteract = () => {
    if (nearPortal !== null) {
      const portal = portals[nearPortal];
      console.log(`Entering portal: ${portal.label}`);
      setCurrentSection(portal.section);
      
      // Mark quest as completed
      setQuestLog(prev => {
        const newLog = [...prev];
        if (nearPortal + 1 < newLog.length) {
          newLog[nearPortal + 1] = { ...newLog[nearPortal + 1], completed: true };
        }
        return newLog;
      });
      
      // Trigger scene change
      if (onPortalEnter) {
        onPortalEnter(portal.label.toLowerCase());
      }
    }
  };

  const completedQuests = questLog.filter(q => q.completed).length;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas shadows camera={{ position: [15, 15, 15], fov: 60 }}>
        {/* SUPER BRIGHT LIGHTING */}
        <ambientLight intensity={1.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={2} 
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[0, 10, 0]} intensity={2} distance={50} />
        <pointLight position={[20, 10, 20]} intensity={1} distance={40} />
        <pointLight position={[-20, 10, -20]} intensity={1} distance={40} />
        
        <fog attach="fog" args={['#000000', 40, 100]} />

        <Floor />
        
        <Player 
          position={[playerPosition.x, playerPosition.y, playerPosition.z]}
          onMove={setPlayerPosition}
          onInteract={handleInteract}
          cameraRotation={cameraRotation}
          dungeonGrid={null}
        />

        {portals.map((portal, i) => (
          <Portal 
            key={i} 
            {...portal} 
            isNear={nearPortal === i}
          />
        ))}

        {/* Add Mouse Controls for camera rotation */}
        <MouseControls target={playerPosition} onRotationChange={setCameraRotation} />
      </Canvas>

      {/* UI Overlays */}
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid white',
        padding: '15px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '11px',
        minWidth: '250px'
      }}>
        <div style={{ fontSize: '11px', marginBottom: '10px', letterSpacing: '2px' }}>
          DEVELOPER STATUS
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', marginBottom: '5px' }}>MOTIVATION: {health}%</div>
          <div style={{ 
            width: '100%', 
            height: '22px', 
            border: '1px solid white',
            background: 'black',
            position: 'relative'
          }}>
            <div style={{
              width: `${health}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00ff00, #00aa00)'
            }} />
          </div>
        </div>
        <div style={{ fontSize: '10px', paddingTop: '10px', borderTop: '1px solid #333' }}>
          <span style={{ opacity: 0.7 }}>LOCATION: </span>
          <span style={{ color: '#00ff00' }}>{currentSection}</span>
        </div>
        <div style={{ fontSize: '9px', marginTop: '8px', opacity: 0.5 }}>
          X: {Math.round(playerPosition.x)} | Y: {Math.round(playerPosition.y)} | Z: {Math.round(playerPosition.z)}
        </div>
      </div>

      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid white',
        padding: '10px',
        width: '180px',
        height: '180px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '10px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '8px', letterSpacing: '2px' }}>
          DUNGEON MAP
        </div>
        <div style={{ 
          width: '100%', 
          height: 'calc(100% - 20px)',
          border: '1px solid white',
          background: 'black',
          position: 'relative'
        }}>
          {/* Player dot */}
          <div style={{
            position: 'absolute',
            left: `${50 + (playerPosition.x / 80) * 100}%`,
            top: `${50 + (playerPosition.z / 80) * 100}%`,
            width: '8px',
            height: '8px',
            background: '#00ff00',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px #00ff00'
          }} />
          
          {/* Portal markers */}
          {portals.map((portal, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${50 + (portal.position[0] / 80) * 100}%`,
              top: `${50 + (portal.position[2] / 80) * 100}%`,
              width: '6px',
              height: '6px',
              background: portal.color,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 5px ${portal.color}`,
              border: nearPortal === i ? '2px solid white' : 'none'
            }} />
          ))}
        </div>
      </div>

      <div style={{
        position: 'fixed',
        bottom: 80,
        left: 20,
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid white',
        padding: '15px',
        minWidth: '320px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '10px'
      }}>
        <div style={{ fontSize: '11px', marginBottom: '10px', letterSpacing: '2px' }}>
          ACTIVE QUESTS <span style={{ 
            background: '#00ff00', 
            color: 'black', 
            padding: '2px 6px',
            fontSize: '9px',
            marginLeft: '8px'
          }}>{completedQuests}/4</span>
        </div>
        {questLog.map((quest, i) => (
          <div key={i} style={{ 
            marginBottom: '8px', 
            opacity: quest.completed ? 0.4 : 1,
            textDecoration: quest.completed ? 'line-through' : 'none'
          }}>
            <span style={{ marginRight: '10px', color: quest.completed ? '#00ff00' : '#666' }}>
              {quest.completed ? '✓' : '○'}
            </span>
            {quest.text}
          </div>
        ))}
      </div>

      <div style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid white',
        padding: '12px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '10px'
      }}>
        <div style={{ marginBottom: '6px', fontWeight: 'bold' }}>CONTROLS</div>
        <div>WASD / Arrows - Move</div>
        <div>E - Interact {nearPortal !== null && <span style={{ color: '#00ff00' }}>← PORTAL NEARBY!</span>}</div>
        <div>Mouse drag - Rotate</div>
      </div>

      <div style={{
        position: 'fixed',
        top: '50%',
        right: 20,
        transform: 'translateY(-50%)',
        background: 'rgba(0, 0, 0, 0.9)',
        border: `2px solid ${nearPortal !== null ? '#00ff00' : '#ffffff'}`,
        padding: '15px',
        color: nearPortal !== null ? '#00ff00' : '#ffffff',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        <div style={{ marginBottom: '10px', fontSize: '14px' }}>
          {nearPortal !== null ? '⚡ PORTAL DETECTED' : '⚠ DEBUG INFO'}
        </div>
        <div>WASD: Move player</div>
        <div>E: Enter portal</div>
        <div>Mouse: Rotate view</div>
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${nearPortal !== null ? '#00ff00' : '#fff'}` }}>
          <div>X: {Math.round(playerPosition.x)}</div>
          <div>Z: {Math.round(playerPosition.z)}</div>
          {nearPortal !== null && (
            <div style={{ marginTop: '5px', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>
              PRESS [E] TO ENTER
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default GameEngine;