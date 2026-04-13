'use client';

import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { COUNTRIES } from '@/lib/countries';
import { latLngToVector3 } from '@/lib/utils';
import { Country } from '@/lib/types';

interface CountryMarkersProps {
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
  activeYear?: number;
}

const NORMAL_COLOR = '#5eadd4';
const HOVER_COLOR = '#7bd1fa';
const SELECTED_COLOR = '#ffffff';

const CountryMarkers = React.memo(({
  selectedCountry,
  onCountrySelect,
}: CountryMarkersProps) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const markerGeometry = useMemo(() => new THREE.SphereGeometry(0.022, 16, 16), []);

  const markers = useMemo(
    () =>
      COUNTRIES.map((country) => ({
        country,
        position: latLngToVector3(country.lat, country.lng, 2.01),
      })),
    []
  );

  return (
    <>
      {markers.map(({ country, position }) => {
        const isSelected = selectedCountry?.code === country.code;
        const isHovered = hovered === country.code;
        const isActive = isHovered || isSelected;
        
        let color = isActive ? HOVER_COLOR : NORMAL_COLOR;
        if (isSelected) color = SELECTED_COLOR;

        return (
          <group key={country.code} position={position}>
            <mesh
              scale={isActive ? 1.4 : 1}
              geometry={markerGeometry}
              onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                setHovered(country.code);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHovered(null);
                document.body.style.cursor = 'default';
              }}
              onPointerDown={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                onCountrySelect(country);
              }}
            >
              <meshStandardMaterial 
                color={color} 
                emissive={color}
                emissiveIntensity={isActive ? 35 : 5}
                transparent
                opacity={isActive ? 1 : 0.85}
              />
            </mesh>

            {/* Glassmorphism Minimalist Tooltip */}
            {isActive && (
              <Html distanceFactor={10} position={[0, 0.08, 0]} center style={{ pointerEvents: 'none' }}>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                    whiteSpace: 'nowrap',
                    animation: 'markerDrift 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {country.name}
                  </span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
});

CountryMarkers.displayName = 'CountryMarkers';

export default CountryMarkers;
