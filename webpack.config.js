const path = require('path');
module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/code.ts",
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: "build.js" // <--- Will be compiled to this single file
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
  }
};