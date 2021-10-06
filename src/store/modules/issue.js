import PATH_TO_SERVER from '@/js/path.js'

export default {
	state: {
		issues: [],

		forMeIssue: [],
		myIssues: [],
		myController: [],

	},
	getters: { 
		getIssues(state) {
			return state.issues
		},
		getForMeIssue(state) {
			return state.forMeIssue
		},
		getMyIssues(state) {
			return state.meIssues
		},
		getMyController(state) {
			return state.myController
		}
	}, 
	actions: {
		async createIssue(ctx, data) { 
			const res = await fetch(`${PATH_TO_SERVER}api/issue`, {
				method: "post",
				body: data
			})
			if(res.ok) {
				const result = await res.json()
				ctx.commit('addIssueMutation', result)
				return result
			}
		},
		async fetchIssueList(ctx, userId) { 
			const res = await fetch(`${PATH_TO_SERVER}api/issue`)
			const result = await res.json()
			ctx.commit('updateIssues', result)
			ctx.commit('issueTypesMutation', userId)
			return result
		}
	},
	mutations: {
		updateIssues(state, result) { 
			state.issues = result
		},
		issueTypesMutation(state, userId) {
			console.log(state.issues[state.issues.length - 1])
			state.issues.filter(issue => {
				state.forMeIssue = []
				state.myController = []
				state.myIssues = []
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
				// которые я сооздал
				if(issue.sourse) {
					try {
						let issuePars = JSON.parse(issue.sourse)
						state.myIssues.push(issuePars)
					} catch(e) {
						console.error(e)
					}
				}
			})
		},
		addIssueMutation(state, issue) {
			state.issues.push(issue)
		}
	}
}