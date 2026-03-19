import { g } from "../global"
import { vec } from "./Vec"

export class Bullet {
    life = 1

    r = 16
    p = vec(0, 0)
    speed = 0
    radian = 0

    alpha = 1
    color = "yellow"
    appearance = Bullet.Appearance.donut
    collision = Bullet.Collision.ball

    private g: Generator[]

    constructor() {
        this.g = [this.move(), this.boundary()]
    }

    tick() {
        this.g = this.g.filter((g) => !g.next().done)
    }

    private *move() {
        while (1) {
            this.p.x += Math.cos(this.radian) * this.speed
            this.p.y += Math.sin(this.radian) * this.speed
            yield
        }
    }

    private *boundary() {
        while (1) {
            if (
                this.p.x < -g.width / 2 ||
                g.width / 2 < this.p.x ||
                this.p.y < -g.height / 2 ||
                g.height / 2 < this.p.y
            ) {
                this.life = 0
            }
            yield
        }
    }
}

export namespace Bullet {
    export enum Appearance {
        donut,
        ball,
        line,
    }
    export enum Collision {
        ball,
        line,
    }
}
