import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
    {
        input: "node_modules/@reduxjs/toolkit/dist/redux-toolkit.browser.mjs",
        output: {
            file: "demo/deps/redux_bundled.js",
            format: "esm"
        },
        plugins: [
            nodeResolve()
        ]
    },
    {
        input: "node_modules/@w-lfpup/wctk/dist/mod.js",
        output: {
            file: "demo/deps/wctk_bundled.js",
            format: "esm"
        }
    }
];