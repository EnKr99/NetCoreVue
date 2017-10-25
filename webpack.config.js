const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const bundleOutputDir = './wwwroot/dist'

module.exports = env => {
  const isDevBuild = !(env && env.prod)
  return [
    {
      entry: { 'main': './ClientApp/app.js' },
      resolve: {
        extensions: ['.js', '.vue'],
        alias: {
          'vue$': 'vue/dist/vue',
          'components': path.resolve(__dirname, './ClientApp/components'),
          'views': path.resolve(__dirname, './ClientApp/views'),
          'utils': path.resolve(__dirname, './ClientApp/utils'),
          'api': path.resolve(__dirname, './ClientApp/store/api')
        }
      },
      output: {
        path: path.resolve(__dirname, bundleOutputDir),
        filename: '[name].js',
        publicPath: '/dist/'
      },
      module: {
        rules: [
          { test: /\.vue$/, use: 'vue-loader' },
          { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
          {
            test: /\.css$/,
            use: isDevBuild ? ['style-loader', 'css-loader'] : ExtractTextPlugin.extract({ use: 'css-loader' })
          },
          { test: /\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2|eot)$/, use: 'url-loader?limit=25000' }
        ]
      },
      plugins: [
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require('./wwwroot/dist/vendor-manifest.json')
        })
      ].concat(isDevBuild
        ? [
          // Plugins that apply in development builds only
          new webpack.SourceMapDevToolPlugin({
            filename: '[file].map', // Remove this line if you prefer inline source maps
            moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
          })
        ]
        : [
          // Plugins that apply in production builds only
          new webpack.optimize.UglifyJsPlugin(),
          new ExtractTextPlugin('site.css')
        ])
    }
  ]
}
