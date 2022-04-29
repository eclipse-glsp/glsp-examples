// @ts-check
const path = require('path');

const outputPath = path.resolve(__dirname, '../extension/pack');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'web',

    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        filename: 'webview.js',
        path: outputPath
    },
    devtool: 'source-map-eval',
    mode: 'development',

    resolve: {
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
                exclude: /(codicon|\.useable)\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /codicon.css$/,
                use: ['ignore-loader']
            }
        ]
    },
    node: { fs: 'empty', net: 'empty' },
    stats: {
        warningsFilter: [/Failed to parse source map/]
    }
};

module.exports = config;
