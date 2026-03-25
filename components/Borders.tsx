'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { latLngToVector3 } from '@/lib/utils';

export default function Borders() {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(res => res.json())
      .then(data => {
        const points: number[] = [];
        const radius = 2.005; // slightly larger than the globe to prevent z-fighting
        
        const addLine = (ring: number[][]) => {
          for (let i = 0; i < ring.length - 1; i++) {
            const p1 = ring[i];
            const p2 = ring[i + 1];
            
            // p[0] is longitude, p[1] is latitude
            const v1 = latLngToVector3(p1[1], p1[0], radius);
            const v2 = latLngToVector3(p2[1], p2[0], radius);

            points.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
          }
        };

        data.features.forEach((feature: any) => {
          const type = feature.geometry.type;
          const coords = feature.geometry.coordinates;
          
          if (type === 'Polygon') {
            coords.forEach(addLine);
          } else if (type === 'MultiPolygon') {
            coords.forEach((polygon: any) => polygon.forEach(addLine));
          }
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        setGeometry(geo);
      });
  }, []);

  if (!geometry) return null;

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#ffae42" transparent opacity={0.6} linewidth={1} />
    </lineSegments>
  );
}
