<template>
	<div >
		<h3>Операция {{ name_operaiton }}</h3>

		
		<TableOperation 
			v-if='type_operation_id && name_operaiton'
			:type_operation_id='type_operation_id'
			:name_operaiton='name_operaiton'
		/>
	</div>
</template>

<script>
import TableOperation from './TableOperation';

export default {
	data() {
		return {
			name_operaiton: null,
			type_operation_id: null,
		}
	},
	components: {
		TableOperation
	},
	methods: {
	},
	async mounted() {
		this.type_operation_id = this.$route.params.operation
		this.name_operaiton = this.$route.params.name_operation
		if(!this.type_operation_id || !this.name_operaiton)
			return this.$router.back()
	}
}
</script>

<style scoped>
th {
  word-break: break-all;
}
</style>