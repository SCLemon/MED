const { defineConfig } = require('@vue/cli-service')
const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  configureWebpack:(config)=>{
    // config.optimization.minimizer[0].options.terserOptions.compress = {
    //   drop_console: true,
    // };
    config.plugins.push(
      new WebpackObfuscator({
        rotateUnicodeArray: true,
      })
    );
    config.optimization.minimizer.push(
      new TerserPlugin({
        terserOptions: {
          mangle: true, // 开启变量名混淆
        },
      })
    );
  }
})