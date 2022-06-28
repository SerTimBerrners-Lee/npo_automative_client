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
							<th>Тип</th>
							<th>Артикул</th> 
							<th>Наименование</th>
							<th>Кол-во</th>
							<th>№ Заказа</th>
							<th>Дата</th>
							<th>Изделие</th>
							<th>Заказчик</th>
						</tr>
						<tbody v-for='way of getAllWaybills' :key='way.id'>
							<tr v-for='(product, inxz) of parseProduct(way.product)' :key='product.id'>
								<td>
									<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
										<p class="checkbox_block" @click='e => select(product, way, e.target)'></p>
									</div>
								</td>
								<td class='center'>{{ inxz + 1 }}</td>
								<td class='center'>{{ new Date(way.createdAt).toLocaleString('ru-RU').split(',')[0] }}</td>
								<td class='center' v-if='way.type_сoming === "Поставщик"'>ПД</td>
								<td class='center' v-else>{{ way.type_сoming == 'Металлообработка' ? 'Д' : 'СБ' }}</td>
								<td>{{ product.art }}</td>
								<td>{{ product.name }}</td>
								<td>{{ product.kol }}</td>
								<td>...</td>
								<td>...</td>
								<td>...</td>
								<td>...</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="btn-control">
					<button class="btn-small">Просмотр</button>
					<button class="btn-small">Печать</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { eSelectSpan } from '@/js/methods';
import { mapGetters, mapActions } from 'vuex';
import DatePicterRange from '@/components/DatePicterRange';
export default {
	data() {
		return {
			span: null,
			instansLet: 0,

			material: null,
			span_material: null,
			selectWayl: null,
			selectProd: null,
			tr: null,
		}
	},
	computed: mapGetters(['getAllWaybills']),
	components: { DatePicterRange },
	methods: {
		...mapActions(['fetchWaybill']),
		changeDatePicterRange(val) {
      console.log(val)
    },
		select(prod, way, e) {
			this.tr = eSelectSpan(this.tr, e, 'checkbox_block_select');
			this.selectWayl = way;
			this.selectProd = prod;
		},
		parseProduct(json) {
			try {
				const pars = JSON.parse(json);
				return pars;
			} catch(err) {
				console.error(err);
				return [];
			}
		}
	},
	async mounted() {
		await this.fetchWaybill();
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