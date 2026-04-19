import { g, T } from "../../global"
import { Bullet } from "../Bullet/Bullet"
import { PlayerRenderer } from "./PlayerRenderer"
import { remodel } from "../Bullet/Remodel"
import { vec } from "../../utils/Vec"
import { SE } from "../../SE"
import { Ctx } from "../../utils/Functions/Ctx"
import { Ease } from "../../utils/Functions/Ease"
import { IUnifiedInput } from "../../utils/UnifiedInput/Input"
import { Action, MyActionId } from "../../utils/UnifiedInput/DefaultConfig"

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

    private gs: Generator[] = []

    frame = 0
    isDead = false

    constructor(
        private readonly input: IUnifiedInput<MyActionId>,
        private readonly scale: number,
    ) {}

    damage() {
        this.deadFrame = this.DASH_COOL_DOWN
        this.life--
    }

    remove() {
        this.input.remove()
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
        this.applyTouch()
        this.clampPosition()
        this.updateRenderer()
        this.input.tick()
    }

    private applyInput() {
        this.v = vec(0, 0)

        // Analog 優先（スティックが入力中ならそちらを使う）
        const axisX = this.input.getAxis(Action.MoveX)
        const axisY = this.input.getAxis(Action.MoveY)

        if (axisX !== 0 || axisY !== 0) {
            this.v = vec(axisX, axisY)
        } else {
            // Digital フォールバック
            if (this.input.isPressed(Action.MoveRight)) this.v.x += 1
            if (this.input.isPressed(Action.MoveLeft)) this.v.x -= 1
            if (this.input.isPressed(Action.MoveDown)) this.v.y += 1
            if (this.input.isPressed(Action.MoveUp)) this.v.y -= 1
        }

        if (this.v.magnitude() > 1) this.v.normalize()
        this.applySpeedModifier()
        this.v.scale(this.BASE_SPEED)
        this.p.add(this.v)
    }

    private applySpeedModifier() {
        if (this.input.isPressed(Action.Slow)) {
            this.v.scale(0.5)
            return
        }
        if (this.input.isPushed(Action.Dash) && this.dashCoolDown === 0) {
            SE.dash.play()
            this.dashFrame = this.DASH_FRAME
            this.dashCoolDown = this.DASH_COOL_DOWN
        }
        if (this.dashFrame > 0) this.v.scale(7)
    }

    private applyTouch() {
        const delta = this.input.getPointerDelta()
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
        return this.input.isPressed(Action.Slow)
    }
}
