<template>
  <div>
    <h3>Перемещение склад / производство / офис</h3>
    <div> 
      <div class="block header_block">
        <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
      </div>
    </div>
 
    <div style='width: fit-content;'>
      <div class="scroll-table" style='width: 99%;'>
        <table>
          <tr>
            <th><unicon name="check" fill="royalblue" /></th>
            <th>№ Перемещения</th>
            <th>Дата перемещения</th>
            <th>отправитель</th>
            <th>Получатель</th>
            <th>Примечание</th>
            <th>Подробности</th>
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
          > Печать</button>
        <button class="btn-small btn-add" @click='newMoving'> Создать перемещение </button>
      </div>
    </div>
    <AddMovind
      v-if='showAddMoving'
      :key='keyAddMovind'
    />
  </div>
</template>
<script>
import {random} from 'lodash';
import AddMovind from './AddMovingModal';
import {mapGetters, mapActions} from 'vuex';
import DatePicterRange from '@/components/DatePicterRange';
export default {
	data() {
		return {
      detals_order: [],
      span: null,
      order: null,
      order_parametr: null,

      showAddMoving: false,
      keyAddMovind: random(1, 999)
		}
	},
  computed: mapGetters(['getAllDeliveries']),
	components: {DatePicterRange, AddMovind},
	methods: {
    ...mapActions(['']),
    newMoving() {
      this.showAddMoving = true
      this.keyAddMovind = random(1, 999)
    },
    changeDatePicterRange(val) {
      console.log(val)
    }
	},
	async mounted() {
	}
}
</script>

<style scoped>
.tooltiptext {
  margin-top: 40px;
}
</style>