/********************************************************************************
 * Copyright (c) 2022-2026 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied:
 * -- GNU General Public License, version 2 with the GNU Classpath Exception
 * which is available at https://www.gnu.org/software/classpath/license.html
 * -- MIT License which is available at https://opensource.org/license/mit.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/
// @ts-check
const esbuild = require('esbuild');
const path = require('path');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const distDir = path.resolve(__dirname, 'dist');

/**
 * Reports build progress and surfaces errors in a format that VS Code's
 * `$esbuild-watch` problem matcher can pick up.
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
    name: 'esbuild-problem-matcher',
    setup(build) {
        build.onStart(() => console.log(`${watch ? '[watch] ' : ''}build started`));
        build.onEnd(result => {
            result.errors.forEach(({ text, location }) => {
                console.error(`✘ [ERROR] ${text}`);
                if (location) {
                    console.error(`    ${location.file}:${location.line}:${location.column}:`);
                }
            });
            console.log(`${watch ? '[watch] ' : ''}build finished`);
        });
    }
};

/** @type {import('esbuild').BuildOptions} */
const config = {
    entryPoints: [path.resolve(__dirname, 'src/app.ts')],
    outfile: path.join(distDir, 'webview.js'),
    bundle: true,
    platform: 'browser',
    format: 'iife',
    // CSS imported by the entry point (GLSP + codicon styles) is bundled and emitted next to the
    // JS output as `webview.css` — esbuild's built-in CSS support replaces `style-loader`/`css-loader`.
    loader: {
        '.ttf': 'file',
        '.woff': 'file',
        '.woff2': 'file',
        '.eot': 'file',
        '.svg': 'file',
        '.png': 'file'
    },
    minify: production,
    sourcemap: production ? false : 'inline',
    sourcesContent: !production,
    logLevel: 'silent',
    plugins: [esbuildProblemMatcherPlugin]
};

async function main() {
    if (watch) {
        const ctx = await esbuild.context(config);
        await ctx.watch();
    } else {
        await esbuild.build(config);
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
