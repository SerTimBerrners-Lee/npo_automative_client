<template>
  <div>
    <h3>Дефицит продукции (комплектации изделий)</h3>
    <div>
      <div class="block header_block">
        <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
        <span>Фильтры по статусу:</span>
        <div>
          <label for='z'>Заказано</label><input id='z' type="checkbox">
          <label for='zn'>Не заказано</label><input id='zn' type="checkbox">
          <label for='end'>Выполнено</label><input id='end' type='checkbox'>
        </div>
      </div>
    </div>
    
    <div class='table_block'>
      <div class="table-scroll">
        <table style='width: 200px;'>
          <tr>
            <th>Заказ покупателя из задач на отгрузку</th>
          </tr>
          <tr 
            v-for='shipment of getShipmentsSclad' 
            :key='shipment'
            class='td-row'
            @click='setShipment(shipment)'>
            <td> {{ shipment.number_order }} </td>
          </tr>
        </table>
      </div>
      <div class="table-scroll" style='margin-left: 5px;'>
        <table>
          <tr>
            <th colspan="7">Комплектация сборки, детали</th>
            <th rowspan="2">Дефицит</th>
            <th rowspan="2">Реальный остаток с учетом планируемых отгрузок</th>
            <th rowspan="2">Минимальный остаток</th>
            <th rowspan="2">Рекомендуемый остаток</th>
            <th rowspan="2">Норма времени на одну единицу (сборка+изготовл.)</th>
            <th rowspan="2">СВОЕ кол-во(по умолч. равно рекоменд. кол-ву)</th>
            <th rowspan="2">Общая норма времени (сборка+изготовл.)</th>
            <th rowspan="2">Реальный остаток с учетом планируемых отгрузок и планируемого производства</th>
            <th rowspan="2">Уровень комплектации, %</th>
            <th rowspan="2">Статус</th>
            <th rowspan="2">Дата запуска</th>
            <th rowspan="2">Примечание</th>
          </tr>
          <tr>
            <th>
              <unicon name="check" fill="royalblue" />
            </th> 
            <th>Тип</th>
            <th>№ Заказа</th>
            <th>Дата заказа</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Принадлежность</th>
          </tr>
          <tr v-for='shipments of selectShipment.cbeds' :key='shipments'>
            <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
              <p class="checkbox_block" @click='e => toProduction(shipments, e.target)'></p>
            </td>
            <td class='center'>СБ</td>
            <td class='center'>{{ selectShipment.number_order }}</td>
            <td class='center'>{{ selectShipment.date_order }}</td>
            <td class='center'>{{ shipments.articl }}</td>
            <td class='center'>{{ shipments.name }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='showParents(shipments, "cb")' class='link_img' atl='Показать' />
            </td>
            <td class='center'>{{ getDeficitIzd('cbed', shipments.id) }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>{{ getDeficitIzd('cbed', shipments.id) }}</td>
            <td class='center'>{{ shipments.parametrs ? JSON.parse(shipments.parametrs)[0].znach : '' }}</td>
            <td class='center' contenteditable="true" @keyup='e => alt(e.target)'>{{ getDeficitIzd('cbed', shipments.id) }}</td>
            <td class='center'>{{ shipments.parametrs ? 
              Number(JSON.parse(shipments.parametrs)[0].znach) * getDeficitIzd('cbed', shipments.id) 
              : '' }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>{{  }}</td>
            <td class='center'>Заказано</td>
            <td class='center'>{{ selectShipment.date_shipments }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDescription(selectShipment.description)' class='link_img' atl='Показать' />
            </td>
          </tr>
          <tr v-for='shipments of selectShipment.detals' :key='shipments'>
            <td class='center checkbox_parent' >
              
            </td>
            <td class='center'> Д </td>
            <td class='center'>{{ selectShipment.number_order }}</td>
            <td class='center'>{{ selectShipment.date_order }}</td>
            <td class='center'>{{ shipments.articl }}</td>
            <td class='center'>{{ shipments.name }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='showParents(shipments, "det")' class='link_img' atl='Показать' />
            </td>
            <td class='center'>{{ getDeficitIzd('detal', shipments.id) }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>{{ getDeficitIzd('detal', shipments.id) }}</td>
            <td class='center'>{{ parseParametrsDetal(shipments.parametrs) }}</td>
            <td class='center'>{{ getDeficitIzd('detal', shipments.id) }}</td>
            <td class='center'>{{ parseParametrsDetal(shipments.parametrs, getDeficitIzd('detal', shipments.id) ) }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>{{  }}</td>
            <td class='center'>Заказано</td>
            <td class='center'>{{ selectShipment.date_shipments }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDescription(selectShipment.description)' class='link_img' atl='Показать' />
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class='btn-control'>
      <button class="btn-small" @click='normTimeOperation'>Норма времени по операциям</button>
      <button class="btn-small btn-add" @click='start'>Запустить в производство</button>
      <button class="btn-small" @click='shipmentsAdd'> Добавить заказ </button>
    </div>
    <StartPraduction 
      v-if='parametrs'
      :key='startProductionModalKey'
      :parametrs='parametrs'
    />
    <DescriptionModal 
      v-if='showDescriptionModal'
      :key='descriptionKey'
      :parametrs='description'
    />
    <NormTimeOperation
      v-if='showNormTimeOperation'
      :key='normTimeOperationKey'
      :izdelie='select_izd'
      :type='type_norm_time'
    />
    <ShipmentsMiniList
      v-if='showShipment'
      :key='shipmentKey'
      @unmount='unmount_sh_list'
    />
    <ProductListModal
      v-if='productListForIzd'
      :key='keyParentsModal'
      :parametrs='productListForIzd'
    />
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />

    <Loader v-if='loader' />
  </div>
</template>
<script>
import NormTimeOperation from '@/components/sclad/norm-time-operation-modal.vue';
import StartPraduction from '@/components/sclad/start-production-modal.vue';
import DescriptionModal from '@/components/description-modal.vue';
import ShipmentsMiniList from '@/components/issueshipment/shipments-mini-list-modal.vue';
import ProductListModal from '@/components/baseproduct/product-list-modal.vue';
import { showMessage } from '@/js/';
import {random} from 'lodash';
import {mapGetters, mapActions} from 'vuex';
import DatePicterRange from '@/components/date-picter-range.vue';
import { OperationTime } from '@/js/operation.js';
export default {
  data() {
    return {
      parametrs: null,
      startProductionModalKey: random(1, 888),

      showDescriptionModal: false,
      descriptionKey: random(1, 999),
      description: '',

      showShipment: false,
      shipmentKey: random(1, 999),

      message: '',
      type: '',
      keyInformTip: random(1, 999),
      
      showNormTimeOperation: false,
      normTimeOperationKey: random(1, 888),

      keyParentsModal: random(1, 999),
      productListForIzd: null,

      selectShipment: [],

      selected_checkbox: null,
      select_izd: null,
      
      kolvo_all: null,

      loader: false,
      type_norm_time: 'cb'
    }
  },
  computed: mapGetters(['getShipmentsSclad']),
  components: {DatePicterRange, StartPraduction, DescriptionModal, NormTimeOperation, ShipmentsMiniList, ProductListModal},
  methods: {
    ...mapActions(['fetchAllShipmentsSclad', 'getOneCbEdById', 'getOneDetal']),
    unmount_sh_list(res) {
      if(res) this.fetchAllShipmentsSclad(true)
    },
    start() {
      if(!this.select_izd || !this.selectShipment)
        return showMessage('', 'Для начала выберите СБ и заказ', 'w', this)
      let kolvo_order_byer = this.getDeficitIzd('cbed', this.select_izd.id)
      this.kolvo_all = this.kolvo_all || kolvo_order_byer
      this.parametrs = {
        izd: this.select_izd, 
        shipments: this.selectShipment,
        kolvo_order_byer, 
        kolvo_all: this.kolvo_all,
        type: 'cb'
      }
      this.startProductionModalKey = random(1, 999)
    },
    openDescription(description) {
      this.showDescriptionModal = true
      this.descriptionKey = random(1, 999)
      this.description = description
    },
    normTimeOperation() {
      if(!this.select_izd)
        return showMessage('', 'Для начала выберите СБ', 'w', this)
      this.showNormTimeOperation = true;
      this.normTimeOperationKey = random(1, 999)
    },
    shipmentsAdd() {
      this.showShipment = true
      this.shipmentKey = random(1, 999)
    },
    setShipment(shipment) {
      let list_izd = JSON.parse(shipment.list_cbed_detal)
      this.selectShipment = {...shipment, list_cbed_detal: list_izd}
    },
    getDeficitIzd(type, id) {
      for(let izd of this.selectShipment.list_cbed_detal) {
        if(izd.type == type && izd.obj.id == id)
          return izd.kol
      }
    },
    oneIzdTime(operation) {
			let ot = new OperationTime(operation)
			return ot.count
		},
		manyIzdTime(operation, kol_create_detal) {
			let ot = new OperationTime(operation, kol_create_detal)
			return ot.count
		},
    toProduction(izd, e) {
      if(this.selected_checkbox) 
        this.selected_checkbox.classList.remove('checkbox_block_select')
      
      if(this.selected_checkbox && this.select_izd && this.select_izd.id == izd.id) {
        this.selected_checkbox = null
        return this.select_izd = null
      }
      
      this.selected_checkbox = e;
      this.selected_checkbox.classList.add('checkbox_block_select')
      this.select_izd = izd
    },
    parseParametrsDetal(parametrs, kol = 1) {
      try {
        let pars = JSON.parse(parametrs)
        return Number(pars.preTime.znach) + (Number(pars.mainTime.znach) + Number(pars.helperTime.znach)) * kol
      } catch(e) {
        console.log(e)
      }
    },
    showParents(izd, type) {
      if(type == 'cb') {
        this.getOneCbEdById(izd.id).then(res => {
          this.productListForIzd = { products: res.products, type, id: izd.id }
          this.keyParentsModal = random(1, 999)
        })
      } else {
        this.getOneDetal(izd.id).then(res => {
          this.productListForIzd = { products: res.products, cbeds: res.cbed, type, id: izd.id }
          this.keyParentsModal = random(1, 999)
        })
      }
      
    },
    alt(e) {
      if(!this.select_izd)
        return showMessage('', 'Для начала выберите Изделие, иначе данные не сохранятся!', 'w', this)
      this.kolvo_all = e.innerText
    },
    changeDatePicterRange(val) {
      console.log(val)
    }
  },
  async mounted() {
    this.loader = true
    await this.fetchAllShipmentsSclad(true)
    this.loader = false
  }
}
</script>


<style scoped>
.table_block{
  display: flex;
}
.block {
  padding: 5px;
}
.block .btn { 
  margin: 0px;
}
.header_block {
  display: flex;
  align-items: center;
}
</style>