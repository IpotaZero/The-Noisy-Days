import { Dom } from "./Dom"
import { Bullet } from "./Game/Bullet/Bullet"
import { Enemy } from "./Game/Enemy/Enemy"
import { Player } from "./Game/Player/Player"
import { Remodel, remodel } from "./Game/Bullet/Remodel"
import { Ease } from "./utils/Functions/Ease"
import { shake } from "./utils/shake"
import { Vec, vec } from "./utils/Vec"
import { UnifiedInput } from "./utils/UnifiedInput/UnifiedInput"
import { DEFAULT_CONFIG } from "./utils/UnifiedInput/DefaultConfig"

export const g = {
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    player: undefined as unknown as Player,

    width: 630,
    height: 1120,

    input: new UnifiedInput(DEFAULT_CONFIG),
}

export const T = Math.PI * 2

export function scorenize() {
    g.bullets
        .filter((b) => b.type === Bullet.Type.Enemy || b.type === Bullet.Type.Neutral)
        .filter((b) => b.scorenizable)
        .forEach((b) => {
            b.scorenize(g.player)
        })
}

export function* fireDeleteField(ctx: CanvasRenderingContext2D) {
    shake(Dom.container, 1000, 12)

    if (g.player.life < 0) {
        explosion(g.player.p.clone())
        return
    }

    const frame = 45

    const p = g.player.p.clone()

    for (let i = 1; i < frame + 1; i++) {
        const r = Ease.Out(i / frame) * g.width
        const alpha = 1 - i / frame

        ctx.save()
        ctx.translate(g.width / 2, g.height / 2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, T)
        ctx.stroke()
        ctx.restore()

        g.bullets
            .filter((b) => b.type === Bullet.Type.Enemy || b.type === Bullet.Type.Neutral)
            .filter((b) => b.scorenizable)
            .filter((b) => b.p.minus(p).magnitude() <= r)
            .forEach((b) => {
                b.scorenize(g.player)
            })

        yield
    }
}

export function explosion(p: Vec) {
    remodel()
        .p(p)
        .type(Bullet.Type.Effect)
        .color("white")
        .duplicate(16, (b) => {
            b.r = Math.random() * 8 + 8
            b.speed = Math.random() * 4 + 4
            b.radian = Math.random() * T
            return b
        })
        .alpha(0.5)
        .g((me) => Remodel.fadeout(me, 60))
        .fire()
}

// 並行ジェネレータをまとめて走らせるユーティリティ
function* parallel(...gens: Generator[]) {
    while (true) {
        const results = gens.map((g) => g.next())
        if (results.every((r) => r.done)) break
        yield
    }
}

export function* bossDefeat(ctx: CanvasRenderingContext2D, bossP: Vec) {
    const maxR = Math.hypot(g.width, g.height)

    // ===== 第一波: スロー中に炸裂（FPS10でゆっくり見える）=====

    // パーティクルをまず叩き込む
    remodel()
        .p(bossP)
        .type(Bullet.Type.Effect)
        .color("white")
        .duplicate(96, (b) => {
            b.r = Math.random() * 20 + 8
            b.speed = Math.random() * 18 + 4
            b.radian = Math.random() * T
            return b
        })
        .alpha(0.9)
        .g((me) => Remodel.fadeout(me, 150))
        .fire()

    // 5色波紋 + 光の柱を同時展開（スロー中に映える）
    yield* parallel(
        ...[
            { delay: 0, color: "255,255,255", lw: 12, speed: 1.4 },
            { delay: 4, color: "255,255,255", lw: 8, speed: 1.7 },
            { delay: 8, color: "255,255,255", lw: 6, speed: 2.0 },
            { delay: 12, color: "255,255,255", lw: 5, speed: 2.3 },
            { delay: 16, color: "255,255,255", lw: 4, speed: 2.6 },
        ].map(({ delay, color, lw, speed }) =>
            (function* () {
                yield* Array(delay)
                const frame = 60
                for (let i = 1; i < frame + 1; i++) {
                    const r = Ease.Out(i / frame) * maxR * speed
                    const alpha = (1 - i / frame) * 0.9

                    ctx.save()
                    ctx.translate(g.width / 2, g.height / 2)
                    ctx.strokeStyle = `rgba(${color}, ${alpha})`
                    ctx.lineWidth = lw
                    ctx.beginPath()
                    ctx.arc(bossP.x, bossP.y, r, 0, T)
                    ctx.stroke()
                    ctx.restore()

                    g.bullets
                        .filter((b) => b.type === Bullet.Type.Enemy || b.type === Bullet.Type.Neutral)
                        .filter((b) => b.p.minus(bossP).magnitude() <= r)
                        .forEach((b) => b.scorenize(g.player))

                    yield
                }
            })(),
        ),

        // 8本の光の柱（スローで回転がドラマチックに見える）
        // しばくぞ
        (function* () {
            const frame = 60
            for (let i = 0; i < frame; i++) {
                ctx.save()
                ctx.translate(g.width / 2, g.height / 2)
                const alpha = i < frame / 2 ? i / (frame / 2) : (frame - i) / (frame / 2)
                for (let j = 0; j < 13; j++) {
                    const angle = (j / 13) * T + (i / frame) * T * 2 * 0.5
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`
                    ctx.lineWidth = 3
                    ctx.beginPath()
                    ctx.moveTo(bossP.x, bossP.y)
                    ctx.lineTo(bossP.x + Math.cos(angle) * maxR, bossP.y + Math.sin(angle) * maxR)
                    ctx.stroke()
                }
                ctx.restore()
                yield
            }
        })(),
    )

    // ===== 大爆発: FPSが戻りきったところで炸裂 =====

    shake(Dom.container, 250, 32)

    // 128個の超巨大パーティクル
    remodel()
        .p(bossP)
        .type(Bullet.Type.Effect)
        .color("white")
        .duplicate(128, (b) => {
            b.r = Math.random() * 24 + 8
            b.speed = Math.random() * 22 + 6
            b.radian = Math.random() * T
            return b
        })
        .alpha(1.0)
        .g((me) => Remodel.fadeout(me, 180))
        .fire()

    // 超巨大5連波紋、画面全体を何度も覆い尽くす
    yield* parallel(
        ...[
            { delay: 0, color: "0 50% 50%", lw: 14, speed: 2.0 },
            { delay: 5, color: "72 50% 50%", lw: 10, speed: 2.5 },
            { delay: 10, color: "144 50% 50%", lw: 8, speed: 3.0 },
            { delay: 15, color: "216 50% 50%", lw: 6, speed: 3.5 },
            { delay: 20, color: "288 50% 50%", lw: 5, speed: 4.0 },
        ].map(({ delay, color, lw, speed }) =>
            (function* () {
                yield* Array(delay)
                const frame = 90
                for (let i = 1; i < frame + 1; i++) {
                    const r = Ease.Out(i / frame) * maxR * speed * 0.2
                    const alpha = 1 - i / frame

                    ctx.save()
                    ctx.translate(g.width / 2, g.height / 2)
                    ctx.strokeStyle = `hsl(${color}/${alpha})`
                    ctx.lineWidth = lw
                    ctx.beginPath()
                    ctx.arc(bossP.x, bossP.y, r, 0, T)
                    ctx.stroke()
                    ctx.restore()
                    yield
                }
            })(),
        ),
    )
}
