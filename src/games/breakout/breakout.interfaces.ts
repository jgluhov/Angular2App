export type TICK = {
  time: number,
  delta: number
};

export type PADDLE_DIRECTION = number;

export type PADDLE_POSITION = number;

export type BRICK = {
  x: number,
  y: number,
  width: number,
  height: number
}

export type BALL_POSITION = {
  x: number,
  y: number
}

export type BALL_DIRECTION = {
  x: number,
  y: number
}

export type BALL = {
  position: BALL_POSITION,
  direction: BALL_DIRECTION
}

export type SCORE = number;
