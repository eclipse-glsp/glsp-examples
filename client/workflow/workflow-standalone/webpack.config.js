/*
 * Copyright (C) 2017 TypeFox and others.
 * 
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
const webpack = require('webpack');
const path = require('path');

const buildRoot = path.resolve(__dirname, 'lib');
const appRoot = path.resolve(__dirname, 'app');
var CircularDependencyPlugin = require('circular-dependency-plugin');


module.exports = {
        entry: [
            'core-js/es6/map', 
            'core-js/es6/promise', 
            'core-js/es6/string', 
            'core-js/es6/symbol', 
            path.resolve(buildRoot, 'main')
        ],
        output: {
            filename: 'bundle.js',
            path: appRoot
        },
       mode: 'development',
    devtool: 'source-map',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'examples.tsconfig.json')
                    }
                }]
            },
            {
                test: /\.css$/,
                exclude: /\.useable\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    node : { fs: 'empty', net: 'empty' },
    plugins: [
        new CircularDependencyPlugin({
            exclude: /(node_modules|examples)\/./,
            failOnError: false
        }),
        new webpack.WatchIgnorePlugin([
            /\.js$/,
            /\.d\.ts$/
        ])
    ]
};