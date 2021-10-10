<template>
  <div>
    <h3>Заказано у поставщиков</h3>
    <div>
      <div class="block header_block">
        <span>Выбрать период, с:</span>
        <input type="text">
        <span>по: </span><input type="text">
        <button class="btn-small">Сбросить период или дату</button>
      </div>
    </div>

    <div style='width: fit-content;'>
      <div class="scroll-table" style='width: 99%;'>
        <table>
          <tr>
            <th>№ Заказа</th>
            <th>Дата создания</th>
            <th>Наименование поставщика</th>
            <th>№ счета и Дата</th>
            <th>Сумма, руб.</th>
            <th>Дата прихода</th>
            <th>Статус</th>
            <th>Подробнее</th>
          </tr>
      </table>
      </div>
      <div class='btn-control'>
        <button class="btn-small" 
          > Редактировать заказ </button>
        <button class="btn-small btn-add" @click='addOrder'> Создать заказ </button>
      </div>
    </div>
    <AddOrder
      v-if='showAddOrder'
      :key='AddOrderKey'
    />
  </div>
</template>

<script>
import AddOrder from './add-order.vue';
import {random} from 'lodash'
export default {
	data() {
		return {
      showAddOrder: false,
      AddOrderKey: random(1, 999)
		}
	},
	components: {AddOrder},
	methods: {
    addOrder() {
      this.showAddOrder = true
      this.AddOrderKey = random(1, 999)
    }
	},
	async mounted() {

	}
}
</script>