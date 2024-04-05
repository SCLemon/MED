const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
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
    }
  }
})