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
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const buildRoot = path.resolve(__dirname, 'lib');
const appRoot = path.resolve(__dirname, 'app');

module.exports = {
    entry: [path.resolve(buildRoot, 'index')],
    output: {
        filename: 'bundle.js',
        path: appRoot
    },
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        fallback: {
            fs: false,
            net: false,
            path: require.resolve('path-browserify')
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
    ignoreWarnings: [/Failed to parse source map/, /Can't resolve .* in '.*ws\/lib'/],
    plugins: [
        new CircularDependencyPlugin({
            exclude: /(node_modules|examples)\/./,
            failOnError: false
        }),
        new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
        new MonacoWebpackPlugin({
            languages: ['javascript', 'css', 'html', 'typescript', 'json']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src', 'index.html'), to: path.resolve(appRoot, 'index.html') },
                { from: path.resolve(__dirname, 'src', 'css'), to: path.resolve(appRoot, 'css') }
            ]
        }),
        new webpack.EnvironmentPlugin(['HOST_PATH'])
    ]
};
