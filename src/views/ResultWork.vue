<template>
	<div>
		<h3>Результаты работы</h3>
    <div class="type-issue">
      <span>По сотрудникам</span>
      <span>По оборудованию</span>
    </div>
		<div class="block header_block">
        <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
      <span>Кол-во рабочих дней в период:</span>
      <input type="text">
    </div>
    <div>
      <div class="table-scroll" style='margin-left: 5px;'>
        <table>
          <tr>
            <th scope="col" colspan="11"></th>
            <th scope="col" colspan="3">За 1 шт.</th>
            <th scope="col" colspan="3">За партию</th>
            <th scope="col" colspan="7"></th>
          </tr>
          <tr>
            <th>Табельный номер</th>
            <th>Сотрудник</th>
            <th>Дата</th>
            <th>Наименование действий (выполнение задания, выполнение операции с производства или сборки, действия в ПО Конструктор - создал, изменил и т.д.)</th>
            <th>Тип</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Заказ</th>
            <th>Время</th>
            <th>Примечание</th>
            <th>Кол-во, шт.</th>
            <th>Подготовит-е время, н.ч.</th>
            <th>Вспомогат-е время, н.ч.</th>
            <th>Машинное время, н.ч.</th>
            <th>Подготовит-е время, н.ч.</th>
            <th>Вспомогат-е время, н.ч.</th>
            <th>Машинное время, н.ч.</th>
            <th>Всего, н.ч.</th>
            <th>Задания, н.ч.</th>
            <th>План за день, н.ч.</th>
            <th>Итого по сотруднику за день</th>
            <th>План за период, н.ч.</th>
            <th>Итого по сотруднику за период, н.ч.</th>
            <th>Потери выработки за период, н.ч.</th>
          </tr>
            <tr>
            <th scope="col" colspan="20"></th>
            <th>Итого, н.ч.</th>
            <th></th>
            <th></th>
          </tr>
        </table>
      </div>
      <div class="btn-control">
        <button class="btn-small">Печать</button>
      </div>
    </div>
	</div>
</template>

<script>
import DatePicterRange from '@/components/DatePicterRange';

export default {
	data() {
		return{
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
.block {
  padding: 5px;
}
.block .btn {
  margin: 0px;
}
.block * {
  margin-left: 5px;
}
.block  input {
  width: 90px;
}
</style>