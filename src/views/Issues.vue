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
          <tr v-for='issue of getMyIssues' 
            :key='issue' 
            @click='showIssue(issue)'
            class='td-row'>
            <td class='center'>{{ issue.name.split('от')[0].slice(1, 2) }}</td>
            <td class="center">{{ issue.dateUse }}</td>
            <td>{{ issue.sourse ? JSON.parse(issue.sourse).login : '' }}</td>
            <td>
               <select class="select-small">
                <option v-for='us in issue.users' 
                  :value='us.id' :key='us'>{{ us.login }}</option>
              </select>
            </td>
            <td>
              <select class="select-small">
                <option v-for='us in issue.controllers' 
                  :value='us.id' :key='us'>{{ us.login }}</option>
              </select>
            </td>
            <td>{{ issue.description }}</td>
            <td>
              <select class="select-small">
                <option v-for='us in JSON.parse(issue.izdList)' 
                  :value='us.id' :key='us'>{{ us.name }}</option>
              </select>
            </td>
            <td class='center'>{{ srokList[issue.srok] }}</td>
            <td>{{ dateIncrementHors(issue.dateUse, issue.normTime) }}</td>
            <td>{{ issue.status }}</td>
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
          <tr v-for='issue in getMyController' 
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
    :editIssue='selectedIssue'
  />
	</div>
</template>

<script>
import {random} from 'lodash';
import AddIssue from '@/components/issue/add-issue.vue';
import { mapActions, mapGetters } from 'vuex'; 
import { dateIncrementHors } from '@/js/';
import DatePicterRange from '@/components/date-picter-range.vue';

export default {
	data() {
		return{
      showAddIssue: false,
      keyAddIssue: random(1, 999),

      srokList: [
        'Срочно',
        'Нормально',
        'Отложено',
        'На контроль'
      ],
      selectedIssue: null
		}
	},
  computed: 
    mapGetters([
      'getAuth',
      'getForMeIssue',
      'getMyIssues',
      'getMyController'
    ]),
	components: {AddIssue, DatePicterRange},
	methods: {
    ...mapActions(['fetchIssueList']),
    addIssue() {
      this.showAddIssue = true
      this.keyAddIssue = random(1, 999)
      this.selectedIssue = null
    },
    unmount(res) {
      console.log(res)
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
    changeDatePicterRange(val) {
      console.log(val)
    }
	}, 
	async mounted() {
    if(this.getAuth && this.getAuth.id) 
      this.fetchIssueList(this.getAuth.id)
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
.first_span {
  color: #c90000;
}
</style>