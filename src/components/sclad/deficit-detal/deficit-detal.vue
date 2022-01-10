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
        <div style='width: 400px;'>
          <ShipmentList
            @unmount_set='toSetOrders'
            @unmount_clear='unmount_clear'
            :getShipments='getShipments'/>
        </div>
        <div style='width: 99%;'> 
          <table>
            <tbody class='fixed_table_85'>
              <tr>
                <th colspan="4" class='min_width-100'>Детали для сборок из комплектации</th>
                <th rowspan="3" class='min_width-100'>Необх. кол-во на дефицит по комплектациям</th>
                <th rowspan="3" class='min_width-100'>Остаток на складе</th>
                <th rowspan="3" class='min_width-100'>Кол-во на производстве</th>
                <th rowspan="3" class='min_width-100'>Дефицит деталей</th>
                <th rowspan="3" class='min_width-100'>СВОЕ кол-во в производство</th>
                <th rowspan="3" class='min_width-100'>ЧПУ</th>
                <th rowspan="3" class='min_width-100'>Норма времени (подготовительное), ч</th>
                <th rowspan="3" class='min_width-100'>Норма времени (вспомогательное), ч</th>
                <th rowspan="3" class='min_width-100'>Норма времени (основное), ч</th>
                <th rowspan="3" class='min_width-100'>Норма времени (общее на парт.), ч</th>
                <th rowspan="3" class='min_width-100'>Уровень комплектации, %</th>
                <th rowspan="3" class='min_width-100'>Статус</th>
                <th rowspan="3" class='min_width-100'>Дата последнего запуска</th>
                <th rowspan="3" class='min_width-100'>№ последнего Заказа</th>
                <th rowspan="3" class='min_width-100'>Примечание</th>
              </tr>
              <tr>
                <th @click='selectAllItem' style='cursor: pointer;'>
                  <unicon name="check" fill="royalblue" />
                </th> 
                <th>Артикул</th>
                <th>Наименование</th>
                <th>Принадлежность</th>
              </tr>
              <tr>
                <td colspan='1'>Поиск: </td>
                <td colspan="3">
                  <Search 
                    :placeholder="'Поиск по Артиклу и Наименованию'"
                    @unmount='keySearch' 
                  />
                </td>
              </tr>
            </tbody>
            <tr v-for='detal of allDetal' :key='detal'
              class='td-row'
              @click='setIzdels(detal)'>
              <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                <p class="checkbox_block" @click='e => toProduction(detal, e.target)'></p>
              </td>
              <td class='center'>{{ detal.articl }}</td>
              <td class='center' @dblclick="showInformIzdel(detal.id)">{{ detal.name }}</td>
              <td class='center'>
                <img src="@/assets/img/link.jpg" @click='showParents(detal, "det")' class='link_img' atl='Показать' />
              </td>
              <td class='center'>{{ detal.shipments_kolvo  }}</td>
              <td class='center'>{{ detal.detal_kolvo }}</td>
              <td class='center'>{{ detal.metalloworking_kolvo }}</td>
              <td class='center' style='color: red;'>{{ detal.detal_kolvo - detal.shipments_kolvo }}</td>
              <td class='center' contenteditable="true" @keyup='e => alt(e.target)'>{{ detal.my_kolvo  }}</td>
              <td class='center'>{{ returnZnachCPU(detal) }}</td>
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
           <div class='btn-control'>
              <button class="btn-small btn-add" @click='start'>Запустить в производство</button>
              <button class="btn-small" @click='shipmentsAdd'> Добавить заказ </button>
            </div>
        </div>
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
    <DetalModal
      :key='detalModalKey'
      v-if='parametrs_detal'
      :id='parametrs_detal'
    />

    <Loader v-if='loader' />
  </div>
</template>

<script>
import {random} from 'lodash';
import { showMessage } from '@/js/';
import Search from '@/components/search.vue';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import DetalModal from '@/components/basedetal/detal-modal.vue';
import DatePicterRange from '@/components/date-picter-range.vue';
import DescriptionModal from '@/components/description-modal.vue';
import StartPraduction from '@/components/sclad/start-production-modal.vue';
import ProductListModal from '@/components/baseproduct/product-list-modal.vue';
import ShipmentList from '@/components/issueshipment/shipments-list-table.vue';
import ShipmentsMiniList from '@/components/issueshipment/shipments-mini-list-modal.vue';
export default {
  data() {
    return {
      showProductionModal: false,
      startProductionModalKey: random(1, 999),

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
      toProductionArr: [],

      select_izd: null,
 
      showShipment: false,
      shipmentKey: random(1, 999),
      detalModalKey: random(1, 999),
			parametrs_detal: false,

      kolvo_all: 0,
      loader: false
    }
  },
  computed: mapGetters(['allDetal', 'getShipments']),
  components: { 
    DatePicterRange, 
    StartPraduction, 
    DescriptionModal, 
    ShipmentsMiniList, 
    ProductListModal,
    DetalModal,
    Search,
    ShipmentList
  },
  methods: {
    ...mapActions(['setchDeficitDeficit', 'getOneDetal', 'fetchAllShipments']),
    ...mapMutations([
      'filterDetalToArticle',
      'cbedToShipmentsSort',
      'detalToShipmentsSort',
      'reverseMidlevareCbed',
      'reverseMidlevareDetal',
    ]),
    unmount_clear() {
      this.reverseMidlevareCbed()
      this.reverseMidlevareDetal()
    },
    returnZnachCPU(detal) {
      if(!detal?.techProcesses?.operations?.length) return 'нет'
      let op = detal.techProcesses.operations
      for(let item of op) {
        if(item?.typeOperation?.cpu) return 'да'
      }
      return 'нет'

    },
    toSetOrders(shipments) {
      this.unmount_clear()
      this.cbedToShipmentsSort(shipments.cbeds)
      this.detalToShipmentsSort(shipments.detals)
    },
    keySearch(v) {
      this.filterDetalToArticle(v)
    },
    unmount_sh_list(res) {
      if(res) this.fetchAllShipmentsSclad(true)
    },
    start() {
      if(!this.toProductionArr.length)
        return showMessage('', 'Для начала выберите Д и заказ', 'w', this)
      this.parametrs = {
        izd: this.toProductionArr,
        type: 'det'
      }
      this.startProductionModalKey = random(1, 999)
    },
    shipmentsAdd() {
      this.showShipment = true
      this.shipmentKey = random(1, 999)
    },
    toProduction(izd, e) {
      e.classList.toggle('checkbox_block_select')
      let check = true
      for(let izdd of this.toProductionArr) {
        if(izdd.id == izd.id) {
          this.toProductionArr = this.toProductionArr.filter(iz => iz.id != izd.id)
          check = false
        }
      }
      if(check) this.toProductionArr.push(izd)
    },
    setIzdels(izd) {
      this.select_izd = izd
    },
    selectAllItem() {
      if(this.toProductionArr.length < this.allDetal.length) {
        this.toProductionArr = this.allDetal
        document.getElementsByClassName('checkbox_block').forEach(el => el.classList.add('checkbox_block_select'))
      } else {
        this.toProductionArr = []
        document.getElementsByClassName('checkbox_block').forEach(el => el.classList.remove('checkbox_block_select'))
      }
    },
    getTimming(param, kol = 1) {
      if(!param) return 0
      try {
        let pars = JSON.parse(param)
        if(pars) 
          return (Number(pars.preTime.znach) + ((Number(pars.helperTime.znach) + Number(pars.mainTime.znach)) * kol)).toFixed(2)
      } catch(e) {
        console.error(e)
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
    showInformIzdel(id) {
      if(!id) return false 
      this.parametrs_detal = id
      this.detalModalKey = random(1, 999)
		},
    changeDatePicterRange(val) {
      console.log(val)
    }
  },
  async mounted() {
    this.loader = true
    await this.setchDeficitDeficit()
    this.fetchAllShipments()
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
th {
  font-size: 13px;
}
</style>