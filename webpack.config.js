const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function (options = {}) {
  const NODE_ENV = options.NODE_ENV || "development"; // "production"
  const SOURCE_MAP = options.SOURCE_MAP || "source-map";// "eval-source-map"; // "source-map"
  const APP_VERSION = options.APP_VERSION || "DEV";


  return {
    entry: {
      vendor: [
        "babel-polyfill",
        "react",
        "react-dom"
      ],
      app: [
        path.resolve(__dirname, "app", "src", "main")
      ]
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js?[hash]",
      publicPath: "/"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    bail: false,
    devtool: SOURCE_MAP,
    externals: {
      './config.js': "env"
    },
      module: {
      rules: [
{
        test: /\.sol$/,
        use: 'raw-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        // loader: "ts-loader"
        loader: 'babel-loader',
        options: {
            presets: ['es2015', 'stage-2', 'react'],
            plugins: ['transform-decorators-legacy', 'transform-class-properties'],
            cacheDirectory: true,
        },
      },{
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader",
          options: {
            modules: true,
            localIdentName: "[name]_[local]"
          }
        }, {
          loader: "postcss-loader",
          options: {
            plugins: function () {
              return [
                autoprefixer
              ];
            }
          }
        }, {
          loader: "less-loader"
        }]
      }, {
        test: /\.s[ac]ss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "postcss-loader",
          options: {
            plugins: function () {
              return [
                autoprefixer
              ];
            }
          }
        }, {
          loader: "sass-loader"
        }]
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          limit: 32768
        }
      }]
    },
    plugins: createListOfPlugins({NODE_ENV, APP_VERSION}),
    devServer: {
      port: 5600,
      stats: {
        chunkModules: false,
        colors: true
      },
      historyApiFallback: true,
      inline: false,
      proxy: {
        "/api": {
          target: "http://search-api.cyber.fund",
          pathRewrite: {"^/api": ""}
        }
      }
    }
  }
};

function createListOfPlugins({NODE_ENV, APP_VERSION}) {
  const plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "app", "index.html"),
      // favicon: path.resolve(__dirname, "app", "favicon.ico"),
      hash: true
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(NODE_ENV)
      },
      dev: JSON.stringify(NODE_ENV) !== 'production',
      _APP_VERSION: JSON.stringify(APP_VERSION),
    }),
    new CopyWebpackPlugin([
      // Copy directory contents to {output}/
      { from: 'config.js' }
    ]) 
  ];

  if (NODE_ENV === "production") {
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: 2
      })
    );

    plugins.push(
      new UglifyJsPlugin({
         test: /\.js($|\?)/i
      })
    )
  }

  return plugins;
}
