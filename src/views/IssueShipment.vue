<template>
	<div>
		<h3>Задачи на отгрузку</h3>
		<div class="block header_block">
			<span>Дата:</span>
			<input type="text">
			<span>Выбрать период, с:</span>
			<input type="text">
			<span>по:</span>
			<input type="text">
			<button class="btn-small">Сбросить период</button>
		</div>

		<div>
			<h3>Комлектация</h3>
			<div class="table-scroll">
				<table> 
					<tr>
						<th>Заказ</th>
						<th>Артикул изделия</th>
						<th>Наименование изделия</th>
						<th>Комплектация/особенности заказа</th>
						<th>Кол-во, шт.</th>
						<th>Срок отгрузки</th>
						<th>Осталось дней</th>
						<th>Основание</th>
						<th>Покупатель</th> 
						<th>Готовность к отгрузки в %</th>
						<th>Статус</th>
						<th>Дата отгрузки</th>
						<th>Н/Ч требуется</th>
						<th>Н/Ч выполнено</th>
						<th>Н/Ч осталось</th>
						<th>Примечание</th>
					</tr>
					<tr v-for='shipments of getShipments'
						:key='shipments'
						class='td-row'
						@click='e => setShipments(shipments, e.target.parentElement)'>
						<td>{{ shipments.number_order }}</td>
						<td>{{ shipments.product.articl }}</td>
						<td>{{ shipments.product.name }}</td>
						<td>
							<div class='osob' v-if='shipments.list_cbed_detal'>
									<p v-for='(izd, inx) of JSON.parse(shipments.list_cbed_detal)'
										:key='izd'><b>{{ inx + '. ' }}</b> {{ izd.obj.name }}</p>
							</div>
						</td>
						<td>{{ shipments.kolvo }}</td>
						<td>{{ dateIncrementHors(shipments.date_order, shipments.day_when_shipments) }}</td>
						<td>{{ incrementDay(shipments.date_order, shipments.day_when_shipments)  }}</td>
						<td>{{ shipments.base }}</td>
						<td>{{ shipments.buyer.name }}</td>
						<td></td>
						<td></td>
						<td>{{ dateIncrementHors(shipments.date_order, shipments.day_when_shipments) }}</td>
						<td></td>
						<td></td>
						<td></td>
						<td>{{ shipments.description }}</td>
					</tr>
				</table>
			</div>

			<div class="btn-control">
        <button 
					class="btn-small">
          Сбросить все фильтры
        </button>
        <button class="btn-small">
            Удалить
        </button>
				<button class="btn-small">
					Изменить
        </button>
				<button class="btn-small btn-add" @click='$router.push("/addorder")'>
          Создать заказ
        </button>
      </div>
		</div>

	</div>
</template> 

<script>
import {mapActions, mapGetters} from 'vuex';
import { dateIncrementHors } from '@/js/';
export default {
	data() {
		return {
			selectShipments: null,
			tr: null
		}	
	},
	computed: mapGetters(['getShipments']),
	methods: {
		...mapActions(['fetchAllShipments']),
		setShipments(shipments, e) {
			if(this.tr && this.selectShipments.id == shipments.id) {
				this.tr.classList.remove('td-row-all')
				this.selectShipments = null 
			}
			if(this.tr) this.tr.classList.remove('td-row-all')
			this.tr = e 
			this.tr.classList.add('td-row-all')
			console.log(shipments)
			this.selectShipments = shipments;
		},
		dateIncrementHors(date, day) {
      let dat = dateIncrementHors(date, day*24)
      return `${dat.day}.${dat.mount}.${dat.year}`
    },
    incrementDay(date, day) {
      let dat = dateIncrementHors(date, day*24)
      return `${dat.iterationHors}`
    },
	},
	async mounted() {
		await this.fetchAllShipments()
	}
}
</script>

<style scoped>
.osob {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
}
.osob * {
	margin: 0px;
}
</style>