<template>
	<div>
		<h3>Создать заказ</h3>
		<div class="block">
			<p>
				<span>Номер заказа: </span>
				<input type="text">
				<span>Дата заказа:</span>
				<input type="text">
				<span>Выбрать изделие: </span>
				<button class="btn-small btn-add">Выбрать</button>
				<span>Количество:</span>
				<input type="text">
			</p>
			<p>
				<span>Рабочих дней до отгрузки:</span>
				<input type="text">
				<span>Дата отгрузки:</span>
				<input type="text">
				<span>Бронь:</span>
				<input type="text">
				<span>Основание:</span>
				<input type="text">
				<span>Покупатель:</span>
				<input type="text">
				<span>На склад:</span>
				<input type="text">
			</p>
		</div>
		<div class='table_block'>
			<div>
				<h3>Комплектация изделия</h3>
				<table>
					<tr>
						<th>№</th>
						<th>Наименование СБ или детали</th>
						<th>Кол-во</th>
					</tr>
				</table>
				<div class="btn-control">
					<button class="btn-small">Удалить</button>
					<button class="btn-small" @click='addDetal'>Добавить СБ/деталь</button>
				</div>
			</div>
			<div>
				<h3>Примечание</h3>
				<textarea></textarea>
			</div>
		</div>
		<div class="btn-control out-btn-control">
			<button 
				class="btn-status" 
				style="height: 0px;">
				Отменить 
			</button>
				<button 
				class="btn-status" 
				style="height: 0px;">
				Добавить новое изделие к заказу
			</button>
			<button 
				class="btn-status btn-black" 
				style="height: 0px;">
				Сохранить Заказ
			</button>
		</div>
		<BaseDetalModal 
			v-if='showBFM'
			:key='generateKeyBFM'
			@responsDetal='responsDetal'
			:listDetal='listDetal'
		/>
	</div>
</template>

<script>
import BaseDetalModal from '@/components/basedetal/base-detal-modal.vue';
import {random} from 'lodash';
export default {
	data() {
		return{
			listDetal: [],
			showBFM: false,
			generateKeyBFM: random(1, 999)
		}
	},
	components: {BaseDetalModal},
	methods: {
		addDetal() {
			this.showBFM = true;
			this.generateKeyBFM = random(1, 999)
		}
	},
	async mounted() {

	}
}
</script>
<style scoped>
.block p * {
	margin-left: 5px;
}
.block p input {
	width: 60px;
}
.table_block {
	display: flex;
}
.table_block * {
	margin: 10px;
}
textarea {
	height: 140px;
}
.out-btn-control{
  position: fixed;
  width: 85%;
  bottom: 10px;
}
</style>