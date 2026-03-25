'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface GlobeProps {
  isDragging: React.MutableRefObject<boolean>;
  isAnimating: React.MutableRefObject<boolean>;
  children?: React.ReactNode;
}

export default function Globe({ isDragging, isAnimating, children }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const [colorMap, bumpMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth_blue_marble.jpg',
    '/textures/earth_topology.png'
  ]);

  useFrame(() => {
    if (groupRef.current && !isDragging.current && !isAnimating.current) {
      groupRef.current.rotation.y += 0.0003; // Reduced rotation speed
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          emissiveMap={colorMap}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={0.6}
          bumpMap={bumpMap}
          bumpScale={0.015}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      
      {children}
    </group>
  );
}
