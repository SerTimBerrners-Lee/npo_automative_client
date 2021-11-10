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
            <td class='center'>{{ order.date_shipments }}</td>
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
          <tr v-for='ass of assembles' :key='ass'>
            <td>{{ ass.number_order }}</td>
            <td>{{ ass.shipments.to_sklad ? 'Склад' : returnBuyer(ass.shipments.buyerId) }}</td>
            <td class='center'>{{ ass.cbed.articl }}</td>
            <td class='center'>{{ ass.cbed.name }}</td>
            <td class='center'>{{ ass.kolvo_all }}</td>
            <td class='center'>{{ ass.kolvo_order_byer }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDocuments(ass.cbed.id)' class='link_img' atl='Показать' />
            </td>
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
      <OpensFile 
        :parametrs='itemFiles' 
        v-if="itemFiles.length" 
        :key='keyWhenModalGenerateFileOpen'
      />
      <InformFolder  
        :title='titleMessage'
        :message = 'message'
        :type = 'type'
        v-if='message'
        :key='keyInformTip'
      />
      <Loader v-if='loader' />
	</div>
</template>
<script>
import AddWaybill from './add-waybill.vue';
import {mapGetters, mapActions} from 'vuex';
import {random} from 'lodash';
import OpensFile from '@/components/filebase/openfile.vue';
import { showMessage } from '@/js/';
export default {
	data() {
		return{
      showAddWaybill: false,
      keyAddWaybill: random(1, 999),

      assembles: [],
      shipments: null,
      loader: false,
      keyWhenModalGenerateFileOpen: random(1, 999),
      itemFiles: [],

      message: '',
      type: '',
      keyInformTip: random(1, 999),
		}
	},
	components: {AddWaybill, OpensFile},
  computed: mapGetters([
      'getShipments',
      'allBuyer'
    ]),
	methods: {
    ...mapActions([
      'fetchAllShipmentsAssemble',
      'fetchAssembleById',
      'fetchAllBuyers',
      'getOneCbEdById'
      ]),
    addWaybill() {
      this.showAddWaybill = true;
      this.keyAddWaybill = random(1, 999)
    },
    toSetOrders(shipments, e) {
      if(e.classList.item(1)) {
        shipments.assemble.forEach(or => { this.assembles = this.assembles.filter(el => el.id != or.id)})
        return e.classList.remove('checkbox_block_select')
      }
      e.classList.add('checkbox_block_select')
      shipments.assemble.forEach(or => { 
        this.fetchAssembleById(or.id).then(result => this.assembles.push(result))
      })
    },
    returnBuyer(buyer_id) {
      for(let buyer of this.allBuyer) {
        if(buyer.id == buyer_id) return buyer.name
      }
    },
    openDocuments(id) {
      this.getOneCbEdById(id).then(cb => {
        if(cb.documents && cb.documents.length) {
          this.keyWhenModalGenerateFileOpen = random(1, 999)
          this.itemFiles = cb.documents
        } else showMessage('', 'Документов нет', 'w', this)
      })
    },
	},
	async mounted() {
    this.loader = true
    await this.fetchAllShipmentsAssemble()
    await this.fetchAllBuyers()
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