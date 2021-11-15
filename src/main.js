import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Unicon from 'vue-unicons'
import { SetupCalendar, Calendar, DatePicker } from 'v-calendar';
import Loader from '@/components/loader.vue';
import MiniLoader from '@/components/mini-loader.vue';
import FileLoader from '@/components/drag-drop-file.vue';
import InformFolder from '@/components/InformFolder.vue';
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
        uniMinusSquareFull,
        uniGlassTea,
        uniPen, 
        uniStar       } from 'vue-unicons/dist/icons'

Unicon.add([uniPen, uniGlassTea, uniStar , uniHistory, uniMinusSquareFull, uniTimes, uniSetting, uniUser, uniPower, uniHouseUserMonochrome, uniPlay, uniTrash, uniSearchAlt, uniCheck])

createApp(App)
    .use(store)
    .use(router)
    .use(SetupCalendar, {})
    .component('Loader', Loader)
    .component('MiniLoader', MiniLoader)
    .component('Calendar', Calendar)
    .component('DatePicker', DatePicker)
    .component('FileLoader', FileLoader)
    .component('InformFolder', InformFolder)
    .use(Unicon, {
        height: 32, 
        width: 32
    }).mount('#app')
