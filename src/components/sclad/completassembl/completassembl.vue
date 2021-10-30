<template>
	<div> 
		<h3>Комплектация сборок на план</h3>
    <div class='table_block'>
      <div class="table-scroll">
        <table>
          <tr>
            <th><unicon name="check" fill="royalblue" /></th>
            <th>Заказ покупателя из задач на отгрузку</th>
            <th>Дата отгрузки покупателю</th>
          </tr>
           <tr v-for='order of getShipments' :key='order'>
            <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
              <p class="checkbox_block" @click='e => toSetOrders(order, e.target)'></p>
            </td>
            <td>{{ order.number_order }}</td>
            <td>{{ order.date_shipments }}</td>
          </tr>
        </table>
      </div>
       <div class="table-scroll" style='margin-left: 5px;'>
        <table>
          <tr>
            <th colspan="2"></th>
            <th colspan="2">Сборочная единица</th>
            <th colspan="5"></th>
          </tr>
          <tr>
            <th>№ Заказа склада</th>
            <th>Заказчик</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Кол-во ВСЕГО по заказу склада, шт.</th>
            <th>Кол-во в т.ч. по заказу покупателя, шт.</th>
            <th>% Комплектации</th>
            <th>Комплектация </th>
            <th>Документы</th>
          </tr>
        </table>
      </div>
    </div>

     <div class="btn-control">
        <button class="btn-small btn-add" @click='addWaybill'>Создать накладную комплектации сборочного участка</button>
      </div>

      <AddWaybill 
        v-if='showAddWaybill'
        :key='keyAddWaybill'
      />
      <Loader v-if='loader' />
	</div>
</template>

<script>
import AddWaybill from './add-waybill.vue';
import {mapGetters, mapActions} from 'vuex';
import {random} from 'lodash';
export default {
	data() {
		return{
      showAddWaybill: false,
      keyAddWaybill: random(1, 999),

      shipments: null,
      loader: false
		}
	},
	components: {AddWaybill},
  computed: mapGetters(['getShipments']),
	methods: {
    ...mapActions(['fetchAllShipments']),
    addWaybill() {
      this.showAddWaybill = true;
      this.keyAddWaybill = random(1, 999)
    },
    toSetOrders(shipments, e) {
      if(e.classList.item(1)) 
        return e.classList.remove('checkbox_block_select')
      
      e.classList.add('checkbox_block_select')
    }
	},
	async mounted() {
    this.loader = true
    this.fetchAllShipments()
    this.loader = false
	}
}
</script>
<style scoped>
.block {
  padding: 5px;
}
.block .btn {
  margin: 0px;
}
</style>