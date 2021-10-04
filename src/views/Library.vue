<template>
	<div>
		<h3>Библиотека</h3>
		<div class="block">
      <span>Выбрать пользователя:</span>
      <input type="text">
      <span>Все:</span>
      <input type="text">
    </div>
    <div class='table_block'>
      <div class="table-scroll">
        <table>
          <tr>
            <th>Разделы</th>
          </tr>
          <tr>
            <th>Гидравлика</th>
          </tr>
          <tr>
            <th>Пневматика</th>
          </tr>
          <tr>
            <th>Автоматика</th>
          </tr>
          <tr>
            <th>Микроэлектроника</th>
          </tr>
        </table>
      </div>
      <div>
        <div class="table-scroll" style='margin-left: 5px;'>
          <table>
            <tr>
              <th>Имя файла или ссылки</th>
              <th>Расширение</th>
              <th>Описание</th>
              <th>Избранное</th>
              <th>Загрузил</th>
              <th>Просмотреть или перейти</th>
            </tr>
          </table>
        </div>
        <div class="btn-control">
          <button class="btn-small">В архив</button>
          <button class="btn-small">Забрать себе</button>
          <button class="btn-small">Редактировать</button>
          <button class="btn-small">Добавить файл или ссылку</button>
          <button class="btn-small btn-add">Скачать</button>
        </div>
      </div>
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
.block * {
  margin-left: 5px;
}
.block  input {
  width: 90px;
}
</style>