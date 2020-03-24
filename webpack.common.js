const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

const devMode = process.env.NODE_ENV !== 'production'

const styleLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    hmr: devMode,
    reloadAll: true,
  },
}

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.css$/,
        use: [styleLoader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [styleLoader, 'css-loader', 'sass-loader'],
      },
      { test: /\.(?:gif|jpg|png|svg|webp)$/, use: ['file-loader'] },
      { test: /\.(?:eot|otf|ttf|woff|woff2)$/, use: ['file-loader'] },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: path.join(__dirname, 'src', 'index.html') }),
    new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      ignoreOrder: false,
    }),
  ],
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsWebpackPlugin()],
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}
