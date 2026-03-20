import { Bullet } from "./Game/Bullet"
import { Enemy } from "./Game/Enemy"
import { Player } from "./Game/Player"

export const g = {
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    player: undefined as unknown as Player,

    width: 630,
    height: 1120,
}

export const T = Math.PI * 2

export function scorenize() {
    g.bullets
        .filter((b) => b.type === Bullet.Type.Enemy)
        .forEach((b) => {
            b.scorenize(g.player)
        })
}
