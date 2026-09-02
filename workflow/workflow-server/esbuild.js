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
const { resolve } = require('node:path');
const esbuild = require('esbuild');

const watch = process.argv.slice(2).includes('--watch');

/**
 * Reports build progress and surfaces errors in a format that VS Code's
 * `$esbuild-watch` problem matcher can pick up.
 * @type {import('esbuild').Plugin}
 */
const problemMatcherPlugin = {
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
    // Bundle the `tsc` output rather than the TypeScript sources: `@eclipse-glsp/ts-config` enables
    // `emitDecoratorMetadata`, which esbuild does not implement. Going through `lib` keeps the
    // inversify `design:paramtypes` metadata that the DI container relies on.
    entryPoints: [resolve(__dirname, 'lib/app.js')],
    outfile: resolve(__dirname, 'dist/workflow-glsp-server.js'),
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node22',
    // Minify one-shot builds; keep watch output readable and fast to rebuild.
    minify: !watch,
    // Preserve original class/function names through minification — GLSP's logger and error
    // messages use `constructor.name` for labels, which would otherwise be mangled.
    keepNames: true,
    sourcemap: true,
    logLevel: 'silent',
    // `ws` requires these optional native deps in a try/catch; keep them external so the
    // graceful-fallback path works and esbuild does not error on the missing modules.
    external: ['bufferutil', 'utf-8-validate'],
    plugins: [problemMatcherPlugin]
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
