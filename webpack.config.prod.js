"strict";

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    entry: './src/scripts/index.ts',
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'game.min.[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: 'src/views/index.html',
            filename: 'index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/assets", to: "assets" },
            ],
        }),
    ],
    optimization: {
        runtimeChunk: true,
    },
};