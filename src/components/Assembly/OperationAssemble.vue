<template>
	<div >
		<h3>Операция {{ name_operaiton }} </h3>
		
		<div class="block header_block">
			<DatePicterRange 
				@unmount='unmount_date_picterRange'  
			/>
		</div>

		<div v-if='getAssembles.length'>
			<table id='tablebody'>
				<tr>
					<th>№</th>
					<th>Артикул СБ</th>
					<th>Наименование СБ</th>
					<th>Кол-во, шт</th>
					<th id='parent'>Принадлежность </th>
					<th class='work_operation'>Предыдущая операция </th>
					<th>Статус</th>
					<th>Сделано, шт</th>
					<th>Осталось, шт</th>
					<th>Норма времени на 1 шт</th>
					<th>Норма времени всего, ч</th>
					<th>Дата исполнения</th>
					<th>Исполнитель</th>
					<th class='success_operation'>Следующая операция</th>
					<th id='doc'>Документы</th>
					<th id='discription'>Примечание</th>
					<th id='mark'>Отметка</th>
				</tr>
				<tr 
					v-for='(ass, inx) of getAssembles'
					:key='ass'>
					<td>{{ inx = 1 }}</td>
					<td>{{ass.cbed ? ass.cbed.articl : 'Нет СБ'}}</td>
					<td>{{ ass.cbed ? ass.cbed.name : 'Нет СБ'}}</td>
					<td class='center'>{{ ass.kolvo_shipments }}</td>
					<td class='center' id='parent'>
						<img src="@/assets/img/link.jpg" v-if='ass.cbed' @click='showParents(ass.cbed)' class='link_img' atl='Показать' />
					</td>
					<td class='center hover work_operation'>{{ showOperation(ass,  "before") }}</td>
					<td :class='ass.kolvo_shipments - returnKolvoCreate(ass) <= 0  ? "success_operation" : "work_operation" ' class='center'>{{ 
						returnStatus(ass.kolvo_shipments, returnKolvoCreate(ass))}}</td>
					<td class='center'>{{ returnKolvoCreate(ass) }}</td>
					<td class='center'>{{ returnFloor(ass.kolvo_shipments - returnKolvoCreate(ass)) }}</td>
					<td class='center'>{{ oneIzdTime(ass) }}</td>
					<td class='center'>{{ manyIzdTime(ass, ass.kolvo_shipments) }}</td>
					<td class='center'>{{ dateIncrementHors(undefined, manyIzdTime(ass, ass.kolvo_shipments)) }} </td>
					<td class='center'>{{ ass.cbed ? responsible(ass.cbed) : 'Нет СБ' }}</td>
					<td class='center hover success_operation'>{{ showOperation(ass,  "after") }}</td>
					<td class='center' id='doc'>
						<img src="@/assets/img/link.jpg" @click='openDocuments(ass.name)' class='link_img' atl='Показать' />
					</td>
					<td class='center' id='discription'>
						<img src="@/assets/img/link.jpg" @click='openDescription(ass.description)' class='link_img' atl='Показать' />
					</td>
					<td class='center hover' @click='addMark(ass)' id='mark'>
						<unicon name="pen" fill="black" width='20' />
					</td>
				</tr>
				
			</table>

			<div class="btn-control">
				<button class="btn-small" @click='printPage'>Печать</button>
				<button class="btn-small">Сбросить все фильтры</button>
			</div>
		</div>

		<div v-if='getAssembles.length == 0' style='margin-top: 20px;'>
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
			:type_izd='"cb"'
			@unmount='unmount_marks'
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
import OpensFile from '@/components/FileBase/OpenFile';
import CreateMark from '@/components/Sclad/MarkModal'; 
import DatePicterRange from '@/components/DatePicterRange';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DescriptionModal from '@/components/DescriptionModal';
import ProductListModal from '@/components/BaseProduct/ProductListModal';
import { afterAndBeforeOperation, OperationTime, returnKolvoCreate } from '@/js/operation';

export default {
	data() {
		return {
			loader: false,
			name_operaiton: null,
			route_path: '',

			itemFiles: [],
      keyWhenModalGenerateFileOpen: random(1, 999),
			descriptionKey: random(1, 999),
      description: '',

			mark_key: random(1, 999),
			mark_data: null,

			type_operation_id: null,
			productListForIzd: null,
			keyParentsModal: random(1, 999),
		}
	},
	computed: mapGetters([
		'getAssembles', 
		'getUsers'
	]),
	beforeUnmount() {
		this.delitPathNavigate(this.route_path ? this.route_path : this.$route.path)
	},
	components: {DatePicterRange, OpensFile, DescriptionModal, CreateMark, ProductListModal},
	methods: {
		...mapActions([
			'fetchAllAssembleTypeOperation',
			'fetchOneOperationById',
			'getAllUsers',
			'getOneCbEdById'
		]),
		...mapMutations([
			'delitPathNavigate', 
		]),
		unmount_date_picterRange(val) {
      console.log(val)
    }, 
		unmount_marks(res) {
			if(res == 'closed') return false
			if(res) {
				this.fetchAllAssembleTypeOperation(this.type_operation_id)
				showMessage('', 'Отметка о выполнении успешно создана', 's')
			} else 
					showMessage('', 'Произошла ошибка при обработки запроса', 'e')
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
		showOperation(ass, type) {
			if(!ass.tech_process || !ass.operation_id) return 'Нет операций'
			return afterAndBeforeOperation(
				ass.tech_process, ass.operation_id, type).full_name
		},
		openDocuments(id) {
			if(!id) return false
      this.fetchOneOperationById(id).then(res => {
        if(res.documents && res.documents.length) {
          this.keyWhenModalGenerateFileOpen = random(1, 999)
          this.itemFiles = res.documents
        } else showMessage('', 'Документов нет', 'w')
      })
    },
		returnStatus(kol, create) {
			return kol - create <= 0 ? "Готово" : "В работе"
		},
		returnKolvoCreate(operation) {
			if(!operation) return showMessage('', 'Нет операций', 'w')
			return returnKolvoCreate(operation)
		},
		openDescription(description) {
      this.descriptionKey = random(1, 999)
      this.description = description
    },
		oneIzdTime(operation) {
			if(!operation) return showMessage('', 'Нет операций', 'w')
			let ot = new OperationTime(operation) 
			return ot.count
		},
		returnFloor(number) {
			return number < 0 ? 0 : number
		},
		manyIzdTime(operation, kol_create_detal) {
			if(!operation) return showMessage('', 'Нет операций', 'w')
			let ot = new OperationTime(operation, kol_create_detal)
			return ot.count
		},
		dateIncrementHors(date = new Date().toLocaleDateString("ru-RU"), hrs) {
      let dat = dateIncrementHors(date, hrs)
      return `${dat.day}.${dat.mount}.${dat.year}`
    },
		responsible(cbed) {
			let user_id = cbed.responsibleId
			for(let user of this.getUsers) {
				if(user.id == user_id)
					return user.login
			}
		},
		showParents(izd, type) {
			this.getOneCbEdById(izd.id).then(res => {
				this.productListForIzd = { products: res.products, type, id: izd.id }
				this.keyParentsModal = random(1, 999)
			})
    },
		addMark(ass) {
			this.mark_key = random(1, 999)
			this.mark_data = ass
		}
	},
	async mounted() {
		this.route_path = this.$route.path
		this.type_operation_id = this.$route.params.operation
		if(!this.type_operation_id)
			return this.$router.back()

		this.loader = true
    await this.fetchAllAssembleTypeOperation(this.type_operation_id)
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