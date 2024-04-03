const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/chat': {
        target: 'http://127.0.0.1:3005',
      },
      '/verify': {
        target: 'http://127.0.0.1:3005',
      },
    }
  }
})
//pathRewrite:{'^/atguigu':''},
// ws: true, //用于支持websocket
// changeOrigin: true //用于控制请求头中的host值