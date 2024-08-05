const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  // mode: "production",
  mode: "production",
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    poll: 500, // Check for changes every second
  },
  performance: {
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    // fallback: {
    //   util: require.resolve("util/"),
    // },
    plugins: [new TsconfigPathsPlugin()],
  },

  entry: {
    index: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "../site/"),
    filename: "js/[name].bundle.js",
    chunkFilename: "js/[name].bundle.[id].js",
  },
  externals: {
    jquery: "jquery",
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].bundle.css",
      chunkFilename: "css/[name].bundle.[id].css",
    }),
    new MomentLocalesPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: ["es-us"],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
              // sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass"),
              sourceMap: true,
              // sourceMapContents: false,
              sassOptions: {
                outputStyle: "compressed",
              },
            },
          },
        ],
      },
    ],
  },
};
