const path = require("path")

module.exports = {
  entry: { 
    index: path.resolve(__dirname, 'src', "index.js") 
  },
  output: {
    path: path.resolve(__dirname, "dist")
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false
  },
  module: {
    rules:[
      {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
              loader: "babel-loader"
          }
      },
    ]
  }
}