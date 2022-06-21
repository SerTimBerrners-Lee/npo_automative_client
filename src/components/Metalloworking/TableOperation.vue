<template>
	<div> 
		<div class="block header_block">
			<p>
				<label for="sortZag">Сортировать по заготовки</label>
				<input type="checkbox" id="sortZag" v-model='sortZag'>
			</p>
			<p class='p_select_header'>
				<label for="statusOperation">Сортировать по Статусу</label>
				<select id="" class='select-small' v-model='selectStatusOperation'>
					<option v-for='stat of statusOperation' :key='stat'>{{ stat }}</option>
				</select>
			</p>
		</div>

		<div class='body_container'>
			<div class='shipments_block'>
				<ShipmentList
				@unmount_set='toSetOrders'
				:getShipments='getShipments'/>
			</div>

			<div v-if='getMetaloworkings.length'>
				<table id='tablebody'>
					<tr>
						<th>№</th>
						<th>Артикул Детали</th>
						<th>Наименование Детали</th>
						<th>Кол-во, шт</th>
						<th>Срок отгрузки</th>
						<th>Дата готовности</th>
						<th id='parent'>Принадлежность</th>
						<th class='th_showZagParam' @click='showZagParam = !showZagParam'>
							<p v-if='showZagParam' >Параметры Заготовки</p>
							<p v-else class='showZagParam tooltip'>>
								<span class='tooltiptext'>Показать параметры Заготовки</span>
							</p>
						</th>
						<th>Заготовка</th>
						<th class='work_operation'>Предыдущая операция</th>
						<th>Статус</th>
						<th>Сделано, шт</th>
						<th>Осталось, шт</th>

						<th class='th_showZagParam' v-if='!showNormTime' @click='showNormTime = !showNormTime'>
							<p class='showZagParam tooltip'>>
								<span class='tooltiptext'>Показать Норма времени</span>
							</p>
						</th>

						<th v-if='showNormTime' @click='showNormTime = !showNormTime'>Норма времени (подготовительное), шт</th>
						<th v-if='showNormTime' @click='showNormTime = !showNormTime'>Норма времени (вспомогательное), шт</th>
						<th v-if='showNormTime' @click='showNormTime = !showNormTime'>Норма времени (основное), шт</th>
						<th>Норма времени (общее на парт.), ч</th>
						<th>Дата исполнения</th>
						<th>Исполнитель</th>
						<th>Отработано, н. ч.</th>
						<th class='success_operation'>Следующая операция</th>
						<th id='doc'>Документы</th>
						<th id='discription'>Примечание</th>
						<th id='mark'>Отметка</th>
					</tr>
					<tr 
						v-for='(metal, inx) of getMetaloworkings'
						:key='metal'
						>
						<td class='center'>{{ inx + 1 }}</td>
						<td>{{ metal.detal ? metal.detal.articl : 'Нет детали'}}</td>
						<td
							class='td-row' 
							@click='openDetal(metal.detal)'>{{  metal.detal ? metal.detal.name : 'Нет детали' }}</td>
						<td class='center'>{{ metal.kolvo_shipments }}</td>
						<td class='center link_img'>
							{{ returnDateShipments(metal?.detal?.shipments) }}
						</td> <!-- Дата готовности -->
						<td class='center'>
							<img src="@/assets/img/link.jpg" v-if='metal.detal' @click='returnShipmentsKolvo(metal.detal)' class='link_img' atl='Показать' />
						</td>
						<td class='center' id='parent'>
							<img src="@/assets/img/link.jpg"  v-if='metal.detal' @click='showParents(metal.detal)' class='link_img' atl='Показать' />
						</td> <!-- Принадлежность --> 
						<td class='params_td' v-if='showZagParam'>
							<TbodyZag :detal='metal.detal' />
						</td>
						<td v-else></td>
						<td>{{ metal?.detal?.mat_za_obj?.name || 'Нет заготовки' }}</td> <!-- Материал --> 
						<td :class='statusBeforeOperation(metal, showOperation(metal,  "before")) ? "center hover success_operation" : "center hover work_operation"'>
							<p class='last_column'>
								<span @click='openOperation(metal,  "before")'>{{ showOperation(metal,  "before") }}</span>
								<span v-if='showOperation(metal,  "before") != "Нет"'>Готово: {{ beforeOperationCount(metal) }}</span>
							</p>
						</td> <!-- Пред. операция --> 
						<td v-if='metal.kolvo_shipments - returnKolvoCreate(metal) == 0' class='success_operation center'>{{ 
							returnStatus(metal.kolvo_shipments, returnKolvoCreate(metal))}}</td>
						<td v-else-if='returnKolvoCreate(metal) > 0' class='process_operation center'>{{ 
							returnStatus(metal.kolvo_shipments, returnKolvoCreate(metal))}}</td><!-- Статус --> 
						<td v-else class='work_operation center'>{{ 
							returnStatus(metal.kolvo_shipments, returnKolvoCreate(metal))}}</td>
						<td class='center'>{{ returnKolvoCreate(metal) }}</td> <!-- Сделано шт. --> 
						<td class='center'>{{ returnFloor(metal.kolvo_shipments - returnKolvoCreate(metal)) }}</td> <!-- Осталось шт. -->
						<td v-if='!showNormTime'></td>
						<td class='center' v-if='showNormTime'>{{ getTime(metal).pt }}</td>
						<td class='center' v-if='showNormTime'>{{ getTime(metal).ht }}</td>
						<td class='center' v-if='showNormTime'>{{ getTime(metal).mt }}</td>
						<td class='center'>{{ manyIzdTime(metal, metal.kolvo_shipments)	}}</td>
						<td class='center'>{{ returnDateExist(metal) }}</td> <!-- Дата исполнения --> 
						<td class='center'>{{ responsible(metal) }}</td> <!-- Исполнитель --> 
						<td class='center'> {{ workingForMarks(metal, metal.marks) }} </td>
						<td class='center hover success_operation'
							@click='openOperation(metal,  "after")'>{{ showOperation(metal,  "after") }}</td>
						<td class='center' id='doc'>
							<img src="@/assets/img/link.jpg" @click='openDocuments(metal.operation_id)' class='link_img' atl='Показать' />
						</td>
						<td class='center' id='discription'>
							<img src="@/assets/img/link.jpg" @click='openDescription(metal.description)' class='link_img' atl='Показать' />
						</td>
						<td class='center hover' @click='addMark(metal)' id='mark'>
							<unicon name="pen" fill="black" width='20' />
						</td>
					</tr>
				</table>

				<div class="btn-control">
					<button class="btn-small" @click='shapeBid'>Сформировать заявку</button>
					<button class="btn-small" @click='printPage'>Печать</button>
					<button class="btn-small" @click='printPage'>Печать</button>
				</div>
			</div>
		</div>

		<div v-if='getMetaloworkings.length == 0' style='margin-top: 20px;'>
			Операций не найдено
		</div>
		<OpensFile 
      :parametrs='itemFiles' 
      v-if="itemFiles.length" 
      :key='keyWhenModalGenerateFileOpen'
		/>
		<DescriptionModal 
      v-if='description'
      :key='descriptionKey'
      :parametrs='description'
    />
		<CreateMark
			v-if='mark_data'
			:key='mark_key'
			:parametrs='mark_data'
			:type_izd='"det"'
			@unmount='unmount_marks'
		/>
		<ShipmentsModal 
      :shipments='shipments'
      v-if='shipments.length'
      :key='shipmentKey'
			:izd='izdForSchipment'
    />
		<ProductListModal
      v-if='productListForIzd'
      :key='keyParentsModal'
      :parametrs='productListForIzd'
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
import random from 'lodash';
import print from 'print-js';
import TbodyZag from './TableZag';
import PATH_TO_SERVER from '@/js/path';
import { 	afterAndBeforeOperation, 
					OperationTime,
					returnKolvoCreate,
					workingForMarks,
					returnShipmentsDate } from '@/js/operation';
import CreateMark from '@/components/Sclad/MarkModal';
import OpensFile from '@/components/FileBase/OpenFile';
import { 	showMessage, dateIncrementHors } from '@/js/';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import DetalModal from '@/components/BaseDetal/DetalModal';
import DescriptionModal from '@/components/DescriptionModal';
import ShipmentsModal from  '@/components/Sclad/ShipmentsToIzed';
import ProductListModal from '@/components/BaseProduct/ProductListModal';
import ShipmentList from '@/components/IssueShipment/ShipmentsListTable';

export default {
	props: ['type_operation_id', 'name_operaiton'],
	data() {
		return {
			loader: true,

			itemFiles: [],
      keyWhenModalGenerateFileOpen: random(1, 999),
			descriptionKey: random(1, 999),
      description: '',

			mark_key: random(1, 999),
			mark_data: null,
			shipmentKey: random(1, 999),
			shipments: [], 
			productListForIzd: null, 
			keyParentsModal: random(1, 999),

			detalModalKey: random(1, 999),
			parametrs_detal: false,

			sortZag: true,
			showZagParam: false,
			showNormTime: false,

			izdForSchipment: null,
			beforesOperations: [],

			statusOperation: [
				'Все', 'В работе', 'Выполняется', 'Готово'
			],
			selectStatusOperation: 'Все'
		}
	},
	computed: {
		...mapGetters([
			'getMetaloworkings',
			'getUsers',
			'getShipments',
		])
	},
	components: {
		OpensFile,
		TbodyZag,
		DescriptionModal,
		DetalModal,
		CreateMark,
		ShipmentsModal,
		ProductListModal,
		ShipmentList
	},
	watch: {
		sortZag: function(val) {
			this.sortMatallZag(val);
		},
		selectStatusOperation: function(val) {
			this.sortMaterialStatus(val);
		}
	},
	methods: {
		...mapActions([
			'fetchAllMetalloworkingTypeOperation',
			'fetchOneOperationById',
			'getOneDetal',
			'getAllUsers',
			'fetchMetalloworkShapeBid',
			'fetchMarksByOperation',
			'fetchAllShipmentsMetaloworking'
		]),
		...mapMutations([
			'sortMatallZag',
			'sortMaterialStatus',
			'filterMetaloworkingByShipments'
		]),
		unmount_marks(res) {
			if (res == 'closed') return false
			if (res) {
				this.fetchAllMetalloworkingTypeOperation(this.type_operation_id)
				showMessage('', 'Отметка о выполнении успешно создана', 's');
			}	else 
					showMessage('', 'Произошла ошибка при обработки запроса', 'e');
		},
		returnDateShipments (shipments, znach_return = 1) {
			return returnShipmentsDate(shipments, znach_return);
    },
		toSetOrders(shipments) {
      if(shipments.detals && shipments.detals.length)
        this.filterMetaloworkingByShipments(shipments.detals)
    },
		// Формируем заявку в архиве
		async shapeBid() {
			const data = this.getMetaloworkings.map(el => { 
				return {
					name: el?.detal?.name || null, 
					id: el?.detal?.id || null,
					kilvo: el.kolvo_shipments || 0
				}
			});

			showMessage('', 'Обработка началась, дождитесь результата...', '');

			const res = await this.fetchMetalloworkShapeBid(data);
				if(!res || !res.pathZip) return showMessage('', 'Не удалось сформировать заявку', 'w');
				showMessage('', 'Заявка сформирована. Дождитесь загрузки.', 's');
				window.open(`${PATH_TO_SERVER}/${res.pathZip}`, '_blank');
		},
		printPage() {
			this.showZagParam = true;
			this.showNormTime = true;
      print({
        printable: 'tablebody', 
        type: 'html',
        targetStyles: ['*'],
        documentTitle: "Операция: " + this.$props.name_operaiton,
        ignoreElements: ['parent', 'doc', 'discription', 'mark'],
        font_size: '10pt'
      });
    },  
		openDetal(detal) {
			if (!detal || !detal.id) return showMessage('', 'Нет детали!', 'w');
			this.parametrs_detal = detal.id;
      this.detalModalKey = random(1, 999);
		},
		showOperation(metal, type) {
			if (!metal.tech_process || !metal.operation_id) return 'Нет операций';
			return afterAndBeforeOperation(
				metal.tech_process, metal.operation_id, type).full_name
		},
		openOperation(metal, type) {
			if (!type) return false;
			if (!metal.tech_process || !metal.operation_id) return showMessage('', 'Нет операций', 'w');
			const operation = afterAndBeforeOperation(metal.tech_process, metal.operation_id, type);
			if (operation.full_name == 'Нет' || !operation.tOperationId) return showMessage('', 'Нет операций', 'w');
			window.open(`${window.location.origin}/metalloworking/operation-metall/${operation.tOperationId}/${operation.full_name}`);
		},		
		openDocuments(id) {
			if(!id) return false
      this.fetchOneOperationById(id).then(res => {
        if(res.documents && res.documents.length) {
          this.keyWhenModalGenerateFileOpen = random(1, 999)
          this.itemFiles = res.documents
        } else showMessage('', 'Документов нет', 'w');
      })
    },
		openDescription(description) {
      this.descriptionKey = random(1, 999)
      this.description = description
    },
		getTime(operation) {
			if (!operation) return showMessage('', 'Нет операций', 'w');
			const ot = new OperationTime(operation);
			return ot;
		},
		manyIzdTime(operation, kol_create_detal) {
			if (!operation) return showMessage('', 'Нет операций', 'w');
			const ot = new OperationTime(operation, kol_create_detal);
			return ot.count;
		},
		dateIncrementHors(date = new Date().toLocaleDateString("ru-RU"), hrs) {
      const dat = dateIncrementHors(date, hrs);
      return `${dat.day}.${dat.mount}.${dat.year}`;
    },
		returnStatus(kol, create) {
			if (kol - create <= 0) return "Готово";
			if (create) return "Выполняется";
			else return "В работе";
		},
		workingForMarks(operation, marks) {
			if (!operation) return showMessage('', 'Нет операций', 'w');
			return workingForMarks(operation, marks);
		},
		async showParents(izd, type) {
			const res = await this.getOneDetal(izd.id);
			this.productListForIzd = { products: res.products, type, id: izd.id };
			this.keyParentsModal = random(1, 999);
    },
		returnKolvoCreate(operation) {
			if (!operation) return showMessage('', 'Нет операций', 'w');
			return returnKolvoCreate(operation);
		},
		returnFloor(number) {
			return number < 0 ? 0 : number;
		},
		returnShipmentsKolvo(izd) {
			const shipments = izd.shipments;
			if (!shipments || shipments.length == 0) 
				return showMessage('', 'Нет заказов', 'w');
				
      this.shipmentKey = random(1, 999);
			this.izdForSchipment = {izd, type: 'detal'};
      this.shipments = shipments;
    },
		responsible(metal) {
			if(!metal.marks || !metal.marks.length) return '-';
			const mark = this.findMarks(metal.operation_id, metal.marks);
			if(!mark) return '-';

			const user_id = mark.user_id
			for(const user of this.getUsers) {
				if(user.id == user_id)
					return user.login;
			}
			return '-';
		},
		findMarks(operation_id, marks) {
			let find = null;
			for (const mark of marks) {
				if (operation_id == mark.oper_id) find = mark;
			}
			return find;
		},
		returnDateExist(metal) {
			if (!metal.marks || !metal.marks.length) return '-';
			const mark = this.findMarks(metal.operation_id, metal.marks);
			if (!mark) return '-';

			return mark.date_build;
		},
		addMark(metal) {
			this.mark_key = random(1, 999);
			this.mark_data = metal;
		},
		// return 1 из 13
		beforeOperationCount(metal) {
			const its = this.beforesOperations.filter(item => item.id == metal.id);
			if(!its[0]) return false;

			const str = `${its[0].beforeCreateCount} из ${metal.kolvo_shipments}`;
			return str;
		},
		// return true || false
		statusBeforeOperation(metal, before_name) {
			const its = this.beforesOperations.filter(item => item.id == metal.id);
			if (!its[0] || its[0].beforeName != before_name) return false;

			if (its[0].beforeCreateCount >= metal.kolvo_shipments) return true;
			return false;
		}
	},
	async mounted() {
		if (!this.$props.type_operation_id)
			return this.$router.back();

		this.loader = true;
    await this.fetchAllMetalloworkingTypeOperation(this.$props.type_operation_id);
		await this.getAllUsers(true);
		await this.fetchAllShipmentsMetaloworking({sort: undefined, light: true})

		for (const item of this.getMetaloworkings) {
			const newItem = { id: item.id, beforeCreateCount: 0, beforeName: '' };
			const beforeOperation = afterAndBeforeOperation(
				item.tech_process, item.operation_id, 'before');
			if (!beforeOperation || !beforeOperation.id) continue;
			// Получаем все марки для текузей операции
			const marks = await this.fetchMarksByOperation(beforeOperation.id);

			if (marks && marks.length) {
				for (const mark of marks) {
					newItem.beforeName = beforeOperation.full_name;
					newItem.beforeCreateCount += Number(mark.kol);
				}
			}  

			this.beforesOperations.push(newItem);
		}
		this.loader = false;
	}
}
</script>

<style scoped>
th {
  word-break: break-all;
}
.params_td {
	padding: 0px;
}
.header_block>p {
	margin: 5px;
}
.header_block label {
	margin: 0px;
	cursor: pointer;
	user-select: none;
}
.last_column {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.last_column>span:last-child {
	font-size: 12px;
	margin-top: 5px;
}
.last_column>span:first-child {
	font-size: 14px;
	font-weight: bold;
}
.p_select_header {
	display: flex;
	width: 400px;
	align-items: center;
}
.p_select_header>select {
	width: 100px;
}
.shipments_block {
	width: min-content;
	margin-right: 21px;
}
.body_container {
	display: flex;
}
</style>