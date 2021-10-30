<template>
  <div>
    <h3>Приход на склад от поставщика и производства</h3>
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
            <th>№ Накладной</th>
            <th>Дата прихода</th>
            <th>№ Заказа</th>
            <th>Поставщик</th>
            <th>Основание</th>
            <th>Сумма, руб.</th>
            <th>Примечание</th>
            <th>Подробнее</th>
          </tr>
          <tr 
            class='td-row' 
            v-for='order of []' 
            @click='e => selectOrder(order, e.target.parentElement)'
            :key="order">
            <td>{{ order.number_check }}</td>
            <td>{{ order.date_shipments }}</td>
            <td>{{ order.name }}</td>
            <td>{{ order.provider.name }}</td>
            <td @click='openCheck(order.documents)' class='select_span_href'>{{ order.number_check }}</td>
            <td>{{ order.count }}</td>
            <td @click='OpenDescription(order.description)' class='center'>
              <img src="@/assets/img/link.jpg" class='link_img' atl='Показать'/>
            </td>
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
        <button class='btn-small'> Печать </button>
        <button class="btn-small btn-add" @click='startComing'> Создать Приход </button>
      </div>
    </div>
    <OpensFile 
			:parametrs='itemFiles' 
			v-if="itemFiles" 
			:key='keyWhenModalGenerateFileOpen'
    />
    <DescriptionModal 
      :key='key_description'
      v-if='description'
      @unmount='unmount_description'
      :parametrs='description'
    />
    <ComingModal 
      :key='key_coming'
      v-if='show_coming'
      :parametrs='order'
      @unmount='unmount_waybill'
    />

    <Loader v-if='loader' />
  </div>
</template>

<script>
import {random} from 'lodash';
import {mapGetters, mapActions} from 'vuex';
import DatePicterRange from '@/components/date-picter-range.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import DescriptionModal from '@/components/description-modal.vue';
import ComingModal from './coming-modal.vue';
export default {
	data() {
		return {
      showAddOrder: false,
      AddOrderKey: random(1, 999),

      detals_order: [],
      span: null,
      order: null,
      order_parametr: null,
      itemFiles: null,
      keyWhenModalGenerateFileOpen: random(1, 999),
      
      description: '',
      key_description: random(1, 999),

      key_coming: random(1, 999),
      show_coming: false,

      loader: false

		}
	},
  computed: mapGetters(['getAllWaybills']),
	components: {DatePicterRange, OpensFile, DescriptionModal, ComingModal},
	methods: {
    ...mapActions(['fetchWaybill']),
    unmount_waybill() {
      this.loader = true
      this.fetchWaybill().then(() => this.loader = false)
    },
    unmount_description() {
      this.description = ''
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
    },
    changeDatePicterRange(val) {
      console.log(val)
    },
    openCheck(documents) {
			if(!documents || documents.length == 0)
				return 0;
			this.itemFiles = documents[0]
			this.keyWhenModalGenerateFileOpen = random(1, 999)
		},
    OpenDescription(val) {
      this.description = val
      this.key_description = random(1, 999)
    },
    startComing() {
      this.key_coming = random(1, 999)
      this.show_coming = true
    }
	},
	async mounted() {
    this.loader = true
    await this.fetchWaybill()
    console.log(this.getAllWaybills)
    this.loader = false
	}
}
</script>

<style scoped>
.tooltiptext {
  margin-top: 40px;
}
</style>