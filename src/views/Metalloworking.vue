<template>
	<div>
		<h3>Металлообработка</h3>
		<div class="block"> 
      <button class="btn" @click='openOperation'>Детали по операциям</button>
      <span style='margin-left: 10px;'>Всего операций: {{ operation_stack.length }}</span>
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
          <tr v-for='metalowork of getMetaloworkings' :key='metalowork'>
            <td>{{ metalowork.date_order }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='returnShipmentsKolvo(metalowork.detal.shipments)' class='link_img' atl='Показать' />
            </td>
            <td>{{ metalowork.detal.name }}</td>
            <td class='center'>{{ metalowork.kolvo_shipments }}</td>
            <td class='center'>{{ metalowork.detal.kolvo_shipments }}</td>
            <td class='center'>{{ metalowork.detal.DxL }}</td>
            <td class='center'>{{ metalowork.detal.mat_za_obj.material.name }}</td>
            <td>{{ metalowork.detal.mat_za_obj.name }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openOperationPath(metalowork)' class='link_img' atl='Показать' />
            </td>
            <td>{{  }}</td>
            <td>{{ metalowork.status }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDocuments(metalowork.detal)' class='link_img' atl='Показать' />
            </td>
            <td class='hover center'>{{ showAllTimers(metalowork) }}</td>
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
      :metaloworking='metaloworking_props'
      v-if="showOperationPathModal" 
      :key='keyOperationPathModal'
    />
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
    <OperationModal 
      :key='key_operation_m'
      v-if='show_operaiton_m && operation_stack.length'
      :parametrs='operation_stack'
      :is_type='"det"'
    />
    <ShipmentsModal 
      :shipments='shipments'
      v-if='shipments.length'
      :key='shipmentKey'
    />

    <Loader v-if='loader' />
	</div>
</template>

<script>

import {mapActions, mapGetters} from 'vuex';
import DescriptionModal from '@/components/description-modal.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import OperationPathModal from '@/components/metalloworking/operation-path-metaloworking.vue';
import { showMessage } from '@/js/';
import {random} from 'lodash';
import OperationModal from '@/components/sclad/workings-operations.vue';
import ShipmentsModal from  '@/components/sclad/shipments-to-ized.vue';
export default {
	data() {
		return{
      metaloworking: [],

      descriptionKey: random(1, 999),
      description: '',
      itemFiles: [],
      keyWhenModalGenerateFileOpen: random(1, 999),
      key_operation_m: random(1, 999),
      show_operaiton_m: false, 
      operation_stack: [],

      message: '',
      type: '',
      keyInformTip: random(1, 999),
      shipments: [],
      shipmentKey: random(1, 999),

      keyOperationPathModal: random(1, 999),
      showOperationPathModal: false,

      metaloworking_props: null,

      loader: false
		}
	},
	computed: mapGetters([
    'getShipments',
    'getTypeOperations',
    'getMetaloworkings'
    ]),
	components: {
    DescriptionModal, 
    OpensFile,
    OperationPathModal, 
    OperationModal, 
    ShipmentsModal
  },
	methods: {
    ...mapActions([
      'fetchAllShipmentsMetaloworking', 
      'fetchMetaloworking',
      'getAllTypeOperations'
      ]),
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
    openDocuments(detal) {
      if(detal.documents && detal.documents.length) {
        this.keyWhenModalGenerateFileOpen = random(1, 999)
        this.itemFiles = detal.documents
      } else showMessage('', 'Документов нет', 'w', this)
    },
    openDescription(description) {
      this.descriptionKey = random(1, 999)
      this.description = description
    },
    openOperation() {
      this.key_operation_m = random(1, 999)
      this.show_operaiton_m = true
    },
    returnShipmentsKolvo(shipments) {
      if(!shipments || shipments.length == 0) return showMessage('', 'Нет прикрепленных заказов', 'w', this)
      this.shipmentKey = random(1, 999)
      this.shipments = shipments
    },
    filterOperation() {
      for(let metal of this.getMetaloworkings) {
        for(let oper of metal.tech_process.operations) {
          for(let ot of this.getTypeOperations) {
            if(oper.name == ot.id) {
              let check = true
              for(let os of this.operation_stack) {
                if(os.id == ot.id) check = false
              }
              if(check) {
                this.operation_stack.push(ot)
              } else check = true
            }
          }
        }
      }
      this.operationFilter()
    },
    operationFilter() {
      if(!this.operation_stack.length) return false
      for(let inx in this.operation_stack) {
        for(let j in this.operation_stack) {
          if(this.operation_stack[inx].id < this.operation_stack[j].id) {
            let variabl = this.operation_stack[inx]
            this.operation_stack[inx] = this.operation_stack[j]
            this.operation_stack[j] = variabl
          }
        }
      }
    },
    showAllTimers(ass) {
      let count = 0
      if(!ass.tech_process) return false
      const operations = ass.tech_process.operations
      if(!operations || operations.length == 0) return 

      for(let operation of operations) {
        count = Number(count) + (Number(operation.preTime) + (Number(operation.helperTime) + Number(operation.mainTime)) * ass.kolvo_shipments) / 60
      }
      return count.toFixed(2)
    }
  },
	async mounted() {
    this.loader = true
    // await this.fetchAllShipmentsMetaloworking() 
    await this.getAllTypeOperations()
    await this.fetchMetaloworking()
    this.filterOperation()
    console.log(this.getMetaloworkings)
    this.loader = false
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