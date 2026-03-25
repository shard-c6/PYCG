'use client';

import { useRef, useCallback, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import Globe from './Globe';
import Atmosphere from './Atmosphere';
import Stars from './Stars';
import CountryMarkers from './CountryMarkers';
import { latLngToVector3 } from '@/lib/utils';
import { Country } from '@/lib/types';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import ErrorBoundary from './ErrorBoundary';

interface SceneProps {
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
  activeYear: number;
  isDragging: React.MutableRefObject<boolean>;
  isAnimating: React.MutableRefObject<boolean>;
  controlsRef: React.MutableRefObject<OrbitControlsType | null>;
}

function Scene({
  selectedCountry,
  onCountrySelect,
  activeYear,
  isDragging,
  isAnimating,
  controlsRef,
}: SceneProps) {
  const { camera } = useThree();

  const animateToCountry = useCallback(
    (lat: number, lng: number) => {
      if (!controlsRef.current) return;
      const targetPos = latLngToVector3(lat, lng, 5);
      isAnimating.current = true;

      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.8,
        ease: 'power3.inOut',
        onUpdate: () => {
          (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
        },
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      gsap.to(controlsRef.current.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.8,
        ease: 'power3.inOut',
        onUpdate: () => {
          controlsRef.current?.update();
        },
      });
    },
    [camera, controlsRef, isAnimating]
  );

  const handleCountrySelect = useCallback(
    (country: Country) => {
      onCountrySelect(country);
      animateToCountry(country.lat, country.lng);
    },
    [onCountrySelect, animateToCountry]
  );

  return (
    <>
      {/* Lighting optimized for textured earth (ambient + directional sun) */}
      <ambientLight intensity={2.5} />
      <directionalLight position={[0, 0, 10]} intensity={2.0} />
      
      {/* Scene elements */}
      <Stars />
      <Globe isDragging={isDragging} isAnimating={isAnimating}>
        <Atmosphere />
        <CountryMarkers
          selectedCountry={selectedCountry}
          onCountrySelect={handleCountrySelect}
          activeYear={activeYear}
        />
      </Globe>

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enableZoom
        zoomSpeed={0.5}
        minDistance={2.5}
        maxDistance={12}
        enablePan={false}
        onStart={() => { isDragging.current = true; }}
        onEnd={() => { isDragging.current = false; }}
      />
    </>
  );
}

interface GlobeSceneProps {
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
  activeYear: number;
}

export default function GlobeScene({ selectedCountry, onCountrySelect, activeYear }: GlobeSceneProps) {
  const isDragging = useRef<boolean>(false);
  const isAnimating = useRef<boolean>(false);
  const controlsRef = useRef<OrbitControlsType | null>(null);

  return (
    <div className="w-full h-full relative" style={{ backgroundColor: '#0e131e' }}>
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ antialias: true, alpha: true, logarithmicDepthBuffer: true }}
          frameloop="always"
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <Scene
              selectedCountry={selectedCountry}
              onCountrySelect={onCountrySelect}
              activeYear={activeYear}
              isDragging={isDragging}
              isAnimating={isAnimating}
              controlsRef={controlsRef}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
