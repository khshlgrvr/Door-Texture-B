import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center, OrbitControls } from '@react-three/drei'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { state } from './components/store'

export const App = ({ position = [0, 0, 2.5], fov = 25 }) => (
  <Canvas shadows camera={{ position: [0, 0, 10], fov }} gl={{ preserveDrawingBuffer: true }} eventSource={document.getElementById('root')} eventPrefix="client">
    <ambientLight intensity={3} />
    <pointLight position={[2, 2, 10]} intensity={0.5} />
    {/* <pointLight position={[20, 10, -10]} intensity={3} /> */}
    <Environment files="./potsdamer_platz_1k.hdr" />
    <Backdrop />
    {/* <CameraRig>
      <Center>
      </Center>
    </CameraRig> */}
    <DoorModel position={[0, -1, 0]} rotation={[0, Math.PI / 2, 0]} />
    <planeBufferGeometry castShadow args={[100, 100]} />
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      enableDamping={true}
      dampingFactor={0.08}
      rotateSpeed={0.6}

      // Limit up/down tilt
      minPolarAngle={Math.PI / 5}
      maxPolarAngle={Math.PI / 2}

      // Allow limited horizontal rotation (left-right)
      minAzimuthAngle={-Math.PI / 4}   // rotate left 45°
      maxAzimuthAngle={Math.PI / 4}    // rotate right 45°
    />
  </Canvas>
)

function Backdrop() {
  const shadows = useRef()
  useFrame((state, delta) => easing.dampC(shadows.current.getMesh().material.color, state.color, 0.25, delta))
  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={5}
      resolution={2048}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}>
      <RandomizedLight amount={4} radius={9} intensity={1 * Math.PI} ambient={0.25} position={[5, 5, -10]} />
      <RandomizedLight amount={4} radius={5} intensity={0.25 * Math.PI} ambient={0.55} position={[-5, 5, -9]} />
    </AccumulativeShadows>
  )
}

function CameraRig({ children }) {


  const group = useRef()
  const snap = useSnapshot(state)
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [snap.intro ? -state.viewport.width / 4 : 0, 0, 7], 0.25, delta)
    easing.dampE(group.current.rotation, [-state.pointer.y / 10, -state.pointer.x / 5, 0], 0.25, delta)
  })
  return <group ref={group}>{children}</group>
}

function DoorModel(props) {
  const { nodes, materials } = useGLTF('./door/DOOR_C_6.gltf')
  const snap = useSnapshot(state)


  if (materials['Baked_B_4.002']) {
    materials['Baked_B_4.002'].metalness = 0.5
    materials['Baked_B_4.002'].roughness = 0.55
  }
  if (materials.Gold) {
    materials.Gold.color.set("#f7c766")
    materials.Gold.metalness = 1
    materials.Gold.roughness = 0.25
  }

  useFrame((state, delta) => easing.dampC(materials['Baked_B_4.002'].color, snap.color, 0.25, delta))
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.door001.geometry} material={materials['Baked_B_4.002']} position={[0.05, 0, 0.49]} />
      <group position={[0.02, 1.074, -0.561]}>
        <mesh geometry={nodes.Mesh_88002.geometry} material={materials.Blackhandle} />
        <mesh geometry={nodes.Mesh_88002_1.geometry} material={materials.numberkey} />
      </group>
      <group position={[0, 0, 0.5]}>
        <mesh geometry={nodes.Mesh_80005.geometry} material={materials['Baked_B_4.002']} />
        <mesh geometry={nodes.Mesh_80005_1.geometry} material={materials.Gold} />
      </group>
      <mesh geometry={nodes.door004.geometry} material={materials['Baked_B_4.002']} position={[0.039, 1.007, -0.435]} scale={[0.808, 0.081, 1]} />
      <mesh geometry={nodes.Plane001.geometry} material={materials.blaack} position={[0.037, 1.007, -0.342]} rotation={[0, 0, -Math.PI / 2]} scale={[0.099, 0.105, 0.105]} />
      <mesh geometry={nodes.Plane.geometry} material={materials.ground} position={[0.044, 0, -0.2]} />
      <mesh geometry={nodes.door005.geometry} material={materials['Baked_B_4.002']} position={[0.044, 1.255, -0.09]} />
      <mesh geometry={nodes.door006.geometry} material={materials['Baked_B_4.002']} position={[0, 0, 0.5]} />
    </group>
  )
}

export default App;

useGLTF.preload('./door/DOOR_C_6.gltf')
  ;['/react.png', '/three2.png', '/pmndrs.png'].forEach(useTexture.preload)
