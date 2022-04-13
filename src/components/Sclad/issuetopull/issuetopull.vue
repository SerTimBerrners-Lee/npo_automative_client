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
        <SortStatus />
      </div>
    </div>
    <div>
      <div style='width: fit-content;'>
				<TableShipmentsSclad 
					v-if='getShipments.length'
					:shipmentsArr='getShipments'
          :shipment_sclad='true'
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
      :is_change_komplit='true'
      :shipments_id='select_shipments.id'
      @unmount='unmount_sh_complit'
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
import SortStatus from '@/components/IssueShipment/sort-status';
import TableShipmentsSclad from '@/components/IssueShipment/table-complect-sclad';

export default {
  data() {
    return {
      showShipmentModal: false,
      shipmentKey: random(1, 999),
      select_shipments: null,
      loader: false,

			tr: null,
    }
  },
  components: {
    DatePicterRange,
    Shipment,
    TableShipmentsSclad,
    SortStatus
  },
  computed: mapGetters(['getShipments']),
  methods: {
    ...mapActions(['fetchAllShipments', 'fetchAllShipmentsTo']),
    unmount_table_shipments(sh) {
      this.select_shipments = sh;
    },
    openShipment() {
      if(!this.select_shipments || !this.select_shipments.id) 
        return showMessage('', 'Для начала выберите задачу', 'w');
      
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