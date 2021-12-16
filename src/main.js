import App from './App.vue';
import store from './store';
import router from './router';
import { createApp } from 'vue';
import Unicon from 'vue-unicons';
import Loader from '@/components/loader.vue';
import MiniLoader from '@/components/mini-loader.vue';
import QuickFilter from '@/components/quick-filter.vue';
import FileLoader from '@/components/drag-drop-file.vue';
import InformFolder from '@/components/InformFolder.vue';
import { SetupCalendar, Calendar, DatePicker } from 'v-calendar';
import { 
    uniTimes, 
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
    uniStar,
    uniExclamation,
    uniAlignCenterV,
    uniOkta } from 'vue-unicons/dist/icons';

Unicon.add([
    uniAlignCenterV, 
    uniOkta, 
    uniExclamation, 
    uniPen, 
    uniGlassTea, 
    uniStar, 
    uniHistory, 
    uniMinusSquareFull, 
    uniTimes, 
    uniSetting, 
    uniUser, 
    uniPower, 
    uniHouseUserMonochrome, 
    uniPlay, 
    uniTrash, 
    uniSearchAlt, 
    uniCheck
])

createApp(App)
    .use(store)
    .use(router)
    .use(SetupCalendar, {})
    .component('Loader', Loader)
    .component('MiniLoader', MiniLoader)
    .component('Calendar', Calendar)
    .component('DatePicker', DatePicker)
    .component('FileLoader', FileLoader)
    .component('QuickFilter', QuickFilter)
    .component('InformFolder', InformFolder)
    .use(Unicon, {
        height: 32, 
        width: 32
    }).mount('#app')
