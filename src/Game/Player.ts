import { g } from "../global"
import { TouchTracker } from "../utils/TouchTracker"
import { Ctx } from "./Ctx"
import { IInput, Operation } from "./Input"
import { vec } from "./Vec"

export class Player {
    life = 8
    p = vec(0, 0)

    private invincibleFrame = 0
    private invincibleCoolDown = 0

    readonly INVINCIBLE_FRAME = 15
    readonly INVINCIBLE_COOL_DOWN = 60

    readonly R = 6
    readonly GRAZE_R = 24
    readonly BASE_SPEED = 16

    private drawRadian = 0

    private readonly input
    private readonly touchTracker

    constructor(
        input: IInput,
        touchTracker: TouchTracker,
        private readonly scale: number,
    ) {
        this.input = input
        this.touchTracker = touchTracker
    }

    tick() {
        this.move()

        if (this.invincibleFrame > 0) this.invincibleFrame--
        if (this.invincibleCoolDown > 0) this.invincibleCoolDown--
    }

    isInvincible() {
        return this.invincibleFrame > 0
    }

    draw(ctx: CanvasRenderingContext2D) {
        Ctx.arc(ctx, this.p.l, this.R, "red", { lineWidth: 0 })
        Ctx.arc(ctx, this.p.l, this.GRAZE_R, "#ffffff80", { lineWidth: 2 })
    }

    private move() {
        const operations = this.input.tick()

        const v = vec(0, 0)

        if (operations.includes(Operation.Right)) {
            v.x += 1
        }
        if (operations.includes(Operation.Left)) {
            v.x -= 1
        }
        if (operations.includes(Operation.Down)) {
            v.y += 1
        }
        if (operations.includes(Operation.Up)) {
            v.y -= 1
        }

        v.normalize()

        if (operations.includes(Operation.Slow)) {
            v.scale(0.5)
        } else if (operations.includes(Operation.Dash) && this.invincibleCoolDown === 0) {
            this.invincibleFrame = this.INVINCIBLE_FRAME
            this.invincibleCoolDown = this.INVINCIBLE_COOL_DOWN
        }

        if (this.invincibleFrame > 0) {
            v.scale(3)
        }

        v.scale(this.BASE_SPEED)

        this.p.add(v)

        const delta = this.touchTracker.getDelta()
        if (delta) {
            this.p.x += delta.dx * this.scale
            this.p.y += delta.dy * this.scale
        }

        if (this.p.x < -g.width / 2) this.p.x = -g.width / 2
        if (this.p.x > g.width / 2) this.p.x = g.width / 2
        if (this.p.y < -g.height / 2) this.p.y = -g.height / 2
        if (this.p.y > g.height / 2) this.p.y = g.height / 2
    }
}
