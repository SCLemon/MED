const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon316: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico',
    }
  },
  devServer: {
    https: true,
    proxy: {
      '/chat': {
        target: 'http://127.0.0.1:3006',
      },
      '/verify': {
        target: 'http://127.0.0.1:3006',
      },
      '/userInfo': {
        target: 'http://127.0.0.1:3006',
      },
      '/reminder': {
        target: 'http://127.0.0.1:3006',
      },
      '/filter': {
        target: 'http://127.0.0.1:3006',
      },
    }
  }
})