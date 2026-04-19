import { defineConfig } from "vite"
import Unplugin from "@typia/unplugin/vite"

export default defineConfig({
    base: "./",
    plugins: [Unplugin()],
    build: {
        target: ["esnext"],
        rollupOptions: {
            input: "src/run.ts",
            output: {
                entryFileNames: "run.js",
                dir: "dist/module",
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
        sourcemap: true,
    },
})
