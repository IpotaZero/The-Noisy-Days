# 移行ガイド：既存コードの変更箇所

---

## 1. SceneStage.ts — Player の生成

### 変更前
```ts
import { InputKeyboard } from "../Game/Player/InputKeyboard"
import { GamepadTracker } from "../utils/GamepadTracker"
import { TouchTracker } from "../utils/TouchTracker"

g.player = new Player(
    new InputKeyboard(),
    new GamepadTracker(0),
    new TouchTracker(Dom.container),
    (g.width / rect.width) * LocalStorage.getSwipeRatio(),
)
```

### 変更後
```ts
import { UnifiedInput } from "../utils/UnifiedInput"
import { DEFAULT_CONFIG } from "../utils/DefaultConfig"

g.player = new Player(
    new UnifiedInput(DEFAULT_CONFIG, 0, Dom.container),
    (g.width / rect.width) * LocalStorage.getSwipeRatio(),
)
```

---

## 2. Player.ts — コンストラクタとフィールド

### 変更前
```ts
import { IInput, Operation } from "./Input"
import { GamepadTracker } from "../../utils/GamepadTracker"
import { TouchTracker } from "../../utils/TouchTracker"

constructor(
    input: IInput,
    gamepadTracker: GamepadTracker,
    touchTracker: TouchTracker,
    private readonly scale: number,
) { ... }

private readonly input: IInput
private readonly gamepadTracker: GamepadTracker
private readonly touchTracker: TouchTracker
```

### 変更後
```ts
import { IUnifiedInput, Action } from "./Input"

constructor(
    private readonly input: IUnifiedInput,
    private readonly scale: number,
) {}
```

---

## 3. Player.ts — move()

### 変更前
```ts
private move() {
    this.applyInput()
    this.applyGamepad()
    this.applyTouch()
    this.clampPosition()
    this.updateRenderer()
    this.input.tick()
    this.gamepadTracker.tick()
}
```

### 変更後
```ts
private move() {
    this.input.tick()        // ← 先頭でポーリング・状態更新
    this.applyInput()
    this.applyTouch()
    this.clampPosition()
    this.updateRenderer()
}
```

`applyGamepad()` は削除。`applyInput()` が全デバイスを統合的に扱う。

---

## 4. Player.ts — applyInput()

### 変更前
```ts
private applyInput() {
    const { pressed, pushed } = this.input
    this.v = vec(0, 0)

    if (pressed.has(Operation.Right)) this.v.x += 1
    if (pressed.has(Operation.Left))  this.v.x -= 1
    if (pressed.has(Operation.Down))  this.v.y += 1
    if (pressed.has(Operation.Up))    this.v.y -= 1

    this.v.normalize()
    this.applySpeedModifier(pressed, pushed)
    this.v.scale(this.BASE_SPEED)
    this.p.add(this.v)
}
```

### 変更後
```ts
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
        if (this.input.isPressed(Action.MoveLeft))  this.v.x -= 1
        if (this.input.isPressed(Action.MoveDown))  this.v.y += 1
        if (this.input.isPressed(Action.MoveUp))    this.v.y -= 1
    }

    if (this.v.magnitude() > 1) this.v.normalize()
    this.applySpeedModifier()
    this.v.scale(this.BASE_SPEED)
    this.p.add(this.v)
}
```

---

## 5. Player.ts — applySpeedModifier()

### 変更前
```ts
private applySpeedModifier(pressed: Set<Operation>, pushed: Set<Operation>) {
    if (pressed.has(Operation.Slow)) { this.v.scale(0.5); return }
    if (pushed.has(Operation.Dash) && this.dashCoolDown === 0) {
        SE.dash.play()
        this.dashFrame    = this.DASH_FRAME
        this.dashCoolDown = this.DASH_COOL_DOWN
    }
    if (this.dashFrame > 0) this.v.scale(7)
}
```

### 変更後
```ts
private applySpeedModifier() {
    if (this.input.isPressed(Action.Slow)) { this.v.scale(0.5); return }
    if (this.input.isPushed(Action.Dash) && this.dashCoolDown === 0) {
        SE.dash.play()
        this.dashFrame    = this.DASH_FRAME
        this.dashCoolDown = this.DASH_COOL_DOWN
    }
    if (this.dashFrame > 0) this.v.scale(7)
}
```

---

## 6. Player.ts — applyTouch()

`TouchTracker` を直接持つ代わりに `getPointerDelta()` を使う。

### 変更前
```ts
private applyTouch() {
    const delta = this.touchTracker.getDelta()
    if (delta) {
        this.p.x += delta.dx * this.scale
        this.p.y += delta.dy * this.scale
    }
}
```

### 変更後
```ts
private applyTouch() {
    const delta = this.input.getPointerDelta()
    if (delta) {
        this.p.x += delta.dx * this.scale
        this.p.y += delta.dy * this.scale
    }
}
```

---

## 7. Player.ts — isSneaking()

### 変更前
```ts
private isSneaking() {
    return this.input.pressed.has(Operation.Slow) || this.gamepadTracker.isSlow
}
```

### 変更後
```ts
private isSneaking() {
    return this.input.isPressed(Action.Slow)
}
```

---

## 8. Stage.ts — ok() のゲームパッド/キーボード判定

### 変更前 (ハードコード)
```ts
window.addEventListener("keydown", (e) => {
    if (e.code === "Enter" || e.code === "Space" || e.code === "KeyZ") {
        clicked = true
    } else if (e.code === "KeyS") {
        this.skip = true
    }
}, { signal: abort.signal })

// ゲームパッドは毎フレーム手動ポーリング
```

### 変更後
`Stage` に `IUnifiedInput` を渡し、`ok()` 内で使う。

```ts
// Stage のコンストラクタ引数に input: IUnifiedInput を追加
protected *ok(): Generator<void, void, unknown> {
    if (this.skip) return

    while (!this.skip) {
        this.input.tick()
        if (this.input.isPushed(Action.Confirm)) break
        if (this.input.isPushed(Action.Skip)) {
            this.skip = true
            this.hideSkipButton()
        }
        yield
    }
}
```

---

## 9. SceneStage.ts — Escape / ゲームパッド Select 判定

### 変更前
```ts
window.addEventListener("keydown", (e) => {
    if (e.code === "Escape") this.selfDestruct()
}, { signal })

navigator.getGamepads().forEach((gp) => {
    if (!gp) return
    if ([8, 9].some((index) => gp.buttons[index].pressed)) this.selfDestruct()
})
```

### 変更後
```ts
// tick() 内で
if (this.input.isPushed(Action.Pause)) this.selfDestruct()
```

---

## 削除できるファイル

| ファイル | 理由 |
|---|---|
| `InputKeyboard.ts` | `UnifiedInput` に統合 |
| `GamepadTracker.ts` | `UnifiedInput` に統合 |
| 旧 `Input.ts` の `IInput` / `Operation` | `IUnifiedInput` / `Action` に置き換え |
