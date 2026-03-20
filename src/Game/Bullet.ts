import { g } from "../global"
import { vec } from "../utils/Vec"

export class Bullet {
    life = 1

    r = 16
    p = vec(0, 0)
    speed = 8
    radian = 0

    alpha = 1
    color = "yellow"
    appearance = Bullet.Appearance.Donut
    collision = Bullet.Collision.ball
    type = Bullet.Type.Enemy

    private g: Generator[] = []
    private gs: ((me: Bullet) => Generator)[] = []

    init() {
        this.g = [this.move(), this.boundary(), ...this.gs.map((g) => g(this))]
    }

    tick() {
        this.g = this.g.filter((g) => !g.next().done)
    }

    G(g: (me: Bullet) => Generator) {
        this.gs.push(g)
    }

    F(f: (me: Bullet) => void, count = Infinity) {
        this.G(function* (me) {
            while (count--) {
                f(me)
                yield
            }
        })
    }

    clone(): Bullet {
        const b = { ...this }

        b.p = this.p.clone()
        b.gs = [...this.gs]
        b.g = [...this.g]
        ;(b as any).__proto__ = Bullet.prototype

        return b
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
                this.p.x + this.r < -g.width / 2 ||
                g.width / 2 < this.p.x - this.r ||
                this.p.y + this.r < -g.height / 2 ||
                g.height / 2 < this.p.y - this.r
            ) {
                this.life = 0
            }
            yield
        }
    }
}

export namespace Bullet {
    export enum Appearance {
        Donut,
        Ball,
        Line,
        Player,
    }
    export enum Collision {
        ball,
        line,
    }
    export enum Type {
        Enemy,
        Friend,
    }
}
