<template>
	<div>
		<h3>Дефицит материалов на план (сборка)</h3>

    <div class='table_block'>
      <div>
				<ShipmentList
					v-if='getShipments.length'
					@unmount_set='toSetOrders'
					@unmount_clear='unmount_clear'
					:getShipments='getShipments'/>
			</div>

			<div class="scroll-table table_material" style='margin-left: 5px;'>
				<TableTypeMaterial />
				<div>
					<TableMaterial :type_view='"def"' />
				</div>
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
import TableMaterial from '../deficit-material/table-material';
import TableTypeMaterial from '../deficit-material/table-type-material';
import ShipmentList from '@/components/issueshipment/shipments-list-table';
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
		...mapActions(['fetchAllShipments', 'fetchMaterialToShipments']),
		...mapMutations(['reverseMidlevareProduct', 'reverseMidlevareCbed', 'unsetSortMaterial']),
		async toSetOrders(shipments) {
      this.unmount_clear();
      if (!shipments) return false;
			await this.fetchMaterialToShipments({ id: shipments.id, type: 'cbed' });
    },
		unmount_clear() {
			this.reverseMidlevareProduct();
			this.reverseMidlevareCbed();
			this.unsetSortMaterial();
    },
	}, 
	async mounted() {
		await this.fetchAllShipments({sort: undefined, light: true});
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