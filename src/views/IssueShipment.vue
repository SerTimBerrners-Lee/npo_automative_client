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
export default {
	data() {
		return {

		}
	},
	methods: {

	},
	async mounted() {

	}
}
</script>

<style scoped>

</style>