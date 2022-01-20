import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky, ContactShadows, Select, useSelect, Edges, Environment, OrbitControls, useCursor } from '@react-three/drei'
import { Panel, useControls } from './MultiLeva'

function Cube({ color = 'white', thickness = 2, roughness = 0.53, envMapIntensity = 1, transmission = 0, metalness, ...props }) {
  const [hovered, setHover] = useState(false)
  const selected = useSelect().map((sel) => sel.userData.store)
  const [store, materialProps] = useControls(selected, {
    color: { value: color },
    roughness: { value: roughness, min: 0, max: 1 },
    thickness: { value: thickness, min: -10, max: 10 },
    envMapIntensity: { value: envMapIntensity, min: 0, max: 10 },
    transmission: { value: transmission, min: 0, max: 1 },
    ...(metalness !== undefined && { metalness: { value: metalness, min: 0, max: 1 } })
  })
  const isSelected = !!selected.find((sel) => sel === store)
  useCursor(hovered)
  return (
    <mesh
      {...props}
      userData={{ store }}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={(e) => setHover(false)}>
      <boxGeometry />
      <meshPhysicalMaterial {...materialProps} />
      <Edges visible={isSelected} scale={1.1} renderOrder={1000}>
        <meshBasicMaterial transparent color="#333" depthTest={false} />
      </Edges>
    </mesh>
  )
}

export default function App() {
  const [selected, setSelected] = useState([])
  return (
    <>
      <Canvas dpr={[1, 2]} orthographic camera={{ position: [-10, 10, 10], zoom: 100 }}>
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Select multiple box onChange={setSelected}>
            <Cube position={[-1, 0, 0]} color="orange" transmission={1} envMapIntensity={5} />
            <Cube position={[0, 0, -1]} color="skyblue" />
            <Cube position={[1, 0, 0]} color="hotpink" transmission={1} envMapIntensity={5} />
            <Cube position={[0, 0, 1]} color="aquamarine" metalness={0} />
          </Select>
          <Environment preset="city" />
          <ContactShadows frames={1} position={[0, -0.5, 0]} scale={10} opacity={0.5} far={1} blur={2} />
        </Suspense>
        <OrbitControls makeDefault rotateSpeed={2} minPolarAngle={0} maxPolarAngle={Math.PI / 2.5} />
        <Sky />
      </Canvas>
      <Panel selected={selected} />
    </>
  )
}
