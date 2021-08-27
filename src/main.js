import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Unicon from 'vue-unicons'
import { uniSetting, uniUser, uniPower, uniHouseUserMonochrome, uniPlay, uniTrash    } from 'vue-unicons/dist/icons'

Unicon.add([uniSetting, uniUser, uniPower, uniHouseUserMonochrome, uniPlay, uniTrash    ])

createApp(App)
    .use(store)
    .use(router)
    .use(Unicon, {
        height: 32, 
        width: 32
    }).mount('#app')
