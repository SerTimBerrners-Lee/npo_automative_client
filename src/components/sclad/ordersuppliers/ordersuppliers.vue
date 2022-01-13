<template>
  <div> 
    <h3>Заказано у поставщиков</h3>
    <div>
      <div class="block header_block">
        <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
      </div>
    </div>

    <MiniNavigation 
      @unmount='filterType' 
      :arrData='[
        "От Поставщика",
        "Только Сборки",
        "Только Металлообработка"
      ]' />

    <div style='width: fit-content;'>
      <div class="scroll-table" style='width: 99%; height: 550px;'>
        <table>
          <tr>
            <th>№ Заказа</th>
            <th>Дата создания</th>
            <th>Тип Заказа</th>
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
            <td v-if='order.provider' class='center'>{{ order.name }}П</td>
            <td>{{ order.provider ? order.provider.name : 'Нет поставщика' }}</td>
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
                    <td>{{ material.art }}</td>
                    <td>{{ material.name }}</td>
                    <td>
                      <span v-if='material.ez == 1'>шт</span>
                      <span v-if='material.ez == 2'>л</span>
                      <span v-if='material.ez == 3'>кг</span>
                      <span v-if='material.ez == 4'>м</span>
                      <span v-if='material.ez == 5'>м.куб</span>
                    </td>
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
          <!-- Assemblye-->
          <tr 
            class='td-row' 
            v-for='ass of getAssembles' :key='ass'>
            <td>{{ ass?.id }}</td>
            <td>{{ ass?.date_order }}</td>
            <td class='center'>{{ ass?.id + 'C' }}</td>
            <td>{{ returnShipmentsKolvo(ass?.cbed?.shipments)?.buyer?.name || 'склад' }}</td>
            <td class='center'>{{ returnShipmentsKolvo(ass?.cbed?.shipments)?.base || '-' }}</td>
            <td class='center'>-</td>
            <td>{{ returnShipmentsKolvo(ass?.cbed?.shipments)?.date_shipments }}</td>
            <td>{{ ass.status }}</td>
            <td class='center tooltip'>
              <div class="tooltiptext">
                <table>
                  <tr>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>Кол-во</th>
                    <th>Примечание</th>
                  </tr>
                  <tr>
                    <td>{{ ass?.cbed?.articl }}</td>
                    <td>{{ ass?.cbed?.name }}</td>
                    <td>{{ ass.kolvo_shipments }}</td>
                    <td>{{ ass.description }}</td>
                  </tr>
                </table>
              </div>
              <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
            </td>
          </tr>
          <!-- Metalloworking-->
          <tr 
            class='td-row' 
            v-for='metal of getMetaloworkings' :key='metal'>
            <td>{{ metal?.id }}</td>
            <td>{{ metal?.date_order }}</td>
            <td class='center'>{{ metal?.id + 'M' }}</td>
            <td>{{ returnShipmentsKolvo(metal?.detal?.shipments)?.buyer?.name || 'склад' }}</td>
            <td class='center'>{{ returnShipmentsKolvo(metal?.detal?.shipments)?.base || '-' }}</td>
            <td class='center'>-</td>
            <td>{{ returnShipmentsKolvo(metal?.detal?.shipments)?.date_shipments }}</td>
            <td>{{ metal.status }}</td>
            <td class='center tooltip'>
              <div class="tooltiptext">
                <table>
                  <tr>
                    <th>Артикул</th>
                    <th>Наименование</th>
                    <th>Кол-во</th>
                    <th>Примечание</th>
                  </tr>
                  <tr>
                    <td>{{ metal?.detal?.articl }}</td>
                    <td>{{ metal?.detal?.name }}</td>
                    <td>{{ metal.kolvo_shipments }}</td>
                    <td>{{ metal.description }}</td>
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
    <Loader v-if='loader' />
  </div>
</template>
<script>
import {random} from 'lodash';
import { comparison } from '@/js/'; 
import AddOrder from './add-order.vue';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import DatePicterRange from '@/components/date-picter-range.vue';
export default {
	data() {
		return {
      showAddOrder: false,
      AddOrderKey: random(1, 999),
 
      detals_order: [],
      span: null,
      order: null,
      order_parametr: null,

      loader: false
		}
	},
  computed: mapGetters([
    'getAllDeliveries', 
    'getAssembles', 
    'getMetaloworkings'
  ]),
	components: {AddOrder, DatePicterRange},
	methods: {
    ...mapActions([
      'fetchGetDeliveries',
      'fetchAssemble',
      'fetchMetaloworking'
    ]),
    ...mapMutations([
      'allAssemble',
      'allMetaloworking',
      'setAllDeliveries'
    ]),
    unmount_order() {
      this.fetchGetDeliveries()
      this.order_parametr = null
    },
    addOrder() {
      this.showAddOrder = true
      this.AddOrderKey = random(1, 999)
      
      this.order_parametr = null
    },
    getDetals(order) {
      if(order.product) {
        try {
          let prod = JSON.parse(order.product)
          this.detals_order = prod
        } catch (e) {console.error(e)}
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
    },
    changeDatePicterRange(val) {
      console.log(val)
    },
    returnShipmentsKolvo(shipments) {
      if(!shipments || shipments.length == 0) return '-'
      let end_date = shipments[0]
      for(let ship1 of shipments) {
        for(let ship2 of shipments) {
          if(comparison(ship1.date_shipments, ship2.date_shipments, '<')) 
            end_date = ship1
        }
      }
      return end_date
    },
    filterType(number) {
      this.clearAllState()
      switch(number) {
        case 1:
          this.getAllState()
          break;
        case 2: 
          this.fetchGetDeliveries()
          break;
        case 3:
          this.fetchAssemble()
          break;
        case 4: 
          this.fetchMetaloworking()
          break;
      }
    },
    clearAllState() {
      this.allAssemble([])
      this.allMetaloworking([])
      this.setAllDeliveries([])
    },
    getAllState() {
      this.fetchGetDeliveries()
      this.fetchAssemble()
      this.fetchMetaloworking()
    }
	},
	async mounted() {
    this.loader = true
    await this.fetchGetDeliveries()
    await this.fetchAssemble()
    await this.fetchMetaloworking()
    this.loader = false
	}
}
</script>

<style scoped>
.tooltiptext {
  margin-top: 40px;
}
</style>