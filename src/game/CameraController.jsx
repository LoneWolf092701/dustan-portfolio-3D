// src/game/CameraController.jsx
import { useFrame, useThree } from "@react-three/fiber";

const CameraController = ({ target }) => {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x = target.x + 8;
    camera.position.y = target.y + 10;
    camera.position.z = target.z + 8;
    camera.lookAt(target.x, target.y, target.z);
  });

  return null;
};

export default CameraController;