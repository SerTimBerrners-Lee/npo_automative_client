<template>
	<div>
		<h3>Склад отходов</h3>
		<div>
			<div class="block header_block">
				<DatePicterRange 
					@unmount='changeDatePicterRange'  
				/>
			</div>
		</div>

		<div>
			<div class="scroll-table">
				<table>
					<tr>
						<th colspan='3'></th>
						<th colspan='2'>Приход за период</th>
						<th colspan='2'>Планируемый приход от плана</th>
						<th colspan='2'></th>
					</tr>
					<tr>
						<th>Материал</th>
						<th>ЕИ</th>
						<th>Остатки на дату</th>
						<th>Заготовительные операции</th>
						<th>Производство</th>
						<th>Заготовительные операции</th>
						<th>Производство</th>
						<th>Реализация отходов</th>
						<th>Остатки на дату</th>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>

<script> 
import DatePicterRange from '@/components/date-picter-range.vue';
export default {
	data() {
		return {
		}
	},
	components: {DatePicterRange},
	methods: {
		changeDatePicterRange(val) {
      console.log(val)
    }
	},
	async mounted() {
	}
}
</script>

<style scoped>
</style>