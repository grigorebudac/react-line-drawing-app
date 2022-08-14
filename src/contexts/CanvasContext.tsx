import React, { useContext, createContext, useRef, useEffect } from "react";
import * as Canvas from "types/Canvas.types";

import { getRandomHexColor } from "utils/color.utils";
import { usePubNubContext } from "./PubNubContext";

type CanvasPointerCallback = (e: React.PointerEvent<HTMLCanvasElement>) => void;

interface CanvasContextValues {
  canvasRef: React.MutableRefObject<HTMLCanvasElement>;
  onSetCanvasRef: (canvas: HTMLCanvasElement) => void;
  onStartDrawing: CanvasPointerCallback;
  onStopDrawing: CanvasPointerCallback;
  onDrawing: CanvasPointerCallback;
}

const STROKE_LINE_WIDTH = 2;
const CHANGE_COLOR_KEY = "r";

export const CanvasContextProvider = (props: React.PropsWithChildren) => {
  const canvasRef = useRef({} as HTMLCanvasElement);
  const ctxRef = useRef({} as CanvasRenderingContext2D);
  const isDrawingRef = useRef(false);

  const { onSubscribeToChannel, onUnsubscribeFromChannel, onPublishMessage } =
    usePubNubContext();

  useEffect(() => {
    onSubscribeToChannel(handleReceiveMessage);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      onUnsubscribeFromChannel();
    };

    // eslint-disable-next-line
  }, []);

  function handleSetCanvasRef(canvas: HTMLCanvasElement) {
    canvasRef.current = canvas;
    ctxRef.current = canvasRef.current.getContext("2d")!;
  }

  function handleStartDrawing() {
    isDrawingRef.current = true;
  }

  function handleStopDrawing() {
    handleDrawEnd();

    onPublishMessage({
      type: Canvas.DrawMessageType.END,
      params: {},
    });
  }

  function handleDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) {
      return;
    }

    const x = e.clientX;
    const y = e.clientY;

    handleDraw({ x, y });

    onPublishMessage({
      type: Canvas.DrawMessageType.MOVING,
      params: {
        x: e.clientX,
        y: e.clientY,
        color: ctxRef.current.strokeStyle,
      },
    });
  }

  function handleDrawEnd() {
    isDrawingRef.current = false;

    ctxRef.current.stroke();
    ctxRef.current.beginPath();
  }

  function handleDraw(payload: Canvas.DrawParamsMoving) {
    ctxRef.current.lineWidth = STROKE_LINE_WIDTH;
    ctxRef.current.lineTo(payload.x, payload.y);
    ctxRef.current.stroke();

    if (payload.color != null) {
      ctxRef.current.strokeStyle = payload.color;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== CHANGE_COLOR_KEY) {
      return;
    }

    ctxRef.current.strokeStyle = getRandomHexColor();
  }

  function handleReceiveMessage(message: Canvas.DrawMessage) {
    if (message.type === Canvas.DrawMessageType.END) {
      ctxRef.current.stroke();
      ctxRef.current.beginPath();
    }

    if (message.type === Canvas.DrawMessageType.MOVING) {
      handleDraw(message.params);
    }
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
