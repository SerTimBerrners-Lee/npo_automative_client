<template>
	<div>
		<h3>Контроль выполнения</h3>
		<div class="type-issue">
			<span 
				class='first_span'
				@click='issueControler(1)'>Новые</span> 
			<span @click='e => issueControler(2, e.target)'>В работе</span>
			<span @click='e => issueControler(3, e.target)'>Просроченные</span>
			<span @click='e => issueControler(4, e.target)'>Выполненные</span>
			<span @click='e => issueControler(0, e.target)'>Все</span>
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
		<AddIssue 
				v-if='showAddIssue'
				:key='keyAddIssue'
				@unmount='unmount_issue'
				:editIssue='selectedIssue'
			/>
	</div>
</template>
<script>
import {random} from 'lodash'                                     ;
import { mapGetters, mapMutations } from 'vuex'       						; 
import AddIssue from '@/components/issue/add-issue.vue'           ;
import { dateIncrementHors } from '@/js/'                         ;
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
	computed:  mapGetters(['getMyController']),
	components: {AddIssue},
	methods: {
		...mapMutations(['filterIssueControllerMe']),
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
		issueControler(instans = 0, e = null) {
      this.filterIssueControllerMe(instans)
      if(this.span_controler_me) this.span_controler_me.classList.remove('active')
      if(!e) return false
      this.span_controler_me = e;
      this.span_controler_me.classList.add('active')
    },
	},
	async mounted() {
		this.issueControler(1)
	}
}
</script>