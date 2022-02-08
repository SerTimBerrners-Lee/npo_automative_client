<template>
	<div class="table-scroll float_block">
		<table class='float_block'>
			<tr> 
				<th><unicon name="check" fill="royalblue" /></th> 
				<th>Заказ покупателя из задач на отгрузку</th>
				<th>Дата отгрузки покупателю</th>
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
		</table>
		<div class="btn-control float_btn">
      <button class="btn-small botton" @click='clearFilter'>Сбросить все фильтры</button>
    </div>
		<ShipmentsModal 
			:key='key_modal_shipments'
			v-if='ship_id'
			:id_shipments='ship_id'
			@unmount_shpment='unmount_shpment'
		/>
	</div>
</template>
<script>
import {random} from 'lodash';
import {mapMutations, mapActions} from 'vuex';
import ShipmentsModal from './shipments-modal.vue';
export default {
	props: ['getShipments'],
	data() {
		return {
			span_ship: null,

			key_modal_shipments: random(1, 999),
			ship_id: null,

			varShipment: []
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
			this.pusshAddShipments(this.varShipment)
		},
		openShipments(id) {
			this.ship_id = id
			this.key_modal_shipments = random(1, 999)
		},
		toSetOrders(shipments, e) {
			this.$emit('unmount_action')

      if(this.span_ship) {
        this.breackFIlterMetal()
				this.breackFIlterAssembl()
        this.span_ship.classList.remove('checkbox_block_select')
      }
      this.span_ship = e
      this.span_ship.classList.add('checkbox_block_select')
			this.fetchAllIzdToShipments(shipments.id).then(res => {
				this.$emit('unmount_set', res)
			})
    },
		clearFilter() {
      if(this.span_ship) {
        this.span_ship.classList.remove('checkbox_block_select')
        this.span_ship = null
      }
			if(!this.$props.getShipments || !this.$props.getShipments.length) return false
			this.breackFIlterMetal()
			this.breackFIlterAssembl()

			this.$emit('unmount_clear')
    },
	},
	async mounted() {
		this.varShipment = this.$props.getShipments
	}
}
</script>

<style scoped>
.float_block {
	position: sticky;
  top: 85px;
	z-index: 2;
}
.float_btn {
	position: sticky;
	top: 300px;
}
.botton {
	position: absolute;
}
</style>