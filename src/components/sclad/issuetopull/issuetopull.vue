<template>
  <div>
    <h3>Задачи на отгрузку</h3>
    <div>
      <div class="block header_block">
       <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
        <div>
          <span>Фильтры:</span>
          <label for='z'>Не учитывать "На склад"</label>
          <input id='z' type="checkbox">
        </div>
      </div>
    </div>
    <div>
      <div class="scroll-table" style='width: 99%; height: fit-content;'>
      <table>
        <tr>
          <th colspan="10"></th>
          <th colspan="2">Задачи склада</th>
          <th colspan="3"></th>
          <th colspan="3">Остатки</th>
          <th colspan="6"></th>
        </tr>
        <tr>
          <th> 
            <unicon name="check" fill="royalblue" />
          </th>
          <th>№ Заказа </th>
          <th>Дата заказа</th>
          <th>Наименование изделия</th>
          <th>Комплектация, особенности заказа</th>
          <th>Кол-во</th>
          <th>Дата отгрузки</th>
          <th>Осталось дней</th>
          <th>Основание</th>
          <th>Покупатель</th>
          <th>Выполнение заготовительных операций, %</th>
          <th>Комплектация участка сборки покупными деталями, %</th>
          <th>Готовность к отгрузке, %</th>
          <th>Статус</th>
          <th>Потребность к отгрузке</th>
          <th>На складе</th>
          <th>На произв-в или план. остаток</th>
          <th>Всего</th>
          <th>Заводской №</th>
          <th>ФИО сборщика</th>
          <th>ФИО контроль</th>
          <th>Документы</th>
          <th>Примечание</th>
        </tr>
        <tr 
          v-for='ship of getShipments' 
          :key='ship'
        >
          <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
            <p class="checkbox_block" @click='e => setShipments(ship, e.target)'></p>
          </td>
          <td class='center'> {{ ship.number_order }}</td>
          <td class='center'> {{ ship.date_order }} </td>
          <td class='center'> {{ ship.product.name }} </td>
          <td class='center komplect_td'> 
            <p class='komplect_p' v-for='prod of returnKomplectinos(ship.list_cbed_detal)' :key='prod'>
              <span class='prod_name'>{{prod.obj.name}}</span>
              <span class='kol'>{{prod.kol}}</span>
            </p> 
          </td>
          <td class='center'> {{ ship.kol }} </td>
          <td>{{ ship.date_order }}</td>
          <td class='center'> {{ incrementDay(undefined, ship.day_when_shipments) }} </td>
          <td class='center'>{{ ship.base }}</td>
          <td>{{ ship.buyer.name }}</td>
          <td class='center'>{{ 0 }}</td>
          <td class='center'>{{ 0 }}</td>
          <td class='center'>{{ 0 }}</td>
          <td>{{ ship.status }}</td>
          <td class='center'>{{ 0 }}</td>
          <td class='center'>{{ 0 }}</td>
          <td class='center'>{{ 0 }}</td>
          <td class='center'>{{ 0 }}</td>
          <td class='center'>{{ ship.product.fabricNumber }}</td>
          <td class='center'>{{  }}</td>
          <td class='center'>{{  }}</td>
          <td class='center'>
            <img src="@/assets/img/link.jpg" @click='openDocuments(ship.documents)' class='link_img' atl='Показать' />
          </td>
          <td class='center'>
            <img 
              src="@/assets/img/link.jpg" 
              @click='openDescription(ship.description)' 
              class='link_img' 
              atl='Показать' />
          </td>
        </tr>
      </table>
      </div>
      <div class='btn-control'>
        <button class="btn-small">Сбросить все фильтры</button>
        <button class="btn-small btn-add" @click='openShipment'>Отгрузить</button>
      </div>
    </div>
    <DescriptionModal
      v-if='showDescriptionModal'
      :key='descriptionKey'
    />
    <Shipment 
      v-if='showShipmentModal'
      :key='shipmentKey'
    />
    <DescriptionModal 
      v-if='showDescriptionModal'
      :key='descriptionKey'
      :parametrs='description'
    />
    <OpensFile 
      :parametrs='itemFiles' 
      v-if="itemFiles.length" 
      :key='keyWhenModalGenerateFileOpen'
      />
    <Loader v-if='loader' />
  </div>
</template>

<script>
import DescriptionModal from '@/components/description-modal.vue';
import Shipment from './shippment.vue';
import {random} from 'lodash';
import DatePicterRange from '@/components/date-picter-range.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import {mapGetters, mapActions} from 'vuex';
import { dateIncrementHors } from '@/js/';
import { showMessage } from '@/js/';
export default {
  data() {
    return {
      showDescriptionModal: false,
      descriptionKey: random(1, 999),

      showShipmentModal: false,
      shipmentKey: random(1, 999),
      select_shipments: null,
      span: null,
      description: '',
      loader: false,

      keyWhenModalGenerateFileOpen: random(1, 999),
      itemFiles: []
    }
  },
  components: {DatePicterRange, DescriptionModal, Shipment, OpensFile},
  computed: mapGetters(['getShipments']),
  methods: {
    ...mapActions(['fetchAllShipments']),
    openDescription(description) {
      this.showDescriptionModal = true
      this.descriptionKey = random(1, 999)
      this.description = description
    },
    openShipment() {
      this.showShipmentModal = true;
      this.shipmentKey = random(1, 999)
    },
    changeDatePicterRange(val) {
      console.log(val)
    },
    returnKomplectinos(list_komplect) {
      if(!list_komplect) return []
      try {
        const pars = JSON.parse(list_komplect)
        if(!pars) return []
        return pars
      } catch(e) {console.error(e)}
    },
    incrementDay(date = new Date().toLocaleString('ru-RU').split(',')[0], day) {
      const dat = dateIncrementHors(date, day*24)
      return `${dat.iterationHors}`
    },
    openDocuments(documents) {
      if(documents && documents.length) {
        this.keyWhenModalGenerateFileOpen = random(1, 999)
        this.itemFiles = documents
      } else showMessage('', 'Документов нет', 'w', this)
    },
    setShipments(shipments, e) {
      if(this.span) e.classList.remove('checkbox_block_select')
      this.span = e
      this.span.classList.add('checkbox_block_select')
      this.select_shipments = shipments
      console.log(shipments)
    },
  },
  async mounted() {
    this.loader = true
    await this.fetchAllShipments()
    console.log(this.getShipments)
    this.loader = false
  }
}
</script>

<style scoped>
.komplect_p {
  margin: 0px;
  display: flex;
  justify-content: space-between;
}
.komplect_p span {
  border-bottom: 1px solid #d3d3d3;
  border-left: 1px solid #d3d3d3;
}
.komplect_td {
  padding: 0px !important;
}
.kol {
  width: 30px;
  justify-content:center;
  align-items: center;
  display: flex;
}
.prod_name {
  width: 100px;
  height: fit-content;
  text-align: start;
}
</style>