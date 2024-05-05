const { defineConfig } = require('@vue/cli-service')
const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
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