import { g } from "../../global"
import { vec } from "@ipota/vec"
import { Player } from "./../Player/Player"

type GS = {
    g: (me: Bullet, index: number) => Generator
    index: number
}

export class Bullet {
    life = 1

    length = 0
    r = 16
    p = vec(0, 0)
    speed = 8
    radian = 0

    delay = 0

    alpha = 1
    color = "yellow"
    appearance = Bullet.Appearance.Donut
    collision = Bullet.Collision.Ball
    type = Bullet.Type.Enemy
    scorenizable = true

    private g: Generator[] = []
    private gs: GS[] = []

    scorenize(player: Player) {
        this.r = 12
        this.color = "#abf0ff"
        this.type = Bullet.Type.Score
        this.alpha = 0.6
        this.delay = 0
        this.appearance = Bullet.Appearance.Score
        this.g = [this.move(), this.boundary(), this.homing(player)]
    }

    init() {
        this.g = [
            this.move(),
            this.boundary(),
            ...this.gs.map(({ g, index }) =>
                function* (this: Bullet) {
                    yield* Array(this.delay)
                    yield* g(this, index)
                }.bind(this)(),
            ),
        ]
    }

    tick() {
        // filter()は毎フレーム新しい配列を確保する。大半のジェネレータはwhile(1)で
        // 終わらないため、実行順序(move→boundary→独自g)を保ったまま同じ配列を
        // その場で詰め直し、実際に何か終了した時だけ配列を縮める
        let writeIndex = 0
        for (let readIndex = 0; readIndex < this.g.length; readIndex++) {
            const gen = this.g[readIndex]
            if (!gen.next().done) {
                this.g[writeIndex++] = gen
            }
        }
        this.g.length = writeIndex
    }

    G(gs: GS) {
        this.gs.push(gs)
    }

    clone(): Bullet {
        const b = Object.assign(new Bullet(), this)

        b.p = this.p.clone()
        b.gs = [...this.gs]
        b.g = [...this.g]

        return b
    }

    private *move() {
        yield* Array(this.delay)

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
            const v = player.p.sub(this.p).scale(1 / 7)

            this.speed = Math.max(v.magnitude(), 16)
            this.radian = v.radian()

            yield
        }
    }
}

export namespace Bullet {
    export enum Appearance {
        Donut,
        Ball,
        Line,
        Arrow,
        Beam,

        Player,
        Score,
    }
    export enum Collision {
        Ball,
        Line,
        Arrow,
        Rect,
    }
    export enum Type {
        Enemy,
        Neutral,
        Friend,
        Score,
        Effect,
    }
}
