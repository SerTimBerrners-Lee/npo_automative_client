import PATH_TO_SERVER from '@/js/path.js'

export default {
	state: {
		issues: [],

		forMeIssue: [],
		myIssues: [],
		myController: [],

		instans_for_me: [],
		instans_to_me: [],
		instans_controller_me: [],
		statusList: ['', 'Новое', 'В работе', 'Просроченно', 'Выполнено'],
	},
	getters: { 
		getIssues(state) {
			return state.issues
		},
		getForMeIssue(state) {
			return state.forMeIssue
		},
		getMyIssues(state) {
			return state.myIssues
		},
		getMyController(state) {
			return state.myController
		}
	}, 
	actions: {
		async createIssue(ctx, data) { 
			const res = await fetch(`${PATH_TO_SERVER}api/issue`, {
				method: "post",
				body: data.data
			})
			if(res.ok) {
				const result = await res.json()
				ctx.commit('pushNewIssue', result)
				ctx.commit('issueTypesMutation', data.user_id)
				return result
			}
		},
		async updateIssue(ctx, data) {
			const res = await fetch(`${PATH_TO_SERVER}api/issue`, {
				method: 'PUT',
				body: data.data
			})
			if(res.ok) {
				const result = await res.json()
				ctx.commit('updateIssueMutation', result)
				ctx.commit('issueTypesMutation', data.user_id)
				return result
			}
		}, 
		async fetchIssueList(ctx, userId) { 
			const res = await fetch(`${PATH_TO_SERVER}api/issue`)
			if(res.ok) {
				const result = await res.json()
				ctx.commit('addAllIssues', result)
				ctx.commit('issueTypesMutation', userId)
				return result
			}
		}
	},
	mutations: {
		addAllIssues(state, result) { 
			state.issues = result
		},
		pushNewIssue(state, issue) {
			state.issues.push(issue)
		},
		updateIssueMutation(state, issue) {
			for(let inx in state.issues) {
				if(state.issues[inx].id == issue.id)
					state.issues[inx] = issue
			}
		},
		issueTypesMutation(state, userId) {
			state.forMeIssue = []
			state.myController = []
			state.myIssues = []

			state.issues.filter(issue => {
				// задачи для меня
				if(issue.users && issue.users.length) {
					issue.users.forEach(user => {
						if(user.id == userId)
							state.forMeIssue.push(issue)
					})
				}
				// где я контроллер
				if(issue.controllers && issue.controllers.length) {
					issue.controllers.forEach(controller => {
						if(controller.id == userId)
							state.myController.push(issue)
					})
				}
				// которые я создал
				if(issue.sourse) {
					try {
						let issuePars = JSON.parse(issue.sourse)
						if(issuePars.id == userId)
							state.myIssues.push(issue)
					} catch(e) {
						console.error(e)
					}
				}
			})
		},
		filterIssueForMe(state, instans) {
			if(state.instans_for_me.length == 0)
				state.instans_for_me = state.forMeIssue
			if(instans == 0)
				return state.forMeIssue = state.instans_for_me

			state.forMeIssue = state.instans_for_me.filter(e => e.status == state.statusList[instans])
		},
		filterIssueToMe(state, instans) {
			if(state.instans_to_me.length == 0)
				state.instans_to_me = state.myIssues
			if(instans == 0)
				return state.myIssues = state.instans_to_me

			state.myIssues = state.instans_to_me.filter(e => e.status == state.statusList[instans])
		},
		filterIssueControllerMe(state, instans) {
			if(state.instans_controller_me.length == 0)
				state.instans_controller_me = state.myController
			if(instans == 0)
				return state.myController = state.instans_controller_me

			state.myController = state.instans_controller_me.filter(e => e.status == state.statusList[instans])
		}
	}
}