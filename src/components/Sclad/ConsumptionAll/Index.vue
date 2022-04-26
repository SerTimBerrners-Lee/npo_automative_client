<template>
	<div>
		<h3>Среднестатистическое потребление</h3>
		<div>
			<div class="type-issue">
        <span class='active'>Продукция</span>
        <span>СБ, Д</span>
        <span>Материалы и прочее</span>
      </div>
			<div class='table-main'>
				<div class="scroll-table" >
					<table>
						<tr>
							<th rowspan="2">Заводской номер</th>
							<th rowspan="2">Артикул</th>
							<th rowspan="2">Наименование</th>
							<th colspan="3">Расчетные значения</th>
						</tr>
						<tr>
							<th>ЕИ</th>
							<th style='width: 50px;'>Минимальный остаток - 1 мес. потребления.</th>
							<th style='width: 50px;'>Минимальный остаток - 3 мес. потребления.</th>
						</tr>
						<tr v-for='tt of 44' :key='tt'>
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
					<button class="btn-small btn-add" @click='openGraph'>График потребления</button>
				</div>
			</div>
		</div>
		<Graph 
			v-if='show_graph'
			:key='key_graph'
		/>
	</div>
</template>

<script> 
import Graph from './Graph';
import { random } from 'lodash';
export default {
	data() {
		return {
			show_graph: false,
			key_graph: random(1, 999)
		}
	},
	components: {Graph},
	methods: {
		openGraph() {
			this.show_graph = true
			this.key_graph = random(1, 999)
		}
	},
	async mounted() {
	}
}
</script>

<style scoped>
.table_material {
	display: flex;
}
.scroll-table {
	height: 700px;
}
.span_td {
	display:  flex;
	flex-direction: column;
}
.table-main {
	width: max-content;
}
.btn-control {
	margin-top: 10px;
}
</style>