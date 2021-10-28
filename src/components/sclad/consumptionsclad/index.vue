<template>
	<div class='main'>
		<div class="left">
			<h3>Расход со склада</h3>
			<div>
				<div class="block header_block">
					<DatePicterRange 
						@unmount='changeDatePicterRange'  
					/>
				</div>
			</div>

			<div>
				<div class='scroll-table'>
					<table>
						<tr>
							<th rowspan='2'>
								<unicon name="check" fill="royalblue" />
							</th>
							<th colspan='7'>Накладные</th>
							<th colspan='4'>Информация о заказе</th>
						</tr>
						<tr>
							<th>№</th>
							<th>Дата</th>
							<th>Статус</th>
							<th>Тип</th>
							<th>Артикул</th>
							<th>Наименование</th>
							<th>Кол-во</th>
							<th>№ Заказа</th>
							<th>Дата</th>
							<th>Изделие</th>
							<th>Заказчик</th>
						</tr>
						<tr v-for='t of 44' :key='t'>
							<td>...</td>
							<td>...</td>
							<td>...</td>
							<td>...</td>
							<td>...</td>
							<td>...</td>
							<td>...</td>
							<td>...</td>
							<td>...</td>
							<td>...</td>
							<td>...</td>
							<td>...</td>
						</tr>
					</table>
				</div>
				<div class="btn-control">
					<button class="btn-small btn-del">Пометка на удаление</button>
					<button class="btn-small">Изменить</button>
					<button class="btn-small">Просмотр</button>
					<button class="btn-small">Печать</button>
				</div>
			</div>
		</div>
		<div class="right">
			<h3>Выдано</h3>
			<div class="block">
				<table>
					<tr>
						<th class='th_black' colspan='5'>Сборки(СБ)</th>
						<th class='th_black' colspan="2">Выдано</th>
					</tr>
					<tr>
						<td>Артикул</td>
						<td>Наименование</td>
						<td>ЕИ</td>
						<td>Потребность на 1 сборку</td>
						<td>Потребность итого</td>
						<td class='td_ocean'>Дата</td>
						<td class='td_ocean'>Кол-во</td>
					</tr>

					<tr>
						<th class='th_black' colspan='5'>Детали(Д)</th>
						<th class='th_black' colspan='2'>Выдано</th>
					</tr>
					<tr>
						<td>Артикул</td>
						<td>Наименование</td>
						<td>ЕИ</td>
						<td>Потребность на 1 сборку</td>
						<td>Потребность итого</td>
						<td class='td_ocean'>Дата</td>
						<td class='td_ocean'>Кол-во</td>
					</tr>
				</table>

				<table>
					<tr>
						<th class='th_black' colspan='5'>Покупные детали и расходные материалы(ПД и РМ)</th>
						<th class='th_black' colspan='5'>Выдано по факту</th>
					</tr>
					<tr>
						<td>Артикул</td>
						<td>Наименование</td>
						<td>ЕИ</td>
						<td>Потребность на 1 сборку</td>
						<td>Потребность итого</td>
						<td class='td_ocean'>Дата</td>
						<td class='td_ocean'>Аналог</td>
						<td class='td_ocean'>Артикул</td>
						<td class='td_ocean'>Наименование</td>
						<td class='td_ocean'>Кол-во</td>
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
			span: null,
			instansLet: 0,

			material: null,
			span_material: null,
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
.scroll-table {
	height: 600px;
	width: 100%;
}
.left {
	width: 1200px;
}
.main {
	display: flex;
	width: 2000px;
}
.main>div {
	margin: 5px; 
}
.right {
	width: 700px;
	overflow: scroll;
	height: max-content;
	padding-bottom: 100px;
}
table {
	width: 100%;
}
.span_td {
	display:  flex;
	flex-direction: column;
}
</style>