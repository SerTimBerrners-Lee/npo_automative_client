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
            <th>№</th>
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
            v-for='(waybill, inx) of getAllWaybills' 
            @click='e => selectOrder(order, e.target.parentElement)'
            :key="waybill">
            <td class="center">{{ inx }}</td>
            <td>{{ waybill.name }}</td>
            <td>{{ new Date(waybill.createdAt).toLocaleString('ru-RU').split(',')[0] }}</td>
            <td>{{ waybill.name }}</td>
            <td>{{ waybill.provider?.name || 'Склад' }}</td>
            <td @click='openCheck(waybill.documents)' class='select_span_href'>{{ waybill.documents.length ? waybill.documents[0].name : '' }}</td>
            <td class='center'>{{ getAllSum(waybill.product) }}</td>
            <td @click='OpenDescription(waybill.description)' class='center'>
              <img src="@/assets/img/link.jpg" class='link_img' atl='Показать'/>
            </td>
            <td class='center tooltip' @mousemove="getDetals(waybill)">
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
                    v-for='prod of detals_order'
                    :key='prod'
                    class='td-row'>
                    <td >{{ prod.art }}</td>
                    <td >{{ prod.name }}</td>
                    <td>
                      <span :value='1' v-if='prod.ez == 1'>шт</span>
                      <span :value='2' v-if='prod.ez == 2'>л</span>
                      <span :value='3' v-if='prod.ez == 3'>кг</span>
                      <span :value='4' v-if='prod.ez == 4'>м</span>
                      <span :value='5' v-if='prod.ez == 5'>м.куб</span>
                    </td>
                    <td>{{ prod.kol }}</td>
                    <td
                      class='tooltip'> {{ prod.sum }}
                      <span class="tooltiptext" >Общая сумма: {{ Number(prod.kol) * Number(prod.sum)  }}</span>
                    </td>
                    <td>{{ prod.description }}</td>
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
      :parametrs='parametrs'
      @unmount='unmount_waybill'
    />

    <Loader v-if='loader' />
  </div>
</template>
<script>
import { random } from 'lodash';
import ComingModal from './ComingModal';
import { eSelectSpan } from '@/js/methods';
import { mapGetters, mapActions } from 'vuex';
import OpensFile from '@/components/FileBase/OpenFile';
import DatePicterRange from '@/components/DatePicterRange';
import DescriptionModal from '@/components/DescriptionModal';

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

      loader: false,
      parametrs: 0

		}
	},
  computed: mapGetters(['getAllWaybills']),
	components: {DatePicterRange, OpensFile, DescriptionModal, ComingModal},
	methods: {
    ...mapActions(['fetchWaybill']),
    async unmount_waybill() {
      console.log('unmount_waybill')
      this.loader = true;
      await this.fetchWaybill();
      this.loader = false;
    },
    unmount_description() {
      this.description = '';
    },
    addOrder() {
      this.showAddOrder = true;
      this.AddOrderKey = random(1, 999);
    },
    getDetals(order) {
      if (order.product) {
        try {
          const prod = JSON.parse(order.product);
          this.detals_order = prod;
        } catch (e) {
          console.error(e);
        }
      }
    },
    getAllSum(product) {
      if (!product) return 0;

      try {
        let count = 0 ;
        const pars = JSON.parse(product);
        for (const prod of pars) {
          count = count + (Number(prod.kol) * Number(prod.sum));
        }
        return count;
      } catch (e) {
        console.error(e);
      }
    },
    selectOrder(order, span) {
      this.order = order;
      this.span = eSelectSpan(this.span, span);
    },
    editOrder() {
      if (!this.order) return 0;
      this.showAddOrder = true;
      this.AddOrderKey = random(1, 999);
      this.order_parametr = this.order;
    },
    changeDatePicterRange(val) {
      console.log(val);
    },
    openCheck(documents) {
			if(!documents || documents.length == 0) return 0;
			this.itemFiles = documents[0];
			this.keyWhenModalGenerateFileOpen = random(1, 999);
		},
    OpenDescription(val) {
      this.description = val;
      this.key_description = random(1, 999);
    },
    startComing() {
      this.parametrs = this.getAllWaybills.length;
      this.key_coming = random(1, 999);
      this.show_coming = true;
    }
	},
	async mounted() {
    this.loader = true;
    await this.fetchWaybill();
    this.loader = false;
	}
}
</script>

<style scoped>
.tooltiptext {
  margin-top: 40px;
}
</style>