<template>
	<div>
		<h3>Задачи на отгрузку</h3>
		<div class="block header_block">
			<DatePicterRange
				@unmount='changeDatePicterRange'  
			/>
			<SortStatus :key='status_sort_key'/>
			<SortBuyer :key="sort_buyer_key" />
		</div>
		<div>
			<h3>Комлектация</h3>
			<div style='width: fit-content;'>
				<TableShipments  
					v-if='getShipments.length'
					:is_print='is_print'
					:shipmentsArr='getShipments'
					@unmount='unmount_table_shipments'/>
			</div>
		</div>

		<div class="btn-control out-btn-control wh_80p">
			<button class="btn-small" @click='printPage'>
				Печать
			</button>
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
		<Loader v-if='loader' />
	</div>
</template> 
<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import DatePicterRange from '@/components/DatePicterRange';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import SortBuyer from '@/components/IssueShipment/SortBuyer';
import SortStatus from '@/components/IssueShipment/SortStatus';
import TableShipments from '@/components/IssueShipment/TableKomplect';

export default {
	data() {
		return {
			selectShipments: null,
			tr: null,
			sort_buyer_key: random(1, 999),
			is_print: false,
			status_sort_key: random(1, 999),

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
			this.sort_buyer_key = random(1, 999);

      this.clearFilters();
      await this.fetchAllShipmentsTo();
			this.status_sort_key = random(1, 999);

      this.loader = false;
    },
		printPage() {
			this.is_print = true;
			setTimeout(() => this.is_print = false);
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
		this.loader = true;
		await this.fetchAllShipmentsTo();
		this.status_sort_key = random(1, 999);
		this.loader = false;
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