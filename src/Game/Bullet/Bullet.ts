import { g } from "../../global"
import { vec } from "../../utils/Vec"
import { Player } from "./../Player/Player"

export class Bullet {
    life = 1

    r = 16
    p = vec(0, 0)
    speed = 8
    radian = 0

    alpha = 1
    color = "yellow"
    appearance = Bullet.Appearance.Donut
    collision = Bullet.Collision.Ball
    type = Bullet.Type.Enemy

    private g: Generator[] = []
    private gs: ((me: Bullet) => Generator)[] = []

    scorenize(player: Player) {
        this.r = 16
        this.color = "lightcyan"
        this.type = Bullet.Type.Score
        this.alpha = 0.6
        this.appearance = Bullet.Appearance.Score
        this.g = [this.move(), this.boundary(), this.homing(player)]
    }

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

    private *homing(player: Player) {
        while (1) {
            const v = player.p.minus(this.p).scaled(1 / 7)

            this.speed = Math.max(v.magnitude(), 16)
            this.radian = v.arg()

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
        Score,
    }
    export enum Collision {
        Ball,
        Line,
    }
    export enum Type {
        Enemy,
        Friend,
        Score,
        Effect,
    }
}
