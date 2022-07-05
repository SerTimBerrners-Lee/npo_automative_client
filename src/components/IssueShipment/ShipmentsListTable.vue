<template>
	<div class='main'>
		<div class='main_container '>
			<tr> 
				<th colspan="3" class='hide_td' @click="show_is = !show_is" style='width: 150px; height: 20px;'>
					{{ show_is ? 'Скрыть' : 'Показать' }} Задачи на отгрузку</th>
				<th @click='clearFilter' class='hide_td' style='width: 150px; height: 20px;'>
					Сбросить все фильтры
				</th>
			</tr>
			<div class="scroll_right" v-if='show_is'>
				<table>
					<tbody>
						<tr> 
							<th><unicon name="check" fill="royalblue" /></th> 
							<th>Заказ покупателя из задач на отгрузку</th>
							<th>Дата отгрузки покупателю</th>
						</tr> 
						<tr>
							<th colspan="3">
								<Search 
									:placeholder="'Поиск по Номеру заказа'"
									@unmount='keySearch'
								/>
							</th>
						</tr>
						<tr v-for='order of getShipments' :key='order.number_order' class='tooltip' @mouseover="tooltipInfo(order)" @mouseleave="mouseLeave">
							<td>
								<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
									<p class="checkbox_block" @click='e => toSetOrders(order, e.target)'></p>
								</div>
							</td>
							<td @click="openShipments(order.id)" class='td-row'>{{ order.number_order }}</td>
							<td @click="openShipments(order.id)" class='td-row'>{{ order.date_shipments }}</td>
						</tr>
						<tr v-if='metalloworing.length'>
							<td colspan="3" class='center'><strong> Заказ склада Металообработка </strong></td>
						</tr>
						<tr v-for="metal of metalloworing" :key="metal.id">
							<td>
								<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
									<p class="checkbox_block" @click='e => toSetMetal(metal, e.target)'></p>
								</div>
							</td>
							<td class='td-row'>{{ metal.number_order }}</td>
							<td class='td-row'>{{ returnShipmentsKolvo(metal?.detal?.shipments) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<td class='tooltiptext' v-if='miniData'>
		<MiniLoader v-if='!shipments_info'/>
		<table v-else>
			<tr>
				<th>Изделие</th>
				<th>Поставщик</th>
			</tr>
			<tr>
				<td>{{ shipments_info?.product?.name || 'нет изделия' }}</td>
				<td>{{ shipments_info?.buyer?.name || 'нет поставщика' }}</td>
			</tr>
		</table>

	</td>
	<ShipmentsModal 
		:key='key_modal_shipments'
		v-if='ship_id'
		:id_shipments='ship_id'
		@unmount_shpment='unmount_shpment'
	/>
</template>
<script>
import { random } from 'lodash';
import { eSelectSpan } from '@/js/methods';
import ShipmentsModal from './ShipmentsModal';
import { mapMutations, mapActions } from 'vuex';
import { returnShipmentsDate } from '@/js/operation';

export default {
	props: {
		getShipments: [],
		metalloworing: [],
	},
	data() {
		return {
			span_ship: null,

			key_modal_shipments: random(1, 999),
			ship_id: null,

			varShipment: [],
			show_is: true,
			shipments_info: null,
			miniData: false,
		}
	},
	components: { ShipmentsModal },
	methods: {
		...mapActions([
			'fetchAllShipmentsById',
			'fetchAllIzdToShipments',
			'fetchIncludesFolderSh'
		]),
		...mapMutations([
      'filterAssemblByShipments',
      'breackFIlterAssembl',
			'breackFIlterMetal',
			'pusshAddShipments',
			'searchShipments'
    ]),
		unmount_shpment() {
			this.pusshAddShipments(this.varShipment);
		},
		mouseLeave() {
			this.miniData = false;
		},
		keySearch(str) {
      this.searchShipments(String(str));
    },
		async tooltipInfo(order) {
			this.miniData = true;
			this.shipments_info = null;
			const res = await this.fetchIncludesFolderSh({
				id: order.id,
				includes: ['product', 'buyer']
			});
			if (res) this.shipments_info = res;
		},
		openShipments(id) {
			this.ship_id = id;
			this.key_modal_shipments = random(1, 999);
		},
		async toSetOrders(shipments, e) {
			this.$emit('unmount_action');

      if (this.span_ship) {
        this.breackFIlterMetal();
				this.breackFIlterAssembl();
      }
      this.span_ship = eSelectSpan(this.span_ship, e, 'checkbox_block_select');

			const res = await this.fetchAllIzdToShipments(shipments.id);
			this.$emit('unmount_set', res);
			if (shipments.number_order) this.keySearch(shipments.number_order);
    },
		toSetMetal(metal, e) {
			this.span_ship = eSelectSpan(this.span_ship, e, 'checkbox_block_select');
			this.$emit('unmount_set_metal', metal);
		},
		returnShipmentsKolvo(shipments, znach_return = 1) {
      return returnShipmentsDate(shipments, znach_return);
    },
		clearFilter() {
      if (this.span_ship) {
        this.span_ship.classList.remove('checkbox_block_select');
        this.span_ship = null;
      }
			
			if (!this.$props.getShipments || !this.$props.getShipments.length) return false;
			this.breackFIlterMetal();
			this.breackFIlterAssembl();
			this.keySearch('');

			this.$emit('unmount_clear');
    },
	},
	async mounted() {
		this.varShipment = this.$props.getShipments;
	}
}
</script>

<style scoped>
.main {
	top: 85px;
	position: sticky;
}
.main_container {
	width: 300px;
}
.float_btn {
	position: fixed;
	top: 30px;
}
.botton {
	position: absolute;
}
.scroll_right {
	height: 75vh;
}
.hide_td {
	cursor: pointer;
	font-size: 10px;
	padding: 1px !important;
	user-select: none;
}

.tooltiptext {
	position: fixed;
	top: 100px;
}
</style>