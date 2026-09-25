import { g, T } from "../../global"
import { Bullet } from "../Bullet/Bullet"
import { PlayerRenderer } from "./PlayerRenderer"
import { remodel } from "../Bullet/Remodel"
import { vec } from "@ipota/vec"
import { SE } from "../../SE"
import { Ctx } from "../../utils/Functions/Ctx"
import { Ease } from "../../utils/Functions/Ease"
import { AnalogInput, DigitalInput, TouchTracker } from "@ipota/input"
import { GeneratorQueue } from "../../utils/GeneratorQueue"

export class Player {
    life: number
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

    private readonly effects = new GeneratorQueue()

    frame = 0
    isDead = false

    constructor(
        private readonly di: DigitalInput.Reader<"slow" | "dash" | "cancel" | "ok">,
        private readonly ai: AnalogInput.Reader<"horizontal" | "vertical">,
        private readonly touch: TouchTracker,
        private readonly scale: number,
        initialLife: number,
    ) {
        this.life = initialLife
    }

    damage() {
        this.deadFrame = this.DASH_COOL_DOWN
        this.life--
    }

    remove() {
        this.isDead = true
        this.p.y = -g.height * 2
    }

    isInvincible() {
        return this.dashFrame > 0 || this.deadFrame > 0
    }

    tick(ctx: CanvasRenderingContext2D) {
        this.move()
        this.tickFrames(ctx)
        this.fire()
        this.emitScaleParticles(ctx)
        this.frame++
    }

    private emitScaleParticles(ctx: CanvasRenderingContext2D) {
        if (this.v.magnitude() < 0.1 && !this.isDead) return

        const isDashing = this.dashFrame > 0

        const count = isDashing ? 2 : 1
        for (let i = 0; i < count; i++) {
            this.effects.push(this.createScaleParticle(ctx, isDashing))
        }
    }

    private *createScaleParticle(ctx: CanvasRenderingContext2D, isDashing: boolean) {
        // 時間を少し長めにして、隙間の中に存在感を残す (20〜30フレーム)
        const maxFrame = isDashing ? 30 : 20

        // 自機の中心付近から発生（ブレを抑えてくっきり見せる）
        const offset = vec((Math.random() - 0.5) * this.GRAZE_R * 8, (Math.random() - 0.5) * this.GRAZE_R * 4)
        let p = this.p.add(offset)

        // 初速も控えめにして自機の軌跡上に残るようにする
        let vx = (Math.random() - 0.5) * 8 - this.v.x * 0.05
        let vy = (Math.random() - 0.5) * 8 - this.v.y * 0.05

        const size = Math.random() * 2 + 3
        let angle = Math.random() * T
        const angularVelocity = (Math.random() - 0.5) * 0.1 // ゆっくり回転

        for (let i = 0; i < maxFrame; i++) {
            // アルファ値を高くして色を濃く保つ (初期値 0.85)
            const alpha = (1 - i / maxFrame) * 0.35

            ctx.save()
            ctx.globalAlpha = alpha

            const color = "#e0e0e0"

            // 塗りつぶしの三角形を描画
            Ctx.polygon(ctx, 3, 1, p.l, size, color, {
                theta: angle,
            })
            ctx.restore()

            p = p.add(vec(vx, vy))
            vx *= 0.96
            vy *= 0.96
            angle += angularVelocity

            yield
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.renderer.draw(ctx, this)
        this.effects.advance()
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
                this.effects.push(this.charge(ctx))
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
            const p = this.p.add(vec.arg(T * (index / text.length)).scale(this.GRAZE_R * 3))
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
        if (!this.isDead) {
            this.applyInput()
            this.applyTouch()
        }

        this.clampPosition()
        this.updateRenderer()
    }

    private applyInput() {
        this.v = vec(0, 0)

        // Analog 優先（スティックが入力中ならそちらを使う）
        const axisX = this.ai.getValue("horizontal")
        const axisY = this.ai.getValue("vertical")

        if (axisX !== 0 || axisY !== 0) {
            this.v = vec(axisX, axisY)
        }

        if (this.v.magnitude() > 1) this.v.normalize()
        this.applySpeedModifier()
        this.v = this.v.scale(this.BASE_SPEED)
        this.p.x += this.v.x
        this.p.y += this.v.y
    }

    private applySpeedModifier() {
        if (this.di.isPushed("dash") && this.dashCoolDown === 0) {
            SE.dash.play()
            this.dashFrame = this.DASH_FRAME
            this.dashCoolDown = this.DASH_COOL_DOWN
        }

        if (this.dashFrame > 0) this.v = this.v.scale(7)

        if (this.di.isPressed("slow")) {
            this.v = this.v.scale(0.4)
        }
    }

    private applyTouch() {
        const delta = this.touch.getDelta()
        if (delta) {
            this.p.x += delta.x * this.scale
            this.p.y += delta.y * this.scale
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
        if (this.isDead) return
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
            // .inertia(this.v.scale(0.5))
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
            // .inertia(this.v.scale(0.5))
            .fire()
    }

    private isSneaking() {
        return this.di.isPressed("slow")
    }
}
