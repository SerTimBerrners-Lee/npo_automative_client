<template>
	<div>
		<h3>Задачи на отгрузку</h3>
		<div class="block header_block">
			<DatePicterRange 
				@unmount='changeDatePicterRange'  
			/>
			<div>
				<select 
					class='select-small' 
					v-model='selectEnumShipments'>
					<option 
						v-for='item of enumShipments' 
						:key='item' 
						:value='item'>{{ item }}</option>
				</select>
			</div>
		</div>
		<div>
			<h3>Комлектация</h3>
			<div style='width: fit-content;'>
				<TableShipments  
					v-if='getShipments.length'
					:shipmentsArr='getShipments'
					@unmount='unmount_table_shipments'/>
				<div class="btn-control">
					<button 
						class="btn-small">
						Сбросить все фильтры
					</button>
					<button class="btn-small" @click='deleteF'>
						Удалить
					</button>
					<button class="btn-small" @click='edit'>
						Изменить
					</button>
					<button class="btn-small btn-add" @click='$router.push("/addorder/false/false")'>
						Создать заказ
					</button>
				</div>
			</div>
		</div>
		<InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
		<Loader v-if='loader' />
	</div>
</template> 
<script>
import {random} from 'lodash';
import {showMessage} from '@/js/';
import {mapActions, mapGetters, mapMutations} from 'vuex';
import DatePicterRange from '@/components/date-picter-range.vue';
import TableShipments from '@/components/issueshipment/table-komplect.vue';
export default {
	data() {
		return {
			selectShipments: null,
			tr: null,
			message: '',
      type: '',
      keyInformTip: random(1, 999),

			loader: false,

			enumShipments: [
				'Все',				
				'Заказано',
				'Удалено',
				'Выполняется',
				'Отгружено',
				'Просрочено'
			],
			selectEnumShipments: 'Все'
		}	
	},
	computed: mapGetters(['getShipments']),
	components: {
		DatePicterRange,
		TableShipments
	},
	watch: {
		selectEnumShipments: function(val) {
			this.filterShipmentsToStatus(val)
		}
	},
	methods: {
		...mapActions([ 
			'fetchDeleteShipments',
			'fetchAllShipmentsTo'
		]),
		...mapMutations([
      'setOneShipment',
			'filterShipmentsToStatus'
    ]),
		unmount_table_shipments(select_shipemnts) {
			if(!select_shipemnts) return false
			this.selectShipments = select_shipemnts
		},
		changeDatePicterRange(val) {
      console.log(val)
    },
		edit() {
			if(!this.selectShipments) return showMessage('', 'Выберите задачу', 'w', this)

			this.$router.push({ path: "/addorder/true/false" })
		},
		deleteF() {
			if(!this.selectShipments) return showMessage('', 'Выберите задачу', 'w', this)
			this.fetchDeleteShipments(this.selectShipments.id)
		}
	},
	async mounted() {
		this.loader = true
		await this.fetchAllShipmentsTo()
		this.loader = false
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