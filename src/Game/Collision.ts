import { build } from "vite"
import { vec, Vec } from "../utils/Vec"
import { Bullet } from "./Bullet/Bullet"
import { Player } from "./Player/Player"
import { T } from "../global"

type Circle = {
    p: Vec
    r: number
}

type Line = {
    start: Vec
    end: Vec
}

export class Collision {
    isColliding(b: Bullet, e: Player) {
        if (b.collision === Bullet.Collision.Ball) {
            return this.isCollidingCircle(
                { p: b.p, r: b.r },
                { p: e.p, r: e.r },
            )
        } else if (b.collision === Bullet.Collision.Line) {
            const circle: Circle = e
            const line = {
                start: b.p.plus(vec.arg(b.radian).scaled(b.r)),
                end: b.p.minus(vec.arg(b.radian).scaled(b.r)),
            }
            return this.isCollidingLine(circle, line)
        } else if (b.collision === Bullet.Collision.Arrow) {
            const circle: Circle = e

            const 右端 = b.p.plus(vec.arg(b.radian).scaled(b.r))
            const 左端 = b.p.minus(vec.arg(b.radian).scaled(b.r))

            const line0 = {
                start: 右端,
                end: 左端,
            }

            const line1 = {
                start: 右端,
                end: 右端.plus(vec.arg((-3 / 8) * T + b.radian).scaled(b.r)),
            }

            const line2 = {
                start: 右端,
                end: 右端.plus(vec.arg((-5 / 8) * T + b.radian).scaled(b.r)),
            }

            return (
                this.isCollidingLine(circle, line0) ||
                this.isCollidingLine(circle, line1) ||
                this.isCollidingLine(circle, line2)
            )
        }
    }

    private isCollidingCircle(
        { p: p1, r: r1 }: Circle,
        { p: p2, r: r2 }: Circle,
    ) {
        const distance = p1.minus(p2).magnitude()
        const radiusSum = r1 + r2
        return distance <= radiusSum
    }

    private isCollidingLine({ p, r }: Circle, { start, end }: Line) {
        // 線分ベクトルと、線分始点から円中心へのベクトル
        const segment = end.minus(start)
        const toCircle = p.minus(start)

        // 線分上への射影（0〜1にクランプで線分内に収める）
        const segLenSq = segment.magnitudeSquared()
        const t = Math.max(0, Math.min(1, toCircle.dot(segment) / segLenSq))

        // 線分上の最近接点
        const closest = start.plus(segment.scaled(t))

        // 最近接点と円中心の距離が半径以下なら衝突
        const distSq = p.minus(closest).magnitudeSquared()
        return distSq <= r * r
    }
}
