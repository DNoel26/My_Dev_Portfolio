const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const path = require("path");
const zlib = require("zlib");

module.exports = {
    mode: "production",
    entry: {
        index: "./src/js/app.js"
    },
    //devtool: "inline-source-map",
    devServer: {
        publicPath: "/",
        contentBase: './dist',
        compress: true,
        port: 8080
    },
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), "..."],
        splitChunks: {
            chunks: 'all',
            minChunks: 1,
            minSize: 10000,
            maxSize: 200000,
            enforceSizeThreshold: 256000,
            cacheGroups: {
                styles: {
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    performance: {
        maxEntrypointSize: 256000,
        maxAssetSize: 256000
    },
    output: {
        chunkFilename: "[id].bundle.[contenthash].js",
        filename: "[name].bundle.[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        sourceMapFilename: "[name].map",
        assetModuleFilename: './assets/[hash][ext][query]',
        clean: true
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: true,
            hash: true,
            chunks: "all",
            filename: "./index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/html/my-google-desktop-audit.html",
            inject: true,
            hash: true,
            filename: "./html/my-google-desktop-audit.html"
        }),
        new HtmlWebpackPlugin({
            template: "./src/html/my-google-mobile-audit.html",
            inject: true,
            hash: true,
            filename: "./html/my-google-mobile-audit.html"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./src/img/", to: "./img/" },
                { from: "./src/media/", to: "./media/" }
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "styles/[name].[contenthash].css",
        }),
        new CompressionPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg|pdf)$/,
            compressionOptions: {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
            },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
        }),
        new CssMinimizerPlugin({
            minimizerOptions: {
                preset: [
                    'default',
                    {
                        discardComments: { removeAll: true },
                    },
                ],
            },
        }),
        new BundleAnalyzerPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, "src")],
                exclude: [
                    /node_modules[\\\/]core-js/,
                    /node_modules[\\\/]webpack[\\\/]buildin/,
                    /(node_modules|bower_components)/,
                    /lib/
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true 
                    }
                }
                /*exclude: [
                    // \\ for Windows, \/ for Mac OS and Linux
                    /node_modules[\\\/]core-js/,
                    /node_modules[\\\/]webpack[\\\/]buildin/,
                    /(node_modules|bower_components)/
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-transform-runtime',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-syntax-class-properties'
                        ],
                        //
                    }
                },*/
            },          
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'] // ,'style-loader' 
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp|mp4)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(pdf)$/i,
                use: {
                    loader: 'file-loader?name=[name].[ext]',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './assets/'
                    }
                },
                type: "javascript/auto"
            },
            {
                test: /\.html$/i,
                use: {
                    loader: 'html-loader'
                },
                type: "javascript/auto"
            }
        ],
    }
};