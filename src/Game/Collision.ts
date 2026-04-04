import { vec, Vec } from "../utils/Vec"
import { Bullet } from "./Bullet/Bullet"
import { Player } from "./Player/Player"

type Circle = {
    p: Vec
    r: number
}

export class Collision {
    isColliding(b: Bullet, e: Player) {
        return b.collision === Bullet.Collision.Ball
            ? this.isCollidingCircle({ p: b.p, r: b.r }, { p: e.p, r: e.r })
            : this.isCollidingLine(
                  { p: e.p, r: e.r },
                  b.p.plus(vec.arg(b.radian).scaled(b.r)),
                  b.p.minus(vec.arg(b.radian).scaled(b.r)),
              )
    }

    isCollidingCircle({ p: p1, r: r1 }: Circle, { p: p2, r: r2 }: Circle) {
        const distance = p1.minus(p2).magnitude()
        const radiusSum = r1 + r2
        return distance <= radiusSum
    }

    isCollidingLine({ p, r }: Circle, p2: Vec, p3: Vec) {
        // 線分ベクトルと、線分始点から円中心へのベクトル
        const segment = p3.minus(p2)
        const toCircle = p.minus(p2)

        // 線分上への射影（0〜1にクランプで線分内に収める）
        const segLenSq = segment.magnitudeSquared()
        const t = Math.max(0, Math.min(1, toCircle.dot(segment) / segLenSq))

        // 線分上の最近接点
        const closest = p2.plus(segment.scaled(t))

        // 最近接点と円中心の距離が半径以下なら衝突
        const distSq = p.minus(closest).magnitudeSquared()
        return distSq <= r * r
    }
}
