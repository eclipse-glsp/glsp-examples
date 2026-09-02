/********************************************************************************
 * Copyright (c) 2019-2026 EclipseSource and others
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
// @ts-check
const esbuild = require('esbuild');
const path = require('path');

const appRoot = path.resolve(__dirname, 'app');

const args = process.argv.slice(2);
const isWatch = args.includes('--watch');

/**
 * Reports the build progress and surfaces errors/warnings in a format that
 * VS Code's `$esbuild-watch` problem matcher can pick up.
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
    name: 'esbuild-problem-matcher',
    setup(build) {
        build.onStart(() => {
            console.log(`${isWatch ? '[watch] ' : ''}build started`);
        });
        build.onEnd(result => {
            result.errors.forEach(({ text, location }) => {
                console.error(`✘ [ERROR] ${text}`);
                if (location) {
                    console.error(`    ${location.file}:${location.line}:${location.column}:`);
                }
            });
            console.log(`${isWatch ? '[watch] ' : ''}build finished`);
        });
    }
};

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
    entryPoints: [path.resolve(__dirname, 'src', 'app.ts')],
    outdir: appRoot,
    entryNames: 'bundle', // -> app/bundle.js + app/bundle.css (extracted from the imported CSS)
    assetNames: '[name]-[hash]', // -> app/codicon-<hash>.ttf, referenced relatively from bundle.css
    bundle: true,
    minify: true,
    sourcemap: true, // emit .map files alongside the minified bundle so the original sources stay debuggable
    format: 'iife', // diagram.html loads bundle.js via a classic <script src>
    platform: 'browser',
    target: ['es2019'],
    logLevel: 'silent',
    loader: { '.ttf': 'file' },
    plugins: [esbuildProblemMatcherPlugin]
};

async function main() {
    if (isWatch) {
        const ctx = await esbuild.context(buildOptions);
        await ctx.watch();
    } else {
        await esbuild.build(buildOptions);
    }
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
