<template>
	<div>
		<h3>Задачи</h3>
    <div class='head_block'>
      <div class="block">
        <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
      </div>
      <button class='btn-add btn' @click='addIssue'>Дать задачу</button>
    </div>
    <IssueForMe v-if='!loader'/>
    
    <IssueMy v-if='!loader' />

    <IssueController v-if='!loader' />

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
    @unmount='unmount_issue'
    :editIssue='selectedIssue'
    :is_me='is_me'
  />
  <Loader v-if='loader' />
	</div>
</template>
<script>
import {random} from 'lodash';
import { dateIncrementHors } from '@/js/';
import { mapActions, mapGetters } from 'vuex'; 
import IssueMy from '@/components/Issue/IssueMy';
import AddIssue from '@/components/Issue/AddIssue';
import IssueForMe from '@/components/Issue/IssueForMe';
import DatePicterRange from '@/components/DatePicterRange';
import IssueController from '@/components/Issue/IssueController';

export default {
	data() {
		return{
      showAddIssue: false,
      keyAddIssue: random(1, 999),
      is_me: null,
      srokList: [
        'Срочно',
        'Нормально',
        'Отложено',
        'На контроль'
      ],
      statusList: ['Новое', 'В работе', 'Просроченно', 'Выполнено'],
      selectedIssue: null,
      loader: false,
      span_is_me: null,
      span_to_me: null,
      span_controler_me: null
		}
	},
  computed: 
    mapGetters([
      'getAuth',
    ]),
	components: {
    AddIssue, 
    IssueForMe,
    DatePicterRange, 
    IssueMy,
    IssueController
  },
	methods: {
    ...mapActions(['fetchIssueList']),
    addIssue() {
      this.showAddIssue = true
      this.keyAddIssue = random(1, 999)
      this.selectedIssue = null
    },
    unmount_issue() {
      this.selectedIssue = null
    },
    dateIncrementHors(date, hors) {
      let dat = dateIncrementHors(date, hors)
      return `${dat.day}.${dat.mount}.${dat.year}`
    },
    incrementDay(date, hors) {
      let dat = dateIncrementHors(date, hors)
      return `${dat.iterationHors}`
    },
    showIssue(issue) {
      this.addIssue()
      this.selectedIssue = issue
    },
    showIssueMe(issue) {
      this.showIssue(issue)
      this.is_me = 'me'
    },
    changeDatePicterRange(val) {
      console.log(val)
    },
	}, 
	async mounted() {
    this.loader = true
    if(this.getAuth && this.getAuth.id) 
      await this.fetchIssueList(this.getAuth.id)

    this.loader = false
	}
}
</script>
<style scoped>
.select-small {
  border:none;
  background: white;
  min-width: 95%;
  max-width: 95%;
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
</style>