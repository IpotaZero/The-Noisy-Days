import { Bullet } from "../../Game/Bullet/Bullet"
import { Enemy } from "../../Game/Enemy/Enemy"
import { Remodel, remodel } from "../../Game/Bullet/Remodel"
import { vec } from "../../utils/Vec"
import { g, scorenize, T } from "../../global"
import { Stage } from "../Stage"
import { flash, shake } from "../../utils/shake"
import { Dom } from "../../Dom"

import * as Curves from "../../utils/Functions/Curves"
import { EnemyRendererMob } from "../../Game/Enemy/EnemyRendererMob"
import { EnemyRendererCore } from "../../Game/Enemy/EnemyRendererCore"
import { EnemyRendererBoss } from "../../Game/Enemy/EnemyRendererBoss"
import { Ease } from "../../utils/Functions/Ease"
import { isSmartPhone } from "../../utils/Functions/isSmartPhone"
import { EnemyRendererFunnel } from "../../Game/Enemy/EnemyRendererFunnel"

export default class extends Stage {
    protected *G(): Generator<void, void, unknown> {
        yield* this.wait(30)

        yield* this.text("「こんにちは、シオン・シマ。」", { name: "レイ" })
        yield* this.text("「なっ……なんでアンタが。」", { name: "シオン" })
        yield* this.text("「あなたの気持ちが知りたくて。」", { name: "レイ" })
        yield* this.text("「……家へ帰るんだ。子供が使いこなせるものじゃあない。そもそも誰が……」", { name: "シオン" })
        yield* this.text("「使いこなす必要はないわ。使われるだけ。あなたと同様に。」", { name: "レイ" })
        yield* this.text("「……そういうことか! そんなもの! 人を承認するだけの機械にするなんて、絶対にやっちゃいけない事なんだ!」", { name: "シオン" })
        yield* this.text("「さあ、行きましょう。分かり合いましょう?」", { name: "レイ" })

        yield* this.waitDefeatEnemy()
        scorenize()
        flash(Dom.container)
        shake(Dom.container, 750, 8)
    }
}
