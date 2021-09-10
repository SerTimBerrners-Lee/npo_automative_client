import { createRouter, createWebHistory } from 'vue-router'
import WorkTable from '@/views/WorkTable.vue';
import settings from '@/views/Settings.vue';
import UsersPage from '@/views/settings/UsersPage.vue';
import EdizmPage from '@/views/settings/EdizmPage.vue';
import MatZagPage from '@/views/settings/MatZagPage.vue';
import PokDetPage from '@/views/settings/PokDetPage.vue';
import RashMatPage from '@/views/settings/RashMatPage.vue';
import OperationTehPage from '@/views/settings/OperationTehPage.vue';
import InstrOsnastPage from '@/views/settings/InstrOsnastPage.vue';
import BaseOborud from '@/views/settings/BaseOborud.vue';
import BaseTechInvPage from '@/views/settings/BaseTechInvPage.vue';
import DiffSklad from '@/views/settings/DiffSklad.vue';
import UthetWorkTimePage from '@/views/settings/UthetWorkTimePage.vue';
import RoliUserPage from '@/views/settings/RoliUserPage.vue';
import DolznUser from '@/views/settings/DolznUser.vue';
import LibbaryPage from '@/views/settings/LibbaryPage.vue';
import PriceHorsPage from '@/views/settings/PriceHorsPage.vue';
import SaveBaseData from '@/views/settings/SaveBaseData.vue';
import AddEdit from '@/views/settings/AddEdit.vue';
import FileBase from '@/views/FileBase.vue';
import BaseMaterial from '@/views/BaseMaterial.vue';
import BaseBuyer from '@/views/BaseBuyer.vue';
import BaseProvider from '@/views/BaseProvider.vue';
import BaseTools from '@/views/BaseTools.vue';
import BaseEquipment from '@/views/BaseEquipment.vue';
import BaseDetals from '@/views/BaseDetals.vue';
import AddMaterialBase from '@/components/base-material-add.vue';
import AddEditBaseProvider from '@/components/baseprovider/add-edit.vue';
import AddBaseInstrument from '@/components/instrument/base-instrument-add.vue'
import EditBaseInstrument from '@/components/instrument/base-instrument-edit.vue'
 
const routes = [
  {
    path: '/instrument/edit',
    name: 'EditBaseInstrument',
    component: EditBaseInstrument,
  },
  {
    path: '/instrument/add/:type',
    name: 'AddBaseInstrument',
    component: AddBaseInstrument,
    props: true
  },
  {
    path: '/baseprovider/addedit/:type',
    name: 'AddEditBaseProvider',
    component: AddEditBaseProvider,
    props: true
  },
  {
    path: '/',
    name: 'WorkTable',
    component: WorkTable
  },
  {
    path: '/material/add/:type',
    name: 'AddMaterialBase',
    component: AddMaterialBase,
    props: true
  },
  {
    path: '/basedetals',
    name: 'BaseDetals',
    component: BaseDetals
  },
  {
    path: '/baseequipment',
    name: 'BaseEquipment',
    component: BaseEquipment
  },
  {
    path: '/basetools',
    name: 'BaseTools',
    component: BaseTools
  },
  {
    path: '/baseprovider',
    name: 'BaseProvider',
    component: BaseProvider
  },
  {
    path: '/basebuyer',
    name: 'BaseBuyer',
    component: BaseBuyer
  },
  {
    path: '/basematerial',
    name: 'BaseMaterial',
    component: BaseMaterial
  },
  {
    path: '/filebase',
    name: 'FileBase',
    component: FileBase
  },
  {
    path: '/settings',
    name: 'settings',
    component: settings
  },
  { 
    path: '/employee/edit/:title',
    name: 'AddEdit',
    component: AddEdit,
    props: true
  },
  {
    path: '/employee',
    name: 'UsersPage',
    component: UsersPage
  },
  {
    path: '/edizm',
    name: 'EdizmPage',
    component: EdizmPage
  },
  {
    path: '/mathzag',
    name: 'MatZagPage',
    component: MatZagPage
  },
  {
    path: '/pokdet',
    name: 'PokDetPage',
    component: PokDetPage
  },
  {
    path: '/rashmat',
    name: 'RashMatPage',
    component: RashMatPage
  },
  {
    path: '/opertechproc',
    name: 'OperationTehPage',
    component: OperationTehPage
  },
  {
    path: '/instrosn',
    name: 'InstrOsnastPage',
    component: InstrOsnastPage
  },
  {
    path: '/baseoborud',
    name: 'BaseOborud',
    component: BaseOborud
  },
  {
    path: '/basetech',
    name: 'BaseTechInvPage',
    component: BaseTechInvPage
  },
  {
    path: '/diffsklad',
    name: 'DiffSklad',
    component: DiffSklad
  },
  {
    path: '/uthetwtime',
    name: 'UthetWorkTimePage',
    component: UthetWorkTimePage
  },
  {
    path: '/rolesuser',
    name: 'RoliUserPage',
    component: RoliUserPage
  },
  {
    path: '/dolznuser',
    name: 'DolznUser',
    component: DolznUser
    // не подходит страница перезагружается
    // children: [{
    //   path: ':id',
    //   name: 'addedizm',
    //   component: AddEdizm
    // }]
  },
  {
    path: '/libbarysetting',
    name: 'LibbaryPage',
    component: LibbaryPage
  },
  {
    path: '/pricehors',
    name: 'PriceHorsPage',
    component: PriceHorsPage
  },
  {
    path: '/savebasedata',
    name: 'SaveBaseData',
    component: SaveBaseData
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
