<template>
  <div>
    <div> 
      <div>
        <IssueForMe />
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
    <Loader v-if='loader' />
  </div>
</template>

<script>
import { dateIncrementHors } from '@/js/';
import { mapGetters, mapActions } from 'vuex';
import IssueForMe from '@/components/Issue/issue-for-me';
import DatePicterRange from '@/components/DatePicterRange';

export default {
  data() {
    return {
      srokList: [
        'Срочно',
        'Нормально',
        'Отложено',
        'На контроль'
      ],
      loader: false
    }
  },
  components: { DatePicterRange, IssueForMe },
  computed: mapGetters([
    'getAuth',
    'getForMeIssue',
    'getTypeOperations',
  ]),
  methods: {
    ...mapActions(['fetchIssueList', 'getAllTypeOperations']),
    dateIncrementHors(date, hors) {
      const dat = dateIncrementHors(date, hors);
      return `${dat.day}.${dat.mount}.${dat.year}`;
    },
    incrementDay(date, hors) {
      const dat = dateIncrementHors(date, hors);
      return `${dat.iterationHors}`;
    },
    changeDatePicterRange(val) {
			console.log(val);
		}
  },
  async mounted() {
    this.loader = true;
    if(this.getAuth && this.getAuth.id) 
      await this.fetchIssueList(this.getAuth.id);

    await this.getAllTypeOperations();
    this.loader = false;
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
}
td {
  border: 1px solid #d3d3d3;
}
.block-one {
  width: max-content;
}
.block-one>.scroll-table{
  width: inherit;
}
</style>