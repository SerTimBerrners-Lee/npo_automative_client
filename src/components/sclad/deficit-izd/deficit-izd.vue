<template>
  <div>
    <h3>Дефицит Изделий</h3>
    <div>
      <div class="block header_block">
        <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
        <div>
          <select 
            class='select-small' 
            v-model='selectEnumStatus'>
            <option 
              v-for='item of enumStatus' 
              :key='item' 
              :value='item'>{{ item }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class='table_block'>
      <div style='width: 400px;'> 
        <ShipmentList
          v-if='getShipments.length'
          @unmount_set='toSetOrders'
          @unmount_clear='unmount_clear'
          :getShipments='getShipments'/>
      </div>
      <div style='margin-left: 5px;'>
        <table>
          <tbody class='fixed_table_85'>
            <tr>
              <th colspan="5" class='min_width-120'>Изделие</th>
              <th rowspan="3" class='min_width-120'>Дефицит</th>
              <th rowspan="3" class='min_width-120'>Дефицит по заказам покупателя </th>
              <th rowspan="3" class='min_width-120'>Потребность по Заказам покупателя</th>
              <th rowspan="3" class='min_width-120'>Остаток</th>
              <th rowspan="3" class='min_width-120'>Минимальный остаток</th>
              <th rowspan="3" class='min_width-120'>Рекомендуемый остаток</th>
              <th rowspan="3" class='min_width-120'>Норма времени на одну единицу (сборка+изготовл.)</th>
              <th rowspan="3" class='min_width-120'>СВОЕ кол-во(по умолч. равно рекоменд. кол-ву)</th>
              <th rowspan="3" class='min_width-120'>Общая норма времени (сборка+изготовл.)</th>
              <th rowspan="3" class='min_width-120'>Реальный остаток с учетом планируемых отгрузок и планируемого производства</th>
              <th rowspan="3" class='min_width-120'>Уровень комплектации, %</th>
              <th rowspan="3" class='min_width-120'>Дата последнего запуска</th>
              <th rowspan="3" class='min_width-120'>Примечание</th>
            </tr>
            <tr>
              <th>№ Заказа</th>
              <th>Заводской номер</th>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Принадлежность</th>
            </tr>
            <tr>
              <td colspan='2'>Поиск: </td>
              <td colspan="4">
                <Search 
                  :placeholder="'Поиск по Изделия'"
                  @unmount='keySearch' 
                />
              </td>
            </tr>
          </tbody>
          <tr v-for='product of allProduct' :key='product' 
            class='td-row'
            @click='setIzdels(product)'>
            <td class='center link_img' @click='returnShipmentsDateModal(product.shipments)' >
              {{returnShipmentsKolvo(product.shipments)}}
            </td>
            <td class='center'>{{ product.fabricNumber }}</td>
            <td class='center'>{{ product.articl }}</td>
            <td class='center' @dblclick="showInformIzdel(product.id)">{{ product.name }}</td>
            <td class='center' @click='returnShipmentsDateModal(product, "product")'>
              <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
            </td>
            <td class='center min_width-100' style='color: red;'>{{ returnDificit(product, product.product_kolvo) }}</td> <!-- Дефицит -->
            <td class='center min_width-100' style='color: red;'>{{ -product.shipments_kolvo }}</td> <!-- Дефицит по Заказам покупател  -->
            <td class='center min_width-100' style='color: red;'>{{ -product.shipments_kolvo }}</td> <!-- Потребность по Заказам покупателя -->
            <td class='center min_width-100'>{{ product.product_kolvo }}</td> <!-- Остаток -->
            <td class='center min_width-100'>{{ product?.min_remaining }}</td> <!-- Минимальный остаток -->
            <td class='center min_width-100'>{{ product?.min_remaining * 3 }}</td> <!-- Рекомендуемый остаток -->
            <td class='center min_width-100'></td>
            <td class='center min_width-100' contenteditable="true" @keyup='e => alt(e.target)'>{{ product?.my_kolvo || product.min_remaining * 3  }}</td> 
            <td class='center min_width-100'>
            </td>
            <td class='center min_width-100'>{{ product.product_kolvo + product.shipments_kolvo }}</td>
            <td class='center min_width-100'>{{  }}</td>
            <td v-if='product.shipments_kolvo > 0' class='center min_width-100 success_operation'>Заказано</td>
            <td v-else class='center min_width-100 work_operation'>Не заказано</td>
            <td class='center min_width-100'>
              <img src="@/assets/img/link.jpg" @click='openDescription(product.description)' class='link_img' atl='Показать' />
            </td>
          </tr>

        </table>
        <div class='btn-control'>
          <button class="btn-small" @click='normTimeOperation'>Норма времени по операциям</button>
          <button class="btn-small btn-add" @click='start'>Запустить в производство</button>
          <button class="btn-small" @click='shipmentsAdd'> Добавить заказ </button>
        </div>
      </div>
    </div>
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
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
    <ShipmentsModal 
      :shipments='shipments'
      :izd='izdForSchipment'
      v-if='shipments.length'
      :key='shipmentKey'
    />
     <ProductModalInfo
      :id='parametrs_product'
      :key='productModalKey'
      v-if='parametrs_product'
    />
    <Loader v-if='loader' />
  </div>
</template>
<script>
import {random} from 'lodash';
import Search from '@/components/search.vue';
import { showMessage, comparison } from '@/js/';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import DatePicterRange from '@/components/date-picter-range.vue';
import DescriptionModal from '@/components/description-modal.vue';
import ShipmentsModal from  '@/components/sclad/shipments-to-ized.vue';
import ProductModalInfo from '@/components/baseproduct/product-modal.vue';
import ShipmentList from '@/components/issueshipment/shipments-list-table.vue';
import NormTimeOperation from '@/components/sclad/norm-time-operation-modal.vue';
import ShipmentsMiniList from '@/components/issueshipment/shipments-mini-list-modal.vue';
export default {
  data() {
    return {
      showDescriptionModal: false,
      descriptionKey: random(1, 999),
      description: '',

      shipments: [],
      shipmentKey: random(1, 999),

      message: '',
      type: '',
      keyInformTip: random(1, 999),
      
      showNormTimeOperation: false,
      normTimeOperationKey: random(1, 999),

      select_izd: null,

      loader: false,
      type_norm_time: 'cb',

      izdForSchipment: null,

      selectEnumStatus: 'Все',
      enumStatus: [
        'Все',
        'Заказано',
        'Не заказано'
      ],

      parametrs_product: null,
      productModalKey: random(1, 999)
    }
  },
  computed: mapGetters(['allProduct', 'getShipments']),
  components: {
    ProductModalInfo,
    DatePicterRange, 
    DescriptionModal, 
    NormTimeOperation, 
    ShipmentsMiniList,
    ShipmentsModal,
    Search,
    ShipmentList
  },
  watch: {
    selectEnumStatus: function(val) {
      this.changeStatusDeficitDetal(val)
      this.changeStatusDeficitCbed(val)
    }
  },
  methods: {
    ...mapActions([
      'setchDeficitProducts', 
      'fetchAllShipments'
    ]),
    ...mapMutations([
      'searchProduct',
      'detalToShipmentsSort',
      'changeStatusDeficitDetal',
      'changeStatusDeficitCbed'
    ]),
    returnDificit(izd, kol) {
      return kol - izd.min_remaining - izd.shipments_kolvo > 0 ? 
        0 : kol - izd.min_remaining - izd.shipments_kolvo
    },
    keySearch(v) {
      this.searchProduct(v)
    },
    unmount_clear() {
      this.reverseMidlevareCbed()
      this.reverseMidlevareDetal()
    },
    showInformIzdel(productId) {
      if(!productId) return false 
      this.parametrs_product = productId
      this.productModalKey = random(1, 999)
    },
    toSetOrders(shipments) {
      this.unmount_clear()
      this.cbedToShipmentsSort(shipments.cbeds)
      this.detalToShipmentsSort(shipments.detals)
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
    returnShipmentsKolvo(shipments) {
      if(!shipments || shipments.length == 0) return '-'
      let end_date = shipments[0]?.number_order.split('от')[0] || '-'
      for(let ship1 of shipments) {
        for(let ship2 of shipments) {
          if(!ship1.number_order) continue;
          if(comparison(ship1.date_shipments, ship2.date_shipments, '<')) end_date = ship1.number_order.split('от')[0]
        }
      }
      return end_date
    },
    returnShipmentsDateModal(izd, type) {
      let shipments = izd.shipments
      if(!shipments || shipments.length == 0) return showMessage('', 'Нет Заказов', 'i', this)
      this.shipments = shipments
      this.izdForSchipment = {izd, type}
      this.shipmentKey = random(1, 999)
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
    setIzdels(izd) {
      this.select_izd = izd
    },
    alt(e) {
      if(!this.select_izd)
        return showMessage('', 'Для начала выберите Изделие, иначе данные не сохранятся!', 'w', this)
      this.select_izd.my_kolvo = e.innerText
    },
    changeDatePicterRange(val) {
      console.log(val)
    },
  },
  async mounted() {
    this.loader = true
    await this.setchDeficitProducts()
    await this.fetchAllShipments({sort: undefined, light: true})
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