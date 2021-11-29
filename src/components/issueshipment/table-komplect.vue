<template>
	<div class="table-scroll">
		<table> 
			<tr>
				<th>Заказ</th>
				<th>Артикул изделия</th>
				<th>Наименование изделия</th>
				<th>Комплектация/особенности заказа</th>
				<th>Кол-во, шт.</th>
				<th>Осталось дней</th>
				<th>Основание</th>
				<th>Покупатель</th> 
				<th>Готовность к отгрузки в %</th>
				<th>Статус</th>
				<th>Дата отгрузки</th>
				<th>Н/Ч требуется</th>
				<th>Н/Ч выполнено</th>
				<th>Н/Ч осталось</th>
				<th>Примечание</th>
			</tr>
			<tr v-for='shipments of shipmentsArr'
				:key='shipments'
				class='td-row'
				@click='e => setShipments(shipments, e.target.parentElement)'>
				<td>{{ shipments.number_order }}</td>
				<td>{{ shipments.product ? shipments.product.articl : 'Нет Изделия' }}</td>
				<td>{{ shipments.product ? shipments.product.name : 'Нет Изделия' }}</td>
				<td>
					<div class='osob' v-if='shipments.list_cbed_detal'>
						<p v-for='(izd, inx) of JSON.parse(shipments.list_cbed_detal)'
							:key='izd'><b>{{ inx + '. ' }}</b> {{ izd.obj.name }}</p>
					</div>
				</td>
				<td class='center'>{{ shipments.kol }}</td>
				<td class='center'>{{ shipments.difference }}</td>
				<td class='center active'  
					@click='openDocuments(shipments)' >
					{{ shipments.base }}
				</td>
				<td class='center'>{{ shipments.to_sklad ? 'Склад' : shipments.buyer ? shipments.buyer.name : 'нет'}}</td>
				<td></td>
				<td>{{ shipments.status }}</td>
				<td>{{ shipments.date_shipments }}</td>
				<td></td>
				<td></td>
				<td></td>
				<td class='center'>
					<img src="@/assets/img/link.jpg" @click='openDescription(shipments.description)' class='link_img' atl='Показать' />
				</td>
			</tr>
		</table>
		<DescriptionModal 
      v-if='showDescriptionModal'
      :key='descriptionKey'
      :parametrs='description'
    />
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
	</div>
</template>
<script>
import {random} from 'lodash';
import { mapMutations } from 'vuex';
import { showMessage } from '@/js/';
import { dateIncrementHors } from '@/js/';
import OpensFile from '@/components/filebase/openfile.vue';
import DescriptionModal from '@/components/description-modal.vue';
export default {
	props: ['shipmentsArr'],
	data() {
		return {
			selectShipments: null,
			tr: null,
			message: '',
      type: '',
      keyInformTip: random(1, 999),

			showDescriptionModal: false,
      descriptionKey: random(1, 999),
      description: '',

			itemFiles: [],
      keyWhenModalGenerateFileOpen: random(1, 999),

			loader: false
		}	
	},
	components: {
		DescriptionModal, 
		OpensFile
	},
	methods: {
		...mapMutations(['setOneShipment']),
		setShipments(shipments, e) {
			if(this.tr && this.selectShipments.id == shipments.id) {
				this.tr.classList.remove('td-row-all')
				this.selectShipments = null 
			}
			if(this.tr) this.tr.classList.remove('td-row-all')
			this.tr = e 
			this.tr.classList.add('td-row-all')
			this.setOneShipment(shipments)
			this.selectShipments = shipments;
			this.$emit('unmount', this.selectShipments)
		},
		openDescription(description) {
      this.showDescriptionModal = true
      this.descriptionKey = random(1, 999)
      this.description = description
    },
		dateIncrementHors(date, day) {
      let dat = dateIncrementHors(date, day*24)
      return `${dat.day}.${dat.mount}.${dat.year}`
    },
		openDocuments(shipments) {	
			if(shipments.documents && shipments.documents.length) {
				for(let doc of shipments.documents) {
					if(doc.name == shipments.base) {
						this.keyWhenModalGenerateFileOpen = random(1, 999)
						this.itemFiles = [doc]
					}
				}
			} else showMessage('', 'Документов нет', 'w', this)
    },
	},
	async mounted() {
	}
}
</script>

<style scoped>
.osob {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
}
.osob * {
	margin: 0px;
}
</style>