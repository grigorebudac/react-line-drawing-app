import React, { useContext, createContext, useRef, useCallback } from "react";

interface CanvasContextValues {
  canvasRef: React.MutableRefObject<HTMLCanvasElement>;
  onSetCanvasRef: (canvas: any) => void;
  onStartDrawing: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onStopDrawing: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onDrawing: (e: React.PointerEvent<HTMLCanvasElement>) => void;
}

const STROKE_LINE_WIDTH = 2;

export const CanvasContextProvider = (props: React.PropsWithChildren) => {
  const canvasRef = useRef({} as HTMLCanvasElement);
  const ctxRef = useRef({} as CanvasRenderingContext2D);
  const isDrawingRef = useRef(false);

  const handleSetCanvasRef = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
    ctxRef.current = canvasRef.current.getContext("2d")!;
  }, []);

  const handleStartDrawing: CanvasContextValues["onStartDrawing"] = useCallback(
    (e) => {
      isDrawingRef.current = true;
    },
    []
  );

  const handleStopDrawing: CanvasContextValues["onStopDrawing"] = useCallback(
    (e) => {
      isDrawingRef.current = false;

      ctxRef.current.stroke();
      ctxRef.current.beginPath();
    },
    []
  );

  const handleDrawing: CanvasContextValues["onDrawing"] = useCallback((e) => {
    if (!isDrawingRef.current) {
      return;
    }

    ctxRef.current.lineWidth = STROKE_LINE_WIDTH;

    ctxRef.current.lineTo(e.clientX, e.clientY);
    ctxRef.current.stroke();
  }, []);

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
