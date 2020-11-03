const { merge } = require("webpack-merge");
const path = require("path");

const resolve = (dir) => path.resolve(__dirname, dir);

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCss = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const baseWebpack = require("./webpack.base.conf");

module.exports = merge(baseWebpack, {
  mode: "production",
  devtool: false,
  output: {
    path: resolve("../dist"),
    filename: "static/js/[name].[chunkhash:8].js",
  },
  optimization: {
    minimizer: [
      new OptimizeCss(),
      new TerserWebpackPlugin({
        // 压缩es6
        terserOptions: {
          // 启用文件缓存
          cache: true,
          // 使用多线程并行运行提高构建速度
          parallel: true,
          // 使用 SourceMaps 将错误信息的位置映射到模块
          sourceMap: true,
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: false,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
            },
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: false,
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
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve("../public/index.html"),
      title: "vue-project-archictecture",
      favicon: resolve("../public/favicon.ico"),
      // 压缩html
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve("../public"),
          to: resolve("../dist"),
        },
      ],
    }),
  ],
});
