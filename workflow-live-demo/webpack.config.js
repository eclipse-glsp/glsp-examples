/********************************************************************************
 * Copyright (c) 2017-2022 TypeFox & others
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
const path = require('path');

const buildRoot = path.resolve(__dirname, 'lib');
const appRoot = path.resolve(__dirname, 'dist');

/**@type {import('webpack').Configuration}*/
const config = {
    entry: [path.resolve(buildRoot, 'main')],
    output: {
        filename: 'bundle.js',
        path: appRoot
    },
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        fallback: {
            fs: false,
            net: false
        },
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader']
            },
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
            {
                test: /\.css$/,
                exclude: /\.useable\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(ttf)$/,
                type: 'asset/resource'
            }
        ]
    },
    devServer: {
        static: {
            directory: appRoot
        },
        port: 9000
    },
    ignoreWarnings: [/Failed to parse source map/, /Can't resolve .* in '.*ws\/lib'/]
};

module.exports = [config];
