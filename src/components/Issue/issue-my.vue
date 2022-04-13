<template>
	<div>
      <h3>Задачи от меня </h3>
      <div class="type-issue">
        <span 
          class='first_span'
          @click='issueMy(1)'>Новые</span> 
        <span @click='e => issueMy(2, e.target)'>В работе</span>
        <span @click='e => issueMy(3, e.target)'>Просроченные</span>
        <span @click='e => issueMy(4, e.target)'>Выполненные</span>
        <span @click='e => issueMy(0, e.target)'>Все</span>
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
			<AddIssue 
				v-if='showAddIssue'
				:key='keyAddIssue'
				@unmount='unmount_issue'
				:editIssue='selectedIssue'
			/>
    </div>
</template>

<script>
import { random } from 'lodash';
import { dateIncrementHors } from '@/js/';
import { mapGetters, mapMutations } from 'vuex'; 
import AddIssue from '@/components/Issue/add-issue';

export default {
	data() {
		return {
			span_is_me: null,

			showAddIssue: false,
			keyAddIssue: random(1, 999),
			selectedIssue: null,
			srokList: [
        'Срочно',
        'Нормально',
        'Отложено',
        'На контроль'
      ],
		}
	},
	computed:  mapGetters(['getMyIssues']),
	components: {AddIssue},
	methods: {
		...mapMutations(['filterIssueToMe']),
		unmount_issue() {
      this.selectedIssue = null
    },
		addIssue() {
      this.showAddIssue = true
      this.keyAddIssue = random(1, 999)
      this.selectedIssue = null
    },
		showIssue(issue) {
      this.addIssue()
      this.selectedIssue = issue
    },
		dateIncrementHors(date, hors) {
      let dat = dateIncrementHors(date, hors)
      return `${dat.day}.${dat.mount}.${dat.year}`
    },
    incrementDay(date, hors) {
      let dat = dateIncrementHors(date, hors)
      return `${dat.iterationHors}`
    },
		issueMy(instans = 0, e = null) {
      this.filterIssueToMe(instans)
      if(this.span_to_me) this.span_to_me.classList.remove('active')
      if(!e) return false
      this.span_to_me = e;
      this.span_to_me.classList.add('active')
    },
	},
	async mounted() {
		this.issueMy(1)
	}
}
</script>