<template>
	<div>
		<h3>Металлообработка</h3>
		<div class="block">
      <button class="btn" @click='$router.push("/detoperation")'>Детали по операциям</button>
    </div>
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
            <th>Заказ склада</th>
            <th>Дата готовности</th> 
            <th>Деталь</th>
            <th>Кол-во ВСЕГО по заказу склада, шт.</th>
            <th>Кол-во в т.ч. по заказу покупателя, шт.</th>
            <th>Габариты заготовки</th>
            <th>Тип заготовки</th>
            <th>Материал</th>
            <th>Операции</th>
            <th>Готовность</th>
            <th>Статус</th>
            <th>Документы</th>
            <th>Время на изг-е, ч</th>
            <th>Отходы (стружка), кг</th>
            <th>Примечание</th>
          </tr>
          <tr v-for='metalowork of metaloworking' :key='metalowork'>
            <td>{{ metalowork.date_order }}</td>
            <td>{{ metalowork.date_shipments }}</td>
            <td>{{ metalowork.detal.name }}</td>
            <td class='center'>{{ metalowork.kolvo_all }}</td>
            <td class='center'>{{ metalowork.kolvo_order_byer }}</td>
            <td class='center'>{{ metalowork.detal.DxL }}</td>
            <td>{{  }}</td>
            <td>{{  }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openOperationPath(metalowork)' class='link_img' atl='Показать' />
            </td>
            <td>{{  }}</td>
            <td>{{  }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDocuments(metalowork.detal.id)' class='link_img' atl='Показать' />
            </td>
            <td>{{  }}</td>
            <td class='center'>{{ metalowork.detal.trash }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDescription(metalowork.description)' class='link_img' atl='Показать' />
            </td>
          </tr>
        </table>
      </div>
    </div>
     <div class="btn-control">
        <button class="btn-small">Печать</button>
        <button class="btn-small">Сбросить все фильтры</button>
      </div>
      <DescriptionModal 
        v-if='description'
        :key='descriptionKey'
        :parametrs='description'
    />
    <OpensFile 
      :parametrs='itemFiles' 
      v-if="itemFiles.length" 
      :key='keyWhenModalGenerateFileOpen'
      />
    <OperationPathModal
      :assemble='assemble_props'
      v-if="showOperationPathModal" 
      :key='keyOperationPathModal'
    />
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='showInformPanel'
      :key='keyInformTip'
    />
	</div>
</template>

<script>

import {mapActions, mapGetters} from 'vuex';
import DescriptionModal from '@/components/description-modal.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import OperationPathModal from '@/components/sclad/operation-path-metaloworking.vue';
import { showMessage } from '@/js/';
import InformFolder from '@/components/InformFolder.vue';
import {random} from 'lodash';
export default {
	data() {
		return{

      metaloworking: [],

      descriptionKey: random(1, 999),
      description: '',
      itemFiles: [],
      keyWhenModalGenerateFileOpen: random(1, 999),

      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: random(1, 999),

      keyOperationPathModal: random(1, 999),
      showOperationPathModal: false,

      metaloworking_props: null
		}
	},
	computed: mapGetters(['getShipments']),
	components: {DescriptionModal, OpensFile, OperationPathModal, InformFolder},
	methods: {
    ...mapActions(['fetchAllShipmentsMetaloworking', 'fetchMetaloworkingById', 'getOneDetal']),
    toSetOrders(shipments, e) {
      if(e.classList.item(1)) {
        shipments.metaloworking.forEach(or => { this.metaloworking = this.metaloworking.filter(el => el.id != or.id)})
        return e.classList.remove('checkbox_block_select')
      }
      e.classList.add('checkbox_block_select')
      shipments.metaloworking.forEach(or => { 
        this.fetchMetaloworkingById(or.id).then(result => this.metaloworking.push(result))
      })
    },
    openOperationPath(metalowork) {
      this.metaloworking_props = metalowork
      this.keyOperationPathModal = random(1, 999)
      this.showOperationPathModal = true
    },
    openDocuments(id) {
      this.getOneDetal(id).then(cb => {
        if(cb.documents && cb.documents.length) {
          this.keyWhenModalGenerateFileOpen = random(1, 999)
          this.itemFiles = cb.documents
        } else showMessage('', 'Документов нет', 'w', this)
      })
    },
    openDescription(description) {
      this.descriptionKey = random(1, 999)
      this.description = description
    },
  },
	async mounted() {
    await this.fetchAllShipmentsMetaloworking() 
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