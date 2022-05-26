import preact from "@preact/preset-vite"
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        preact(),
        dts({
            insertTypesEntry: true,
        }),
    ],
    build: {
        target: "es2017",
        lib: {
            entry: resolve(__dirname, "src/index.tsx"),
            name: "myapp",
            formats: ["es"],
            fileName: (format) => `myapp.${format}.js`,
        },
        rollupOptions: {
            external: ["preact", "preact-render-to-string"],
        },
    },
});