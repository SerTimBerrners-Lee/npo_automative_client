module.exports = {
	devServer: process.env.VUE_APP_IS_PROD === 'true' ?	{
    compress: true,
		public: 'npo-automotive.ru'
  } : {
		compress: true,
		disableHostCheck: true
	}
}