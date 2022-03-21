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
      <!-- <div class="scroll-table" style='width: 99%; height: fit-content;'>
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
      </div> -->
      <div style='width: fit-content;'>
				<TableShipmentsSclad 
					v-if='getShipments.length'
					:shipmentsArr='getShipments'
					@unmount='unmount_table_shipments'/>
      </div>
      <div class='btn-control'>
        <button class="btn-small">Сбросить все фильтры</button>
        <button class="btn-small btn-add" @click='openShipment'>Отгрузить</button>
      </div>
    </div>
    <Shipment 
      v-if='showShipmentModal && select_shipments'
      :key='shipmentKey'
      :shipments_id='select_shipments.id'
      @unmount='unmount_sh_complit'
    />
    <InformFolder
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
      :title='titleMessage'
    />
    <Loader v-if='loader' />
  </div>
</template>

<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import Shipment from './sh-comlit.modal';
import { mapGetters, mapActions } from 'vuex';
import DatePicterRange from '@/components/date-picter-range';
import TableShipmentsSclad from '@/components/issueshipment/table-complect-sclad';

export default {
  data() {
    return {
      showShipmentModal: false,
      shipmentKey: random(1, 999),
      select_shipments: null,
      loader: false,

      keyInformTip: random(1, 999),
      message: '',
      type: 's',

			tr: null,
    }
  },
  components: {
    DatePicterRange,
    Shipment,
    TableShipmentsSclad
  },
  computed: mapGetters(['getShipments']),
  methods: {
    ...mapActions(['fetchAllShipments', 'fetchAllShipmentsTo']),
    unmount_table_shipments(sh) {
      this.select_shipments = sh;
    },
    openShipment() {
      console.log(this.select_shipments);
      if(!this.select_shipments || !this.select_shipments.id) 
        return showMessage('', 'Для начала выберите задачу', 'w', this);
      
      this.showShipmentModal = true;
      this.shipmentKey = random(1, 999);
    },
    async unmount_sh_complit() {
      this.loader = true;
      await this.fetchAllShipmentsTo();
      this.loader = false;
    },
    changeDatePicterRange(val) {
      console.log(val);
    }
  },
  async mounted() {
    this.loader = true;
    await this.fetchAllShipmentsTo();
    this.loader = false;
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