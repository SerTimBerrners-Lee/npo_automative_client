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
							<th colspan='3'>Накладные</th>
							<th colspan='4'>Информация о заказе</th>
						</tr>
						<tr>
							<th>№</th>
							<th>Дата</th>
							<th>Основание</th>
							
							<th>№ Заказа</th>
							<th>Комплектация</th>
							<th>Дата</th>
							<th>Изделие</th>
							<th>Заказчик</th>
						</tr>
						<tbody v-for='(complit, idx) of getShComplits' :key='complit.id'>
							<tr>
								<td :rowspan='complit.shipments.length + 1 || 1'>
									<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
										<p class="checkbox_block" @click='e => select(sh, e.target)'></p>
									</div>
								</td>
								<td :rowspan='complit.shipments.length + 1 || 1' class='center'>{{ idx + 1 }}</td>
								<td :rowspan='complit.shipments.length + 1 || 1' class='center'>{{ new Date(complit.createdAt).toLocaleString('ru-RU').split(',')[0] }}</td>
								<td :rowspan='complit.shipments.length + 1 || 1'>{{ complit.base }}</td>
							</tr>
							<tr v-for='(sh) of complit.shipments' :key='sh.id'>
								<td>{{ sh.number_order }}</td>
								<td class='center'>
									<img 
										src="@/assets/img/link.jpg" 
										@click='openComplect(sh)' 
										class='link_img' 
										atl='Показать' />
								</td>
								<td>{{ sh.date_order }}</td>
								<td>{{ sh.product?.name || '-' }}</td>
								<td>{{ sh.buyer?.name || 'Склад' }}</td>
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
	<KomplectCon 
		v-if='komplectIs'
		:key='komplectKey'
		:sh='selectSh'
	/>
</template>
<script>
import { random } from 'lodash';
import KomplectCon from './KomplectCon';
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
			selectSh: null,
			tr: null,

			komplectIs: false,
			komplectKey: random(1, 999),
		}
	},
	computed: mapGetters(['getShComplits']),
	components: { DatePicterRange, KomplectCon },
	methods: {
		...mapActions(['fetchShComplit']),
		changeDatePicterRange(val) {
      console.log(val)
    },
		select(sh, e) {
			this.tr = eSelectSpan(this.tr, e, 'checkbox_block_select');
			this.selectSh = sh;
		},
		openComplect(sh) {
			this.selectSh = sh;
			this.komplectIs = true;
			this.komplectKey = random(1, 999);
		}
	},
	async mounted() {
    await this.fetchShComplit();
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