<template>
	<div>
		<h3>Дефицит материалов</h3>
		<div>
			<div class="block header_block">
				<span>Выбрать период, с:</span>
				<input type="text">
				<span>по: </span><input type="text">
				<button class="btn-small">Сбросить период или дату</button>
			</div>
		</div>

		<div>
			<div class="scroll-table table_material">
				<table style="width: 200px;">
					<tr>
						<th>Категория</th>
					</tr>
					<tr>
						<td>Все</td>
					</tr>
					<tr>
						<td>Материалы </td>
					</tr>
					<tr>
						<td>Покупные детали</td>
					</tr>
					<tr>
						<td>Расходные материалы</td>
					</tr>
				</table>
				<table style="width: 300px;">
					<tr>
						<th>Тип</th>
						<th>Подтип</th>
					</tr>
				</table>
				<table>
					<tr>
						<th>Наименование</th>
						<th>ЕИ</th>
						<th>Остаток на дату</th>
						<th>План расход на план</th>
						<th>План остаток</th>
						<th>Среднестат. расход</th>
						<th>Мин. остаток</th>
						<th>Рекомендованный остаток</th>
						<th>Дефицит</th>
						<th>Дефицит в рублях</th>
						<th>Рекомендованный заказ</th>
						<th>План приход (данные по счету)</th>
						<th>Дата прихода</th>
						<th>План остаток после план прихода</th>
						<th>План дефицит/Профицит</th>
						<th>Статус</th>
					</tr>
				</table>
			</div>
			<div class='btn-control'>
				<button class="btn-small btn-add" 
					@click='start'> Запустить </button>
				<button class="btn-small"> Выгрузка в Excel </button>
				<button class="btn-small"> Печать отчета </button>
			</div>
		</div>
		<Start
			v-if='showStart'
			:key='startKey'
		/>
	</div>
</template>

<script> 
import { mapGetters, mapActions } from 'vuex';
import {random} from 'lodash';
import Start from '../start-modal.vue'
export default {
	data() {
		return {
			showStart: false,
			startKey: random(1, 999)
		}
	},
	components: {Start},
	computed: mapGetters(['getOnePodMaterial']),
	methods: {
		...mapActions(['fetchGetAllDeficitPPM']),
		start() {
			this.showStart = true;
			this.startKey = random(1, 999);
		}
	},
	async mounted() {
		await this.fetchGetAllDeficitPPM()
		console.log(this.getOnePodMaterial)
	}
}
</script>

<style scoped>
.table_material {
	display: flex;
}
table {
	height: fit-content;
}
</style>