// src/dungeons/AboutDungeon.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, Plane } from '@react-three/drei';

function BioScroll({ position, title, content, index }) {
  const scrollRef = useRef();

  useFrame(({ clock }) => {
    if (scrollRef.current) {
      scrollRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5 + index) * 0.1;
      scrollRef.current.position.y = Math.sin(clock.getElapsedTime() + index) * 0.1 + 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Pedestal */}
      <Box args={[2, 0.3, 2]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>

      {/* Floating Scroll */}
      <Box ref={scrollRef} args={[1.5, 2, 0.1]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>

      {/* Title */}
      <Text
        position={[0, 2.8, 0.2]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.4}
      >
        {title}
      </Text>

      {/* Content lines */}
      {content.split('\n').slice(0, 3).map((line, i) => (
        <Text
          key={i}
          position={[0, 2.3 - i * 0.25, 0.2]}
          fontSize={0.08}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.3}
        >
          {line}
        </Text>
      ))}

      {/* Number badge */}
      <Box args={[0.4, 0.4, 0.05]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      <Text
        position={[0, 0.5, 0.05]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {String(index + 1).padStart(2, '0')}
      </Text>
    </group>
  );
}

function CenterCrystal() {
  const crystalRef = useRef();

  useFrame(({ clock }) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = clock.getElapsedTime();
      crystalRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.3 + 3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Base platform */}
      <Box args={[3, 0.2, 3]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>

      {/* Crystal */}
      <Box ref={crystalRef} args={[1, 2, 1]} position={[0, 3, 0]}>
        <meshStandardMaterial 
          color="#ffffff" 
          wireframe 
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </Box>

      {/* Orbiting rings */}
      {[1, 2, 3].map((i) => (
        <Box 
          key={i}
          args={[2 + i * 0.3, 0.02, 2 + i * 0.3]} 
          position={[0, 2 + i * 0.3, 0]}
          rotation={[0, 0, 0]}
        >
          <meshStandardMaterial color="#00ff00" wireframe />
        </Box>
      ))}

      {/* Name */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        KALADARAN
      </Text>

      <Text
        position={[0, 4.5, 0]}
        fontSize={0.15}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        CHANTHIRAKUMAR
      </Text>
    </group>
  );
}

function ExitPortal({ position }) {
  const portalRef = useRef();

  useFrame(({ clock }) => {
    if (portalRef.current) {
      portalRef.current.rotation.y = clock.getElapsedTime();
    }
  });

  return (
    <group position={position}>
      <Box args={[1.5, 2.5, 0.1]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.6} />
      </Box>
      <Box ref={portalRef} args={[1.2, 2.2, 0.05]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#00ff00" wireframe />
      </Box>
      <Text
        position={[0, 3, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        EXIT
      </Text>
    </group>
  );
}

const AboutDungeon = ({ onExit }) => {
  const bioSections = [
    {
      title: "WHO AM I",
      content: "Full Stack Developer\nGame Dev Researcher\nProblem Solver"
    },
    {
      title: "EDUCATION",
      content: "BSc (Hons) Computer Science\nInformatics Institute (IIT)\nWestminster University"
    },
    {
      title: "EXPERTISE",
      content: "Web Development\n3D Game Engines\nSystem Architecture"
    },
    {
      title: "PASSION",
      content: "Procedural Generation\nAlgorithm Design\nImmersive Experiences"
    },
    {
      title: "LOCATION",
      content: "Colombo, Sri Lanka\nAvailable Globally\nRemote Work"
    },
    {
      title: "STATUS",
      content: "Open to Opportunities\nFreelance Available\nFull-time Ready"
    }
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', position: 'relative' }}>
      <Canvas camera={{ position: [0, 8, 15], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 8, 0]} intensity={0.8} color="#ffffff" />
        <pointLight position={[8, 5, 8]} intensity={0.4} color="#00ff00" />
        <pointLight position={[-8, 5, -8]} intensity={0.4} color="#00ff00" />

        {/* Floor */}
        <Plane args={[30, 30]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#0a0a0a" />
        </Plane>

        {/* Grid */}
        {Array.from({ length: 31 }, (_, i) => (
          <React.Fragment key={`grid-${i}`}>
            <Box args={[30, 0.02, 0.02]} position={[0, 0.01, -15 + i]}>
              <meshStandardMaterial color="#333333" />
            </Box>
            <Box args={[0.02, 0.02, 30]} position={[-15 + i, 0.01, 0]}>
              <meshStandardMaterial color="#333333" />
            </Box>
          </React.Fragment>
        ))}

        {/* Title */}
        <Text
          position={[0, 6, -8]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ABOUT CHAMBER
        </Text>

        {/* Center Crystal */}
        <CenterCrystal />

        {/* Bio Scrolls in circle */}
        {bioSections.map((section, i) => {
          const angle = (i / bioSections.length) * Math.PI * 2;
          const radius = 7;
          return (
            <BioScroll
              key={i}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
              title={section.title}
              content={section.content}
              index={i}
            />
          );
        })}

        {/* Exit Portal */}
        <ExitPortal position={[0, 0, 12]} />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid white',
        padding: '15px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 100
      }}>
        <div style={{ marginBottom: '10px', fontSize: '14px', letterSpacing: '2px' }}>
          BIOGRAPHY
        </div>
        <div>Mouse: Rotate view</div>
        <div>Scroll: Zoom</div>
        <div>ESC: Back to main</div>
      </div>

      {/* Profile Info */}
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid white',
        padding: '20px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 100,
        maxWidth: '300px'
      }}>
        <div style={{ fontSize: '14px', letterSpacing: '2px', marginBottom: '15px' }}>
          DEVELOPER PROFILE
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#00ff00' }}>►</span> Full Stack Developer
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#00ff00' }}>►</span> Game Dev Researcher
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#00ff00' }}>►</span> Algorithm Designer
        </div>
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '5px' }}>EXPERIENCE</div>
          <div>1+ Years Professional</div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '5px' }}>STATUS</div>
          <div style={{ color: '#00ff00' }}>Available for Hire</div>
        </div>
      </div>
    </div>
  );
};

export default AboutDungeon;