// src/dungeons/SkillsDungeon.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, Plane, Torus } from '@react-three/drei';

const skillCategories = [
  {
    category: "Frontend",
    skills: [
      { name: "React.js", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "React Native", level: 80 }
    ]
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 85 },
      { name: ".NET Core", level: 80 },
      { name: "Express.js", level: 85 },
      { name: "RESTful APIs", level: 90 }
    ]
  },
  {
    category: "Game Dev",
    skills: [
      { name: "Unity Engine", level: 85 },
      { name: "C#", level: 88 },
      { name: "Procedural Gen", level: 90 },
      { name: "3D Graphics", level: 75 }
    ]
  },
  {
    category: "Database",
    skills: [
      { name: "MSSQL", level: 85 },
      { name: "MySQL", level: 80 },
      { name: "Azure", level: 75 },
      { name: "Git/GitHub", level: 90 }
    ]
  }
];

function SkillOrb({ position, skill, category, index }) {
  const orbRef = useRef();
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = clock.getElapsedTime() + index;
      orbRef.current.position.y = Math.sin(clock.getElapsedTime() + index) * 0.2 + 2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = clock.getElapsedTime() * 2;
    }
  });

  const size = (skill.level / 100) * 0.8 + 0.3;

  return (
    <group position={position}>
      {/* Base */}
      <Box args={[1, 0.2, 1]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>

      {/* Floating Orb */}
      <Box ref={orbRef} args={[size, size, size]} position={[0, 2, 0]}>
        <meshStandardMaterial 
          color="#ffffff" 
          wireframe 
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Ring */}
      <Torus ref={ringRef} args={[size * 1.2, 0.02, 8, 32]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </Torus>

      {/* Skill Name */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
      >
        {skill.name}
      </Text>

      {/* Level */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.2}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        {skill.level}%
      </Text>

      {/* Level Bar */}
      <Box args={[1, 0.05, 0.05]} position={[0, 3.5, 0]}>
        <meshStandardMaterial color="#333333" />
      </Box>
      <Box 
        args={[(skill.level / 100), 0.05, 0.05]} 
        position={[-(1 - skill.level / 100) / 2, 3.5, 0]}
      >
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </Box>
    </group>
  );
}

function CategoryPillar({ position, category, index }) {
  const pillarRef = useRef();

  useFrame(({ clock }) => {
    if (pillarRef.current) {
      pillarRef.current.rotation.y = clock.getElapsedTime() * 0.5 + index;
    }
  });

  return (
    <group position={position}>
      {/* Pillar */}
      <Box args={[0.5, 4, 0.5]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#0a0a0a" wireframe />
      </Box>

      {/* Top decoration */}
      <Box ref={pillarRef} args={[0.8, 0.3, 0.8]} position={[0, 4.2, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>

      {/* Category Label */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {category}
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

const SkillsDungeon = ({ onExit }) => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', position: 'relative' }}>
      <Canvas camera={{ position: [0, 10, 15], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 8, 0]} intensity={0.8} />
        <pointLight position={[10, 5, 10]} intensity={0.5} />
        <pointLight position={[-10, 5, -10]} intensity={0.5} />

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
          position={[0, 6, -10]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          SKILLS ARENA
        </Text>

        {/* Category Pillars and Skills */}
        {skillCategories.map((cat, catIndex) => (
          <React.Fragment key={catIndex}>
            <CategoryPillar
              position={[
                (catIndex % 2) * 12 - 6,
                0,
                Math.floor(catIndex / 2) * 10 - 5
              ]}
              category={cat.category}
              index={catIndex}
            />

            {cat.skills.map((skill, skillIndex) => (
              <SkillOrb
                key={`${catIndex}-${skillIndex}`}
                position={[
                  (catIndex % 2) * 12 - 6 + (skillIndex % 2) * 3 - 1.5,
                  0,
                  Math.floor(catIndex / 2) * 10 - 5 + Math.floor(skillIndex / 2) * 3 - 1.5
                ]}
                skill={skill}
                category={cat.category}
                index={catIndex * 4 + skillIndex}
              />
            ))}
          </React.Fragment>
        ))}

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
          SKILLS OVERVIEW
        </div>
        <div>Mouse: Rotate view</div>
        <div>Scroll: Zoom</div>
        <div>ESC: Back to main</div>
      </div>

      {/* Stats */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid white',
        padding: '15px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '10px',
        zIndex: 100,
        minWidth: '200px'
      }}>
        <div style={{ fontSize: '12px', letterSpacing: '2px', marginBottom: '10px' }}>
          STATISTICS
        </div>
        <div style={{ marginBottom: '5px' }}>Total Skills: 16</div>
        <div style={{ marginBottom: '5px' }}>Categories: 4</div>
        <div style={{ marginBottom: '5px' }}>Avg Level: 84%</div>
        <div style={{ color: '#00ff00' }}>Status: EXPERT</div>
      </div>
    </div>
  );
};

export default SkillsDungeon;