/********************************************************************************
 * Copyright (c) 2022-2023 EclipseSource and others.
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
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');
const fs = require('fs');

const buildRoot = path.resolve(__dirname, 'lib');
const appRoot = path.resolve(__dirname, '..', 'app');

/**@type {import('webpack').Configuration}*/
module.exports = {
    entry: [path.resolve(buildRoot, 'app')],
    output: {
        filename: 'tasklist-glsp-server.js',
        path: appRoot
    },
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    target: 'webworker',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: (() => {
                const jsonFilePath = path.resolve(__dirname, 'monaco-sources.json');
                const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
                const filesToCopy = JSON.parse(jsonData).files;

                return filesToCopy.map(file => {
                    return { from: path.resolve(__dirname, 'src', ...file), to: path.resolve(appRoot, 'sources', 'server', file.at(-1)) };
                });
            })()
        })
    ],
    ignoreWarnings: [/Failed to parse source map/, /Can't resolve .* in '.*ws\/lib'/]
};
