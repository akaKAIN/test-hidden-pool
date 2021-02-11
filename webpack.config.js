const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssets = require('optimize-css-assets-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: './src/app.ts',                  // Входной файл
  output: {                               // Параметры выходного файла JS
    filename: 'bundle.js',                // имя собранного файла
    path: path.resolve(__dirname, 'dist') // папка для итогового файла
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),             // Минимазатор JS-кода
      new OptimizeCssAssets({})           // Минимизатор CSS
    ]
  },
  devServer: {                                      // Настройки для локального сервера
    contentBase: path.resolve(__dirname, 'dist'),   // Источник раздачи статики
    port: 4200,                                     // Порт
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
        test: /.(s*)css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
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
        exclude: [/node_modules/],
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      filename: "index.html",                   // Имя для собраной webpack-ом страницы
      template: "./src/templates/base_template.html"      // HTML-Шаблон для подключения собраных CSS + JS
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'                     // Собранный файл CSS (все css-ы собираются в него)
    }),
  ]
}
