import { Bullet } from "./Game/Bullet"
import { Enemy } from "./Game/Enemy"

export const g = {
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    player: undefined,

    width: 630,
    height: 1120,
}

export const T = Math.PI * 2
