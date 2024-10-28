const { defineConfig } = require('@vue/cli-service');
const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  devServer: {
    https: true,
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
      '/imageHistory': {
        target: 'http://127.0.0.1:3007',
      },
      '/stock': {
        target: 'http://127.0.0.1:3007',
      },
      '/word': {
        target: 'http://127.0.0.1:3007',
      },
      '/api': {
        target: 'http://127.0.0.1:3007',
      }
    }
  },
  productionSourceMap: false,
  pwa: {
    name: 'MED Reminder',
    short_name: 'MED Reminder',
    themeColor: '#4DBA87',
    backgroundColor: '#ffffff',
    display: 'standalone',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/favicon-32x32.png',
      maskIcon: 'img/icons/favicon-32x32.png',
      msTileImage: 'img/icons/favicon-32x32.png',
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('.*\\.(js|css|html)$'), // 匹配所有的 JS、CSS 和 HTML 文件
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'assets-cache-v2.5.4',
          },
        },
      ],
    },
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 添加加密和混淆插件
      config.plugins.push(
        new WebpackObfuscator({
          rotateUnicodeArray: true,
        })
      );

      // 使用 TerserPlugin 進行壓縮
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            extractComments: false,
          },
        })
      );

      // Tree shaking
      config.optimization.usedExports = true;
      
      // 拆分代碼
      config.optimization.splitChunks = {
        chunks: 'all', // 可選：'async' | 'all' | 'initial'
        minSize: 20000, // 最小尺寸
        maxSize: 0, // 0 表示不限制
        minChunks: 1, // 最少使用次數
        maxAsyncRequests: 30, // 最大的異步請求數
        maxInitialRequests: 30, // 最大的初始請求數
        automaticNameDelimiter: '~',
      }
    }
  }
});
