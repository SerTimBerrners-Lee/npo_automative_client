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
        <SortStatus :key='status_sort_key' />
        <SortBuyer :key='sort_buyer_key'/>
      </div>
    </div>
    <div>
      <div style='width: fit-content;'>
				<TableShipmentsSclad
          :is_print='is_print'
					v-if='getShipments.length'
					:shipmentsArr='getShipments'
          :shipment_sclad='true'
          @unmount_sh_complit='unmount_sh_complit'
					@unmount='unmount_table_shipments'/>
      </div>
      <div class='btn-control out-btn-control wh_70p'>
        <button class="btn-small" @click='printPage'> Печать </button>
        <button class="btn-small" @click='clearFiltersF'>Сбросить все фильтры</button>
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
import Shipment from './ShComlitModal';
import DatePicterRange from '@/components/DatePicterRange';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import SortBuyer from '@/components/IssueShipment/SortBuyer';
import SortStatus from '@/components/IssueShipment/SortStatus';
import TableShipmentsSclad from '@/components/IssueShipment/TableComplectSclad';

export default {
  data() {
    return {
      showShipmentModal: false,
      shipmentKey: random(1, 999),
      select_shipments: null,
      loader: false,

			tr: null,
      is_print: false,
      sort_buyer_key: random(1, 999),
      status_sort_key: random(1, 999),
    }
  },
  components: {
    DatePicterRange,
    Shipment,
    TableShipmentsSclad,
    SortStatus,
    SortBuyer
  },
  computed: mapGetters(['getShipments']),
  methods: {
    ...mapActions(['fetchAllShipmentsTo']),
    ...mapMutations(['clearFilters']),
    unmount_table_shipments(sh) {
      this.select_shipments = sh;
    },
    openShipment() {
      if(!this.select_shipments || !this.select_shipments.id) 
        return showMessage('', 'Для начала выберите задачу', 'w');
      
      this.showShipmentModal = true;
      this.shipmentKey = random(1, 999);
    },
    printPage() {
			this.is_print = true;
			setTimeout(() => this.is_print = false);
		},
    async unmount_sh_complit() {
      this.loader = true;
      await this.fetchAllShipmentsTo();
      this.status_sort_key = random(1, 999);
      this.loader = false;
    },
    async clearFiltersF() {
      this.sort_buyer_key = random(1, 999);
      this.clearFilters();
      await this.unmount_sh_complit();
    },
    changeDatePicterRange(val) {
      console.log(val);
    }
  },
  async mounted() {
    this.loader = true;
    await this.fetchAllShipmentsTo();
    this.status_sort_key = random(1, 999);
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