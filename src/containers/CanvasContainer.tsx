import { useRef, useEffect } from "react";

import { useCanvasContext } from "contexts/CanvasContext";

const CanvasContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { onSetCanvasRef, onStartDrawing, onStopDrawing, onDrawing } =
    useCanvasContext();

  useEffect(() => {
    if (canvasRef.current != null) {
      onSetCanvasRef(canvasRef.current);
    }
  }, [onSetCanvasRef]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onPointerDown={onStartDrawing}
      onPointerUp={onStopDrawing}
      onPointerMove={onDrawing}
    />
  );
};

export default CanvasContainer;
