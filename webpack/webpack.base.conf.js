const path = require("path");
const webpack = require("webpack");

const resolve = (dir) => path.resolve(__dirname, dir);
const jsonToStr = (json) => JSON.stringify(json);
const isProd = process.env.NODE_ENV === "production";

const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: resolve("../src/index.js"),
  // 引入资源省略后缀，资源别名
  resolve: {
    extensions: [".js", ".json", ".vue"],
    alias: {
      "@": resolve("../src"),
      assets: resolve("../src/assets"),
      views: resolve("../src/views"),
      components: resolve("../src/components"),
      api: resolve("../src/api"),
      store: resolve("../src/store"),
      router: resolve("../src/router"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              // 图片小于10kb就是图片地址，大于正常打包成base64格式编码
              limit: 10000,
              // 输出路径
              outputPath: "img/",
              // 指定生成的目录
              name: "img/[name].[hash:7].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|)$/,
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
        include: resolve("src"),
      },
      { test: /\.vue$/, use: "vue-loader" },
      {
        test: /\.(vue|js)$/,
        include: resolve("../src"),
        enforce: "pre",
        loader: "eslint-loader",
        options: {
          fix: true,
          emitWarning: true,
        },
      },
    ],
  },
  plugins: [
    // 定义全局变量
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": isProd ? jsonToStr("production") : jsonToStr("development"),
    }),
    new VueLoaderPlugin(),
  ],
  performance: false,
};
