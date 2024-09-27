import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Props for the Text3DAnimated component
 * @property {string} text - The text to be displayed
 * @property {string} color - The color of the text
 * @property {[number, number, number]} position - The position of the text in 3D space
 * @property {number} [size=0.5] - The size of the text (optional, default is 0.5)
 * @property {number} [height=0.2] - The extrusion height of the text (optional, default is 0.2)
 * @property {string} [font='/fonts/helvetiker_regular.typeface.json'] - The path to the font file (optional)
 */
interface Text3DAnimatedProps {
  text: string
  color: string
  position: [number, number, number]
  size?: number
  height?: number
  font?: string
}

/**
 * A component that renders animated 3D text
 * @param {Text3DAnimatedProps} props - The props for the component
 * @returns {JSX.Element} The rendered 3D text
 */
const Text3DAnimated: React.FC<Text3DAnimatedProps> = ({
  text,
  color,
  position,
  size = 0.5,
  height = 0.2,
  font = '/fonts/helvetiker_regular.typeface.json'
}) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Center position={position}>
      <Text3D
        ref={meshRef}
        font={font}
        size={size}
        height={height}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshPhongMaterial color={color} />
      </Text3D>
    </Center>
  )
}

export default Text3DAnimated