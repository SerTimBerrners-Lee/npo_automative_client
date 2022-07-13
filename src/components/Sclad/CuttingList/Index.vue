<template>
	<div>
		<h3>Комплектация производства - Заготовительная операция - Листовая Резка</h3>

		<OpPgMetalloworking 
			v-if='showTableOperation'
			:type_operation_id='type_operation_id'
			:name_operaiton='name_operaiton'
		/>

		<div v-if='!type_operation_id' style='margin-top: 20px;'>
			Операций не найдено
		</div>
		

		<div class="btn-control">
			<button class="btn-small">Печать задания</button>
			<button class="btn-small btn-add">Создать накладную на передачу заготовок на металлообработку</button>
		</div>
		
	</div>
</template>
<script> 
import { mapGetters, mapActions } from 'vuex';
import OpPgMetalloworking from '@/components/Metalloworking/TableOperation';

export default {
	data() {
		return {
			name_operaiton: '', 
			type_operation_id: null,
			showTableOperation: false,
		}
	},
	components: {OpPgMetalloworking},
	computed: mapGetters(['getTypeOperations']),
	methods: {
		...mapActions(['getAllTypeOperations']),

	},
	async mounted() {
		await this.getAllTypeOperations();
		
		for (const item of this.getTypeOperations) {
			if (item.list) {
				this.type_operation_id = item.id
				this.name_operation = item.name
				this.showTableOperation = true
				break;
			}
		}
	}
}
</script>
