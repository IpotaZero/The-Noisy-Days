import { Bullet } from "../../Game/Bullet/Bullet"
import { Collision } from "../../Game/Collision"
import { Enemy } from "../../Game/Enemy/Enemy"
import { EnemyRendererBoss } from "../../Game/Enemy/EnemyRendererBoss"
import { bossDefeat, explosion, fireDeleteField, g } from "../../global"
import { SE } from "../../SE"

export class GameLogic {
    private readonly collision = new Collision()

    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        private readonly effects: () => Generator[],
        private readonly slowFPS: () => void,
        private readonly onPlayerDead: () => void,
    ) {}

    tick() {
        this.updateEnemies()
        this.updateBullets()
        this.checkPlayerHit()
        this.collectScoreBullets()
        this.cleanup()
        this.checkDead()
    }

    private updateEnemies() {
        g.enemies.forEach((e) => {
            e.tick()

            if (e.isInvincible) return

            g.bullets
                .values()
                .filter((b) => b.type === Bullet.Type.Friend)
                .filter((b) => b.p.minus(e.p).magnitude() <= b.r + e.r)
                .forEach((b) => {
                    b.life = 0
                    e.hit(Math.ceil(b.p.minus(e.p).magnitude() / g.width))
                })

            if (e.life <= 0) {
                this.defeatEnemy(e)
            }
        })
    }

    private defeatEnemy(e: Enemy) {
        if (e.renderer instanceof EnemyRendererBoss) {
            this.effects().push(bossDefeat(this.ctx, e.p.clone()))
            this.slowFPS()
        } else {
            explosion(e.p.clone())
        }

        SE.crush.play()
    }

    private updateBullets() {
        g.bullets.forEach((b) => b.tick())
    }

    private checkPlayerHit() {
        if (g.player.isInvincible()) return

        g.bullets
            .values()
            .filter((b) => b.type === Bullet.Type.Enemy)
            .forEach((b) => {
                if (g.player.isInvincible()) return

                const distance = b.p.minus(g.player.p).magnitude()

                if (distance <= b.r + g.player.GRAZE_R) {
                    SE.graze.play()
                }

                if (this.collision.isColliding(b, g.player)) {
                    b.life = 0
                    g.player.damage()
                    SE.u.play()
                    SE.hit.play()
                    this.effects().push(fireDeleteField(this.ctx))
                }
            })
    }

    private collectScoreBullets() {
        g.bullets
            .values()
            .filter((b) => b.type === Bullet.Type.Score)
            .filter((b) => b.p.minus(g.player.p).magnitude() <= b.r + g.player.GRAZE_R)
            .forEach((b) => {
                b.life = 0
                SE.graze.play()
            })
    }

    private cleanup() {
        g.bullets = g.bullets.filter((b) => b.life > 0)
        g.enemies = g.enemies.filter((e) => e.life > 0)
    }

    private checkDead() {
        if (g.player.life <= -1) {
            this.onPlayerDead()
        }
    }
}
