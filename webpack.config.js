const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts');
const packageJson = require('./package.json');

const PATHS = {
  app  : path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css')
  ],
  build: path.join(__dirname, 'build'),
};

const common = {
  entry: {
    style: PATHS.style,
    app: PATHS.app
  },
  output: {
    path    : PATHS.build,
    filename: '[name]-.js',
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Demo',
    }),
  ],

};


var config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map', // reconsider sourcemaps for production
        output: {
          path    : PATHS.build,
          publicPath: '/webpack-demo/',
          filename: '[name]-[chunkhash].js',
          // This is used for require.ensure. The setup
          // will work without but this is useful to set.
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app]),
      parts.setFreeVariable('process.env.NODE_ENV', 'production'),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react', 'react-dom']
      }),
      parts.replaceReactWithPreact(),
      parts.minify()
    );
    break;
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map' // possible performance decrease, if rebuild is too slow consider lower quality of sourcemaps
      },
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
      }),
      parts.setupCSS(PATHS.style)
    );
}

module.exports = validate(config, {
  quiet: true
});