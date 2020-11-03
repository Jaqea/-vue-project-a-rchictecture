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
