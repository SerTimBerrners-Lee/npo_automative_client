<template>
	<div>
		<h3>Сборка</h3>
		<div class="block">
      <button class="btn" @click='openOperation'>Сборочные единицы по операциям</button>
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
            <th>Сборочная единица</th>
            <th>Кол-во ВСЕГО по заказу склада, шт.</th>
            <th>Кол-во в т.ч. по заказу покупателя, шт.</th>
            <th>Операции</th>
            <th>Готовность</th>
            <th>Готовность к сборке</th>
            <th>Статус</th>
            <th>Документы</th>
            <th>Время на сборку, ч</th>
            <th>Примечание</th>
          </tr>
          <tr v-for='assemble of assembles' :key='assemble'>
            <td>{{ assemble.date_order }}</td>
            <td>{{ assemble.date_shipments }}</td>
            <td>{{ assemble.cbed.name }}</td>
            <td class='center'>{{ assemble.kolvo_all }}</td>
            <td class='center'>{{ assemble.kolvo_order_byer }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openOperationPath(assemble)' class='link_img' atl='Показать' />
            </td>
            <td>{{  }}</td>
            <td>{{  }}</td>
            <td :class='assemble.status == "Готово" ? "success_operation" : "work_operation" '>{{ assemble.status }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDocuments(assemble.cbed.id)' class='link_img' atl='Показать' />
            </td>
            <td class='hover center' @click='e => showAllTimers(assemble, e.target)'>Посмотреть</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDescription(assemble.description)' class='link_img' atl='Показать' />
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
    <OperationModal 
      :key='key_operation_m'
      v-if='show_operaiton_m && operation_stack.length'
      :parametrs='operation_stack'
      :is_type='"cb"'
    />

    <Loader v-if='loader' />
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import DescriptionModal from '@/components/description-modal.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import OperationPathModal from '@/components/assembly/operation-path-modal.vue';
import {random} from 'lodash';
import { showMessage } from '@/js/';
import InformFolder from '@/components/InformFolder.vue';
import OperationModal from '@/components/sclad/workings-operations.vue';
export default {
	data() {
		return{
      assembles: [],
      descriptionKey: random(1, 999),
      description: '',
      itemFiles: [],
      keyWhenModalGenerateFileOpen: random(1, 999),

      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: random(1, 999),

      operation_stack: [],

      keyOperationPathModal: random(1, 999),
      showOperationPathModal: false,
      key_operation_m: random(1, 999),
      show_operaiton_m: false,

      assemble_props: null,

      loader: false
		}
	},
  computed: mapGetters(['getShipments', 'getTypeOperations']),
	components: {OperationModal, DescriptionModal, OpensFile, OperationPathModal, InformFolder},
	methods: {
    ...mapActions([
      'fetchAllShipmentsAssemble', 
      'fetchAssembleById', 
      'getOneCbEdById', 
      'fetchTechProcess',
      'getAllTypeOperations'
    ]),
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
    openDescription(description) {
      this.descriptionKey = random(1, 999)
      this.description = description
    },
    openDocuments(id) {
      this.getOneCbEdById(id).then(cb => {
        if(cb.documents && cb.documents.length) {
          this.keyWhenModalGenerateFileOpen = random(1, 999)
          this.itemFiles = cb.documents
        } else showMessage('', 'Документов нет', 'w', this)
      })
    },
    openOperationPath(assemble) {
      this.assemble_props = assemble
      this.keyOperationPathModal = random(1, 999)
      this.showOperationPathModal = true
    },
    openOperation() {
      this.key_operation_m = random(1, 999)
      this.show_operaiton_m = true
    },
    filterOperation() {
      for(let ship of this.getShipments) {
        for(let ass of ship.assemble) {
          this.getOneCbEdById(ass.cbed_id).then(cbed => {
            if(cbed.techProcesses) {
              this.fetchTechProcess(cbed.techProcesses.id).then(tp => {
                for(let oper of tp.operations) {
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
              })
            }

          })
        }
      }
    },
    showAllTimers(ass, e) {
      let count = 0
      e.innerText = count
      if(!ass.tp_id) return false
      this.fetchTechProcess(ass.tp_id).then(res => {
        if(!res.operations || res.operations.length <= 0) return 
        for(let operation of res.operations) {
          count = (Number(count) + Number(operation.preTime)) + (Number(operation.helperTime) * Number(operation.mainTime))
        }
        e.innerText = count
      })
    }
	},
	async mounted() {
    this.loader = true
    await this.fetchAllShipmentsAssemble()
    await this.getAllTypeOperations()
    this.filterOperation()
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