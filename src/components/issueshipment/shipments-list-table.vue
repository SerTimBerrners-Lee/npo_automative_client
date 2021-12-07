<template>
	<div class="table-scroll">
		<table>
			<tr> 
				<th><unicon name="check" fill="royalblue" /></th> 
				<th>Заказ покупателя из задач на отгрузку</th>
				<th>Дата отгрузки покупателю</th>
			</tr>
			<tr v-for='order of getShipments' :key='order'>
				<td class='center_block checkbox_parent' style='height:20px; border: none; border-bottom: 1px solid #e4e4e4ce'>
					<p class="checkbox_block" @click='e => toSetOrders(order, e.target)'></p>
				</td>
				<td>{{ order.number_order }}</td>
				<td>{{ order.date_shipments }}</td>
			</tr>
		</table>
		<div class="btn-control">
      <button class="btn-small" @click='clearFilter'>Сбросить все фильтры</button>
    </div>
	</div>
</template>
<script>
import {mapMutations} from 'vuex';
export default {
	props: ['getShipments'],
	data() {
		return {
			span_ship: null,
		}
	},
	methods: {
		...mapMutations([
      'filterAssemblByShipments',
      'breackFIlterAssembl',
			'breackFIlterMetal'
    ]),
		toSetOrders(shipments, e) {
      if(this.span_ship) {
        this.breackFIlterMetal()
				this.breackFIlterAssembl()
        this.span_ship.classList.remove('checkbox_block_select')
      }
      this.span_ship = e
      this.span_ship.classList.add('checkbox_block_select')
			this.$emit('unmount_set', shipments)
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
	}
}
</script>