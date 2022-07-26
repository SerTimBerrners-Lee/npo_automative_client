<template>
	<div class='main'>
		<div class="left">
			<h3>Расход со склада</h3>
			<div>
				<div class="block header_block">
					<DatePicterRange 
						@unmount='changeDatePicterRange' 
						v-if='!loader'
					/>
				</div>
			</div>

			<div>
				<div class='scroll-table'>
					<table>
						<tbody class='fixed_table_10'>
							<tr>
								<th colspan='3'>Накладные</th>
								<th colspan='5'>Информация о заказе</th>
							</tr>
							<tr>
								<th>№</th>
								<th>Дата</th>
								<th>Основание</th>
								
								<th>№ Заказа</th>
								<th>Комплектация</th>
								<th>Дата</th>
								<th>Изделие</th>
								<th>Заказчик</th>
							</tr>
						</tbody>
						<tbody v-for='(complit, idx) of getShComplits' :key='complit.id'>
							<tr class='td-row' @click='e => selectComplit(complit, e.target.parentElement)'>
								<td :rowspan='complit.shipments.length + 1 || 1' class='center'>{{ idx + 1 }}</td>
								<td :rowspan='complit.shipments.length + 1 || 1' class='center'>{{ new Date(complit.createdAt).toLocaleString('ru-RU').split(',')[0] }}</td>
								<td :rowspan='complit.shipments.length + 1 || 1' class="center">{{ complit.number_complit }}</td>
							</tr>
							<tr v-for='(sh) of complit.shipments' :key='sh.id'
								class='td-row'
								@click='openSh(sh)'>
								<td>{{ sh.number_order }}</td>
								<td class='center'>
									<img 
										src="@/assets/img/link.jpg" 
										@click='openComplect(sh)' 
										class='link_img' 
										atl='Показать' />
								</td>
								<td>{{ sh.date_order }}</td>
								<td>{{ sh.product?.name || '-' }}</td>
								<td>{{ sh.buyer?.name || 'Склад' }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="btn-control">
					<button class="btn-small">Печать</button>
				</div>
			</div>
		</div>
	</div>
	<KomplectCon 
		v-if='komplectIs'
		:key='komplectKey'
		:sh='selectSh'
	/>
	<ShComplit 
		v-if='selected_complit'
		:key='shipment_key'
		:complit='selected_complit'
		@unmount='unmount_complit_modal'
	/>
	<ShipmentsModal 
		v-if='key_modal_shipments && selectSh.id'
		:key='key_modal_shipments'
		:id_shipments='selectSh.id'
	/>
	<Loader v-if='loader' />
</template>
<script>
import { random } from 'lodash';
import KomplectCon from './KomplectCon';
import { eSelectSpan } from '@/js/methods';
import DatePicterRange from '@/components/DatePicterRange';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import ShComplit from '@/components/Sclad/IssueToPull/ShComlitUpdateModal';

export default {
	data() {
		return {
			span: null,
			instansLet: 0,

			material: null,
			span_material: null,
			tr: null,

			komplectIs: false,
			komplectKey: random(1, 999),
			loader: false,

			selectSh: null,
			key_modal_shipments: null,


			selected_complit: null,
			shipment_key: random(1, 999),
		}
	},
	computed: mapGetters(['getShComplits']),
	components: { 
		ShComplit,
		DatePicterRange,
		KomplectCon,
	},
	beforeCreate() {
    this.$options.components.ShipmentsModal = require('@/components/IssueShipment/ShipmentsModal').default;
  },
	methods: {
		...mapActions(['fetchShComplit']),
		...mapMutations(['filterShComplitData']),
		async unmount_complit_modal() {
      this.loader = true;
      await this.fetchShComplit();
      this.loader = false;
    },
		changeDatePicterRange(val) {
      this.filterShComplitData(val);
    },
		selectComplit(complit, e) {
			this.selected_complit = complit;
			this.shipment_key = random(1, 999);	
			console.log(complit);
			this.tr = eSelectSpan(this.tr, e);
		},
		openSh(sh) {
			console.log(sh);
			this.selectSh = sh;
			this.key_modal_shipments = random(1, 999);
		},
		openComplect(sh) {
			this.selectSh = sh;
			this.komplectIs = true;
			this.komplectKey = random(1, 999);
		}
	},
	async mounted() {
		this.loader = true; 
    await this.fetchShComplit();
    this.loader = false;
	}
}
</script>

<style scoped>
.scroll-table {
	height: 600px;
	width: 100%;
}
.left {
	width: 1200px;
}
.main {
	display: flex;
	width: 2000px;
}
.main>div {
	margin: 5px; 
}
.right {
	width: 700px;
	overflow: scroll;
	height: max-content;
	padding-bottom: 100px;
}
table {
	width: 100%;
}
.span_td {
	display:  flex;
	flex-direction: column;
}
</style>