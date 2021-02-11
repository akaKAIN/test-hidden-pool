const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCssAssets = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/app.ts',                            // Входной файл
  output: {                                         // Параметры выходного файла JS
    filename: 'bundle.js',                          // имя собранного файла
    path: path.resolve(__dirname, 'dist')           // папка для итогового файла
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),                       // Минимазатор JS-кода
      new OptimizeCssAssets({})             // Минимизатор CSS
    ]
  },
  devServer: {                                      // Настройки для локального сервера
    contentBase: path.resolve(__dirname, 'dist'),   // Источник раздачи статики
    port: 4200,                                     // Порт
    compress: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  resolve: {
    extensions: ['.js', '.ts']                  // Настройка для того, чтобы в импортах не дописывать расширение файла
  },
  module: {
    rules: [                                    // Сборщик стилей в проекте
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.sass|scss|css$/i,
        use: [ MiniCssExtractPlugin.loader,'css-loader','sass-loader' ],
      },
      {
        test: /\.(woff(2)?|ttf|png)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.m?js$/,                        // Правила для babel
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.ts$/,                          // компиляция TS через babel
        exclude: /node_modules/,
        loader: "babel-loader"
      },
    ]
  },
  plugins: [
    new HTMLPlugin({
      filename: "index.html",                              // Имя для собраной webpack-ом страницы
      template: "./src/templates/base_template.html"      // HTML-Шаблон для подключения собраных CSS + JS
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'                               // Собранный min-файл CSS (все css-ы собираются в него)
    }),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/assets/images", to: "src/assets/images" },
        { from: "src/assets/svg", to: "src/assets/svg" },
      ],
    })
  ]
}
