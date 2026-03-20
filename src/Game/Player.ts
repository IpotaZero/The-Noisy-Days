import { g, T } from "../global"
import { TouchTracker } from "../utils/TouchTracker"
import { Bullet } from "./Bullet"
import { IInput, Operation } from "./Input"
import { PlayerRenderer } from "./PlayerRenderer"
import { remodel } from "./Remodel"
import { vec } from "./Vec"

export class Player {
    life = 8
    p = vec(0, 0)

    private invincibleFrame = 0
    invincibleCoolDown = 0

    readonly INVINCIBLE_FRAME = 15
    readonly INVINCIBLE_COOL_DOWN = 60

    readonly R = 4
    readonly GRAZE_R = 24
    readonly BASE_SPEED = 20

    private readonly renderer = new PlayerRenderer()
    private readonly input: IInput
    private readonly touchTracker: TouchTracker

    frame = 0

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

        this.fire()

        this.frame++
    }

    isInvincible() {
        return this.invincibleFrame > 0
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.renderer.draw(ctx, this)
    }

    private move() {
        const { pressed, pushed } = this.input
        const v = vec(0, 0)

        const movingRight = pressed.has(Operation.Right)
        const movingLeft = pressed.has(Operation.Left)

        if (movingRight) v.x += 1
        if (movingLeft) v.x -= 1
        if (pressed.has(Operation.Down)) v.y += 1
        if (pressed.has(Operation.Up)) v.y -= 1

        v.normalize()

        if (pressed.has(Operation.Slow)) {
            v.scale(0.5)
        } else if (pushed.has(Operation.Dash) && this.invincibleCoolDown === 0) {
            this.invincibleFrame = this.INVINCIBLE_FRAME
            this.invincibleCoolDown = this.INVINCIBLE_COOL_DOWN
        }

        if (this.invincibleFrame > 0) v.scale(4)

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

        this.renderer.tick(
            movingRight,
            movingLeft,
            this.isSneaking(),
            this.invincibleFrame > 0, // Dash 中かどうか
            this.p.x,
            this.p.y,
        )

        this.input.tick()
    }

    private fire() {
        if (this.frame % 3 === 0) {
            if (!this.isSneaking()) {
                remodel([new Bullet()])
                    .type(Bullet.Type.friend)
                    .appearance(Bullet.Appearance.player)
                    .color("#ffffff80")
                    .r(this.R)
                    .p(this.p.clone())
                    .radian(-T / 4)
                    .speed(48)
                    .nway(5, T / 48)
                    .fire()
            } else {
                remodel([new Bullet()])
                    .type(Bullet.Type.friend)
                    .appearance(Bullet.Appearance.player)
                    .color("#ffffff80")
                    .r(this.R)
                    .p(this.p.clone())
                    .radian(-T / 4)
                    .speed(48)
                    .shift(5, this.GRAZE_R)
                    .fire()
            }
        }
    }

    private isSneaking() {
        return this.input.pressed.has(Operation.Slow)
    }
}
