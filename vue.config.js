module.exports = {
	devServer: process.env.VUE_APP_IS_PROD === 'true' ?	{
    compress: true,
		public: 'npo-automotive.ru'
  } : {
		compress: true,
		disableHostCheck: true
	},
	chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with ion- as custom elements
          isCustomElement: tag => tag.startsWith('ComponentCbedModal')
        }
      }))
  }
}