export type Star = {
    x: number,
    y: number,
    size: number
}

export type Shot = {
    x: number,
    y?: number,
    timestamp?: number,
    isActive: boolean
}

export type Enemy = {
    x: number,
    y: number,
    shots: Array<Shot>,
    isDead: Boolean
}

export type SpaceshipPosition = {
    x: number,
    y: number
}

export type Spaceship = {
    health: number,
    position: SpaceshipPosition,
    isDead: boolean
}

export type ShotEvent = {
    timestamp: number,
    value: Object | MouseEvent
}

export type GameActors = {
    stars: Array<Star>,
    spaceship: Spaceship,
    enemies: Array<Enemy>,
    playerShots: Array<Shot>,
    score: number,
    health: number
}
