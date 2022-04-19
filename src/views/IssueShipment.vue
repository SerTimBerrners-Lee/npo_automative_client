<template>
	<div>
		<h3>Задачи на отгрузку</h3>
		<div class="block header_block">
			<DatePicterRange 
				@unmount='changeDatePicterRange'  
			/>
			<SortStatus />
			<SortBuyer />
		</div>
		<div>
			<h3>Комлектация</h3>
			<div style='width: fit-content;'>
				<TableShipments  
					v-if='getShipments.length'
					:shipmentsArr='getShipments'
					@unmount='unmount_table_shipments'/>
				<div class="btn-control out-btn-control wh_80p">
					<button 
						class="btn-small"
						@click='clearFiltersF'>
						Сбросить все фильтры
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
		<Loader v-if='loader' />
	</div>
</template> 
<script>
import { showMessage } from '@/js/';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import DatePicterRange from '@/components/date-picter-range';
import SortBuyer from '@/components/IssueShipment/SortBuyer';
import SortStatus from '@/components/IssueShipment/sort-status';
import TableShipments from '@/components/IssueShipment/table-komplect';

export default {
	data() {
		return {
			selectShipments: null,
			tr: null,

			loader: false,
		}	
	},
	computed: mapGetters(['getShipments']),
	components: {
		DatePicterRange,
		TableShipments,
		SortStatus,
		SortBuyer
	},
	methods: {
		...mapActions(['fetchAllShipmentsTo']),
		...mapMutations(['clearFilters']),
		unmount_table_shipments(select_shipemnts) {
			if(!select_shipemnts) return false;
			this.selectShipments = select_shipemnts;
		},
		async clearFiltersF() {
      this.loader = true;

      this.clearFilters();
      await this.fetchAllShipmentsTo();

      this.loader = false;
    },
		changeDatePicterRange(val) {
      console.log(val)
    },
		edit() {
			if(!this.selectShipments) return showMessage('', 'Выберите задачу', 'w');
			this.$router.push({ path: "/addorder/true/false" });
		},
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