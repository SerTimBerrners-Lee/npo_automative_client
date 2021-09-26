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
import AddEditUser from '@/views/settings/AddEditUser.vue';
import FileBase from '@/views/FileBase.vue';
import BaseMaterial from '@/views/BaseMaterial.vue';
import BaseBuyer from '@/views/BaseBuyer.vue';
import BaseProvider from '@/views/BaseProvider.vue';
import BaseTools from '@/views/BaseTools.vue';
import BaseEquipment from '@/views/BaseEquipment.vue';
import BaseDetals from '@/views/BaseDetals.vue';
import Sclad from '@/views/Sclad.vue';
import AddMaterialBase from '@/components/base-material-add.vue';
import AddEditBaseProvider from '@/components/baseprovider/add-edit.vue';
import AddBaseInstrument from '@/components/instrument/base-instrument-add.vue'
import EditBaseInstrument from '@/components/instrument/base-instrument-edit.vue'
import AddBaseEquipment from '@/components/equipment/base-equipment-add.vue';
import EditBaseEquipment from '@/components/equipment/base-equipment-edit.vue';
import AddDetal from '@/components/basedetal/add-detal.vue'; 
import EditDetal from '@/components/basedetal/edit-detal.vue'; 


const routes = [
  {
    path: '/sclad',
    name: 'Склад',
    component: Sclad
  },
  {
    path: '/detal/edit/:editAndCopt',
    name: 'Редактировать Деталь',
    component: EditDetal,
    props: true
  },
  {
    path: '/detal/add',
    name: 'Добавить деталь',
    component: AddDetal
  },
  {
    path: '/equipment/edit/:copy',
    name: 'Редактировать/Копировать Оборудование',
    component: EditBaseEquipment,
    props: true
  },
  {
    path: '/equipment/add',
    name: 'Добавить Оборудование',
    component: AddBaseEquipment
  },
  {
    path: '/instrument/edit/:copy',
    name: 'Редактировать инструмент',
    component: EditBaseInstrument,
    props: true
  },
  {
    path: '/instrument/add/:type',
    name: 'Добавить инструмент',
    component: AddBaseInstrument,
    props: true
  },
  {
    path: '/baseprovider/addedit/:type',
    name: 'Добавить/Редактировать Поставщика',
    component: AddEditBaseProvider,
    props: true
  },
  {
    path: '/',
    name: 'Главная',
    component: WorkTable
  },
  {
    path: '/material/add/:type',
    name: 'Создать/Редактировать',
    component: AddMaterialBase,
    props: true
  },
  {
    path: '/basedetals',
    name: 'База Деталей',
    component: BaseDetals
  },
  {
    path: '/baseequipment',
    name: 'База Оборудования',
    component: BaseEquipment
  },
  {
    path: '/basetools',
    name: 'База Инструмента',
    component: BaseTools
  },
  {
    path: '/baseprovider',
    name: 'База Поставщиков',
    component: BaseProvider
  },
  {
    path: '/basebuyer',
    name: 'База Покупателей',
    component: BaseBuyer
  },
  {
    path: '/basematerial',
    name: 'База Материалов',
    component: BaseMaterial
  },
  {
    path: '/filebase',
    name: 'База Файлов',
    component: FileBase
  },
  {
    path: '/settings',
    name: 'Настройки',
    component: settings
  },
  { 
    path: '/employee/edit/:title',
    name: 'Добавить Пользователя',
    component: AddEditUser,
    props: true
  },
  {
    path: '/employee',
    name: 'Пользователи',
    component: UsersPage
  },
  {
    path: '/edizm',
    name: 'Единицы измерений',
    component: EdizmPage
  },
  {
    path: '/mathzag',
    name: 'Материалы',
    component: MatZagPage
  },
  {
    path: '/pokdet',
    name: 'Покупные Материалы',
    component: PokDetPage
  },
  {
    path: '/rashmat',
    name: 'Расходные Материалы',
    component: RashMatPage
  },
  {
    path: '/opertechproc',
    name: 'Типы Операций',
    component: OperationTehPage
  },
  {
    path: '/instrosn',
    name: 'Инструмент и Оснастка',
    component: InstrOsnastPage
  },
  {
    path: '/baseoborud',
    name: 'Оборудование',
    component: BaseOborud
  },
  {
    path: '/basetech',
    name: 'Техника и Инвентарь',
    component: BaseTechInvPage
  },
  {
    path: '/diffsklad',
    name: 'Дефицит',
    component: DiffSklad
  },
  {
    path: '/uthetwtime',
    name: 'Учет Времени',
    component: UthetWorkTimePage
  },
  {
    path: '/rolesuser',
    name: 'Роли',
    component: RoliUserPage
  },
  {
    path: '/dolznuser',
    name: 'Должности',
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
    name: 'Библиотека',
    component: LibbaryPage
  },
  {
    path: '/pricehors',
    name: 'Стоимость норма-часа',
    component: PriceHorsPage
  },
  {
    path: '/savebasedata',
    name: 'База Данных',
    component: SaveBaseData
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
