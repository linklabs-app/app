// rollup.config.js
import json from "@rollup/plugin-json"
import postcss from "rollup-plugin-postcss"
import postcssImport from "postcss-import"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"
import cssnano from "cssnano"
import nodeResolve from "@rollup/plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs-alternate"
import alias from "@rollup/plugin-alias"
import replace from "@rollup/plugin-replace"
import visualizer from "rollup-plugin-visualizer"
import progress from "rollup-plugin-progress"
import devServer from "rollup-plugin-dev"
import nodePolyfill from "rollup-plugin-polyfill-node"

const dev = process.env.NODE_ENV !== "production"

module.exports = {
  input: "src/app.tsx",

  output: {
    file: "public/dist/bundle.js",
    format: "iife",
    sourcemap: true
  },

  preserveEntrySignatures: false,

  plugins: [
    progress({
      clearLine: false
    }),
    typescript(),
    alias({
      entries: []
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: true,
      extensions: [".ts", ".tsx", ".jsx", ".js"]
    }),
    nodePolyfill({
      include: null
    }),
    json(),
    commonjs(),
    replace({ "process.env.NODE_ENV": JSON.stringify(dev ? "development" : "production"), preventAssignment: false }),
    postcss({
      plugins: [
        postcssImport(),
        tailwindcss(),
        autoprefixer(),
        !dev && cssnano(),
      ].filter(Boolean),
      extract: true
    }),
    !dev && terser(),
    !dev && visualizer({
      sourcemap: true,
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      filename: "./bundle-map.html"
    }),
    dev && devServer({
      dirs: ["public"],
      port: 5000
    })
  ].filter(Boolean),

  watch: {
    clearScreen: false
  },

  onwarn: (warning) => {
    if (warning.code === "THIS_IS_UNDEFINED") return
    console.warn(warning.message)
  }
};
