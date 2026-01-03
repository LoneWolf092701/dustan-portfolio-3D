// src/dungeons/ProjectsDungeon.jsx
import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, Plane } from '@react-three/drei';
import { projects } from '../constants';

function ProjectPedestal({ position, project, index, isSelected }) {
  const pedestalRef = useRef();
  
  useFrame(({ clock }) => {
    if (pedestalRef.current) {
      pedestalRef.current.rotation.y = Math.sin(clock.getElapsedTime() + index) * 0.1;
      if (isSelected) {
        pedestalRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 1;
      }
    }
  });

  return (
    <group position={position}>
      <Box args={[2, 0.3, 2]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color={isSelected ? "#00ff00" : "#ffffff"} wireframe />
      </Box>

      <group ref={pedestalRef} position={[0, 1, 0]}>
        <Box args={[1.5, 1.5, 0.2]}>
          <meshStandardMaterial color={isSelected ? "#ffffff" : "#666666"} wireframe />
        </Box>

        <Text
          position={[0, 0, 0.2]}
          fontSize={0.8}
          color={isSelected ? "#00ff00" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
        >
          {String(index + 1).padStart(2, '0')}
        </Text>

        <Text
          position={[0, -0.8, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {project.name}
        </Text>
      </group>

      {isSelected && (
        <>
          <Box args={[2.2, 0.05, 2.2]} position={[0, 0.02, 0]}>
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
          </Box>
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.15}
            color="#00ff00"
            anchorX="center"
            anchorY="middle"
          >
            [E] View Details
          </Text>
        </>
      )}

      {project.tags.slice(0, 3).map((tag, i) => (
        <Text
          key={i}
          position={[-0.6 + i * 0.6, 1.8, 0]}
          fontSize={0.1}
          color="#888888"
          anchorX="center"
          anchorY="middle"
        >
          {tag.name.toUpperCase()}
        </Text>
      ))}
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

const ProjectsDungeon = ({ onExit }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key.toLowerCase() === 'e' && selectedProject !== null && !showDetails) {
      setShowDetails(true);
    }
    if (e.key === 'Escape' && showDetails) {
      setShowDetails(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedProject, showDetails]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', position: 'relative' }}>
      <Canvas camera={{ position: [0, 8, 12], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={0.6} />
        <pointLight position={[5, 3, 5]} intensity={0.4} />
        <pointLight position={[-5, 3, -5]} intensity={0.4} />

        <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#0a0a0a" />
        </Plane>

        {Array.from({ length: 21 }, (_, i) => (
          <React.Fragment key={`grid-${i}`}>
            <Box args={[20, 0.02, 0.02]} position={[0, 0.01, -10 + i]}>
              <meshStandardMaterial color="#333333" />
            </Box>
            <Box args={[0.02, 0.02, 20]} position={[-10 + i, 0.01, 0]}>
              <meshStandardMaterial color="#333333" />
            </Box>
          </React.Fragment>
        ))}

        <Text
          position={[0, 4, -5]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          PROJECTS ARCHIVE
        </Text>

        {projects.map((project, i) => (
          <ProjectPedestal
            key={i}
            position={[(i % 2) * 4 - 2, 0, Math.floor(i / 2) * 4 - 2]}
            project={project}
            index={i}
            isSelected={selectedProject === i}
          />
        ))}

        <ExitPortal position={[0, 0, -7]} />
      </Canvas>

      {showDetails && selectedProject !== null && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid white',
          padding: '40px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          zIndex: 1000,
          color: 'white',
          fontFamily: 'monospace'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '2px', marginBottom: '10px' }}>
              PROJECT {String(selectedProject + 1).padStart(2, '0')}
            </div>
            <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>
              {projects[selectedProject].name}
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'white', marginBottom: '20px' }} />
          </div>

          <div style={{ marginBottom: '20px', lineHeight: '1.6', fontSize: '14px' }}>
            {projects[selectedProject].description}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '2px', marginBottom: '10px' }}>
              TECH STACK
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {projects[selectedProject].tags.map((tag, i) => (
                <span key={i} style={{
                  border: '1px solid white',
                  padding: '5px 10px',
                  fontSize: '10px',
                  letterSpacing: '1px'
                }}>
                  {tag.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #333', paddingTop: '20px', fontSize: '10px', textAlign: 'center' }}>
            Press ESC to close
          </div>
        </div>
      )}

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
        <div>Mouse: Rotate view</div>
        <div>Scroll: Zoom</div>
        <div>E: View details</div>
        <div>ESC: Back to main</div>
      </div>
    </div>
  );
};

export default ProjectsDungeon;