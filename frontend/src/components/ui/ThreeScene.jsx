import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleGlobe = () => {
  const groupRef = useRef();
  const particlesCount = 600;

  // Generate evenly distributed points on a sphere (Fibonacci sphere)
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const radius = 3.5;
    
    for (let i = 0; i < particlesCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particlesCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      pos[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle constant rotation
      groupRef.current.rotation.y += 0.001;
      
      // Subtle mouse interaction
      groupRef.current.rotation.x += (state.pointer.y * 0.1 - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.z += (state.pointer.x * 0.1 - groupRef.current.rotation.z) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Node particles representing users/connections */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.04} 
          color="#1d9bf0" 
          transparent 
          opacity={0.6} 
          sizeAttenuation 
        />
      </points>

      {/* Core faint glow inside the globe */}
      <mesh>
        <sphereGeometry args={[3.3, 32, 32]} />
        <meshBasicMaterial color="#1d9bf0" transparent opacity={0.03} />
      </mesh>

      {/* Minimal orbital rings */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[4.2, 0.005, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      
      <mesh rotation={[Math.PI / 1.5, Math.PI / 4, 0]}>
        <torusGeometry args={[5.0, 0.008, 16, 100]} />
        <meshBasicMaterial color="#1d9bf0" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

const ThreeScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        {/* We don't need lights because we're using BasicMaterial for a clean, flat, minimal look */}
        <ParticleGlobe />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
