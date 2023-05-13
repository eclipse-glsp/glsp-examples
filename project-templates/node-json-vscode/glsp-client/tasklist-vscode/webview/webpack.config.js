// @ts-check
const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const outputPath = path.resolve(__dirname, '../extension/pack');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'web',

    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        filename: 'webview.js',
        path: outputPath
    },
    devtool: 'eval-source-map',
    mode: 'development',

    resolve: {
        fallback: {
            fs: false,
            net: false,
            crypto: false,
            os: false
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
                exclude: /(codicon|\.useable)\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /codicon.css$/,
                use: ['ignore-loader']
            }
        ]
    },
    plugins: [new NodePolyfillPlugin()],
    ignoreWarnings: [/Failed to parse source map/, /Can't resolve .* in '.*ws\/lib'/]
};

module.exports = config;
