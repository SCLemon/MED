const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pwa: {
    name: 'MED 智能小助手',
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'white',
    iconPaths: {
      favicon32: 'img/icons/favicon-96x96.png',
      favicon316: 'img/icons/favicon-96x96.png',
      appleTouchIcon: 'logo.png',
      maskIcon: 'logo.png',
      msTileImage: 'img/icons/favicon-96x96.png',
    }
  },
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
    }
  }
})