import { g } from "../../global"
import { AtlasUv, BulletSpriteAtlas } from "./BulletSpriteAtlas"

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec2 a_corner;
layout(location = 1) in vec2 a_instancePos;
layout(location = 2) in float a_instanceRotation;
layout(location = 3) in float a_instanceAlpha;
layout(location = 4) in float a_instanceHalfSize;
layout(location = 5) in vec4 a_instanceUv;

uniform vec2 u_screenHalfSize;

out vec2 v_uv;
out float v_alpha;

void main() {
    vec2 local = a_corner * a_instanceHalfSize;
    float c = cos(a_instanceRotation);
    float s = sin(a_instanceRotation);
    vec2 rotated = vec2(local.x * c - local.y * s, local.x * s + local.y * c);
    vec2 world = a_instancePos + rotated;

    gl_Position = vec4(world.x / u_screenHalfSize.x, -world.y / u_screenHalfSize.y, 0.0, 1.0);

    v_uv = mix(a_instanceUv.xy, a_instanceUv.zw, a_corner * 0.5 + 0.5);
    v_alpha = a_instanceAlpha;
}
`

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;

in vec2 v_uv;
in float v_alpha;

uniform sampler2D u_atlas;

out vec4 outColor;

void main() {
    outColor = texture(u_atlas, v_uv) * v_alpha;
}
`

const FLOATS_PER_INSTANCE = 9

/**
 * 弾スプライトをインスタンシングで1回のドローコールにまとめて描くレンダラー。
 * オフスクリーンのWebGLキャンバスに描き、呼び出し側がその結果をdrawImageで
 * メインのCanvas2Dへ合成する（メインキャンバスと同じ座標系・透明背景）。
 */
export class BulletGpuBatchRenderer {
    private readonly canvas = document.createElement("canvas")
    private readonly gl: WebGL2RenderingContext
    private readonly program: WebGLProgram
    private readonly vao: WebGLVertexArrayObject
    private readonly instanceBuffer: WebGLBuffer
    private readonly atlas: BulletSpriteAtlas
    private readonly screenHalfSizeLocation: WebGLUniformLocation

    private instanceData = new Float32Array(FLOATS_PER_INSTANCE * 256)
    private instanceCount = 0

    static tryCreate(): BulletGpuBatchRenderer | null {
        try {
            return new BulletGpuBatchRenderer()
        } catch (e) {
            console.warn("WebGLでの弾描画の初期化に失敗したため、Canvas2Dで描画します", e)
            return null
        }
    }

    private constructor() {
        const gl = this.canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true })
        if (!gl) throw new Error("WebGL2 is not available")
        this.gl = gl

        this.program = this.createProgram()

        const location = gl.getUniformLocation(this.program, "u_screenHalfSize")
        if (!location) throw new Error("u_screenHalfSize uniform not found")
        this.screenHalfSizeLocation = location

        this.atlas = new BulletSpriteAtlas(gl, this.createTexture())
        this.instanceBuffer = this.createBuffer()
        this.vao = this.createVao(this.createQuadBuffer(), this.instanceBuffer)

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.ONE, gl.ONE)
    }

    /**
     * 1体の弾を今フレームのバッチに積む。アトラスが満杯で置き場所がなければfalseを返す。
     */
    queue(
        key: string,
        source: HTMLCanvasElement,
        x: number,
        y: number,
        rotation: number,
        alpha: number,
        halfSize: number,
    ): boolean {
        const uv = this.atlas.get(key, source)
        if (!uv) return false

        this.ensureCapacity(this.instanceCount + 1)
        this.writeInstance(this.instanceCount, x, y, rotation, alpha, halfSize, uv)
        this.instanceCount++

        return true
    }

    /**
     * 積んだ弾をまとめて描画し、結果のキャンバスを返す（1体も無ければnull）。
     * 呼ぶたびに次フレーム分のキューをリセットする。
     */
    render(): HTMLCanvasElement | null {
        const count = this.instanceCount
        this.instanceCount = 0
        if (count === 0) return null

        const gl = this.gl

        if (this.canvas.width !== g.width || this.canvas.height !== g.height) {
            this.canvas.width = g.width
            this.canvas.height = g.height
        }

        gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.useProgram(this.program)
        gl.bindVertexArray(this.vao)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.instanceData.subarray(0, count * FLOATS_PER_INSTANCE), gl.DYNAMIC_DRAW)

        gl.uniform2f(this.screenHalfSizeLocation, g.width / 2, g.height / 2)

        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count)

        return this.canvas
    }

    private writeInstance(
        index: number,
        x: number,
        y: number,
        rotation: number,
        alpha: number,
        halfSize: number,
        uv: AtlasUv,
    ) {
        const offset = index * FLOATS_PER_INSTANCE
        const d = this.instanceData

        d[offset + 0] = x
        d[offset + 1] = y
        d[offset + 2] = rotation
        d[offset + 3] = alpha
        d[offset + 4] = halfSize
        d[offset + 5] = uv.u0
        d[offset + 6] = uv.v0
        d[offset + 7] = uv.u1
        d[offset + 8] = uv.v1
    }

    private ensureCapacity(instanceCount: number) {
        const needed = instanceCount * FLOATS_PER_INSTANCE
        if (needed <= this.instanceData.length) return

        const grown = new Float32Array(Math.max(needed, this.instanceData.length * 2))
        grown.set(this.instanceData)
        this.instanceData = grown
    }

    private createProgram(): WebGLProgram {
        const gl = this.gl
        const program = gl.createProgram()
        if (!program) throw new Error("Failed to create WebGL program")

        gl.attachShader(program, this.createShader(gl.VERTEX_SHADER, VERTEX_SHADER))
        gl.attachShader(program, this.createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER))
        gl.linkProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const log = gl.getProgramInfoLog(program)
            gl.deleteProgram(program)
            throw new Error(`Failed to link WebGL program: ${log}`)
        }

        return program
    }

    private createShader(type: number, source: string): WebGLShader {
        const gl = this.gl
        const shader = gl.createShader(type)
        if (!shader) throw new Error("Failed to create WebGL shader")

        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader)
            gl.deleteShader(shader)
            throw new Error(`Failed to compile WebGL shader: ${log}`)
        }

        return shader
    }

    private createTexture(): WebGLTexture {
        const texture = this.gl.createTexture()
        if (!texture) throw new Error("Failed to create WebGL texture")
        return texture
    }

    private createBuffer(): WebGLBuffer {
        const buffer = this.gl.createBuffer()
        if (!buffer) throw new Error("Failed to create WebGL buffer")
        return buffer
    }

    private createQuadBuffer(): WebGLBuffer {
        const gl = this.gl
        const buffer = this.createBuffer()

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

        return buffer
    }

    private createVao(quadBuffer: WebGLBuffer, instanceBuffer: WebGLBuffer): WebGLVertexArrayObject {
        const gl = this.gl
        const vao = gl.createVertexArray()
        if (!vao) throw new Error("Failed to create WebGL vertex array object")

        gl.bindVertexArray(vao)

        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

        const stride = FLOATS_PER_INSTANCE * 4
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer)

        gl.enableVertexAttribArray(1)
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 0)
        gl.vertexAttribDivisor(1, 1)

        gl.enableVertexAttribArray(2)
        gl.vertexAttribPointer(2, 1, gl.FLOAT, false, stride, 2 * 4)
        gl.vertexAttribDivisor(2, 1)

        gl.enableVertexAttribArray(3)
        gl.vertexAttribPointer(3, 1, gl.FLOAT, false, stride, 3 * 4)
        gl.vertexAttribDivisor(3, 1)

        gl.enableVertexAttribArray(4)
        gl.vertexAttribPointer(4, 1, gl.FLOAT, false, stride, 4 * 4)
        gl.vertexAttribDivisor(4, 1)

        gl.enableVertexAttribArray(5)
        gl.vertexAttribPointer(5, 4, gl.FLOAT, false, stride, 5 * 4)
        gl.vertexAttribDivisor(5, 1)

        gl.bindVertexArray(null)
        return vao
    }
}
