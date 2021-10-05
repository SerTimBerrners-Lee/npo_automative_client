import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Unicon from 'vue-unicons'
import { uniTimes, 
        uniSetting, 
        uniUser, 
        uniPower, 
        uniHouseUserMonochrome, 
        uniPlay, 
        uniTrash, 
        uniSearchAlt,
        uniCheck,
        uniHistory    } from 'vue-unicons/dist/icons'

Unicon.add([uniHistory, uniTimes, uniSetting, uniUser, uniPower, uniHouseUserMonochrome, uniPlay, uniTrash, uniSearchAlt, uniCheck])

createApp(App)
    .use(store)
    .use(router)
    .use(Unicon, {
        height: 32, 
        width: 32
    }).mount('#app')
