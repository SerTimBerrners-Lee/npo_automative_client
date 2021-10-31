import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    assembles: [],
  },
  getters: { 
    getAssembles(state) {
      return state.assembles
    },
  }, 
  actions: {
    async fetchAssemble(ctx) { 
      const res = await fetch(`${PATH_TO_SERVER}api/assemble`)
			if(res.ok) {
				const result = await res.json()
				ctx.commit('allAssemble', result)
			} 
    },
		async fetchCreateAssemble(ctx, data) { 
      const res = await fetch(`${PATH_TO_SERVER}api/assemble`, {
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify({...data})
			})
			
			if(res.ok) 
				return true
			return false
    },
    async fetchAssembleById(ctx, id) { 
      const res = await fetch(`${PATH_TO_SERVER}api/assemble/${id}`)
			if(res.ok) {
				const result = await res.json()
				return result
			} 
    }
  },
  mutations: {
    allAssemble(state, result) { 
      state.assembles = result
    },
  }
}