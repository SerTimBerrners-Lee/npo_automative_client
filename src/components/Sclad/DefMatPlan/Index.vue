<template>
	<div>
		<h3>Дефицит материалов на план (металлообработки)</h3>

    <div class='table_block'>
      <div style='width: 400px;'>
				<ShipmentList
					@unmount_set='toSetOrders'
					@unmount_clear='unmount_clear'
					:getShipments='getShipments'/>
			</div>

			<div class="scroll-table table_material" style='margin-left: 5px;'>
				<TableTypeMaterial />
				<TableMaterial :type_view='"def"' />
			</div>
		</div>
		<div class='btn-control'>
			<button class="btn-small"> Выгрузка в Excel </button>
			<button class="btn-small"> Печать отчета </button>
		</div>
	</div>
</template>
<script> 
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TableMaterial from '../DeficitMaterial/TableMaterial';
import TableTypeMaterial from '../DeficitMaterial/TableTypeMaterial';
import ShipmentList from '@/components/IssueShipment/ShipmentsListTable';

export default {
	data() {
		return {
		}
	},
	computed: mapGetters(['getShipments']),
	components: {
		TableTypeMaterial,
		TableMaterial,
		ShipmentList
	},
	methods: {
		...mapActions(['fetchAllShipmentsNoStatus', 'fetchMaterialToShipments']),
		...mapMutations(['reverseMidlevareDetal', 'unsetSortMaterial']),
		async toSetOrders(shipments) {
      this.unmount_clear();
      if (!shipments) return false;
			await this.fetchMaterialToShipments({ id: shipments.id, type: 'detal' });
    },
		unmount_clear() {
      this.reverseMidlevareDetal();
			this.unsetSortMaterial();
    },
	},
	async mounted() {
		await this.fetchAllShipmentsNoStatus();
	}
}
</script>

<style scoped>
.table_material {
	display: flex;
	height: 800px;
}
table {
	height: fit-content;
}
</style>