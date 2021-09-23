import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Unicon from 'vue-unicons'
import { uniTimes, uniSetting, uniUser, uniPower, uniHouseUserMonochrome, uniPlay, uniTrash, uniSearchAlt    } from 'vue-unicons/dist/icons'

Unicon.add([uniTimes, uniSetting, uniUser, uniPower, uniHouseUserMonochrome, uniPlay, uniTrash, uniSearchAlt   ])

createApp(App)
    .use(store)
    .use(router)
    .use(Unicon, {
        height: 32, 
        width: 32
    }).mount('#app')
