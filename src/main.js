import App from './App.vue';
import store from './store';
import router from './router';
import workers from './workers';
import { createApp } from 'vue';
import Unicon from 'vue-unicons';
import Loader from '@/components/Loader';
import Search from '@/components/Search';
import MiniLoader from '@/components/MiniLoader';
import FileLoader from '@/components/DragDropFile';
import QuickFilter from '@/components/QuickFilter';
import InformFolder from '@/components/InformFolder';
import MiniNavigation from '@/components/MiniNavigation';
import { SetupCalendar, Calendar, DatePicker } from 'v-calendar';
import {
    uniImport,
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
    uniOkta
} from 'vue-unicons/dist/icons';

Unicon.add([
    uniImport,
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
    .use(workers)
    .use(SetupCalendar, {})
    .component('Loader', Loader)
    .component('Search', Search)
    .component('MiniLoader', MiniLoader)
    .component('Calendar', Calendar)
    .component('DatePicker', DatePicker)
    .component('FileLoader', FileLoader)
    .component('QuickFilter', QuickFilter)
    .component('InformFolder', InformFolder)
    .component('MiniNavigation', MiniNavigation)
    .use(Unicon, {
        height: 32,
        width: 32
    }).mount('#app')
