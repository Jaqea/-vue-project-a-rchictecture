# vue-project-archictecture

一个基于Webpack搭建的Vue项目脚手架。

所用技术：

- 使用**Vue.js**作为编码语言。
- 使用**Webpack**进行项目打包及配置。
- 使用**Antd**组件进行页面编写。
- 集成**sass**、**Less**进行样式编写。
- 使用**Vue-router**管理路由。
- 使用**Vuex**管理数据。
- 使用**Axios**进行服务端交互。
- 使用**Eslint+Airbub、Prettier、Commitlint**配置规范代码。

## 项目目录结构

```cmd
|-- vue-project-archictecture
    |-- .babelrc										# babel配置文件
    |-- .browserslistrc									# 浏览器兼容配置
    |-- .editorconfig									# 代码风格配置文件
    |-- .eslintrc.js									# eslint配置文件
    |-- .gitignore										# git忽略文件
    |-- .prettierrc.js									# Prettier配置文件
    |-- commitlint.config.js							# commitlint配置文件
    |-- package.json
    |-- yarn-error.log
    |-- yarn.lock
    |-- public
    |   |-- favicon.ico
    |   |-- index.html
    |-- src
    |   |-- App.vue	
    |   |-- index.js
    |   |-- api											# API接口	
    |   |   |-- base.js									# 环境域名配置
    |   |   |-- modules									# 模块接口
    |   |       |-- demo.js
    |   |       |-- index.js
    |   |-- assets
    |   |   |-- images
    |   |   |   |-- demo.png
    |   |   |-- styles									# 全局样式
    |   |       |-- common.less							# 入口文件
    |   |       |-- layout.less							# 全局布局样式
    |   |       |-- mixin.less							# 全局混合
    |   |       |-- variable.less						# 全局样式变量
    |   |       |-- theme								# antd主题配置
    |   |           |-- base.js
    |   |-- components									# 全局组件
    |   |   |-- loading									# 加载效果组件
    |   |       |-- loading.vue
    |   |-- router
    |   |   |-- index.js
    |   |   |-- middleware								# 路由中间件
    |   |   |   |-- auth.js
    |   |   |   |-- demo.js
    |   |   |   |-- guest.js
    |   |   |   |-- index.js
    |   |   |-- routes									# 路由
    |   |       |-- index.js
    |   |-- store
    |   |   |-- index.js
    |   |   |-- modules
    |   |       |-- demo
    |   |           |-- actions.js
    |   |           |-- getters.js
    |   |           |-- index.js
    |   |           |-- mutations.js
    |   |           |-- state.js
    |   |-- utils										# 全局公用方法
    |   |   |-- http.js
    |   |-- views
    |       |-- home
    |       |   |-- home.less
    |       |   |-- home.vue
    |       |-- login
    |       |   |-- login.vue
    |       |-- notFound
    |           |-- notFound.vue
    |-- webpack
        |-- webpack.base.conf.js						# webpack基础配置
        |-- webpack.dev.conf.js							# 开发环境配置
        |-- webpack.prod.conf.js						# 生产环境配置
```

## 全局配置

### webpack

基础配置：

```js
// /webpack/webpack.base.conf.js
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
```

开发环境配置：

```js
// /webpack/webpack.dev.conf.js
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
```

生产环境配置：

```js
// /webpack/webpack.prod.conf.js
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
```

### .eslintrc.js

ESLint基本配置。

```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: "./webpack/webpack.base.conf.js",
      },
    },
  },
  extends: ["plugin:vue/essential", "airbnb-base", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["vue", "prettier", "babel"],
  rules: {
    "prettier/prettier": "error",
    quotes: [1, "double"],
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        vue: "never",
      },
    ],
    "global-require": 0,
    "import/no-dynamic-require": 0,
    "import/no-cycle": 0,
    "import/prefer-default-export": 0,
    "no-console": 0,
    "no-param-reassign": 0,
    "import/no-extraneous-dependencies": 0,
  },
};

```

### .prettierrc.js

Prettier格式化规则配置。

```js
// .prettierrc.js
module.exports = {
  printWidth: 100, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, //一个tab代表几个空格数，默认为80
  useTabs: false, //是否使用tab进行缩进，默认为false，表示用空格进行缩减
  singleQuote: false, //字符串是否使用单引号，默认为false，使用双引号
  semi: true, //行位是否使用分号，默认为true
  trailingComma: 'es5', //是否使用尾逗号，有三个可选值"<none|es5|all>"
  bracketSpacing: true, //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
};
```

### commitlint.config.js

commitlint 基础配置，用于检查 `git commit -m ''` 格式。

```js
// .commitlint.config.js
module.exports = {
  // 继承默认配置
  extends: ["@commitlint/config-angular"],
  // 自定义规则
  rules: {
    "type-enum": [
      2,
      "always",
      ["test", "upd", "feat", "fix", "refactor", "docs", "chore", "style", "revert"],
    ],
    "header-max-length": [0, "always", 72],
  },
};
```

`commit`的格式要求如下：

```cmd
Type(<scope>): <subject>

<body>

<footer>

# Type 字段包含:
#  feat：新功能（feature）
#  fix：修补bug
#  docs：文档（documentation）
#  style： 格式（不影响代码运行的变动）
#  refactor：重构（即不是新增功能，也不是修改bug的代码变动）
#  test：增加测试
#  chore：构建过程或辅助工具的变动
# scope用于说明 commit 影响的范围，比如数据层、控制层、视图层等等。
# subject是 commit 目的的简短描述，不超过50个字符
# Body 部分是对本次 commit 的详细描述，可以分成多行
# Footer用来关闭 Issue或以BREAKING CHANGE开头，后面是对变动的描述、
#  以及变动理由和迁移方法
```

例子：

```cmd
git commit -m 'feat: 增加用户搜搜功能'
git commit -m 'fix: 修复用户检测无效的问题'
```

## 样式管理

### base.js

antd 主题样式配置，需要改变相应主题只需在该文件中配置，默认内置样式如下：

```js
// /src/assets/theme/base.js
module.exports = {
  "@primary-color": "#1890ff", // 全局主色 1890ff
  //   "@link-color": "#1890ff", // 链接色
  //   "@success-color": "#52c41a", // 成功色
  //   "@warning-color": "#faad14", // 警告色
  //   "@error-color": "#f5222d", // 错误色
  //   "@font-size-base": "14px", // 主字号
  //   "@heading-color": "rgba(0, 0, 0, 0.85)", // 标题色
  //   "@text-color": "rgba(0, 0, 0, 0.65)", // 主文本色
  //   "@text-color-secondary": "rgba(0, 0, 0, 0.45)", // 次文本色
  //   "@disabled-color": "rgba(0, 0, 0, 0.25)", // 失效色
  //   "@border-radius-base": "2px", // 组件/浮层圆角
  //   "@border-color-base": "#d9d9d9", // 边框色
  //   // 浮层阴影
  //   "@box-shadow-base": `0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08)
  // , 0 9px 28px 8px rgba(0, 0, 0, 0.05)`,
};
```

### 全局样式

全局样式（variable.less、mixin.less、layout.less）在 `common.js` 里导入后，就不用在其它样式文件中 `@import 'xxx.less';` ，直接引用即可。例如：

```less
div {
  color: @color;
}
```

- variable.less：全局样式变量
- mixin.less：全局混合
- layout.less：全局布局样式

如果想要导入其它全局样式，在该目录下创建文件再导入`common.js` 中即可。例如：

```less
@import "./xxx.less";
```

## 接口管理

### base.js

用于配置不同环境下的域名。

```js
// /src/api/base.js
module.exports = {
  production: "https://production.com",
  development: "http://jsonplaceholder.typicode.com",
};
```

### modules

各个模块的接口，例如：

```js
// /src/api/modules/base.js
import service from "@/utils/http";

const demo = {
  getData() {
    return service.get("/posts/1");
  },
  // ...其它
};

export default demo;
```

##  路由权限管理

### middleware

通过中间件管理路由权限。

```js
// /src/router/middleware/auth.js
export default function auth({ next, store }) {
  if (!store.getters.isLogin)
    return next({
      name: "login",
    });

  return next();
}
```

```js
// /src/router/index.js
router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) next();
  const { middleware } = to.meta;
  const context = {
    to,
    from,
    next,
    store,
  };
  if (middleware) middleware.forEach((middlewareItem) => middlewareItem(context));
});
```

```js
// /src/router/routes/index.js
const routes = [
  {
    path: "/",
    name: "home",
    component: load("home"),
    meta: {
      middleware: [auth, demo],
    },
  },
  {
    path: "/login",
    name: "login",
    component: load("login"),
    meta: {
      middleware: [guest],
    },
  },
  {
    path: "/404",
    name: "notFound",
    component: load("notFound"),
  },
  {
    path: "*",
    redirect: {
      name: "home",
    },
  },
];
```

## 开发流程

1. 将源仓库克隆/拉取到本地。

   ```cmd
   git clone https://gitee.com/jaqea/vue-project-archictecture.git
   ```

2. `cd`到根目录“/vue-project-archictecture”，安装依赖。

   ```cmd
   npm install / yarn install
   ```

3. 运行，进行开发。

   ```cmd
   npm run serve / yarn serve
   ```

4. 完成开发后，进行打包。

   ```cmd
   npm run build / yarn serve
   ```
   
5. 代码提交到远程个人仓库。

   ```cmd
   git add .
   npm run commit / yarn commit
   git push ...
   ```