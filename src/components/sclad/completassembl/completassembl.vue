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
        <button class="btn-small btn-add" @click='addWaynill'>Создать накладную комплектации сборочного участка</button>
      </div>

      <AddWaybill 
        v-if='showAddWaybill'
        :key='keyAddWaybill'
      />
	</div>
</template>

<script>
import AddWaybill from './add-waybill.vue';
import {random} from 'lodash';
export default {
	data() {
		return{
      showAddWaybill: false,
      keyAddWaybill: random(1, 999)
		}
	},
	components: {AddWaybill},
	methods: {
    addWaynill() {
      this.showAddWaybill = true;
      this.keyAddWaybill = random(1, 999)
    }
	},
	async mounted() {

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
</style>