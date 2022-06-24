const proxy = {
	'/api': {
		target: process.env.VUE_APP_PATH_TO_SERVER,
		changeOrigin: true
	}
}


module.exports = {
	devServer: process.env.VUE_APP_IS_PROD === 'true' ?	{
    compress: true,
		public: 'npo-automotive.ru',
		proxy
  } : {
		compress: true,
		disableHostCheck: true,
		proxy
	},
}