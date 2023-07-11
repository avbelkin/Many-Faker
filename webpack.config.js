const path = require('path');
module.exports = (env, argv) =>({
  mode: "development",
  devtool: argv.mode === "production" ? false : "inline-source-map",
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
        test: /\.(m?js|ts)?$/,
        exclude: function(modulePath){
          return  /node_modules/.test(modulePath) && 
          !(
            /node_modules\/@faker-js/.test(modulePath)
            || /node_modules\/d3.*/.test(modulePath)
          );
        },
        loader: "babel-loader",
        options: {
          rootMode: "upward",
        },
      }
    ]
  }
});