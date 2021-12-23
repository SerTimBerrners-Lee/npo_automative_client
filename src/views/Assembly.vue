<template>
	<div>
		<h3>Сборка</h3>
		<div class="block">
      <button class="btn" @click='openOperation'>Сборочные единицы по операциям</button>
      <span style='margin-left: 10px;'>Всего операций: {{ operation_stack.length }}</span>
    </div>
    <div class='table_block'> 
      <ShipmentList
        @unmount_set='toSetOrders' 
        :getShipments='getShipments'/> 
      <div class="table-scroll" style='margin-left: 5px;'>
        <table id='tablebody'>
          <tr class='fixed_table_85'>
            <th>Дата готовности</th>
            <th>Заказ склада</th>
            <th>№ Заказа</th>
            <th>Сборочная единица</th>
            <th>Артикул СБ</th>
            <th>Кол-во ВСЕГО по заказу склада, шт.</th>
            <th>Кол-во в т.ч. по заказу покупателя, шт.</th>
            <th id='operation'>Операции</th>
            <th>Готовность</th>
            <th>Готовность к сборке</th>
            <th>Статус</th>
            <th id='doc'>Документы</th>
            <th>Время на сборку, ч</th>
            <th id='discription'>Примечание</th>
          </tr> 
          <tr 
            v-for='assemble of getAssembles' :key='assemble'
            @click='e => setObject(assemble, e.target.parentElement)'
            class='td-row'>
            <td class='center link_img' @click='returnShipmentsDateModal(assemble?.cbed?.shipments)' >
              {{returnShipmentsKolvo(assemble?.cbed?.shipments)}}
            </td>
            <td>{{ assemble.date_order }}</td>
            <td class='center link_img' @click='returnShipmentsDateModal(assemble?.cbed?.shipments)' >
              {{returnShipmentsKolvo(assemble?.cbed?.shipments, 2)}}
            </td>
            <td>{{ assemble?.cbed?.name || 'Нет СБ' }}</td>
            <td>{{ assemble?.cbed?.articl || 'Нет СБ' }}</td>
            <td class='center'>{{ assemble.kolvo_shipments }}</td>
            <td class='center'>{{ assemble?.cbed?.shipments_kolvo || 'Нет СБ' }}</td>
            <td class='center' id='operation'>
              <img src="@/assets/img/link.jpg" @click='openOperationPath(assemble)' class='link_img' atl='Показать' />
            </td>
            <td>{{  }}</td>
            <td class='center'>{{ "нет" }}</td>
            <td :class='assemble.status == "Готово" ? "success_operation" : "work_operation" '>{{ assemble.status }}</td>
            <td class='center' id='doc'>
              <img src="@/assets/img/link.jpg" v-if='assemble.cbed' @click='openDocuments(assemble.cbed.id)' class='link_img' atl='Показать' />
            </td>
            <td class='hover center'>{{ showAllTimers(assemble) }}</td>
            <td class='center' id='discription'>
              <img src="@/assets/img/link.jpg" @click='openDescription(assemble.description)' class='link_img' atl='Показать' />
            </td>
          </tr>
        </table> 
      </div>
    </div> 
    <div class="btn-control">
      <button class="btn-small" @click='removeObject'>Удалить</button>
      <button class="btn-small" @click='printPage'>Печать</button>
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
      v-if='message'
      :key='keyInformTip'
    />
    <OperationModal 
      :key='key_operation_m'
      v-if='show_operaiton_m && operation_stack.length'
      :parametrs='operation_stack'
      :is_type='"cb"'
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
import print from 'print-js';
import {random} from 'lodash';
import { showMessage, comparison } from '@/js/';
import {mapActions, mapGetters, mapMutations} from 'vuex';
import OpensFile from '@/components/filebase/openfile.vue';
import DescriptionModal from '@/components/description-modal.vue';
import ShipmentsModal from '@/components/sclad/shipments-to-ized.vue';
import OperationModal from '@/components/sclad/workings-operations.vue';
import ShipmentList from '@/components/issueshipment/shipments-list-table.vue';
import OperationPathModal from '@/components/assembly/operation-path-modal.vue';
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
      keyInformTip: random(1, 999),

      operation_stack: [],

      keyOperationPathModal: random(1, 999),
      showOperationPathModal: false,
      key_operation_m: random(1, 999),
      show_operaiton_m: false,
      shipments: [],
      shipmentKey: random(1, 999),

      assemble_props: null,

      loader: false,

      span: null,
      selectAssembly: null
		}
	},
  computed: mapGetters([
    'getShipments',
    'getTypeOperations',
    'getAssembles'
  ]),
	components: {
    OperationModal,
    DescriptionModal,
    OpensFile,
    OperationPathModal,
    ShipmentsModal,
    ShipmentList
  },
	methods: {
    ...mapActions([
      'fetchAllShipmentsAssemble',
      'fetchAssemble',
      'fetchAssembleById',
      'getAllTypeOperations',
      'getOneCbEdField',
      'fetchAssemblyDelete'
    ]),
    ...mapMutations([
      'filterAssemblByShipments',
      'breackFIlterAssembl'
    ]),
    setObject(obj, e) {
      if(this.span) this.span.classList.remove('td-row-all')

      this.span = e
      this.span.classList.add('td-row-all')

      this.selectAssembly = obj
    },
    removeObject() {
      if(!this.selectAssembly) return showMessage('', 'Выберите объект для удаления', 'w', this)
      this.fetchAssemblyDelete(this.selectAssembly.id)
    },
    printPage() {
      print({
        printable: 'tablebody',
        type: 'html',
        targetStyles: ['*'],
        documentTitle: 'Сборка',
        ignoreElements: ['operation', 'doc', 'discription'],
        font_size: '10pt'
      })
    },
    toSetOrders(shipments) {
      if(shipments.cbeds && shipments.cbeds.length)
        this.filterAssemblByShipments(shipments.cbeds)
    },
    openDescription(description) {
      this.descriptionKey = random(1, 999)
      this.description = description
    },
    openDocuments(id) {
      this.getOneCbEdField({fields: 'documents', id: id}).then(cb => {
        if(cb.documents && cb.documents.length) {
          this.keyWhenModalGenerateFileOpen = random(1, 999)
          this.itemFiles = cb.documents
        } else showMessage('', 'Документов нет', 'w', this)
      })
    },
    openOperationPath(assemble) {
      if(!assemble.tech_process || !assemble.tech_process.operations) return showMessage('', 'Нет Сборочной единицы ', 'w', this);
      this.assemble_props = assemble
      this.keyOperationPathModal = random(1, 999)
      this.showOperationPathModal = true
    },
    openOperation() {
      this.key_operation_m = random(1, 999)
      this.show_operaiton_m = true
    }, 
    returnShipmentsKolvo(shipments, znach_return = 1) {
      if(!shipments || shipments.length == 0) return '-'
      let end_date = shipments[0]?.date_shipments || '-'
      if(znach_return == 2) end_date = shipments[0]?.number_order || '-'
      for(let ship1 of shipments) {
        for(let ship2 of shipments) {
          if(comparison(ship1.date_shipments, ship2.date_shipments, '<')) end_date = znach_return == 1 ? ship1.date_shipments : ship1.number_order
        }
      }
      return end_date
    },
    returnShipmentsDateModal(shipments) {
      if(!shipments || shipments.length == 0) return showMessage('', '', 'Нет заказов', this)
      this.shipmentKey = random(1, 999)
      this.shipments = shipments
    },
    filterOperation() {
      for(let ass of this.getAssembles) {
        if(!ass.tech_process || !ass.tech_process.operations) continue;
        for(let oper of ass.tech_process.operations) {
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
    await this.fetchAllShipmentsAssemble()
    await this.fetchAssemble()
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
td {
  width: 100px;
  word-break: break-all;
}
</style>