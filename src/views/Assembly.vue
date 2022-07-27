<template>
	<div>
		<h3>Сборка</h3>
    <p 
      class='hover active' 
      style='text-align: end;'
      @click='showArchive'>
      {{ isArchive ? "все сборки" : "сборки в архиве" }}
    </p>
		<div class="block">
      <button class="btn" @click='openOperation'>Сборочные единицы по операциям</button>
      <span style='margin-left: 10px;'>Всего операций: {{ operation_stack.length }}</span>
    </div>
    <div class='table_block'> 
      <ShipmentList
        @unmount_set='toSetOrders' 
        :getShipments='getShipments'
        @unmount_set_work='toSetOrdersAss'
        :workings='assemblyWorkings'
      /> 
      <div class="table-scroll" style='margin-left: 5px;'>
        <table id='tablebody'>
          <tr class='fixed_table_85'>
            <th>№</th>
            <th>Тип</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Кол-во ВСЕГО по заказу склада, шт.</th>
            <th>Дата план. отгрузки</th>
            <th>Заказы</th>
            <th id='operation'>Операции</th>
            <th>Готовность</th>
            <th>Готовность к сборке</th>
            <th id='doc'>Документы</th>
            <th>Время на сборку, ч</th>
            <th id='discription'>Примечание</th>
          </tr> 
          <tr 
            v-for='(assemble, inx) of getAssembles' :key='assemble'
            @click='e => setObject(assemble, e.target.parentElement)'
            class='td-row'>
            <td class="center">{{ inx + 1}}</td>
            <td class="center"><strong>{{ assemble.type_izd == 'prod' ? 'Изд.' : 'СБ' }}</strong></td>
            <td>{{ assemble?.cbed?.articl || 'Нет артикла' }}</td>
            <td>{{ assemble?.cbed?.name || 'Нет наименования' }}</td>
            <td class='center'>{{ assemble.kolvo_shipments }}</td> <!-- Кол-во ВСЕГО по заказу склада, шт. -->
            <td class='center link_img'> <!-- Дата готовности --> 
              {{ returnFirstDate(assemble?.cbed?.shipments) == '-' ? returnFirstDate(assemble?.workings) : returnFirstDate(assemble?.cbed?.shipments) }}
            </td>
            <td class="center">
              <img src="@/assets/img/link.jpg" @click='returnShipmentsDateModal(assemble)' class='link_img' atl='Показать' />
            </td> <!-- Заказы -->
            <td class='center' id='operation'>
              <img src="@/assets/img/link.jpg" @click='openOperationPath(assemble)' class='link_img' atl='Показать' />
            </td>
            <td 
              v-if="assemble.status !== 'Проведено'"
              :class='returnStatus(assemble.status, precentWorks(assemble)) + " tooltip center"'>
                <span>{{ precentWorks(assemble) }}</span>
                <span class="tooltiptext">{{ assemble.status }}</span>
            </td>
            <td v-else :class='returnStatus(assemble.status) + " tooltip center"'>
              <span class="tooltiptext">{{ assemble.status }}</span>
              <unicon name="check" fill="black" />
            </td> <!-- Готовность -->
            <td class='center'>{{ "нет" }}</td>
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
      <button class="btn-small" v-if='!isArchive'  
        @click='removeObject'>Переместить в архив</button>

      <button class="btn-small btn-add" v-if='isArchive' 
        @click='combackArchive'>Вернуть из Архива</button>
      <button class="btn-small btn-del" v-if='isArchive' 
        @click='removeObject'>Удалить безвозвратно</button>

      <button class="btn-small" @click='printPage'>Печать</button>
    </div>
    <DescriptionModal 
      v-if='descriptionKey'
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
    <OperationModal 
      :key='key_operation_m'
      v-if='show_operaiton_m && operation_stack.length'
      :parametrs='operation_stack'
      :is_type='"cb"'
    />

    <ShipmentsModal 
      :shipments='shipments'
      v-if='izdForSchipment'
      :key='shipmentKey'
      :izd='izdForSchipment'
      :scladWorking='assemblyWorkings'
    />

    <Loader v-if='loader' />
	</div>
</template>

<script>
import print from 'print-js';
import { random } from 'lodash';
import { showMessage } from '@/js/';
import { eSelectSpan } from '@/js/methods';
import { worksHorsOperations } from '@/js/operation';
import { returnShipmentsDate } from '@/js/operation';
import OpensFile from '@/components/FileBase/OpenFile';
import { precentWorksAsOperation } from '@/js/operation';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import DescriptionModal from '@/components/DescriptionModal';
import ShipmentsModal from '@/components/Sclad/ShipmentsToIzed';
import OperationModal from '@/components/Sclad/WorkingsOperations';
import ShipmentList from '@/components/IssueShipment/ShipmentsListTable';
import OperationPathModal from '@/components/Assembly/OperationPathModal';

export default {
	data() {
		return{
      assembles: [],
      descriptionKey: null,
      description: '',
      itemFiles: [],
      keyWhenModalGenerateFileOpen: random(1, 999),

      operation_stack: [],

      keyOperationPathModal: random(1, 999),
      showOperationPathModal: false,
      key_operation_m: random(1, 999),
      show_operaiton_m: false,
      shipments: [],
      izdForSchipment: null,
      shipmentKey: random(1, 999),
      assemblyWorkings: [],

      assemble_props: null,

      loader: false,

      enumStatus: [				
				'В процессе',
        'Готово',
        'В архиве',
        'Просрочено',
        'Проведено',
			],

      span: null,
      selectAssembly: null,
      isArchive: false
		}
	},
  computed: mapGetters([
    'getShipments',
    'getTypeOperations',
    'getAssembles',
    'getWorkings'
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
      'fetchAssemblyDelete',
      'fetchCombackAssemble',
      'fetchAllWorkings',
    ]),
    ...mapMutations([
      'filterAssemblByShipments',
      'breackFIlterAssembl'
    ]),
    async combackArchive() {
      if (!this.selectAssembly) return showMessage('', 'Выберите объект для изменения', 'w');
      const res = await this.fetchCombackAssemble(this.selectAssembly.id);
      if (res) return showMessage('', 'Сборка возвращена из архива', 's');
      else return showMessage('', 'Сборку не удалось вернуть из архива', 's');
    }, 
    showArchive() {
      this.isArchive = !this.isArchive;
      this.fetchAssemble(this.isArchive);
    }, 
    setObject(obj, e) {
      this.span = eSelectSpan(this.span, e);
      this.selectAssembly = obj;
    },
    async removeObject() {
      if (!this.selectAssembly) return showMessage('', 'Выберите объект для удаления', 'w');
      await this.fetchAssemblyDelete(this.selectAssembly.id);

      return showMessage('', 'Статус Сборки изменен', 's');
    },
    printPage() {
      print({
        printable: 'tablebody',
        type: 'html',
        targetStyles: ['*'],
        documentTitle: 'Сборка',
        ignoreElements: ['operation', 'doc', 'discription'],
        font_size: '10pt'
      });
    },
    precentWorks(metal) {
      return precentWorksAsOperation(metal);
    },
    returnStatus(status, precent = null) {
      if (status == this.enumStatus[1] || status == this.enumStatus[4] || precent == '100%') return 'success_operation';
      if (status == this.enumStatus[0]) return 'work_operation';
      return 'delete_operation';
    },
    toSetOrders(shipments) {
      if (shipments.cbeds && shipments.cbeds.length)
        this.filterAssemblByShipments(shipments.cbeds);
    },
    openDescription(description) {
      this.descriptionKey = random(1, 999);
      this.description = description;
    },
    async openDocuments(id) {
      const cb = await this.getOneCbEdField({fields: 'documents', id});
      if (cb.documents && cb.documents.length) {
        this.keyWhenModalGenerateFileOpen = random(1, 999);
        this.itemFiles = cb.documents;
      } else showMessage('', 'Документов нет', 'w', this);
    },
    openOperationPath(assemble) {
      if (!assemble.tech_process || !assemble.tech_process.operations) return showMessage('', 'Нет Технологической операции! ', 'w');
      this.assemble_props = assemble;
      this.keyOperationPathModal = random(1, 999);
      this.showOperationPathModal = true;
    },
    openOperation() {
      this.key_operation_m = random(1, 999);
      this.show_operaiton_m = true;
    }, 
    returnFirstDate(shipments, znach_return = 1) {
      return returnShipmentsDate(shipments, znach_return);
    },
    filterOperation() {
      for (const ass of this.getAssembles) {
        if (!ass.tech_process || !ass.tech_process.operations) continue;
        for (const oper of ass.tech_process.operations) {
          for (const ot of this.getTypeOperations) {
            if (oper.name == ot.id) {
              let check = true;
              for (const os of this.operation_stack) {
                if (os.id == ot.id) check = false;
              }
              if (check) {
                this.operation_stack.push(ot);
              } else check = true;
            }
          }
        }
      }
      this.operationFilter();
    },
    operationFilter() {
      if (!this.operation_stack.length) return false;
      for (let inx in this.operation_stack) {
        for (let j in this.operation_stack) {
          if (this.operation_stack[inx].id < this.operation_stack[j].id) {
            let variabl = this.operation_stack[inx];
            this.operation_stack[inx] = this.operation_stack[j];
            this.operation_stack[j] = variabl;
          }
        }
      }
    },
    showAllTimers(work) {
      const operations = work?.tech_process?.operations;
      if (!operations || operations.length == 0) return 0;

      return worksHorsOperations(operations, work.kolvo_shipments);
    },
    toSetOrdersAss(work) {
      if (!work.assemble || !work.assemble.length) return false;
      const arr = [];
      for (const item of work.assemble) {
        if (item.cbed) arr.push(item.cbed);
      }
      this.filterAssemblByShipments(arr);
    },
    returnShipmentsDateModal(ass) {
      this.shipments = ass?.cbed?.shipments || [];
      this.izdForSchipment = {izd: ass?.cbed, type: ass.type_izd};
      this.shipmentKey = random(1, 999);
    },
	},
	async mounted() {
    this.loader = true;
    await this.fetchAllShipmentsAssemble({sort: undefined, light: true});
    await this.fetchAssemble();
    await this.getAllTypeOperations();
    this.filterOperation();

    await this.fetchAllWorkings();
    this.assemblyWorkings = this.getWorkings.filter(el => el.type == 'ass');
    this.loader = false;
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