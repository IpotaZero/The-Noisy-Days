import { g } from "../../global"
import { Ease } from "../../utils/Functions/Ease"
import { Vec, vec } from "../../utils/Vec"
import { remodel } from "../Bullet/Remodel"
import { EnemyRendererCore } from "./EnemyRendererCore"
import { IEnemyRenderer } from "./IEnemyRenderer"

export class Enemy {
    damaged = false
    life = 100
    maxLife = 100
    chargeRemaining = 0
    chargeMax = 0 // waitCharge() 呼び出し時の初期値。レンダラーが進捗計算に使う

    r = 64
    p = vec(g.width / 2, -g.height)
    frame = 0
    isInvincible = false

    readonly renderer: IEnemyRenderer
    protected g: Generator[] = []

    protected margin = 30

    constructor(
        life: number,
        r: number,
        renderer: IEnemyRenderer = new EnemyRendererCore(),
        { remainingCharge, margin }: { remainingCharge?: number; margin?: number } = {},
    ) {
        this.margin = margin ?? 30

        this.renderer = renderer

        this.r = r

        this.life = life
        this.maxLife = life
        this.chargeRemaining = remainingCharge ?? 0
        this.chargeMax = remainingCharge ?? 0

        if ("G" in this) {
            this.g.push(
                function* (this: any) {
                    yield* Array(this.margin)
                    while (1) yield* this.G()
                }.bind(this)(),
            )
        }
        if ("H" in this) {
            this.g.push(
                function* (this: any) {
                    yield* Array(this.margin)
                    while (1) yield* this.H()
                }.bind(this)(),
            )
        }
    }

    hit(damage: number) {
        if (this.isInvincible) return

        // 充電中はダメージを受けるたびに充電を早める
        if (this.chargeRemaining > 0) {
            this.chargeRemaining -= damage
        } else {
            this.life -= damage
        }

        this.damaged = true
    }

    tick() {
        // 充電カウントダウン
        if (this.chargeRemaining > 0) this.chargeRemaining--

        const done = this.g.map((g) => g.next().done)
        this.g = this.g.filter((_, i) => !done[i])
        this.frame++
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.renderer.draw(ctx, this)
        this.damaged = false
    }

    protected *waitCharge(): Generator<void, void, unknown> {
        while (this.chargeRemaining > 0) yield
    }

    protected setParent(enemy: Enemy, position: () => Vec) {
        this.g.push(
            function* (this: Enemy) {
                while (1) {
                    if (enemy.life <= 0) {
                        this.life = 0
                        return
                    }

                    this.p = enemy.p.plus(position())
                    yield
                }
            }.bind(this)(),
        )
    }

    protected moveTo(target: Vec, frame: number, easing: Ease.Type = Ease.Out): void[] {
        const start = this.p.clone()

        this.g.push(
            function* (this: Enemy) {
                for (let i = 1; i < frame + 1; i++) {
                    this.p = start.plus(target.minus(start).scaled(easing(i / frame)))
                    yield
                }
            }.bind(this)(),
        )

        return Array(frame)
    }

    protected funnel(v: Vec) {
        this.g.push(
            function* (this: Enemy) {
                while (1) {
                    if (this.p.x < -g.width / 2) {
                        v.x *= -1
                        this.p.x = -g.width / 2
                    }

                    if (g.width / 2 < this.p.x) {
                        v.x *= -1
                        this.p.x = g.width / 2
                    }

                    if (this.p.y < -g.height / 2) {
                        v.y *= -1
                        this.p.y = -g.height / 2
                    }

                    if (g.height / 2 < this.p.y) {
                        v.y *= -1
                        this.p.y = g.height / 2
                    }

                    this.p.add(v)

                    yield
                }
            }.bind(this)(),
        )
    }

    protected mine(timeoutFrame: number, callback: (this: Enemy) => Generator) {
        const r = this.r

        this.r = 0

        this.g.push(
            function* (this: Enemy) {
                for (let i = 1; i < 15 + 1; i++) {
                    this.r = r * Ease.InOut(i / 15)
                    yield
                }

                let i = 0

                while (1) {
                    if (i > timeoutFrame || this.p.minus(g.player.p).magnitude() < this.r * 3) {
                        break
                    }

                    if (g.height / 2 + this.r < this.p.y) {
                        this.life = 0
                    }

                    i++
                    yield
                }

                yield* callback.call(this)
                this.life = 0
            }.bind(this)(),
        )
    }
}
