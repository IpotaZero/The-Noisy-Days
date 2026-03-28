export function shake(
    element: HTMLElement,
    durationMS = 1500,
    initialAmplitude = 12,
) {
    const FRAMES = 30

    const keyframes: Keyframe[] = Array.from({ length: FRAMES + 1 }, (_, i) => {
        const ratio = 1 - i / FRAMES
        const amplitude = initialAmplitude * ratio

        // 最終フレームだけ中央に戻す
        if (i === FRAMES) return { transform: "translate(0px, 0px)" }

        const dx = (Math.random() * 2 - 1) * amplitude
        const dy = (Math.random() * 2 - 1) * amplitude
        return { transform: `translate(${dx}px, ${dy}px)` }
    })

    element.animate(keyframes, {
        duration: durationMS,
        easing: "linear",
        fill: "none",
    })
}

export function flash(element: HTMLElement, duration = 1000) {
    const overlay = document.createElement("div")

    Object.assign(overlay.style, {
        position: "absolute",
        inset: "0",
        backgroundColor: "#eee2",
        pointerEvents: "none",
    })

    element.appendChild(overlay)

    overlay
        .animate([{ opacity: 1 }, { opacity: 0 }], {
            duration,
            easing: "ease-out",
            fill: "none",
        })
        .finished.then(() => overlay.remove())
}
