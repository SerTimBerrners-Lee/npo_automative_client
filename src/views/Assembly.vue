<template>
	<div>
		<h3>Сборка</h3>
		<div class="block">
      <button class="btn" @click='$router.push("/cboperation")'>Сборочные единицы по операциям</button>
    </div>
    <div class='table_block'>
      <div class="table-scroll">
        <table>
          <tr>
            <th><unicon name="check" fill="royalblue" /></th>
            <th>Заказ покупателя из задач на отгрузку</th>
            <th>Дата отгрузки покупателю</th>
          </tr>
        </table>
      </div>
      <div class="table-scroll" style='margin-left: 5px;'>
        <table>
          <tr>
            <th>Заказ склада</th>
            <th>Дата готовности</th>
            <th>Сборочная единица</th>
            <th>Кол-во ВСЕГО по заказу склада, шт.</th>
            <th>Кол-во в т.ч. по заказу покупателя, шт.</th>
            <th>Операции</th>
            <th>Готовность</th>
            <th>Готовность к сборке</th>
            <th>Статус</th>
            <th>Документы</th>
            <th>Время на сборку, ч</th>
            <th>Примечание</th>
          </tr>
        </table>
      </div>
    </div>
     <div class="btn-control">
        <button class="btn-small">Печать</button>
        <button class="btn-small">Сбросить все фильтры</button>
      </div>
	</div>
</template>

<script>

export default {
	data() {
		return{
		}
	},
	components: {},
	methods: {
	
	},
	async mounted() {

	}
}
</script>
<style scoped>
.table_block{
  display: flex;
}
.block {
  padding: 5px;
}
.block .btn {
  margin: 0px;
}
</style>