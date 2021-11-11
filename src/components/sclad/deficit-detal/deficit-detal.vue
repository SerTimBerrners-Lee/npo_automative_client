<template>
  <div>
    <h3>Дефицит деталей</h3>
    <div>
      <div class="block header_block">
        <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
        <div>
          <span>Фильтры по статусу:</span>
          <label for='z'>Заказано</label><input id='z' type="checkbox">
          <label for='zn'>Не заказано</label><input id='zn' type="checkbox">
          <label for='end'>Выполнено</label><input id='end' type='checkbox'>
        </div>
      </div>

      <div class='table_block'> 
        <div class="scroll-table" style='width: 99%;'>
          <table>
            <tr>
              <th colspan="4">Детали для сборок из комплектации</th>
              <th rowspan="2">Необх. кол-во на дефицит по комплектациям</th>
              <th rowspan="2">Остаток на складе</th>
              <th rowspan="2">Кол-во на производстве</th>
              <th rowspan="2">Дефицит деталей</th>
              <th rowspan="2">СВОЕ кол-во в производство</th>
              <th rowspan="2">ЧПУ</th>
              <th rowspan="2">Норма времени (подготовительное), ч</th>
              <th rowspan="2">Норма времени (вспомогательное), ч</th>
              <th rowspan="2">Норма времени (основное), ч</th>
              <th rowspan="2">Норма времени (общее на парт.), ч</th>
              <th rowspan="2">Уровень комплектации, %</th>
              <th rowspan="2">Статус</th>
              <th rowspan="2">Дата последнего запуска</th>
              <th rowspan="2">№ последнего Заказа</th>
              <th rowspan="2">Примечание</th>
            </tr>
            <tr>
              <th>
                <unicon name="check" fill="royalblue" />
              </th> 
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Принадлежность</th>
            </tr>
            <tr v-for='detal of allDetal' :key='detal'>
              <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                <p class="checkbox_block" @click='e => toProduction(detal, e.target)'></p>
              </td>
              <td class='center'>{{ detal.articl }}</td>
              <td class='center'>{{ detal.name }}</td>
              <td class='center'>
                <img src="@/assets/img/link.jpg" @click='showParents(detal, "det")' class='link_img' atl='Показать' />
              </td>
              <td class='center'>{{ detal.shipments_kolvo  }}</td>
              <td class='center'>{{ detal.detal_kolvo }}</td>
              <td class='center'>{{ detal.metalloworking_kolvo }}</td>
              <td class='center'>{{ detal.detal_kolvo - detal.shipments_kolvo }}</td>
              <td class='center' contenteditable="true" @keyup='e => alt(e.target)'>{{ detal.my_kolvo  }}</td>
              <td class='center'>да</td>
              <td class='center'>{{ JSON.parse(detal.parametrs).preTime.znach }}</td>
              <td class='center'>{{ JSON.parse(detal.parametrs).helperTime.znach }}</td>
              <td class='center'>{{ JSON.parse(detal.parametrs).mainTime.znach}}</td>
              <td class='center'>{{ getTimming(detal.parametrs, detal.shipments_kolvo) }}</td>
              <td class='center'></td>
              <td class='center'>{{ detal.metaloworking && detal.metaloworking.length ? "Заказано" : 'Не заказано' }}</td>
              <td class='center'>{{ detal.metaloworking && detal.metaloworking.length ? detal.metaloworking[detal.metaloworking.length - 1].date_order : '' }}</td>
              <td class='center'>{{ detal.metaloworking && detal.metaloworking.length ? detal.metaloworking[detal.metaloworking.length - 1].number_order : '' }}</td>
              <td class='center'>
                <img src="@/assets/img/link.jpg" @click='openDescription(detal.description)' class='link_img' atl='Показать' />
              </td>
          </tr>
          </table>
        </div>
      </div>
       <div class='btn-control'>
          <button class="btn-small btn-add" @click='start'>Запустить в производство</button>
          <button class="btn-small" @click='shipmentsAdd'> Добавить заказ </button>
        </div>
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

import StartPraduction from '@/components/sclad/start-production-modal.vue';
import DescriptionModal from '@/components/description-modal.vue';
import {random} from 'lodash';
import {mapGetters, mapActions} from 'vuex';
import ShipmentsMiniList from '@/components/issueshipment/shipments-mini-list-modal.vue';
import ProductListModal from '@/components/baseproduct/product-list-modal.vue';
import { showMessage } from '@/js/';
import DatePicterRange from '@/components/date-picter-range.vue';
export default {
  data() {
    return {
      showProductionModal: false,
      startProductionModalKey: random(1, 888),

      showDescriptionModal: false,
      descriptionKey: random(1, 999),

      message: '',
      type: '',
      keyInformTip: random(1, 999),

      parametrs: null,

      description: '',

      keyParentsModal: random(1, 999),
      productListForIzd: null,

      selectShipment: [],

      selected_checkbox: null,
      select_izd: null,
 
      showShipment: false,
      shipmentKey: random(1, 999),

      kolvo_all: 0,
      loader: false
    }
  },
  computed: mapGetters(['allDetal']),
  components: { DatePicterRange, StartPraduction, DescriptionModal, ShipmentsMiniList, ProductListModal},
  methods: {
    ...mapActions(['setchDeficitDeficit', 'getOneDetal']),
    unmount_sh_list(res) {
      if(res) this.fetchAllShipmentsSclad(true)
    },
    start() {
      if(!this.select_izd)
        return showMessage('', 'Для начала выберите Д и заказ', 'w', this)
      this.parametrs = {
        izd: this.select_izd,
        type: 'det'
      }
      this.startProductionModalKey = random(1, 999)
    },
    shipmentsAdd() {
      this.showShipment = true
      this.shipmentKey = random(1, 999)
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
    getTimming(param, kol = 1) {
      if(!param) return 0
      try {
        let pars = JSON.parse(param)
        if(pars) 
          return (Number(pars.preTime.znach) + ((Number(pars.helperTime.znach) + Number(pars.mainTime.znach)) * kol)).toFixed(2)
      } catch(e) {
        console.log(e)
      }
    },
    showParents(detal, type) {
      this.getOneDetal(detal.id).then(res => {
        this.productListForIzd = { products: res.products, cbeds: res.cbed, type, id: detal.id }
        this.keyParentsModal = random(1, 999)
      })
    },
    openDescription(description) {
      this.showDescriptionModal = true
      this.descriptionKey = random(1, 999)
      this.description = description
    },
    alt(e) {
      if(!this.select_izd)
        return showMessage('', 'Для начала выберите Деталь, иначе данные не сохранятся!', 'w', this)
      this.select_izd.my_kolvo = Number(e.innerText)
    },
    changeDatePicterRange(val) {
      console.log(val)
    }
  },
  async mounted() {
    this.loader = true
    await this.setchDeficitDeficit()
    console.log(this.allDetal)
    this.loader = false
  }
}
</script>

<style scoped>
.scroll-table table {
  font-size: 15px;
}
.table_block{
  display: flex;
}
.table_block>div{
  margin: 4px;
}
.block {
  padding: 5px;
}
.block .btn {
  margin: 0px;
}
</style>