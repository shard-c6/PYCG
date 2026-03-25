'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.2}
        mipmapBlur
        intensity={0.4}
      />
    </EffectComposer>
  );
}
