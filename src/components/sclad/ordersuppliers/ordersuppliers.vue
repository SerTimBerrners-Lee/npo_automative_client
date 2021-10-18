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
          <tr 
            class='td-row' 
            v-for='order of getAllDeliveries' 
            @click='e => selectOrder(order, e.target.parentElement)'
            :key="order">
            <td>{{ order.name }}</td>
            <td>{{ order.date_create }}</td>
            <td>{{ order.provider.name }}</td>
            <td>{{ order.number_check }}</td>
            <td>{{ order.count }}</td>
            <td>{{ order.date_shipments }}</td>
            <td>Заказано</td>
            <td class='center tooltip' @mousemove="getDetals(order)">
              <div class="tooltiptext">
                <table>
                  <tr>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>ЕИ</th>
                    <th>Кол-во</th>
                    <th>Сумма, руб (за шт.)</th>
                    <th>Примечание</th>
                  </tr>
                  <tr 
                    v-for='material of detals_order'
                    :key='material'
                    class='td-row'>
                    <td >{{ material.art }}</td>
                    <td >{{ material.name }}</td>
                    <td v-html='material.ez'></td>
                    <td>{{ material.kol }}</td>
                    <td
                      class='tooltip'> {{ material.sum }}
                      <span class="tooltiptext" >Общая сумма: {{ Number(material.kol) * Number(material.sum)  }}</span>
                    </td>
                    <td>{{ material.description }}</td>
                  </tr>
                </table>
              </div>
              <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
            </td>
          </tr>
      </table>
      </div>
      <div class='btn-control'>
        <button 
          class="btn-small" 
          @click='editOrder'
          > Редактировать заказ </button>
        <button class="btn-small btn-add" @click='addOrder'> Создать заказ </button>
      </div>
    </div>
    <AddOrder
      v-if='showAddOrder'
      :key='AddOrderKey'
      @unmount='unmount_order'
      :order_parametr='order_parametr'
    />
  </div>
</template>

<script>
import AddOrder from './add-order.vue';
import {random} from 'lodash';
import {mapGetters, mapActions} from 'vuex';
export default {
	data() {
		return {
      showAddOrder: false,
      AddOrderKey: random(1, 999),

      detals_order: [],
      span: null,
      order: null,
      order_parametr: null
		}
	},
  computed: mapGetters(['getAllDeliveries']),
	components: {AddOrder},
	methods: {
    ...mapActions(['fetchGetDeliveries']),
    unmount_order() {
      this.fetchGetDeliveries()
      this.order_parametr = null
    },
    addOrder() {
      this.showAddOrder = true
      this.AddOrderKey = random(1, 999)
    },
    getDetals(order) {
      if(order.product) {
        try {
          let prod = JSON.parse(order.product)
          this.detals_order = prod
        } catch (e) {
          console.log(e)
        }
      }
    },
    selectOrder(order, span) {
      this.order = order
      if(this.span)
        this.span.classList.remove('td-row-all')
      this.span = span
      this.span.classList.add('td-row-all')
    },
    editOrder() {
      if(!this.order) return 0
      this.showAddOrder = true
      this.AddOrderKey = random(1, 999)
      this.order_parametr = this.order
    }
	},
	async mounted() {
    this.fetchGetDeliveries()
	}
}
</script>

<style scoped>
.tooltiptext {
  margin-top: 40px;
}
</style>