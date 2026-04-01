import { g } from "../../global"
import { Ease } from "../../utils/Functions/Ease"
import { Vec, vec } from "../../utils/Vec"
import { EnemyRendererCore } from "./EnemyRendererCore"
import { IEnemyRenderer } from "./IEnemyRenderer"

export class Enemy {
    damaged = false
    life = 100
    maxLife = 100
    r = 64
    p = vec(g.width / 2, -g.height)
    frame = 0
    isInvincible = false

    private readonly renderer: IEnemyRenderer
    private g: Generator[] = []

    protected margin = 30

    constructor(
        life: number,
        r: number,
        renderer: IEnemyRenderer = new EnemyRendererCore(),
    ) {
        this.renderer = renderer

        this.r = r

        this.life = life
        this.maxLife = life

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

    tick() {
        this.g = this.g.filter((g) => !g.next().done)
        this.frame++
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.renderer.draw(ctx, this)
        this.damaged = false
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

    protected moveTo(target: Vec, frame: number, easing: Ease.Type = Ease.Out) {
        const start = this.p.clone()

        this.g.push(
            function* (this: Enemy) {
                for (let i = 1; i < frame + 1; i++) {
                    this.p = start.plus(
                        target.minus(start).scaled(easing(i / frame)),
                    )
                    yield
                }
            }.bind(this)(),
        )

        return Array(frame)
    }
}
