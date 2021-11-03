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
import CbEd from '@/views/CbEd.vue';
import Product from '@/views/Product.vue';
import IssueShipment from '@/views/IssueShipment.vue';
import Assembly from '@/views/Assembly.vue';
import Metalloworking from '@/views/Metalloworking.vue'; 
import Library from '@/views/Library.vue';
import ResultWork from "@/views/ResultWork.vue";
import Issues from '@/views/Issues.vue';
import Layot from '@/views/Layt.vue';

import AddMaterialBase from '@/components/mathzag/base-material-add.vue';
import AddEditBaseProvider from '@/components/baseprovider/add-edit.vue';
import AddBaseInstrument from '@/components/instrument/base-instrument-add.vue';
import EditBaseInstrument from '@/components/instrument/base-instrument-edit.vue';
import AddBaseEquipment from '@/components/equipment/base-equipment-add.vue';
import EditBaseEquipment from '@/components/equipment/base-equipment-edit.vue';
import AddDetal from '@/components/basedetal/add-detal.vue'; 
import EditDetal from '@/components/basedetal/edit-detal.vue'; 
import CreateCbEd from '@/components/cbed/create-cbed.vue';
import EditCbEd from '@/components/cbed/edit-cbed.vue';
import CreateProduct from '@/components/baseproduct/create-product.vue';
import EditProduct from '@/components/baseproduct/edit-product.vue';
import CreateBuyer from '@/components/basebuyer/add-buyer.vue';
import EditBuyer from '@/components/basebuyer/edit-buyer.vue';
import NotFound from '@/components/not-found.vue';
import DefcitDetal from '@/components/sclad/deficit-detal/deficit-detal.vue';
import DeficitMaterial from '@/components/sclad/deficit-material/deficit-material.vue';
import DeficitProd from '@/components/sclad/deficit-prod/deficit-prod.vue';
import AddOrder from '@/components/issueshipment/add-order.vue';
import OrderSuppliers from '@/components/sclad/ordersuppliers/ordersuppliers.vue';
import CompletAssembl from '@/components/sclad/completassembl/completassembl.vue';
import IssueToPull from '@/components/sclad/issuetopull/issuetopull.vue';
import OrderToWay from '@/components/sclad/ordertoway/indexway.vue';
import MovingOrder from '@/components/sclad/movingorder/index.vue';
import OstatolMat from '@/components/sclad/ostatkimat/index.vue';
import OstatolProdCbDet from '@/components/sclad/ostatk-p-cb-d/index.vue';
import DefMatPlan from '@/components/sclad/defmatplan/index.vue';
import DefMatPlanAssembly from '@/components/sclad/defmatplanass/index.vue';
import CuttingCircle from '@/components/sclad/cuttingcircle/index.vue';
import CuttingList from '@/components/sclad/cuttinglist/index.vue';
import ConsumptionAll from '@/components/sclad/consumptionall/index.vue';
import ConsumptionSclad from '@/components/sclad/consumptionsclad/index.vue';
import ComingSclad from '@/components/sclad/comingtosclad/index.vue';
import ScladTrash from '@/components/sclad/scladtrash/index.vue';
import OparationDetalAssembly from '@/components/assembly/operation-assemble.vue';
import OparationDetalMetalloworking from '@/components/metalloworking/operation-metall.vue';

const routes = [ 
  {
    path: '/metalloworking/operation-metall/:operation',
    name: 'Операции Металлообработки',
    component: OparationDetalMetalloworking,
    props: true
  },
  {
    path: '/assembly/operation-assemble/:operation',
    name: 'Операции сборки',
    component: OparationDetalAssembly,
    props: true
  },
  {
    path: '/scladtrash',
    name: 'Склад отходов',
    component: ScladTrash
  },
  {
    path: '/comingsclad',
    name: 'Приход на склад',
    component: ComingSclad
  },
  {
    path: '/consumptionsclad',
    name: 'Расход склада',
    component: ConsumptionSclad
  },
  {
    path: '/consumptionall',
    name: 'Расход всего',
    component: ConsumptionAll
  },
  {
    path: '/cuttinglist',
    name: 'Резка листа',
    component: CuttingList
  },
  {
    path: '/cuttingcircle',
    name: 'Резка круга',
    component: CuttingCircle
  },
  {
    path: '/defmatplanass',
    name: 'Дефицит на сборку',
    component: DefMatPlanAssembly
  },
  {
    path: '/defmatplan',
    name: 'Дефицит на металлообработку',
    component: DefMatPlan
  },
  {
    path: '/ostatokprod',
    name: 'Остаток продукции',
    component: OstatolProdCbDet
  },
  {
    path: '/ostatolmat',
    name: 'Остаток материалов',
    component: OstatolMat
  },
  {
    path: '/layot',
    name: 'Новое окно',
    component: Layot
  },
  {
    path: '/movingorder',
    name: 'Перемещение',
    component: MovingOrder 
  },
  {
    path: '/ordertoway',
    name: 'Заказано / в пути',
    component: OrderToWay 
  },
  {
    path: '/issuetopull',
    name: 'Склад Задачи на отгрузку',
    component: IssueToPull
  },
  {
    path: '/completassembl',
    name: 'Комплектация сборок ',
    component: CompletAssembl
  },
  {
    path: '/ordersuppliers',
    name: 'Заказы у поставщиков ',
    component: OrderSuppliers
  },
  {
    path: '/issues',
    name: 'Задачи ',
    component: Issues
  },
  {
    path: '/resultwork',
    name: 'Результаты работ ',
    component: ResultWork
  },
  {
    path: '/library',
    name: 'Библиотека ',
    component: Library
  },
  {
    path: '/metalloworking',
    name: 'Металлообработка',
    component: Metalloworking
  },
  {
    path: '/assembly',
    name: 'Сборка',
    component: Assembly
  },
  {
    path: '/addorder',
    name: 'Добавить Заказ',
    component: AddOrder
  },
  {
    path: '/issueshipment',
    name: 'Задачи на отгрузку',
    component: IssueShipment
  },
  {
    path: '/deficitprod',
    name: 'Дефицит продукции',
    component: DeficitProd
  },
  {
    path: '/deficitmaterial',
    name: 'Дефицит материалов',
    component: DeficitMaterial
  },
  {
    path: '/deficitdetal',
    name: 'Дефицит деталей',
    component: DefcitDetal
  },
  {
    path: '/buyer/edit',
    name: 'Редактировать покупателя',
    component: EditBuyer
  },
  {
    path: '/buyer/create',
    name: 'Создать покупателя',
    component: CreateBuyer
  },
  {
    path: '/product/edit/:copy',
    name: 'Обновление Изделия',
    component: EditProduct,
  },
  {
    path: '/cbed/edit/:copy',
    name: 'Обновление',
    component: EditCbEd
  },
  {
    path: '/createproduct',
    name: 'Создать изделие',
    component: CreateProduct
  },
  {
    path: '/cbed/create',
    name: 'Создать Сборочную Ед.',
    component: CreateCbEd
  },
  {
    path: '/product',
    name: 'Продукция НПО Автомотив',
    component: Product
  },
  {
    path: '/cbed',
    name: 'Сборочная Еденица',
    component: CbEd
  },
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
  },
  { 
    path: "/:catchAll(.*)", 
    name: 'Страница не найдена', 
    component: NotFound, 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
