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
      <ShipmentList
        v-if='false'
        @unmount_set='toSetOrders'
        :getShipments='[]'/>
      <div style='margin-left: 5px;'>
        <table>
          <tbody class='fixed_table'>
            <tr>
              <th colspan="6" class='min_width-100'>Комплектация сборки, детали</th>
              <th rowspan="3" class='min_width-100'>Дефицит</th>
              <th rowspan="3" class='min_width-100'>Реальный остаток с учетом планируемых отгрузок</th>
              <th rowspan="3" class='min_width-100'>Минимальный остаток</th>
              <th rowspan="3" class='min_width-100'>Рекомендуемый остаток</th>
              <th rowspan="3" class='min_width-100'>Норма времени на одну единицу (сборка+изготовл.)</th>
              <th rowspan="3" class='min_width-100'>СВОЕ кол-во(по умолч. равно рекоменд. кол-ву)</th>
              <th rowspan="3" class='min_width-100'>Общая норма времени (сборка+изготовл.)</th>
              <th rowspan="3" class='min_width-100'>Реальный остаток с учетом планируемых отгрузок и планируемого производства</th>
              <th rowspan="3" class='min_width-100'>Уровень комплектации, %</th>
              <th rowspan="3" class='min_width-100'>Статус</th>
              <th rowspan="3" class='min_width-100'>Дата последнего запуска</th>
              <th rowspan="3" class='min_width-100'>Примечание</th>
            </tr>
            <tr>
              <th @click='selectAllItem' style='cursor: pointer;'>
                <unicon name="check" fill="royalblue" />
              </th> 
              <th>Тип</th>
              <th>№ Заказа</th>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Принадлежность</th>
            </tr>
            <tr>
              <td colspan='2'>Поиск: </td>
              <td colspan="4">
                <Search 
                  :placeholder="'Поиск СБ по Артиклу и Наименованию'"
                  @unmount='keySearchCb' 
                />
              </td>
            </tr>
          </tbody>
          <tr v-for='cbed of allCbed' :key='cbed' 
            class='td-row'
            @click='setIzdels(cbed)'>
            <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
              <p class="checkbox_block" @click='e => toProduction(cbed, e.target)'></p>
            </td>
            <td class='center'>СБ</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='shipmentsShow(cbed.shipments)' class='link_img' atl='Показать' />
            </td>
            <td class='center'>{{ cbed.articl }}</td>
            <td class='center' @dblclick="showInformIzdel(cbed.id, 'cbed')">{{ cbed.name }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='showParents(cbed, "cb")' class='link_img' atl='Показать' />
            </td>
            <td class='center min_width-100' style='color: red;'>{{ cbed.cbed_kolvo - cbed.shipments_kolvo }}</td>
            <td class='center min_width-100'>{{ 0 }}</td>
            <td class='center min_width-100'>{{ 0 }}</td>
            <td class='center min_width-100'>{{ cbed.cbed_kolvo + cbed.shipments_kolvo }}</td>
            <td class='center min_width-100'>{{ cbed.parametrs ? JSON.parse(cbed.parametrs)[0].znach : '' }}</td>
            <td class='center min_width-100' contenteditable="true" @keyup='e => alt(e.target)'>{{ cbed.my_kolvo }}</td> 
            <td class='center min_width-100'>{{ cbed.parametrs ? 
              Number(JSON.parse(cbed.parametrs)[0].znach) * cbed.shipments_kolvo
              : '' }}</td>
            <td class='center min_width-100'>{{ cbed.cbed_kolvo +  returnProductionColvo(cbed) }}</td>
            <td class='center min_width-100'>{{  }}</td>
            <td class='center min_width-100'>{{ cbed.assemble && cbed.assemble.length ? "Заказано" : 'Не заказано' }}</td>
            <td class='center min_width-100'>{{ cbed.assemble && cbed.assemble.length ? cbed.assemble[cbed.assemble.length - 1].date_order : '' }}</td>
            <td class='center min_width-100'>
              <img src="@/assets/img/link.jpg" @click='openDescription(cbed.description)' class='link_img' atl='Показать' />
            </td>
          </tr>

          
          <tr v-for='detal of allDetal' :key='detal' 
            class='td-row'>
            <td class='center checkbox_parent' >
            </td>
            <td class='center'> Д </td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='shipmentsShow(detal.shipments)' class='link_img' atl='Показать' />
            </td>
            <td class='center'>{{ detal.articl }}</td>
            <td class='center' @dblclick="showInformIzdel(detal.id, 'detal')">{{ detal.name }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='showParents(detal, "det")' class='link_img' atl='Показать' />
            </td>
            <td class='center' style='color: red;'>{{ detal.detal_kolvo - detal.shipments_kolvo }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>{{ detal.detal_kolvo + detal.shipments_kolvo }}</td>
            <td class='center'>{{ getTimming(detal.parametrs) }}</td>
            <td class='center'>{{ detal.detal_kolvo + detal.shipments_kolvo }}</td> 
            <td class='center'>{{ detal.parametrs ? 
              getTimming(detal.parametrs, detal.shipments_kolvo)
              : '' }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>{{  }}</td>
            <td class='center'>{{ detal.metaloworking && detal.metaloworking.length ? "Заказано" : 'Не заказано' }}</td>
            <td class='center'>{{ detal.metaloworking && detal.metaloworking.length ? detal.metaloworking[detal.metaloworking.length - 1].date_order : '' }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDescription(detal.description)' class='link_img' atl='Показать' />
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
    <StartProduction 
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
    <DetalModal
      :key='detalModalKey'
      v-if='parametrs_detal'
      :id='parametrs_detal'
    />
    <CbedModalInfo
      :id='parametrs_cbed'
      :key='cbedModalKey'
      v-if='parametrs_cbed'
    />
    <ShipmentsModal 
      :shipments='shipments'
      v-if='shipments.length'
      :key='shipmentKey'
    />
    <Loader v-if='loader' />
  </div>
</template>
<script>
import {random} from 'lodash';
import { showMessage } from '@/js/';
import Search from '@/components/search.vue';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import CbedModalInfo from '@/components/cbed/cbed-modal.vue';
import DetalModal from '@/components/basedetal/detal-modal.vue';
import DatePicterRange from '@/components/date-picter-range.vue';
import DescriptionModal from '@/components/description-modal.vue';
import ShipmentsModal from  '@/components/sclad/shipments-to-ized.vue';
import StartProduction from '@/components/sclad/start-production-modal.vue';
import ProductListModal from '@/components/baseproduct/product-list-modal.vue';
import ShipmentList from '@/components/issueshipment/shipments-list-table.vue';
import NormTimeOperation from '@/components/sclad/norm-time-operation-modal.vue';
import ShipmentsMiniList from '@/components/issueshipment/shipments-mini-list-modal.vue';
export default {
  data() {
    return {
      parametrs: null,
      startProductionModalKey: random(1, 888),

      showDescriptionModal: false,
      descriptionKey: random(1, 999),
      description: '',

      shipments: [],
      toProductionArr: [],
      shipmentKey: random(1, 999),

      message: '',
      type: '',
      keyInformTip: random(1, 999),
      
      showNormTimeOperation: false,
      normTimeOperationKey: random(1, 999),

      keyParentsModal: random(1, 999),
      productListForIzd: null,
      detalModalKey: random(1, 999),
			parametrs_detal: false,
			parametrs_cbed: null,
			cbedModalKey: random(1, 999),

      select_izd: null,

      loader: false,
      type_norm_time: 'cb'
    }
  },
  computed: mapGetters(['allCbed', 'allDetal']),
  components: {
    DatePicterRange, 
    StartProduction, 
    DescriptionModal, 
    NormTimeOperation, 
    ShipmentsMiniList, 
    ProductListModal,
    ShipmentsModal,
    DetalModal,
    CbedModalInfo,
    Search,
    ShipmentList
  },
  methods: {
    ...mapActions([
      'getOneCbEdById', 
      'getOneDetal', 
      'setchDeficitCbed', 
      'setchDeficitDeficit'
    ]),
    ...mapMutations(['searchCbed']),
    keySearchCb(v) {
      this.searchCbed(v)
    },
    toSetOrders(shipments) {
      console.log(shipments)
    },
    start() {
      if(!this.toProductionArr.length)
        return showMessage('', 'Для начала выберите СБ и заказ', 'w', this)
      this.parametrs = {
        izd: this.toProductionArr,
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
    shipmentsShow(shipments) {
      this.shipments = shipments
      this.shipmentKey = random(1, 999)
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
    returnProductionColvo(cbed) {
      if(!cbed || !cbed.assemble || cbed.assemble.length == 0) return 0
      let count = 0
      for(let ass of cbed.assemble) {
        count = count + ass.kolvo_shipments
      }
      return count
    },
    alt(e) {
      if(!this.select_izd)
        return showMessage('', 'Для начала выберите Изделие, иначе данные не сохранятся!', 'w', this)
      this.select_izd.my_kolvo = e.innerText
    },
    changeDatePicterRange(val) {
      console.log(val)
    },
    selectAllItem() {
      if(this.toProductionArr.length < this.allCbed.length) {
        this.toProductionArr = this.allCbed
        document.getElementsByClassName('checkbox_block').forEach(el => el.classList.add('checkbox_block_select'))
      } else {
        this.toProductionArr = []
        document.getElementsByClassName('checkbox_block').forEach(el => el.classList.remove('checkbox_block_select'))
      }
    },
    showInformIzdel(id, type) {
			if(type == 'cbed') {
				if(id) {
					this.parametrs_cbed = id
					this.cbedModalKey = random(1, 999)
				}
			}
			if(type == 'detal') {
				if(id) {
					this.parametrs_detal = id
					this.detalModalKey = random(1, 999)
				}
			}
		}
  },
  async mounted() {
    this.loader = true
    await this.setchDeficitCbed()
    await this.setchDeficitDeficit()
    console.log(this.allCbed)
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
th {
  font-size: 13px;
}

</style>