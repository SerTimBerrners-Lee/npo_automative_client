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
    async fetchAssemble() { 
      const res = await fetch(`${PATH_TO_SERVER}api/assemble`)
			if(res.ok) {
				const result = await res.json()
				console.log(result)
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
    }
  },
  mutations: {
    allAssemble(state, result) { 
      state.assembles = result
    },
  }
}