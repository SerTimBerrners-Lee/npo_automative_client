<template>
	<div class='picter'>
		<DatePicker 
			v-model="date"  
			:model-config="modelConfig" 
			is-dark 
			color='gray'
			:select-attribute='modelAttribute'
			> 
			<template v-slot="{  inputEvents }">
				<input
					v-model='date'
					v-on="inputEvents"
				/>
			</template>
		</DatePicker>
	</div>
</template>

<script>

export default {
	props: ['dateStart'],
	data() {
		return {
			date: new Date().toLocaleDateString("ru-RU"),
			modelConfig: { 
				type: 'string', 
				mask: 'DD.MM.YYYY'
			},
			modelAttribute: {
				dot: true,
			}
		}
	},
	watch: {
		date: function(val) {
			this.$emit('unmount', val)
		},
		dateStart: function(val) {
			this.date = val
		}
	},
	async mounted() {
		if(this.$props.dateStart)
			this.date = this.$props.dateStart
	}
}
</script>

<style scoped>
input {
	width: 80px;
}
.picter {
	widows: fit-content;
}
</style>