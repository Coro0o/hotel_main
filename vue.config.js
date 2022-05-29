module.exports = {
  publicPath: './',  
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  //打包生成map
  productionSourceMap: false,
  configureWebpack : {
    //关闭webpack的性能提示
    // performance : {
    //     hints : false
    // },
    performance: {
        hints: 'warning',
        // 入口起点的最大体积
        maxEntrypointSize: 50000000,
        // 生成文件的最大体积
        maxAssetSize: 30000000,
        // 只给出 js 文件的性能提示
        assetFilter: function(assetFilename) {
          return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
        }
    },
},
 }
