export enum DrawMessageType {
  END = "END",
  MOVING = "MOVING",
}

type DrawMessageArg<T, K = {}> = {
  type: T;
  params: K;
};

export type DrawMessage =
  | DrawMessageArg<DrawMessageType.END>
  | DrawMessageArg<DrawMessageType.MOVING, DrawParamsMoving>;

export interface DrawParamsMoving {
  x: number;
  y: number;
  color?: string;
}
