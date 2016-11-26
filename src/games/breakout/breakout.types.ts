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

export type COLLISIONS = {
  paddle: boolean,
  floor: boolean,
  wall: boolean,
  ceiling: boolean,
  brick: boolean
}

export type GAME_OBJECTS = {
  ball: BALL,
  bricks: BRICK[],
  collisions: COLLISIONS,
  score: number
};

export type UPDATE_GAME_PARAMS = [
  TICK,
  PADDLE_DIRECTION,
  GAME_OBJECTS
];
