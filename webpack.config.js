const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './js/index.js',
    output: {
        filename: 'js/bundle.[contenthash].js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
        publicPath: "/"
    },
    devtool: "inline-source-map",
    plugins: [
        new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' }),
        new HtmlWebpackPlugin({ template: './public/index.html' }),
        new CopyPlugin({
            patterns: [
                { from: "images", to: "images" },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name].[hash][ext][query]',
                },
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            }
        ]
    },
    devServer: {
        port: 5000,
        open: true,
        static: {
            directory: path.join(__dirname, 'build'),
        }
    }
};