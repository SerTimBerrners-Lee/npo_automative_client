<template>
	<div>
		<tr> 
			<th colspan="3" class='hide_td' @click="show_is = !show_is">
				{{ show_is ? 'Скрыть' : 'Показать' }} Задачи на отгрузку</th>
      <th @click='clearFilter' class='hide_td'>
				Сбросить все фильтры
			</th>
		</tr>
		<div class="table-scroll float_block" v-if='show_is'>
		<table class='float_block'>
			<tbody>
				<tr> 
					<th><unicon name="check" fill="royalblue" /></th> 
					<th>Заказ покупателя из задач на отгрузку</th>
					<th>Дата отгру	зки покупателю</th>
				</tr>
				<tr v-for='order of getShipments' :key='order'>
					<td>
						<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
							<p class="checkbox_block" @click='e => toSetOrders(order, e.target)'></p>
						</div>
					</td>
					<td @click="openShipments(order.id)" class='td-row'>{{ order.number_order }}</td>
					<td @click="openShipments(order.id)" class='td-row'>{{ order.date_shipments }}</td>
				</tr>
			</tbody>
		</table>
		<ShipmentsModal 
			:key='key_modal_shipments'
			v-if='ship_id'
			:id_shipments='ship_id'
			@unmount_shpment='unmount_shpment'
		/>
	</div>
	</div>
</template>
<script>
import {random} from 'lodash';
import {mapMutations, mapActions} from 'vuex';
import { eSelectSpan } from '@/js/methods.js';
import ShipmentsModal from './shipments-modal.vue';
export default {
	props: ['getShipments'],
	data() {
		return {
			span_ship: null,

			key_modal_shipments: random(1, 999),
			ship_id: null,

			varShipment: [],

			show_is: true,
		}
	},
	components: {
		ShipmentsModal
	},
	methods: {
		...mapActions(['fetchAllShipmentsById', 'fetchAllIzdToShipments']),
		...mapMutations([
      'filterAssemblByShipments',
      'breackFIlterAssembl',
			'breackFIlterMetal',
			'pusshAddShipments',
    ]),
		unmount_shpment() {
			this.pusshAddShipments(this.varShipment);
		},
		openShipments(id) {
			this.ship_id = id;
			this.key_modal_shipments = random(1, 999);
		},
		toSetOrders(shipments, e) {
			this.$emit('unmount_action');

      if(this.span_ship) {
        this.breackFIlterMetal();
				this.breackFIlterAssembl();
      }
      this.span_ship = eSelectSpan(this.span_ship, e, 'checkbox_block_select');

			this.fetchAllIzdToShipments(shipments.id).then(res => {
				this.$emit('unmount_set', res)
			});
    },
		clearFilter() {
      if(this.span_ship) {
        this.span_ship.classList.remove('checkbox_block_select');
        this.span_ship = null;
      }
			
			if(!this.$props.getShipments || !this.$props.getShipments.length) return false;
			this.breackFIlterMetal();
			this.breackFIlterAssembl();

			this.$emit('unmount_clear');
    },
	},
	async mounted() {
		this.varShipment = this.$props.getShipments;
	}
}
</script>

<style scoped>
.float_block {
	position: sticky;
  top: 85px;
	z-index: 2;
	max-width: 300px;
}
.float_btn {
	position: fixed;
	top: 30px;
}
.botton {
	position: absolute;
}
.hide_td {
	cursor: pointer;
	font-size: 10px;
	padding: 1px !important;
	user-select: none;
}
</style>