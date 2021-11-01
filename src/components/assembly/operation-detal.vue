<template>
	<div >
		<h3>Операция {{ name_operaiton }} </h3>

		<div class="block header_block">
        <DatePicterRange 
          @unmount='unmount_date_picterRange'  
        />
      </div>

		<div v-if='getAssembles.length'>
			<table>
				<tr>
					<th>№</th>
					<th>Артикул СБ</th>
					<th>Наименование СБ</th>
					<th>Кол-во, шт</th>
					<th>Срок отгрузки изд.</th>
					<th>Заводской № изд.</th>
					<th>Наименование изделия </th>
					<th class='work_operation'>Предыдущая операция </th>
					<th>Статус</th>
					<th>Сделано, шт</th>
					<th>Осталось, шт</th>
					<th>Норма времени на 1 шт</th>
					<th>Норма времени всего, ч</th>
					<th>Дата исполнения</th>
					<th>Исполнитель</th>
					<th class='success_operation'>Следующая операция</th>
					<th>Документы</th>
					<th>Примечание</th>
					<th>Отметка</th>
				</tr>
				<tr 
					v-for='(ass, inx) of getAssembles'
					:key='ass'>
					<td>{{ inx = 1 }}</td>
					<td>{{ ass.cbed.articl }}</td>
					<td>{{ ass.cbed.name }}</td>
					<td class='center'>{{ ass.kolvo_all }}</td>
					<td class='center'>{{ ass.shipments[0].date_shipments }}</td>
					<td @click.once='e => getProduct(ass.shipments, "number", e.target)'
						class='center hover'>показать</td>
					<td @click.once='e => getProduct(ass.shipments, "name", e.target)'
						class='center hover'>показать</td>
					<td @click.once='e => showOperation(ass, "before",  e.target)'
						class='center hover work_operation'>показать</td>
					<td>{{ ass.status }}</td>
					<td class='center'>{{ ass.kolvo_create }}</td>
					<td class='center'>{{ ass.kolvo_all - ass.kolvo_create }}</td>
					<td class='center'>{{ getTime(ass.operation).pt + getTime(ass.operation).t }}</td>
					<td class='center'>{{ getTime(ass.operation).pt + (getTime(ass.operation).t * ass.kolvo_all) }}</td>
					<td class='center'>{{ dateIncrementHors(undefined, (getTime(ass.operation).pt + (getTime(ass.operation).t * ass.kolvo_all))) }} </td>
					<td class='center'>{{ responsible(ass.cbed) }}</td>
					<td @click.once='e => showOperation(ass,  "after", e.target)'
						class='center hover success_operation'>показать</td>
					<td class='center'>
						<img src="@/assets/img/link.jpg" @click='openDocuments(ass.operation.id)' class='link_img' atl='Показать' />
					</td>
					<td class='center'>
						<img src="@/assets/img/link.jpg" @click='openDescription(ass.operation.description)' class='link_img' atl='Показать' />
					</td>
					<td class='center hover' @click='addMark(ass)' >
						<unicon name="pen" fill="black" width='20' />
					</td>
				</tr>
				<tr v-for='(ass, inx) of getAssembles' :key='ass'>
					<td>{{ inx + 1}}</td>
				</tr>
			</table>

			<div class="btn-control">
				<button class="btn-small">Печать</button>
				<button class="btn-small">Сбросить все фильтры</button>
			</div>
		</div>

		<div v-if='getAssembles.length == 0'>
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
			:type='"cb"'
		/>

		<Loader v-if='loader' />
	</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import random from 'lodash';
import DatePicterRange from '@/components/date-picter-range.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import { showMessage } from '@/js/';
import InformFolder from '@/components/InformFolder.vue';
import DescriptionModal from '@/components/description-modal.vue';
import { dateIncrementHors } from '@/js/';
import CreateMark from '@/components/sclad/mark-modal.vue'; 
import { afterAndBeforeOperation } from '@/js/operation.js';
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

		}
	},
	computed: mapGetters(['getAssembles', 'getTypeOperations', 'getUsers']),
	components: {DatePicterRange, OpensFile, InformFolder, DescriptionModal, CreateMark},
	methods: {
		...mapActions([
			'fetchAllAssembleTypeOperation', 
			'getAllTypeOperations', 
			'getAllProductByIdLight',
			'fetchOneOperationById',
			'getAllUsers']),
		unmount_date_picterRange(val) {
      console.log(val)
    },
		getProduct(shipments, type='number', e) {
			if(!shipments.length && shipments[0].productId) 
				return 0
			this.getAllProductByIdLight(shipments[0].productId).then(res => {
				if(type == 'number')
					e.innerText = res.fabricNumber
				else if(type == 'name')
					e.innerText = res.name
				})
		},
		showOperation(ass, type, e) {
			afterAndBeforeOperation(
				ass.tp_id, 
				ass.operation_id, 
				type,  
				this.getTypeOperations).then(res => {
					if(res)
						e.innerText = res.name
				})
		},
		openDocuments(id) {
      this.fetchOneOperationById(id).then(res => {
        if(res.documents && res.documents.length) {
          this.keyWhenModalGenerateFileOpen = random(1, 999)
          this.itemFiles = res.documents
        } else showMessage('', 'Документов нет', 'w', this)
      })
    },
		getStatus(id) {
      if(!this.tp) return false

      let pug_true = '<p class="success_operation">Готово</p>'
      let pug_false = '<p class="work_operation">В процессе</p>'

      let index = 0
      for(let inx in this.tp.operations) {
        if(this.tp.operations[inx].id == this.$props.assemble.operation_id) 
          index = inx
      }
      // Делаем проверку - если индекс больше - значит уже готов если меньше или равен значит в работе 
      for(let inx in this.tp.operations) {
        if(this.tp.operations[inx].id == id) {
          if(index > inx) return pug_true
          else return pug_false
        }
      }
    },
		openDescription(description) {
      this.descriptionKey = random(1, 999)
      this.description = description
    },
		getTime(operation) {
			return {
				pt: Number(operation.preTime),
				t: Number(operation.mainTime) + Number(operation.helperTime)
			}
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
		let operation_id = this.$route.params.operation
		if(!operation_id)
			this.$router.back()

		this.loader = true
    await this.fetchAllAssembleTypeOperation(operation_id)
		await this.getAllTypeOperations()
		await this.getAllUsers(true)

		for(let to of this.getTypeOperations) {
			if(to.id == operation_id) 
				this.name_operaiton = to.name
		}
    this.loader = false
	}
}
</script>

<style scoped>

</style>