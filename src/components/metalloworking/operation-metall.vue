<template>
	<div >
		<h3>Операция {{ name_operaiton }} </h3>

		<div class="block header_block">
			<DatePicterRange 
				@unmount='unmount_date_picterRange'  
			/>
		</div>

		<div v-if='getMetaloworkings.length'>
			<table>
				<tr>
					<th>№</th>
					<th>Артикул Детали</th>
					<th>Наименование Детали</th>
					<th>Кол-во, шт</th>
					<th>Срок отгрузки изд.</th>
					<th>Заводской № изд.</th> 
					<th>Наименование изделия </th>
					<th>Габариты заготовки, мм</th>
					<th>Тип заготовки</th>
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
					<th>Документы</th>
					<th>Примечание</th>
					<th>Отметка</th>
				</tr>
				<tr 
					v-for='(meatl, inx) of getMetaloworkings'
					:key='meatl'>
					<td>{{ inx = 1 }}</td>
					<td>{{ meatl.detal.articl }}</td>
					<td>{{ meatl.detal.name }}</td>
					<td class='center'>{{ meatl.kolvo_all }}</td>
					<td class='center'>{{ meatl.shipments.date_shipments }}</td>
					<td class='center'>{{ meatl.product ? meatl.product.fabricNumber : '' }}</td>
					<td class='center'>{{ meatl.product ? meatl.product.name : '' }}</td>
					<td class='center'>{{ meatl.detal.DxL }}</td>
					<td class='center'>{{ meatl.type_material.name }}</td>
					<td @click.once='e => showOperation(meatl, "before",  e.target)'
						class='center hover work_operation'>показать</td>
					<td :class='meatl.status == "Готово" ? "success_operation" : "work_operation" '>{{ meatl.status }}</td>
					<td class='center'>{{ meatl.kolvo_create_in_operation }}</td>
					<td class='center'>{{ meatl.kolvo_all - meatl.kolvo_create_in_operation }}</td>
					<td class='center'>{{ getTime(meatl.operation).pt }}</td>
					<td class='center'>{{ getTime(meatl.operation).ht }}</td>
					<td class='center'>{{ getTime(meatl.operation).mt }}</td>
					<td class='center'>{{ manyIzdTime(meatl.operation, meatl.kolvo_all)	}}</td>
					<td class='center'>
						{{ 
							dateIncrementHors(undefined, 
							manyIzdTime(meatl.operation, meatl.kolvo_all))
						}} 
					</td> 
					<td class='center'>{{ responsible(meatl.detal) }}</td>
					<td class='center'> {{ manyIzdTime(meatl.operation, meatl.kolvo_create_in_operation) }} </td>
					<td @click.once='e => showOperation(meatl,  "after", e.target)'
						class='center hover success_operation'>показать</td>
					<td class='center'>
						<img src="@/assets/img/link.jpg" @click='openDocuments(meatl.operation.id)' class='link_img' atl='Показать' />
					</td>
					<td class='center'>
						<img src="@/assets/img/link.jpg" @click='openDescription(meatl.operation.description)' class='link_img' atl='Показать' />
					</td>
					<td class='center hover' @click='addMark(meatl)' >
						<unicon name="pen" fill="black" width='20' />
					</td>
				</tr>
			</table>

			<div class="btn-control">
				<button class="btn-small">Печать</button>
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
      v-if='showInformPanel'
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

		<Loader v-if='loader' />
	</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'																;
import random from 'lodash'																								;
import DatePicterRange from '@/components/date-picter-range.vue'					;
import OpensFile from '@/components/filebase/openfile.vue'								;
import { showMessage } from '@/js/'																				;
import InformFolder from '@/components/InformFolder.vue'									;
import DescriptionModal from '@/components/description-modal.vue'					;
import { dateIncrementHors } from '@/js/'																	;
import CreateMark from '@/components/sclad/mark-modal.vue'								; 
import { afterAndBeforeOperation, OperationTime } from '@/js/operation.js';
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

			titleMessage: '',
      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: 0,
			type_operation_id: null
		}
	},
	computed: mapGetters(['getMetaloworkings', 'getTypeOperations', 'getUsers']),
	components: {DatePicterRange, OpensFile, InformFolder, DescriptionModal, CreateMark},
	methods: {
		...mapActions([
			'fetchAllMetalloworkingTypeOperation', 
			'getAllTypeOperations', 
			'getAllProductByIdLight',
			'fetchOneOperationById',
			'getAllUsers']),
		unmount_date_picterRange(val) {
      console.log(val)
    },
		unmount_marks(res) {
			if(res == 'closed') return false
			if(res) {
				this.fetchAllMetalloworkingTypeOperation(this.type_operation_id)
				showMessage('', 'Отметка о выполнении успешно создана', 's', this)
			}
				else 
					showMessage('', 'Произошла ошибка при обработки запроса', 'e', this)
		},
		showOperation(meatl, type, e) {
			afterAndBeforeOperation(
				meatl.tp_id, 
				meatl.operation_id, 
				type).then(res => e.innerText = res.full_name)
		},
		openDocuments(id) {
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
			let ot = new OperationTime(operation)
			return ot
		},
		manyIzdTime(operation, kol_create_detal) {
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
		addMark(ass) {
			this.mark_key = random(1, 999)
			this.mark_data = ass
		}
	},
	async mounted() {
		this.type_operation_id = this.$route.params.operation
		if(!this.type_operation_id)
			this.$router.back()

		this.loader = true
    await this.fetchAllMetalloworkingTypeOperation(this.type_operation_id) // Получаем металлообработку по операциям
		await this.getAllTypeOperations()
		await this.getAllUsers(true)

		console.log(this.getMetaloworkings)

		for(let to of this.getTypeOperations) {
			if(to.id == this.type_operation_id) 
				this.name_operaiton = to.name
		}
    this.loader = false
	}
}
</script>

<style scoped>

</style>