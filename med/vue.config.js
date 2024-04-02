const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/chat': {
        target: 'http://localhost:3001',
      },
      '/verify': {
        target: 'http://localhost:3001',
      },
    }
  }
})
//pathRewrite:{'^/atguigu':''},
// ws: true, //用于支持websocket
// changeOrigin: true //用于控制请求头中的host值