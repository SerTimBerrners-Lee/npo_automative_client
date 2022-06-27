const proxy = {
	'/api': {
		target: process.env.VUE_APP_PATH_TO_SERVER,
		changeOrigin: true
	}
}

console.info("\n\n\nVUE_APP_IS_PROD: ", process.env.VUE_APP_IS_PROD, "\n\n\n");

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