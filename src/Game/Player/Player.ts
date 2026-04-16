import { g, T } from "../../global"
import { TouchTracker } from "../../utils/TouchTracker"
import { Bullet } from "../Bullet/Bullet"
import { IInput, Operation } from "./Input"
import { PlayerRenderer } from "./PlayerRenderer"
import { remodel } from "../Bullet/Remodel"
import { vec } from "../../utils/Vec"
import { SE } from "../../SE"
import { Ctx } from "../../utils/Functions/Ctx"
import { Ease } from "../../utils/Functions/Ease"
import { GamepadTracker } from "../../utils/GamepadTracker"

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
    private readonly gamepadTracker: GamepadTracker
    private readonly touchTracker: TouchTracker

    private gs: Generator[] = []

    frame = 0
    isDead = false

    constructor(
        input: IInput,
        gamepadTracker: GamepadTracker,
        touchTracker: TouchTracker,
        private readonly scale: number,
    ) {
        this.input = input
        this.gamepadTracker = gamepadTracker
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

    isInvincible() {
        return this.dashFrame > 0 || this.deadFrame > 0
    }

    tick(ctx: CanvasRenderingContext2D) {
        this.move()
        this.tickFrames(ctx)
        this.fire()
        this.frame++
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.renderer.draw(ctx, this)
        this.gs = this.gs.filter((g) => !g.next().done)
    }

    // ----------------------------------------------------------------
    // tick helpers
    // ----------------------------------------------------------------

    private tickFrames(ctx: CanvasRenderingContext2D) {
        if (this.deadFrame > 0) this.deadFrame--
        if (this.dashFrame > 0) this.dashFrame--

        if (this.dashCoolDown > 0) {
            this.dashCoolDown--
            if (this.dashCoolDown === 0) {
                SE.charge.play()
                this.gs.push(this.charge(ctx))
            }
        }
    }

    private *charge(ctx: CanvasRenderingContext2D) {
        const frame = 30
        for (let i = 1; i < frame + 1; i++) {
            this.drawChargeRings(ctx, i, frame)
            this.drawChargeText(ctx, i, frame)
            ctx.globalAlpha = 1
            yield
        }
    }

    private drawChargeRings(ctx: CanvasRenderingContext2D, i: number, frame: number) {
        const r = Ease.Out(i / frame) * this.GRAZE_R * 3 + this.GRAZE_R * 3
        ctx.globalAlpha = 1 - i / frame
        Ctx.arc(ctx, this.p.l, r, "#ffffff80", { lineWidth: 2 })
        Ctx.arc(ctx, this.p.l, r + this.GRAZE_R / 4, "#ffffff80", {
            lineWidth: 2,
        })
        Ctx.arc(ctx, this.p.l, r / 2, "#ffffff80", { lineWidth: 2 })
    }

    private drawChargeText(ctx: CanvasRenderingContext2D, i: number, frame: number) {
        ctx.globalAlpha = 1 - i / frame
        const text = [..."CHARGED"]
        text.forEach((c, index) => {
            const p = this.p.plus(vec.arg(T * (index / text.length)).scaled(this.GRAZE_R * 3))
            Ctx.text(ctx, p.l, "#ffffff80", c, {
                fontFamily: "fraktur",
                fontSize: this.GRAZE_R,
            })
        })
    }

    // ----------------------------------------------------------------
    // move helpers
    // ----------------------------------------------------------------

    private move() {
        this.applyInput()
        this.applyGamepad()
        this.applyTouch()
        this.clampPosition()
        this.updateRenderer()
        this.input.tick()
        this.gamepadTracker.tick()
    }

    private applyInput() {
        const { pressed, pushed } = this.input
        this.v = vec(0, 0)

        if (pressed.has(Operation.Right)) this.v.x += 1
        if (pressed.has(Operation.Left)) this.v.x -= 1
        if (pressed.has(Operation.Down)) this.v.y += 1
        if (pressed.has(Operation.Up)) this.v.y -= 1

        this.v.normalize()
        this.applySpeedModifier(pressed, pushed)

        this.v.scale(this.BASE_SPEED)
        this.p.add(this.v)
    }

    private applyGamepad() {
        const { axis, isSlow, isDashPushed } = this.gamepadTracker
        if (axis.x === 0 && axis.y === 0 && !isDashPushed) return

        let v = axis.clone()
        if (v.magnitude() > 1) v.normalize()

        // 速度補正（デジタル入力側の dashFrame 等と干渉しないよう注意）
        if (isSlow) v.scale(0.5)

        if (isDashPushed && this.dashCoolDown === 0) {
            SE.dash.play()
            this.dashFrame = this.DASH_FRAME
            this.dashCoolDown = this.DASH_COOL_DOWN
        }

        if (this.dashFrame > 0) v.scale(7)

        this.p.add(v.scaled(this.BASE_SPEED))
    }

    private applySpeedModifier(pressed: Set<Operation>, pushed: Set<Operation>) {
        if (pressed.has(Operation.Slow)) {
            this.v.scale(0.5)
            return
        }
        if (pushed.has(Operation.Dash) && this.dashCoolDown === 0) {
            SE.dash.play()
            this.dashFrame = this.DASH_FRAME
            this.dashCoolDown = this.DASH_COOL_DOWN
        }
        if (this.dashFrame > 0) this.v.scale(7)
    }

    private applyTouch() {
        const delta = this.touchTracker.getDelta()
        if (delta) {
            this.p.x += delta.dx * this.scale
            this.p.y += delta.dy * this.scale
        }
    }

    private clampPosition() {
        if (this.isDead) return
        if (this.p.x < -g.width / 2) this.p.x = -g.width / 2
        if (this.p.x > g.width / 2) this.p.x = g.width / 2
        if (this.p.y < -g.height / 2) this.p.y = -g.height / 2
        if (this.p.y > g.height / 2) this.p.y = g.height / 2
    }

    private updateRenderer() {
        this.renderer.tick(this.v.x > 0, this.v.x < 0, this.isSneaking(), this.dashFrame > 0, this.p.x, this.p.y)
    }

    // ----------------------------------------------------------------
    // fire helpers
    // ----------------------------------------------------------------

    private fire() {
        if (this.frame % 3 !== 0) return
        this.isSneaking() ? this.fireSneakShot() : this.fireNormalShot()
    }

    private fireNormalShot() {
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
    }

    private fireSneakShot() {
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

    private isSneaking() {
        return this.input.pressed.has(Operation.Slow) || this.gamepadTracker.isSlow
    }
}
