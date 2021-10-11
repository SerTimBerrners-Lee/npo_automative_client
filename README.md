# npo_automative
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

# Code Styles
* Табы = 2 пробела
* css стили пишутся без отступов от ктрая
* Основные страницы в папке **views**
* Компоненты(и страницы которые относятся к странице в **views**)  в одноименных папках в папке **components** 
* Папка **components** содержит другие компоненты которые часто используются в приложении, например модальные окна, они находятся в корне папки **components**.
* Поочередность наименование методов vue в компонентах
	* props
	* data()
	* watch
	* computed | components - между ними любая очередность
	* любые другие 
	* methods
	* mounted


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
