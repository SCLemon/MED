const { defineConfig } = require('@vue/cli-service')
const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // publicPath: './',
  devServer:{
    https:true,
    proxy: {
      '/chat': {
        target: 'http://127.0.0.1:3007',
      },
      '/verify': {
        target: 'http://127.0.0.1:3007',
      },
      '/userInfo': {
        target: 'http://127.0.0.1:3007',
      },
      '/reminder': {
        target: 'http://127.0.0.1:3007',
      },
      '/filter': {
        target: 'http://127.0.0.1:3007',
      },
      '/aiSetting': {
        target: 'http://127.0.0.1:3007',
      },
      '/schedule': {
        target: 'http://127.0.0.1:3007',
      },
      '/imageHistory':{
        target: 'http://127.0.0.1:3007',
      },
      '/stock':{
        target: 'http://127.0.0.1:3007',
      },
      '/word':{
        target: 'http://127.0.0.1:3007',
      },
      '/api':{
        target: 'http://127.0.0.1:3007',
      }
    }
  },
  configureWebpack:(config)=>{
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new WebpackObfuscator({
          rotateUnicodeArray: true,
        })
      );
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            mangle: true,
          },
        })
      );
    }
  }
})