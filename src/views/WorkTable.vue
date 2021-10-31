<template>
  <div>
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
          <tr v-for='issue in getForMeIssue' 
            @click='(issue)'
            :key='issue'>
            <td class='center'>{{ issue.name.split('от')[0].slice(1, 2) }}</td>
            <td class="center">{{ issue.dateUse }}</td>
            <td class='center'>{{ incrementDay(issue.dateUse, issue.normTime) }}</td>
            <td>{{ issue.sourse ? JSON.parse(issue.sourse).login : '' }}</td>
            <td>{{ issue.name }}</td>
            <td class='center'>{{ srokList[issue.srok] }}</td>
            <td>
              <select class="select-small">
                <option v-for='us in issue.users' 
                  :value='us.id' :key='us'>{{ us.login }}</option>
              </select>
            </td>
            <td>{{ dateIncrementHors(issue.dateUse, issue.normTime) }}</td>
            <td class='center'>{{ issue.normTime }}</td>
            <td>
              <select class="select-small">
                <option v-for='us in issue.controllers' 
                  :value='us.id' :key='us'>{{ us.login }}</option>
              </select>
            </td>
            <td>{{ dateIncrementHors(issue.dateUse, issue.normTime) }}</td>
            <td class='center'>{{ issue.srok_control }}</td>
            <td>{{ issue.status }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="block-two">
      <h3>План по операциям</h3>
      <div class="operation-block">
        <div class="type-operation" v-for='(operation, inx) of getTypeOperations' :key='operation'>
          <span>{{ inx }}.</span>
          <span>{{ operation.name }}</span>
        </div>
      </div>
    </div>
    <div>
      <h3>Результаты работы</h3>
      <div class='header_block'>
        <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
        <span>Кол-во рабочих дней в периоде: </span>
        <input type="number" min='0' class="input-periud">
      </div>
      <div class="scroll-table" style="width: inherit;">
        <table class="wort-page-table">
          <tr>
            <th colspan="11" scope="colgroup"></th>
            <th colspan="3" scope="colgroup">За 1 шт.</th>
            <th colspan="3" scope="colgroup">За партию.</th>
            <th colspan="7" scope="colgroup"></th>
          </tr>
          <tr>
            <th>Табельный номер</th>
            <th>Сотрудник</th>
            <th>Дата</th>
            <th>Наименование действия(выполнение задания, выполнение операции с производства или сборки, действия в ПО Конструктор - создал, изменил и т.д)</th>
            <th>Тип </th>
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
            <th>Итого по сотруднику за день.</th>
            <th>План за период, н.ч.</th>
            <th>Итого по сотруднику за период, н.ч.</th>
            <th>Потери выработки за период, н.ч.</th>
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
import { mapGetters, mapActions} from 'vuex';
import { dateIncrementHors } from '@/js/';
import DatePicterRange from '@/components/date-picter-range.vue';
export default {
  data() {
    return {
      srokList: [
        'Срочно',
        'Нормально',
        'Отложено',
        'На контроль'
      ],
    }
  },
  components: {DatePicterRange},
  computed: mapGetters([
    'getAuth',
    'getForMeIssue',
    'getTypeOperations',
  ]),
  methods: {
    ...mapActions(['fetchIssueList', 'getAllTypeOperations']),
    dateIncrementHors(date, hors) {
      let dat = dateIncrementHors(date, hors)
      return `${dat.day}.${dat.mount}.${dat.year}`
    },
    incrementDay(date, hors) {
      let dat = dateIncrementHors(date, hors)
      return `${dat.iterationHors}`
    },
    changeDatePicterRange(val) {
			console.log(val)
		}
  },
  async mounted() {
    if(this.getAuth && this.getAuth.id) 
      this.fetchIssueList(this.getAuth.id)
    this.getAllTypeOperations()
  }
}
</script>

<style>
.select-small{
  width: 98%;
}
.container {
  flex-direction: column;
  padding: 10px;
  margin: 40px;
  margin-left: 210px;
  padding-top: 40px;
}
table {
  border: 1px solid #d3d3d3;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 16px;
}
.wort-page-table {
  font-size: 16px;
}
th {
  border: 1px solid #d3d3d3;
  padding: 10px;
}
td {
  border: 1px solid #d3d3d3;
  padding: 10px;
}
.block-one {
  width: max-content;
}
.block-one>.scroll-table{
  width: inherit;
}
</style>