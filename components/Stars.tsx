'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Stars() {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const qty = 1500;
    const positions = new Float32Array(qty * 3);

    for (let i = 0; i < qty; i++) {
      const radius = 10 + Math.random() * 20;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#bfc6dd',
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
