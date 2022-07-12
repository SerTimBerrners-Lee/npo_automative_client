<template>
	<div>
		<h3>Металлообработка</h3>
    <p 
      class='hover active' 
      style='text-align: end;'
      @click='showArchive'>
      {{ isArchive ? "все металлообработки" : "металлообработки в архиве" }}
    </p>
		<div class="block"> 
      <button class="btn" @click='openOperation'>Детали по операциям</button>
      <span style='margin-left: 10px;'>Всего операций: {{ operation_stack.length }}</span>
      
      <span class='sort_span'>
      </span>
    </div>
    <div class='table_block'>
      <ShipmentList
        @unmount_set='toSetOrders'
        @unmount_set_metal='toSetOrdersMetal'
        :getShipments='getShipments'
        :metalloworing='metalloworkingsWorkings' />
      <div class="table-scroll" style='margin-left: 5px;'>
        <table id='tablebody'>
          <tbody class='fixed_table_85'>
            <tr>
              <th>№</th> 
              <th>Артикул Детали</th>
              <th>Нимаенование Деталь</th>
              <th>Кол-во ВСЕГО по заказу склада, шт.</th>
              <th>Дата план. отгрузки</th>
              <th>Заказы</th>
              <th class='th_showZagParam' @click='showZagParam = !showZagParam'>
                <p v-if='showZagParam' >Параметры Заготовки</p>
                <p v-else class='showZagParam tooltip'>>
                  <span class='tooltiptext'>Показать параметры Заготовки</span>
                </p>
              </th>
              <th>Материал</th>
              <th id='operation'>Операции</th>
              <th>Готовность</th>
              <th id='doc'>Документы</th>
              <th>Время на изг-е, ч</th>
              <th>Отходы (стружка), кг</th>
              <th id='discription'>Прим.</th>
            </tr>
            <tr>
              <th colspan="4">
                <Search 
                  :placeholder="'Поиск по Заготовки'"
                  @unmount='keySearch'
                />
              </th>
              <th colspan="13"></th>
            </tr>
          </tbody>
          <tr 
            v-for='(metalowork, inx) of getMetaloworkings' :key='metalowork'
            @click='e => setObject(metalowork, e.target.parentElement)'
            class='td-row'>
            <th>{{ inx + 1 }}</th>
            <td>{{ metalowork?.detal?.articl || "Нет детали" }}</td> <!-- Артикл Детали -->
            <td @dblclick="showInformIzdel(metalowork?.detal.id)">{{ metalowork?.detal?.name || "Нет детали" }}</td> <!-- Наименование Детали -->
            <td class='center'>{{ metalowork?.kolvo_shipments }}</td>  <!-- Кол-во ВСЕГО по заказу склада, шт. -->
            <td class='center link_img' @click='returnShipmentsDateModal(metalowork?.detal)' >
              {{ returnShipmentsKolvo(metalowork?.detal?.shipments) }}
            </td> <!-- Дата план отгрузки -->
            <td class="center">
              <img src="@/assets/img/link.jpg" @click='returnShipmentsDateModal(metalowork?.detal, metalowork)' class='link_img' atl='Показать' />
            </td> <!-- Заказы -->
            <td class='params_td' v-if='showZagParam'>
              <TbodyZag :detal='metalowork.detal' />
            </td>
            <td v-else></td>
            <td>{{metalowork.detal && metalowork.detal.mat_za_obj ?  metalowork.detal.mat_za_obj.name : 'Нет заготовки' }}</td>
            <td class='center' id='operation'>
              <img src="@/assets/img/link.jpg" @click='openOperationPath(metalowork)' class='link_img' atl='Показать' />
            </td>
            <td :class='returnStatus(metalowork.status) + " tooltip center"'>
              <span>{{ precentWorks(metalowork) }}</span>
              <span class="tooltiptext">{{ metalowork.status }}</span>
            </td>
            <td class='center' id='doc'>
              <img src="@/assets/img/link.jpg" v-if='metalowork.detal' @click='openDocuments(metalowork.detal)' class='link_img' atl='Показать' />
            </td>
            <td class='hover center'>{{ showAllTimers(metalowork) }}</td>
            <td class='center'>{{metalowork.detal?.trash ? Number(metalowork.detal.trash)?.toFixed(3) : 'Нет детали'}}</td>
            <td class='center' id='discription'>
              <img src="@/assets/img/link.jpg" @click='openDescription(metalowork.description)' class='link_img' atl='Показать' />
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
    <OperationModal 
      :key='key_operation_m'
      v-if='show_operaiton_m && operation_stack.length'
      :parametrs='operation_stack'
      :is_type='"det"'
    />
    <ShipmentsModal 
      :shipments='shipments'
      v-if='izdForSchipment'
      :key='shipmentKey'
      :izd='izdForSchipment'
      :scladWorking='metalloworkingsWorkings'
    />
    <DetalModal
      :key='detalModalKey'
      v-if='parametrs_detal'
      :id='parametrs_detal'
    />

    <Loader v-if='loader' />
	</div>
</template>
<script>
import print from 'print-js';
import { random } from 'lodash';
import { showMessage } from '@/js/';
import { eSelectSpan } from '@/js/methods';
import { returnShipmentsDate } from '@/js/operation';
import OpensFile from '@/components/FileBase/OpenFile';
import DetalModal from '@/components/BaseDetal/DetalModal';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import TbodyZag from '@/components/Metalloworking/TableZag';
import DescriptionModal from '@/components/DescriptionModal';
import ShipmentsModal from  '@/components/Sclad/ShipmentsToIzed';
import OperationModal from '@/components/Sclad/WorkingsOperations';
import ShipmentList from '@/components/IssueShipment/ShipmentsListTable';
import OperationPathModal from '@/components/Metalloworking/OperationPathMetaloworking';

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

      shipments: [],
      shipmentKey: random(1, 999),

      keyOperationPathModal: random(1, 999),
      showOperationPathModal: false,

      metaloworking_props: null,

      loader: false,
      showZagParam: false,

      enumStatus: [				
				'В процессе',
        'Готово',
        'В архиве',
        'Просрочено' 
			],

      span: null,
      selectMetalloworking: null,
      isArchive: false,
      izdForSchipment: null,
      scladWorking: null,

      detalModalKey: random(1, 999),
			parametrs_detal: false,
      metalloworkingsWorkings: []
		}
	},
	computed: {
    ...mapGetters([
      'getShipments',
      'getTypeOperations',
      'getMetaloworkings',
      'ShipmentList',
      'getWorkings'
    ])
  },
	components: {
    DescriptionModal, 
    OpensFile,
    TbodyZag,
    OperationPathModal, 
    OperationModal, 
    ShipmentsModal,
    ShipmentList,
    DetalModal
  },
	methods: {
    ...mapActions([
      'fetchAllShipmentsMetaloworking', 
      'fetchMetaloworking',
      'getAllTypeOperations',
      'fetchMetalloworkingDelete',
      'fetchCombackMetallowork',
      'fetchAllWorkings'
    ]),
    ...mapMutations([
      'filterMetaloworkingByShipments', 
      'breackFIlterMetal',
      'sortMatallZag',
      'sortMetallZag'
    ]),
    keySearch(str) {
      this.sortMetallZag(str);
    },
    showInformIzdel(id) {
      if (!id) return false;
      this.parametrs_detal = id;
      this.detalModalKey = random(1, 999);
		},
    returnStatus(status) {
      if (status == this.enumStatus[0]) return 'work_operation';
      if (status == this.enumStatus[1]) return 'success_operation';
      return 'delete_operation';
    },
    precentWorks(metal) {
      const tp = metal.tech_process;
      if (!tp || !tp.operations || !tp.operations.length) return '0%';
      let kolDetalComplit = 0;
      for (const item of tp.operations) {
        if (!item?.marks.length) continue;
        for (const mark of item.marks) {
          kolDetalComplit += mark.kol;
        }
      }
      const kolDetalForOpetaion = tp.operations.length * metal.kolvo_shipments;
      const precent = kolDetalComplit * 100 / kolDetalForOpetaion;
      return precent.toFixed(0) + '%';
    },
    returnShipmentsKolvo(shipments, znach_return = 1) {
      return returnShipmentsDate(shipments, znach_return);
    },
    combackArchive() {
      if(!this.selectMetalloworking) return showMessage('', 'Выберите объект для изменения', 'w');
      this.fetchCombackMetallowork(this.selectMetalloworking.id).then(() => {
        return showMessage('', 'Металлообработка возвращена из архива', 's');
      }).catch(() => {
        return showMessage('', 'Металлообработку не удалось вернуть из архива', 's');
      })
    }, 
    showArchive() {
      this.isArchive = !this.isArchive
      this.fetchMetaloworking(this.isArchive)
    }, 
    setObject(obj, e) {
      this.span = eSelectSpan(this.span, e);
      this.selectMetalloworking = obj;
    },
    async removeObject() {
      if(!this.selectMetalloworking) return showMessage('', 'Выберите объект для удаления', 'w');
      await this.fetchMetalloworkingDelete(this.selectMetalloworking.id);
      return showMessage('', 'Статус Металлообработки изменен', 's');
    },
    printPage() {
      this.showZagParam = true;
      print({
        printable: 'tablebody', 
        type: 'html',
        targetStyles: ['*'], 
        documentTitle: 'Металлообработка',
        ignoreElements: ['operation', 'doc', 'discription'],
        font_size: '10pt'
      });
    },   
    toSetOrders(shipments) {
      if (shipments.detals && shipments.detals.length)
        this.filterMetaloworkingByShipments(shipments.detals);
    },
    toSetOrdersMetal(work) {
      if (!work.metall || !work.metall.length) return false;
      const arr = [];
      for (const item of work.metall) {
        if (item.detal) arr.push(item.detal);
      }
      this.filterMetaloworkingByShipments(arr);
    },
    openOperationPath(metalowork) {
      if (!metalowork.tech_process || !metalowork.tech_process.operations) return showMessage('', 'Нет Технологической операции!', 'w');
      this.metaloworking_props = metalowork;
      this.keyOperationPathModal = random(1, 999);
      this.showOperationPathModal = true;
    },
    openDocuments(detal) {
      if (detal.documents && detal.documents.length) {
        this.keyWhenModalGenerateFileOpen = random(1, 999);
        this.itemFiles = detal.documents;
      } else showMessage('', 'Документов нет', 'w');
    },
    openDescription(description) {
      this.descriptionKey = random(1, 999);
      this.description = description;
    },
    openOperation() {
      this.key_operation_m = random(1, 999);
      this.show_operaiton_m = true;
    },
    returnShipmentsDateModal(izd, metal) {
      const shipments = izd.shipments;
      this.shipmentKey = random(1, 999);
      this.izdForSchipment = { izd, type: 'detal' };
      this.scladWorking = metal;
      this.shipments = shipments;
    },
    filterOperation() {
      for (const metal of this.getMetaloworkings) {
        if (!metal.tech_process || !metal.tech_process.operations) continue;
        for (const oper of metal.tech_process.operations) {
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
    showAllTimers(metal) {
      let count = 0;
      if (!metal.tech_process) return false;
      const operations = metal.tech_process.operations;
      if (!operations || operations.length == 0) return;

      for (const operation of operations) {
        count = Number(count) + (Number(operation.preTime) + (Number(operation.helperTime) + Number(operation.mainTime)) * metal.kolvo_shipments) / 60;
      }
      return count.toFixed(2);
    }
  },
	async mounted() {
    this.loader = true;
    await this.fetchAllShipmentsMetaloworking({sort: undefined, light: true});
    await this.getAllTypeOperations();
    await this.fetchMetaloworking();
    this.filterOperation();

    await this.fetchAllWorkings();
    this.metalloworkingsWorkings = this.getWorkings.filter(el => el.type == 'metall');
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
  display: flex;
  align-items: center;
}
.block .btn {
  margin: 0px;
}
td {
  width: 100px;
  word-break: break-all;
}
.sort_span {
  margin-left: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
}
.sort_span>label {
  color: black;
  margin: 0px;
}
.params_td {
	padding: 0px;
}
</style>