<template>
	<div>
		<h3>Задачи</h3>
    <div class='head_block'>
      <div class="block">
        <span>Дата:</span>
        <input type="text">
        <span>Выбрать период, с:</span>
        <input type="text">
        <span>по:</span>
        <input type="text">
        <button class="btn-small">Сбросить период или дату</button>
      </div>
      <button class='btn-add btn' @click='addIssue'>Дать задачу</button>
    </div>

    <div> 
      <h3>Задачи для меня</h3>
      <div class="type-issue">
        <span class='first_span'>Новые</span>
        <span>В работе</span>
        <span>Просроченные</span>
        <span>Выполненные</span>
        <span>Все</span>
      </div>
      <div class="table-scroll" style='margin-left: 5px;'>
        <table>
          <tr>
            <th>№</th>
            <th>Дата задачи</th>
            <th>Осталось дней</th>
            <th>Источник</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Срочность</th>
            <th>Исполнитель</th>
            <th>Выполнить до</th>
            <th>Время на выполнение, ч</th>
            <th>Контролер</th>
            <th>Контроль до</th>
            <th>Время на контроль, ч</th>
            <th>Статус</th>
          </tr>
        </table>
      </div>
    </div>
    
    <div>
      <h3>Задачи от меня </h3>
      <div class="type-issue">
        <span class='first_span'>Новые</span>
        <span>В работе</span>
        <span>Просроченные</span>
        <span>Выполненные</span>
        <span>Все</span>
      </div>
      <div class="table-scroll" style='margin-left: 5px;'>
        <table>
          <tr>
            <th>№</th>
            <th>Дата задачи</th>
            <th>Источник</th>
            <th>Исполнитель</th>
            <th>Контролер</th>
            <th>Примечание</th>
            <th>Привязка</th>
            <th>Срочность</th>
            <th>Выполнить до</th>
            <th>Статус</th>
          </tr>
        </table>
      </div>
    </div>

    <div>
      <h3>Контроль выполнения</h3>
      <div class="type-issue">
        <span class='first_span'>Новые</span>
        <span>В работе</span>
        <span>Просроченные</span>
        <span>Выполненные</span>
        <span>Все</span>
      </div>
      <div class="table-scroll" style='margin-left: 5px;'>
        <table>
          <tr>
            <th>№</th>
            <th>Дата задачи</th>
            <th>Источник</th>
            <th>Исполнитель</th>
            <th>Контролер</th>
            <th>Примечание</th>
            <th>Привязка</th>
            <th>Срочность</th>
            <th>Выполнить до</th>
            <th>Контроль до</th>
            <th>Статус</th>
          </tr>
        </table>
      </div>
    </div>

    <div>
      <h3>Общецеховые задачи</h3>
      <div class="type-issue">
        <span class='first_span'>Новые</span>
        <span>В работе</span>
        <span>Просроченные</span>
        <span>Выполненные</span>
        <span>Все</span>
      </div>
      <div class="table-scroll" style='margin-left: 5px;'>
        <table>
          <tr>
            <th>№</th>
            <th>Дата задачи</th>
            <th>Источник</th>
            <th>Контролер</th>
            <th>Примечание</th>
            <th>Выполнить до</th>
            <th>Статус</th>
          </tr>
        </table>
      </div>
    </div>
  <AddIssue 
    v-if='showAddIssue'
    :key='keyAddIssue'
    @unmount='unmount'
  />
	</div>
</template>

<script>
import {random} from 'lodash';
import AddIssue from '@/components/issue/add-issue.vue';
export default {
	data() {
		return{
      showAddIssue: false,
      keyAddIssue: random(1, 999)
		}
	},
	components: {AddIssue},
	methods: {
    addIssue() {
      this.showAddIssue = true
      this.keyAddIssue = random(1, 999)
    },
    unmount(res) {
      console.log(res)
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
.head_block {
  display: flex;
  align-items: center;
  align-content: center;
}
.head_block .block {
  width: 80%; 
}
.btn {
  margin-top: 0px;
}
.first_span {
  color: #c90000;
}
</style>