import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * AuroraBorealis Component
 * 
 * This component creates an animated aurora borealis effect using Three.js and React Three Fiber.
 * It uses custom shaders to generate the aurora effect with dynamic colors and movements.
 * The aurora colors are now focused on shades of green and light yellow.
 */
function AuroraBorealis() {
  const meshRef1 = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);
  const meshRef3 = useRef<THREE.Mesh>(null);
  const backgroundRef = useRef<THREE.Mesh>(null);
  const { viewport, scene } = useThree();

  // Load the background image
  // Load the .png image
  const imageTexture = useLoader(THREE.TextureLoader, '../../assets/landscape.png');
  
  // Load the .avif image
  const avifTexture = useLoader(THREE.TextureLoader, '../../assets/aurora.avif');
  
  // Load the .mp4 video
  // const videoTexture = useMemo(() => {
  //   const video = document.createElement('video');
  //   video.src = '../../assets/nightscene.mp4';
  //   video.loop = true;
  //   video.muted = true;
  //   video.play();
  //   return new THREE.VideoTexture(video);
  // }, []);

  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x000000, 0.005);
  }, [scene]);

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(viewport.width, viewport.height, 300, 300);
  }, [viewport.width, viewport.height]);

  const backgroundGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(viewport.width, viewport.height);
  }, [viewport.width, viewport.height]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying float vNoise;
        uniform float time;

        //	Simplex 3D Noise by Ian McEwan, Ashima Arts
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

        float snoise(vec3 v){ 
          const vec2  C = vec2(1.0/6.0, 1.0/3.0);
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

          // First corner
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 =   v - i + dot(i, C.xxx);

          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );

          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1. + 3.0 * C.xxx;

          // Permutations
          i = mod(i, 289.0 ); 
          vec4 p = permute( permute( permute( 
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

          // Gradients
          float n_ = 1.0/7.0;
          vec3 ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );

          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );

          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);

          // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
          vUv = uv;
          vec3 pos = position;

          float noiseFreq = 2.5;
          float noiseAmp = 0.8; 
          vec3 noisePos = vec3(pos.x * noiseFreq + time, pos.y * noiseFreq + time, time);
          vNoise = snoise(noisePos) * noiseAmp;

          // Vertical wave
          pos.z += sin(pos.y * 10.0 + time) * 0.1;
          
          // Horizontal wave
          pos.z += sin(pos.x * 8.0 + time * 0.5) * 0.15;
          
          // Noise displacement
          pos.z += vNoise;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        varying vec2 vUv;
        varying float vNoise;
        uniform float fogDensity;
        uniform vec3 fogColor;

        void main() {
          // Dynamic color mixing
          vec3 baseColor = mix(color1, color2, vUv.y + sin(vUv.x * 10.0 + time) * 0.1);
          baseColor = mix(baseColor, color3, vNoise);
          baseColor = mix(baseColor, color4, sin(vUv.y * 20.0 + time * 2.0) * 0.5 + 0.5);

          // Pulsing effect
          float alpha = smoothstep(0.2, 0.8, vUv.y + vNoise * 0.2);
          alpha *= 0.7 + 0.3 * sin(time * 2.0 + vUv.y * 10.0); // Pulse based on time and position

          // Edge glow
          float edgeGlow = smoothstep(0.5, 1.0, vNoise);
          baseColor += edgeGlow * vec3(0.8, 1.0, 0.6) * 0.5;

          // Sparkle effect
          float sparkle = pow(sin(vUv.x * 100.0 + time * 5.0) * sin(vUv.y * 100.0 + time * 3.0), 20.0);
          baseColor += sparkle * vec3(1.0, 1.0, 0.8);

          // Fog calculation
          float depth = gl_FragCoord.z / gl_FragCoord.w;
          float fogFactor = 1.0 - exp(-fogDensity * fogDensity * depth * depth);
          fogFactor = clamp(fogFactor, 0.0, 1.0);

          gl_FragColor = mix(vec4(baseColor, alpha), vec4(fogColor, alpha), fogFactor);
        }
      `,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x00FF87) }, // Bright green
        color2: { value: new THREE.Color(0x1AFF00) }, // Lime green
        color3: { value: new THREE.Color(0x39FF14) }, // Neon green
        color4: { value: new THREE.Color(0xCCFF00) }, // Fluorescent yellow-green
        color5: { value: new THREE.Color(0x40E0D0) }, // Turquoise (for subtle variation)
        auroraIntensity: { value: 1.0 },
        waveFrequency: { value: 0.005 },
        fogDensity: { value: 0.03
         },
        fogColor: { value: new THREE.Color(0x001F3F) }, // Dark blue for night sky
        noiseScale: { value: 2.0 },
        colorShiftSpeed: { value: 0.5 },
        starIntensity: { value: 0.8 },
        windSpeed: { value: 0.8 },
        pulseFrequency: { value: 0.5 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.5;
    const material1 = meshRef1.current!.material as THREE.ShaderMaterial;
    const material2 = meshRef2.current!.material as THREE.ShaderMaterial;
    const material3 = meshRef3.current!.material as THREE.ShaderMaterial;

    [material1, material2, material3].forEach((mat, index) => {
      mat.uniforms.time.value = time + index * 0.1;

      // Dynamic color shifts
      const hue = (Math.sin(time * 0.1 + index * 0.5) + 1) * 0.1;
      mat.uniforms.color1.value.setHSL(0.25 + hue * 0.1, 0.7, 0.2); // Shift between light green shades
      mat.uniforms.color2.value.setHSL(0.3 + hue * 0.1, 0.8, 0.6);
      mat.uniforms.color3.value.setHSL(0.15 + hue * 0.1, 0.9, 0.7);
      mat.uniforms.color4.value.setHSL(0.1 + hue * 0.1, 0.7, 0.8); // Shift towards light yellow
    });

    // Dynamic parallax movement
    meshRef1.current!.position.y = Math.sin(time * 0.2) * 0.5;
    meshRef2.current!.position.y = Math.sin(time * 0.3 + 1) * 0.3;
    meshRef3.current!.position.y = Math.sin(time * 0.4 + 2) * 0.2;

    meshRef1.current!.rotation.z = Math.sin(time * 0.1) * 0.05;
    meshRef2.current!.rotation.z = Math.sin(time * 0.15 + 1) * 0.03;
    meshRef3.current!.rotation.z = Math.sin(time * 0.2 + 2) * 0.02;
  });

  return (
    <>
      {/* Background image */}
      <mesh 
        ref={backgroundRef} 
        position={[0, 3.75, -10]} // Moved closer to the camera
        scale={[27.25, 17, 1]}    // Adjusted scale for better visibility
      >
        <planeGeometry args={[1.8, 1]} />
        <meshBasicMaterial 
          map={imageTexture} 
          transparent 
          opacity={0.9}        // Reduced opacity for better visibility
          color={new THREE.Color(1, 1.0, 1/3)} // Adjusted color for better contrast with green-yellow aurora
        >
         
          <primitive attach="map" object={avifTexture} />
        </meshBasicMaterial>
      </mesh>

      {/* Parallax depth: multiple layers of auroras */}
      <mesh ref={meshRef1} geometry={geometry} material={material} position={[0, 3, -5]} />
      <mesh ref={meshRef2} geometry={geometry} material={material} position={[0, 0, -10]} />
      <mesh ref={meshRef3} geometry={geometry} material={material} position={[0, 0, -15]} />
    </>
  );
}

export default AuroraBorealis;
