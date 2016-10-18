export interface Star {
    x: number,
    y: number,
    size: number
}

export interface Shot {
    x: number,
    y?: number,
    timestamp?: number
}

export interface Enemy {
    x: number,
    y: number,
    shots: Array<Shot>,
    isDead: Boolean
}

export interface Spaceship {
    x: number,
    y: number
}

export interface ShotEvent {
    timestamp: number,
    value: Object | MouseEvent
}

export interface GameActors {
    stars: Array<Star>
    spaceship: Spaceship
    enemies: Array<Enemy>
    playerShots: Array<Shot>
    score: number
}
