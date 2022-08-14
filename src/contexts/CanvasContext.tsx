import React, { useContext, createContext, useRef, useEffect } from "react";

import { getRandomHexColor } from "utils/getRandomHexColor";

interface CanvasContextValues {
  canvasRef: React.MutableRefObject<HTMLCanvasElement>;
  onSetCanvasRef: (canvas: any) => void;
  onStartDrawing: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onStopDrawing: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onDrawing: (e: React.PointerEvent<HTMLCanvasElement>) => void;
}

const STROKE_LINE_WIDTH = 2;
const CHANGE_COLOR_KEY = "r";

export const CanvasContextProvider = (props: React.PropsWithChildren) => {
  const canvasRef = useRef({} as HTMLCanvasElement);
  const ctxRef = useRef({} as CanvasRenderingContext2D);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleSetCanvasRef(canvas: HTMLCanvasElement) {
    canvasRef.current = canvas;
    ctxRef.current = canvasRef.current.getContext("2d")!;
  }

  function handleStartDrawing() {
    isDrawingRef.current = true;
  }

  function handleStopDrawing() {
    isDrawingRef.current = false;

    ctxRef.current.stroke();
    ctxRef.current.beginPath();
  }

  function handleDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) {
      return;
    }

    ctxRef.current.lineWidth = STROKE_LINE_WIDTH;

    ctxRef.current.lineTo(e.clientX, e.clientY);
    ctxRef.current.stroke();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== CHANGE_COLOR_KEY) {
      return;
    }

    ctxRef.current.strokeStyle = getRandomHexColor();
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        onSetCanvasRef: handleSetCanvasRef,
        onStartDrawing: handleStartDrawing,
        onStopDrawing: handleStopDrawing,
        onDrawing: handleDrawing,
      }}
    >
      {props.children}
    </CanvasContext.Provider>
  );
};

const CanvasContext = createContext<CanvasContextValues>(
  {} as CanvasContextValues
);

export const useCanvasContext = () => useContext(CanvasContext);
