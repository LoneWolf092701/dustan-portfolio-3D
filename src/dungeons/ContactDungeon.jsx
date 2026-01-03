// src/dungeons/ContactDungeon.jsx
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, Plane, Sphere } from '@react-three/drei';

function CommunicationCrystal() {
  const crystalRef = useRef();
  const ringsRef = useRef([]);

  useFrame(({ clock }) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      crystalRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.3 + 3;
    }
    
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z = clock.getElapsedTime() * (0.5 + i * 0.2);
      }
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <Box args={[4, 0.3, 4]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>

      {/* Central Crystal */}
      <Box ref={crystalRef} args={[1.5, 3, 1.5]} position={[0, 3, 0]}>
        <meshStandardMaterial 
          color="#00ff00" 
          wireframe 
          emissive="#00ff00"
          emissiveIntensity={0.8}
        />
      </Box>

      {/* Orbiting Rings */}
      {[0, 1, 2, 3].map((i) => (
        <Box 
          key={i}
          ref={(el) => (ringsRef.current[i] = el)}
          args={[0.05, 3 + i * 0.5, 3 + i * 0.5]} 
          position={[0, 3, 0]}
          rotation={[Math.PI / 2, 0, i * Math.PI / 4]}
        >
          <meshStandardMaterial 
            color="#ffffff" 
            wireframe 
            transparent 
            opacity={0.6 - i * 0.1}
          />
        </Box>
      ))}

      {/* Floating particles */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Sphere 
            key={i}
            args={[0.1, 8, 8]} 
            position={[
              Math.cos(angle) * 2.5,
              3 + Math.sin(angle * 2) * 0.5,
              Math.sin(angle) * 2.5
            ]}
          >
            <meshStandardMaterial 
              color="#00ff00" 
              emissive="#00ff00"
              emissiveIntensity={0.5}
            />
          </Sphere>
        );
      })}

      {/* Label */}
      <Text
        position={[0, 6, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        CONTACT
      </Text>

      <Text
        position={[0, 5.3, 0]}
        fontSize={0.2}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        CRYSTAL
      </Text>
    </group>
  );
}

function ContactPillar({ position, icon, label, value }) {
  const pillarRef = useRef();

  useFrame(({ clock }) => {
    if (pillarRef.current) {
      pillarRef.current.position.y = Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.1 + 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <Box args={[1.5, 0.2, 1.5]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>

      {/* Floating Icon Box */}
      <Box ref={pillarRef} args={[1, 1, 1]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#ffffff" wireframe />
      </Box>

      {/* Icon */}
      <Text
        position={[0, 1.5, 0.6]}
        fontSize={0.4}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        {icon}
      </Text>

      {/* Label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Value */}
      <Text
        position={[0, 2.3, 0]}
        fontSize={0.12}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {value}
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

const ContactDungeon = ({ onExit }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: "✉",
      label: "EMAIL",
      value: "kaladaranchanthirakumar@gmail.com",
      link: "mailto:kaladaranchanthirakumar@gmail.com"
    },
    {
      icon: "☎",
      label: "PHONE",
      value: "+94 76 196 2266",
      link: "tel:+94761962266"
    },
    {
      icon: "⚑",
      label: "LOCATION",
      value: "Colombo, Sri Lanka",
      link: null
    },
    {
      icon: "⚙",
      label: "GITHUB",
      value: "LoneWolf092701",
      link: "https://github.com/LoneWolf092701"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', position: 'relative' }}>
      <Canvas camera={{ position: [0, 8, 15], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 8, 0]} intensity={1} color="#00ff00" />
        <pointLight position={[8, 5, 8]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-8, 5, -8]} intensity={0.5} color="#ffffff" />

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
          position={[0, 6.5, -8]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          CONTACT CRYSTAL
        </Text>

        {/* Center Crystal */}
        <CommunicationCrystal />

        {/* Contact Info Pillars */}
        {contactInfo.map((info, i) => {
          const angle = (i / contactInfo.length) * Math.PI * 2;
          const radius = 6;
          return (
            <ContactPillar
              key={i}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
              {...info}
            />
          );
        })}

        {/* Exit Portal */}
        <ExitPortal position={[0, 0, 12]} />
      </Canvas>

      {/* Contact Form Trigger */}
      <button
        onClick={() => setShowForm(true)}
        style={{
          position: 'fixed',
          top: '50%',
          right: 20,
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid white',
          color: 'white',
          padding: '20px',
          fontFamily: 'monospace',
          fontSize: '14px',
          cursor: 'pointer',
          letterSpacing: '2px',
          zIndex: 100
        }}
      >
        SEND MESSAGE
      </button>

      {/* Contact Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'black',
            border: '2px solid white',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            color: 'white',
            fontFamily: 'monospace'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', letterSpacing: '2px' }}>
              SEND MESSAGE
            </h2>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>
                    NAME
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      background: 'black',
                      border: '1px solid white',
                      color: 'white',
                      padding: '10px',
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      background: 'black',
                      border: '1px solid white',
                      color: 'white',
                      padding: '10px',
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>
                    MESSAGE
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      background: 'black',
                      border: '1px solid white',
                      color: 'white',
                      padding: '10px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      background: 'white',
                      border: 'none',
                      color: 'black',
                      padding: '12px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      cursor: 'pointer',
                      letterSpacing: '2px'
                    }}
                  >
                    SEND
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      flex: 1,
                      background: 'black',
                      border: '1px solid white',
                      color: 'white',
                      padding: '12px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      cursor: 'pointer',
                      letterSpacing: '2px'
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', color: '#00ff00' }}>✓</div>
                <div style={{ fontSize: '16px', letterSpacing: '2px' }}>
                  MESSAGE SENT
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
          COMMUNICATION HUB
        </div>
        <div>Mouse: Rotate view</div>
        <div>Scroll: Zoom</div>
        <div>ESC: Back to main</div>
      </div>
    </div>
  );
};

export default ContactDungeon;