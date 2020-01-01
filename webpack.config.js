const path = require("path");

const outputDir = path.resolve(__dirname, "dist/js");
module.exports = {
  entry: path.resolve(__dirname, "src/js/entry"),
  output: {
    path: outputDir,
    filename: "bundle.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  }
};
