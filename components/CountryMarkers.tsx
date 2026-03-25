'use client';

import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { COUNTRIES } from '@/lib/countries';
import { latLngToVector3 } from '@/lib/utils';
import { Country } from '@/lib/types';

interface CountryMarkersProps {
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
  activeYear?: number;
}

const NORMAL_COLOR = new THREE.Color('#45464c');
const HOVER_COLOR = new THREE.Color('#7bd1fa');
const SELECTED_COLOR = new THREE.Color('#ffffff');

const normalMat = new THREE.MeshBasicMaterial({ color: NORMAL_COLOR });
const hoverMat = new THREE.MeshBasicMaterial({ color: HOVER_COLOR });
const selectedMat = new THREE.MeshBasicMaterial({ color: SELECTED_COLOR });

export default function CountryMarkers({
  selectedCountry,
  onCountrySelect,
  activeYear,
}: CountryMarkersProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const markerGeometry = useMemo(() => new THREE.SphereGeometry(0.035, 16, 16), []);

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
        const material = isSelected ? selectedMat : isHovered ? hoverMat : normalMat;

        return (
          <mesh
            key={country.code}
            position={position}
            geometry={markerGeometry}
            material={material}
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
          />
        );
      })}
    </>
  );
}
