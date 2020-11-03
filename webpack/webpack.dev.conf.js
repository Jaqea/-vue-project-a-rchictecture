const { merge } = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");

const resolve = (dir) => path.resolve(__dirname, dir);

const HtmlWebpackPlugin = require("html-webpack-plugin");
const baseWebpack = require("./webpack.base.conf");

const PROXY_URL = require("../src/api/base");
const antdThemeOption = require("../src/assets/styles/theme/base");

module.exports = merge(baseWebpack, {
  mode: "development",
  output: {
    path: resolve("../dist"),
    filename: "js/[name].js",
    chunkFilename: "js/[name].chunk.js",
  },
  devtool: "source-map",
  devServer: {
    contentBase: resolve("../public"),
    port: "8080",
    inline: true,
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true,
    open: true,
    proxy: {
      "/api": {
        target: PROXY_URL.development,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars: antdThemeOption,
                javascriptEnabled: true,
              },
            },
          },
          {
            loader: "style-resources-loader",
            options: {
              patterns: resolve("../src/assets/styles/common.less"),
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolve("../public/index.html"),
    }),
  ],
});
