const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const vueConfig = {
  lintOnSave: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'public',
  indexPath: 'index.html',
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'webease',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  productionSourceMap: false,
  css: {
    // extract: false, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps
    // requireModuleExtension: true,
    loaderOptions: {},
  },
  configureWebpack: {
    plugins: [],
  },
  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))
    config.plugins.delete('prefetch-index')
    config.plugins.delete('preload-index')
  },
  devServer: {
    // 环境配置
    port: 88,
    https: false,
    hotOnly: false,
    open: false, // 配置自动启动浏览器
    compress: true, // 启用gzip压缩
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true, // 是否改变域名
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}

module.exports = vueConfig
