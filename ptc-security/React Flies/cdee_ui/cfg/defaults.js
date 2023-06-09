/**
 * Function that returns default values.
 * Used because Object.assign does a shallow instead of a deep copy.
 * Using [].push will add to the base array, so a require will alter
 * the base array output.
 */
"use strict";

const path = require("path");
const srcPath = path.join(__dirname, "/../src");
const dfltPort = 8000;

/**
 * Get the default modules object for webpack
 * @return {Object}
 */
function getDefaultModules() {
  return {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
      },
      {
        test: /\.sass/,
        loader:
          "style-loader!css-loader!sass-loader?outputStyle=expanded&indentedSyntax",
      },
      {
        test: /\.scss/,
        loader: "style-loader!css-loader!sass-loader?outputStyle=expanded",
      },
      {
        test: /\.less/,
        loader: "style-loader!css-loader!less-loader",
      },
      {
        test: /\.styl/,
        loader: "style-loader!css-loader!stylus-loader",
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf|svg)(\S+)?$/,
        loader: "url-loader?limit=100000&name=fonts/[name].[ext]",
      },
      {
        test: /\.(mp4|ogg)$/,
        loader: "file-loader",
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
    ],
  };
}
//(\?v=\d+\.\d+\.\d+)?
module.exports = {
  srcPath: srcPath,
  publicPath: "/assets/",
  port: dfltPort,
  getDefaultModules: getDefaultModules,
};
