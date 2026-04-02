import { g, T } from "../../global"
import { TouchTracker } from "../../utils/TouchTracker"
import { Bullet } from "../Bullet/Bullet"
import { IInput, Operation } from "./Input"
import { PlayerRenderer } from "./PlayerRenderer"
import { remodel } from "../Bullet/Remodel"
import { vec } from "../../utils/Vec"
import { SE } from "../../SE"

export class Player {
    life = 8
    p = vec(0, 0)
    v = vec(0, 0)

    private deadFrame = 0
    private dashFrame = 0
    dashCoolDown = 0

    readonly DASH_FRAME = 15
    readonly DASH_COOL_DOWN = 60

    readonly r = 4
    readonly GRAZE_R = 24
    readonly BASE_SPEED = 20

    private readonly renderer = new PlayerRenderer()
    private readonly input: IInput
    private readonly touchTracker: TouchTracker

    frame = 0

    isDead = false

    constructor(
        input: IInput,
        touchTracker: TouchTracker,
        private readonly scale: number,
    ) {
        this.input = input
        this.touchTracker = touchTracker
    }

    damage() {
        this.deadFrame = this.DASH_COOL_DOWN
        this.life--
    }

    remove() {
        this.input.remove()
        this.touchTracker.remove()
        this.isDead = true
        this.p.y = -g.height
    }

    tick() {
        this.move()

        if (this.deadFrame > 0) this.deadFrame--
        if (this.dashFrame > 0) this.dashFrame--
        if (this.dashCoolDown > 0) this.dashCoolDown--

        this.fire()

        this.frame++
    }

    isInvincible() {
        return this.dashFrame > 0 || this.deadFrame > 0
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.renderer.draw(ctx, this)
    }

    private move() {
        const { pressed, pushed } = this.input
        this.v = vec(0, 0)

        const movingRight = pressed.has(Operation.Right)
        const movingLeft = pressed.has(Operation.Left)

        if (movingRight) this.v.x += 1
        if (movingLeft) this.v.x -= 1
        if (pressed.has(Operation.Down)) this.v.y += 1
        if (pressed.has(Operation.Up)) this.v.y -= 1

        this.v.normalize()

        if (pressed.has(Operation.Slow)) {
            this.v.scale(0.5)
        } else if (pushed.has(Operation.Dash) && this.dashCoolDown === 0) {
            SE.dash.play()
            this.dashFrame = this.DASH_FRAME
            this.dashCoolDown = this.DASH_COOL_DOWN
        }

        if (this.dashFrame > 0) this.v.scale(5)

        this.v.scale(this.BASE_SPEED)

        this.p.add(this.v)

        const delta = this.touchTracker.getDelta()
        if (delta) {
            this.p.x += delta.dx * this.scale
            this.p.y += delta.dy * this.scale
        }

        if (!this.isDead) {
            if (this.p.x < -g.width / 2) this.p.x = -g.width / 2
            if (this.p.x > g.width / 2) this.p.x = g.width / 2
            if (this.p.y < -g.height / 2) this.p.y = -g.height / 2
            if (this.p.y > g.height / 2) this.p.y = g.height / 2
        }

        this.renderer.tick(
            this.v.x > 0,
            this.v.x < 0,
            this.isSneaking(),
            this.dashFrame > 0, // Dash 中かどうか
            this.p.x,
            this.p.y,
        )

        this.input.tick()
    }

    private fire() {
        if (this.frame % 3 === 0) {
            if (!this.isSneaking()) {
                remodel()
                    .type(Bullet.Type.Friend)
                    .appearance(Bullet.Appearance.Player)
                    .color("#ffffff80")
                    .r(this.r)
                    .p(this.p.clone())
                    .radian(-T / 4)
                    .speed(48)
                    .nway(5, T / 48)
                    .fire()
            } else {
                remodel()
                    .type(Bullet.Type.Friend)
                    .appearance(Bullet.Appearance.Player)
                    .color("#ffffff80")
                    .r(this.r)
                    .p(this.p.clone())
                    .radian(-T / 4)
                    .speed(48)
                    .shift(5, this.GRAZE_R / 2)
                    .fire()
            }
        }
    }

    private isSneaking() {
        return this.input.pressed.has(Operation.Slow)
    }
}
