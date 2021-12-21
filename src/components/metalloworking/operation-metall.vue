<template>
	<div >
		<h3>Операция {{ name_operaiton }} </h3>

		<div class="block header_block">
			<DatePicterRange 
				@unmount='unmount_date_picterRange'   
			/>
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
					<th>Габариты заготовки, мм</th>
					<th>Материал</th>
					<th class='work_operation'>Предыдущая операция </th>
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
					<td>{{ inx + 1 }}</td>
					<td>{{ meatl.detal ? meatl.detal.articl : 'Нет детали'}}</td>
					<td>{{  meatl.detal ? meatl.detal.name : 'Нет детали' }}</td>
					<td class='center'>{{ meatl.kolvo_shipments }}</td>
					<td class='center'>
              <img src="@/assets/img/link.jpg" v-if='meatl.detal' @click='returnShipmentsKolvo(meatl.detal.shipments)' class='link_img' atl='Показать' />
            </td>
					<td class='center' id='parent'>
						<img src="@/assets/img/link.jpg"  v-if='meatl.detal' @click='showParents(meatl.detal)' class='link_img' atl='Показать' />
					</td>
					<td class='center'>{{ meatl.detal ? meatl.detal.DxL : 'Нет детали' }}</td>
					<td>{{ metalowork?.detal?.mat_za_obj?.name || 'Нет заготовки' }}</td>
					<td class='center hover work_operation'>{{ showOperation(meatl,  "before") }}</td>
					<td :class='meatl.kolvo_shipments - returnKolvoCreate(meatl) <= 0  ? "success_operation" : "work_operation" ' class='center'>{{ 
						returnStatus(meatl.kolvo_shipments, returnKolvoCreate(meatl))}}</td>
					<td class='center'>{{ returnKolvoCreate(meatl) }}</td>
					<td class='center'>{{ returnFloor(meatl.kolvo_shipments - returnKolvoCreate(meatl)) }}</td>
					<td class='center'>{{ getTime(meatl).pt }}</td>
					<td class='center'>{{ getTime(meatl).ht }}</td>
					<td class='center'>{{ getTime(meatl).mt }}</td>
					<td class='center'>{{ manyIzdTime(meatl, meatl.kolvo_shipments)	}}</td>
					<td class='center'>
						{{ 
							dateIncrementHors(undefined, 
							manyIzdTime(meatl, meatl.kolvo_shipments))
						}} 
					</td> 
					<td class='center'>{{ meatl.detal ? responsible(meatl.detal) : "Нет детали" }}</td>
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
				<button class="btn-small" @click='printPage'>Печать</button>
				<button class="btn-small">Сбросить все фильтры</button>
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

		<Loader v-if='loader' />
	</div>
</template>

<script>
import random from 'lodash';
import print from 'print-js';
import { showMessage } from '@/js/';
import { dateIncrementHors } from '@/js/';
import {mapGetters, mapActions} from 'vuex';
import { 	afterAndBeforeOperation, 
					OperationTime, 
					returnKolvoCreate, 
					workingForMarks } from '@/js/operation.js';
import CreateMark from '@/components/sclad/mark-modal.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import DatePicterRange from '@/components/date-picter-range.vue';
import DescriptionModal from '@/components/description-modal.vue';
import ShipmentsModal from  '@/components/sclad/shipments-to-ized.vue';
import ProductListModal from '@/components/baseproduct/product-list-modal.vue';
export default {
	data() {
		return {
			loader: false,
			name_operaiton: null,

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

			titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,
			type_operation_id: null,
			route_path: '',
		}
	},
	computed: mapGetters(['getMetaloworkings', 'getUsers']),
	components: {
		DatePicterRange, 
		OpensFile, 
		DescriptionModal, CreateMark, 
		ShipmentsModal, 
		ProductListModal
	},
	methods: {
		...mapActions([
			'fetchAllMetalloworkingTypeOperation',
			'fetchOneOperationById',
			'getOneDetal',
			'getAllUsers']),
		unmount_date_picterRange(val) {
      console.log(val)
    },
		unmount_marks(res) {
			if(res == 'closed') return false
			if(res) {
				this.fetchAllMetalloworkingTypeOperation(this.type_operation_id)
				showMessage('', 'Отметка о выполнении успешно создана', 's', this)
			}	else 
					showMessage('', 'Произошла ошибка при обработки запроса', 'e', this)
		},
		printPage() {
      print({
        printable: 'tablebody', 
        type: 'html',
        targetStyles: ['*'],
        documentTitle: "Операция: " + this.name_operaiton,
        ignoreElements: ['parent', 'doc', 'discription', 'mark'],
        font_size: '10pt'
      })
    },   
		showOperation(metal, type) {
			if(!metal.tech_process || !metal.operation_id) return 'Нет операций'
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
		responsible(detal) {
			let user_id = detal.responsibleId
			for(let user of this.getUsers) {
				if(user.id == user_id)
					return user.login
			}
		},
		addMark(metal) {
			this.mark_key = random(1, 999)
			this.mark_data = metal
		}
	},
	async mounted() {
		this.route_path = this.$route.path
		this.type_operation_id = this.$route.params.operation
		if(!this.type_operation_id)
			return this.$router.back()

		this.loader = true
    await this.fetchAllMetalloworkingTypeOperation(this.type_operation_id)
		await this.getAllUsers(true)
		this.name_operaiton = this.$route.params.name_operation
    this.loader = false
	}
}
</script>

<style scoped>
th {
  word-break: break-all;
}
</style>