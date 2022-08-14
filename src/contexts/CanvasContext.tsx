import React, { useContext, createContext, useRef, useCallback } from "react";

interface CanvasContextValues {
  canvasRef: React.MutableRefObject<{}>;
  onSetCanvasRef: (canvas: any) => void;
}

export const CanvasContextProvider = (props: React.PropsWithChildren) => {
  const canvasRef = useRef({});

  const handleSetCanvasRef = useCallback((canvas: any) => {
    canvasRef.current = canvas;
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        onSetCanvasRef: handleSetCanvasRef,
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
