const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = (env, argv) =>({
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/code.ts",
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: "build.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin()]
  }
});