import PATH_TO_SERVER from '@/js/path.js'

export default {
	state: {
		issues: []
	},
	getters: { 
		getIssues(state) {
			return state.issues
		}
	}, 
	actions: {
		async createIssue(ctx, data) { 
			const res = await fetch(`${PATH_TO_SERVER}api/issue`, {
				method: "post",
				body: data
			})
			const result = await res.json()
			ctx.commit('addIssueMutation', result)
			return result
		},
		async fetchIssueList(ctx) { 
			const res = await fetch(`${PATH_TO_SERVER}api/issue`)
			const result = await res.json()
			ctx.commit('updateIssues', result)
			return result
		}
	},
	mutations: {
		updateIssues(state, issues) { 
			state.issues = issues
		},
		addIssueMutation(state, issue) {
			state.issues.push(issue)
		}
	}
}