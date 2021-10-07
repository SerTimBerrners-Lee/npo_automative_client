import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Unicon from 'vue-unicons'
import { SetupCalendar, Calendar, DatePicker } from 'v-calendar';
import { uniTimes, 
        uniSetting, 
        uniUser, 
        uniPower, 
        uniHouseUserMonochrome, 
        uniPlay, 
        uniTrash, 
        uniSearchAlt,
        uniCheck,
        uniHistory,
        uniMinusSquareFull     } from 'vue-unicons/dist/icons'

Unicon.add([uniHistory, uniMinusSquareFull, uniTimes, uniSetting, uniUser, uniPower, uniHouseUserMonochrome, uniPlay, uniTrash, uniSearchAlt, uniCheck])

createApp(App)
    .use(store)
    .use(router)
    .use(SetupCalendar, {})
    .component('Calendar', Calendar)
    .component('DatePicker', DatePicker)
    .use(Unicon, {
        height: 32, 
        width: 32
    }).mount('#app')
