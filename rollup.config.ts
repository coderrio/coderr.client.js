import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import del from 'rollup-plugin-delete';
import ts from "rollup-plugin-ts";
import { terser } from 'rollup-plugin-terser';

export default [
    {
        external: ['ua-parser-js'],
        input: `src/index.ts`,
        output: [
            {
                globals: {
                    'ua-parser-js': 'ua',
                },
                name: 'coderr',
                file: 'dist/coderr.browser.js',
                format: 'umd',
                sourcemap: true,
            },
            {
                globals: {
                    'ua-parser-js': 'ua',
                },
                file: 'dist/coderr.browser.min.js',
                name: 'coderr',
                format: 'iife',
                sourcemap: true,
                plugins: [terser()]
            },
            { file: 'dist/coderr.esm.js', format: 'es', sourcemap: true },
        ],
        plugins: [
            del({ targets: 'dist/*' }),
            ts({ tsconfig: "tsconfig.json" }),
            resolve({ browser: true }),
            commonjs({ }),
            sourceMaps(),
        ],
    },
    {
        input: `src/index.ts`,
        output: [
            {
                file: 'dist/coderr.umd.js',
                name: 'aaa',
                format: 'umd',
                sourcemap: true,
            },
            { file: 'dist/coderr.umd.min.js', format: 'es', sourcemap: true, plugins: [terser()] },
        ],
        // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
        external: [],
        watch: {
            include: 'src/**',
        },
        plugins: [
            // Compile TypeScript files  { useTsconfigDeclarationDir: true }

            ts(),
            // Allow node_modules resolution, so you can use 'external' to control
            // which external modules to include in the bundle
            // https://github.com/rollup/rollup-plugin-node-resolve#usage
            resolve(),

            // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
            commonjs(),

            // Resolve source maps to the original source
            sourceMaps(),
        ],
    },
];
