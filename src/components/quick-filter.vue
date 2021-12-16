<template>
	<div class='main_filter exclamation'>
			<span class='tooltip' @click='sortToAttention'>
				<unicon name="exclamation" fill="red" />
				<span class='tooltiptext'>Соритировать по отметке</span>
			</span> 
			<span class='tooltip' @click='sortToDate'>
				<unicon name="align-center-v" fill="blue" width='20' />
				<span class='tooltiptext'>Соритировать по дате создания</span>
			</span> 
			<span class='tooltip' @click='sortToMyObject' v-if='!hide_filter_responsibil'>
				<unicon name="okta" fill="black" width='20' />
				<span class='tooltiptext'>Показать мои</span>
			</span> 
	</div>
</template>

<script>
export default {
	props: ['hide_filter_responsibil'],
	data() {
		return {

		}
	},
	methods: {
		sortToAttention() {
			this.$emit('attention')
		},
		sortToDate() {
			this.$emit('date_first')
		},
		sortToMyObject() {
			this.$emit('my_object')
		}
	}
}
</script>

<style scoped>
.main_filter {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>