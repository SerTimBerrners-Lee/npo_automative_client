<template>
	<div>
		<div class="block header_block">
			<p>
				<label for="sortZag">Сортировать по заготовки</label>
				<input type="checkbox" id="sortZag" v-model='sortZag'>
			</p>
		</div>

		<div v-if='getMetaloworkings.length'>
			<table id='tablebody'>
				<tr>
					<th>№</th>
					<th>Артикул Детали</th>
					<th>Наименование Детали</th>
					<th>Кол-во, шт</th>
					<th>Срок отгрузки изд.</th>
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
					<th>Норма времени (подготовительное), шт</th>
					<th>Норма времени (вспомогательное), шт</th>
					<th>Норма времени (основное), шт</th>
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
					v-for='(meatl, inx) of getMetaloworkings'
					:key='meatl'
					>
					<td class='center'>{{ inx + 1 }}</td>
					<td>{{ meatl.detal ? meatl.detal.articl : 'Нет детали'}}</td>
					<td
						class='td-row' 
						@click='openDetal(meatl.detal)'>{{  meatl.detal ? meatl.detal.name : 'Нет детали' }}</td>
					<td class='center'>{{ meatl.kolvo_shipments }}</td>
					<td class='center'>
              <img src="@/assets/img/link.jpg" v-if='meatl.detal' @click='returnShipmentsKolvo(meatl.detal.shipments)' class='link_img' atl='Показать' />
            </td>
					<td class='center' id='parent'>
						<img src="@/assets/img/link.jpg"  v-if='meatl.detal' @click='showParents(meatl.detal)' class='link_img' atl='Показать' />
					</td> <!-- Принадлежность --> 
					<td class='params_td' v-if='showZagParam'>
						<tbody v-if='searchParams(meatl.detal)'>
							<tr v-if='meatl.detal?.lengt'>
								<td>Длина</td>
								<td>{{ meatl.detal?.lengt }}</td>
							</tr>
							<tr v-if='meatl.detal?.width'>
								<td>Ширина</td>
								<td>{{ meatl.detal?.width }}</td>
							</tr>
							<tr v-if='meatl.detal?.height'>
								<td>Высота</td>
								<td>{{ meatl.detal?.height }}</td>
							</tr>
							<tr v-if='meatl.detal?.wallThickness'>
								<td>Толщина стенки</td>
								<td>{{ meatl.detal?.wallThickness }}</td>
							</tr>
							<tr v-if='meatl.detal?.diametr'>
								<td>Наружный Диаметр</td>
								<td>{{ meatl.detal?.diametr }}</td>
							</tr>
							<tr v-if='meatl.detal?.thickness'>
								<td>Толщина</td>
								<td>{{ meatl.detal?.thickness }}</td>
							</tr>
							<tr v-if='meatl.detal?.areaCS'>
								<td>Площадь сечения</td>
								<td>{{ meatl.detal?.areaCS }}</td>
							</tr>
						</tbody>
						<p v-else class='center'>-</p>
					</td>
					<td v-else></td>
					<td>{{ meatl?.detal?.mat_za_obj?.name || 'Нет заготовки' }}</td> <!-- Материал --> 
					<td class='center hover work_operation'>{{ showOperation(meatl,  "before") }}</td> <!-- Пред. операция --> 
					<td v-if='meatl.kolvo_shipments - returnKolvoCreate(meatl) <= 0 ' class='success_operation center'>{{ 
						returnStatus(meatl.kolvo_shipments, returnKolvoCreate(meatl))}}</td>
					<td v-if='returnKolvoCreate(meatl) == 0' class='work_operation center'>{{ 
						returnStatus(meatl.kolvo_shipments, returnKolvoCreate(meatl))}}</td>
					<td v-else class='process_operation center'>{{ 
						returnStatus(meatl.kolvo_shipments, returnKolvoCreate(meatl))}}</td>
					<td class='center'>{{ returnKolvoCreate(meatl) }}</td> <!-- Сделано шт. --> 
					<td class='center'>{{ returnFloor(meatl.kolvo_shipments - returnKolvoCreate(meatl)) }}</td>
					<td class='center'>{{ getTime(meatl).pt }}</td>
					<td class='center'>{{ getTime(meatl).ht }}</td>
					<td class='center'>{{ getTime(meatl).mt }}</td>
					<td class='center'>{{ manyIzdTime(meatl, meatl.kolvo_shipments)	}}</td>
					<td class='center'>{{ returnDateExist(meatl) }}</td> <!-- Дата исполнения --> 
					<td class='center'>{{ responsible(meatl) }}</td> <!-- Исполнитель --> 
					<td class='center'> {{ workingForMarks(meatl, meatl.marks) }} </td>
					<td class='center hover success_operation'>{{ showOperation(meatl,  "after") }}</td>
					<td class='center' id='doc'>
						<img src="@/assets/img/link.jpg" @click='openDocuments(meatl.operation_id)' class='link_img' atl='Показать' />
					</td>
					<td class='center' id='discription'>
						<img src="@/assets/img/link.jpg" @click='openDescription(meatl.description)' class='link_img' atl='Показать' />
					</td>
					<td class='center hover' @click='addMark(meatl)' id='mark'>
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

		<div v-if='getMetaloworkings.length == 0' style='margin-top: 20px;'>
			Операций не найдено
		</div>
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
import { showMessage } from '@/js/';
import { dateIncrementHors } from '@/js/';
import PATH_TO_SERVER from '@/js/path.js';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import { 	afterAndBeforeOperation, 
					OperationTime,
					returnKolvoCreate,
					workingForMarks } from '@/js/operation.js';
import CreateMark from '@/components/sclad/mark-modal.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import DetalModal from '@/components/basedetal/detal-modal.vue';
import DescriptionModal from '@/components/description-modal.vue';
import ShipmentsModal from  '@/components/sclad/shipments-to-ized.vue';
import ProductListModal from '@/components/baseproduct/product-list-modal.vue';
export default {
	props: ['type_operation_id', 'name_operaiton'],
	data() {
		return {
			loader: false,

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

			titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,

			sortZag: true,
			showZagParam: false,
		}
	},
	computed: mapGetters(['getMetaloworkings', 'getUsers']),
	components: {
		OpensFile,
		DescriptionModal,
		DetalModal,
		CreateMark,
		ShipmentsModal,
		ProductListModal,
	},
	watch: {
		sortZag: function(val) {
			console.log(val);
			this.sortMatallZag(val);
		}
	},
	methods: {
		...mapActions([
			'fetchAllMetalloworkingTypeOperation',
			'fetchOneOperationById',
			'getOneDetal',
			'getAllUsers',
			'fetchMetalloworkShapeBid',
		]),
		...mapMutations(['sortMatallZag']),
		unmount_marks(res) {
			if(res == 'closed') return false
			if(res) {
				this.fetchAllMetalloworkingTypeOperation(this.type_operation_id)
				showMessage('', 'Отметка о выполнении успешно создана', 's', this)
			}	else 
					showMessage('', 'Произошла ошибка при обработки запроса', 'e', this)
		},
		// Формируем заявку в архиве
		shapeBid() {
			const data = this.getMetaloworkings.map(el => { 
				return {
					name: el?.detal?.name || null, 
					id: el?.detal?.id || null,
					kilvo: el.kolvo_shipments || 0
				}
			});

			showMessage('', 'Обработка началась, дождитесь результата...', '', this);

			this.fetchMetalloworkShapeBid(data).then(res => {
				if(!res || !res.pathZip) return showMessage('', 'Не удалось сформировать заявку', 'w', this);
				showMessage('', 'Заявка сформирована. Дождитесь загрузки.', 's', this);
				window.open(`${PATH_TO_SERVER}/${res.pathZip}`, '_blank');
			})
		},
		printPage() {
			this.showZagParam = true;
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
			if(!detal || !detal.id) return showMessage('', 'Нет детали!', 'w', this);
			this.parametrs_detal = detal.id;
      this.detalModalKey = random(1, 999);
		},
		showOperation(metal, type) {
			if(!metal.tech_process || !metal.operation_id) return 'Нет операций';
			return afterAndBeforeOperation(
				metal.tech_process, metal.operation_id, type).full_name
		},
		openDocuments(id) {
			if(!id) return false
      this.fetchOneOperationById(id).then(res => {
        if(res.documents && res.documents.length) {
          this.keyWhenModalGenerateFileOpen = random(1, 999)
          this.itemFiles = res.documents
        } else showMessage('', 'Документов нет', 'w', this)
      })
    },
		openDescription(description) {
      this.descriptionKey = random(1, 999)
      this.description = description
    },
		getTime(operation) {
			if(!operation) return showMessage('', 'Нет операций', 'w', this)
			let ot = new OperationTime(operation)
			return ot
		},
		manyIzdTime(operation, kol_create_detal) {
			if(!operation) return showMessage('', 'Нет операций', 'w', this)
			let ot = new OperationTime(operation, kol_create_detal)
			return ot.count
		},
		dateIncrementHors(date = new Date().toLocaleDateString("ru-RU"), hrs) {
      let dat = dateIncrementHors(date, hrs)
      return `${dat.day}.${dat.mount}.${dat.year}`
    },
		returnStatus(kol, create) {
			return kol - create <= 0 ? "Готово" : "В работе"
		},
		workingForMarks(operation, marks) {
			if(!operation) return showMessage('', 'Нет операций', 'w', this)
			return workingForMarks(operation, marks)
		},
		showParents(izd, type) {
			this.getOneDetal(izd.id).then(res => {
				this.productListForIzd = { products: res.products, type, id: izd.id }
				this.keyParentsModal = random(1, 999)
			})
    },
		returnKolvoCreate(operation) {
			if(!operation) return showMessage('', 'Нет операций', 'w', this)
			return returnKolvoCreate(operation)
		},
		returnFloor(number) {
			return number < 0 ? 0 : number
		},
		returnShipmentsKolvo(shipments) {
			if(!shipments || shipments.length == 0) 
				return showMessage('', 'Нет прикрепленных заказов', 'w', this)
      this.shipmentKey = random(1, 999)
      this.shipments = shipments
    },
		responsible(metal) {
			if(!metal.marks || !metal.marks.length) return '-';
			const mark = this.findMarks(metal.operation_id, metal.marks);
			if(!mark) return '-';

			let user_id = mark.user_id
			for(let user of this.getUsers) {
				if(user.id == user_id)
					return user.login;
			}
			return '-';
		},
		findMarks(operation_id, marks) {
			let find = null;
			for(const mark of marks) {
				if(operation_id == mark.oper_id) find = mark;
			}

			return find;
		},
		returnDateExist(metal) {
			if(!metal.marks || !metal.marks.length) return '-';
			const mark = this.findMarks(metal.operation_id, metal.marks);
			if(!mark) return '-';

			return mark.date_build;
		},
		addMark(metal) {
			this.mark_key = random(1, 999)
			this.mark_data = metal
		},
		searchParams(det) {
			if(!det) return false;

			if(!det?.lengt && !det?.width && 
				!det?.height && !det?.wallThickness &&
				!det?.diametr && !det?.thickness && 
				!det?.areaCS) return false;

			return true;
		}
	},
	async mounted() {
		if(!this.$props.type_operation_id)
			return this.$router.back()

		this.loader = true
    await this.fetchAllMetalloworkingTypeOperation(this.$props.type_operation_id)
		await this.getAllUsers(true)
		this.loader = false
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
</style>