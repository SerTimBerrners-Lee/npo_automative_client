module.exports = {
	devServer: {
    compress: true,
		disableHostCheck: true, 
  }
  // chainWebpack: config => {
  //   config.module
  //     .rule('vue')
	// 		.user('vue-style-loader')
  //       .tap(options => {
  //         // modify the options...
  //         return options
  //       })
  // }
	// module: {
	// 	rules: [
	// 		{
	// 			test: /\.scss$/,
	// 			use: [
	// 				'vue-style-loader',
  //         'css-loader',
  //         'sass-loader'
	// 			]
	// 		}
	// 	]
	// }
}