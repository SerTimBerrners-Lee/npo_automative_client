import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    metaloworkings: [],
  },
  getters: { 
    getMetaloworkings(state) {
      return state.metaloworkings
    },
  }, 
  actions: {
    async fetchMetaloworking(ctx) { 
      const res = await fetch(`${PATH_TO_SERVER}api/metaloworking`)
			if(res.ok) {
				const result = await res.json()
        ctx.commit('allMetaloworking', result)
        return result
			}
    },
		async fetchCreateMetaloworking(ctx, data) { 
      const res = await fetch(`${PATH_TO_SERVER}api/metaloworking`, {
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
    async fetchMetaloworkingById(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/metaloworking/${id}`)
			if(res.ok) {
				const result = await res.json()
				return result
			}
    },
    async fetchAllMetalloworkingTypeOperation(ctx, op_id) { 
      const res = await fetch(`${PATH_TO_SERVER}api/metaloworking/typeoperation/${op_id}`)
      if(res.ok) {
        const result = await res.json()
        console.log(result)
        ctx.commit('allMetaloworkingOperation', result)
        return result 
      }
    }
  },
  mutations: {
    allMetaloworking(state, result) { 
      state.metaloworkings = result
    },
    allMetaloworkingOperation(state, result) {
      state.metaloworkings = []
      for(let r of result) {
        let {description, id, ...operation} = r.operation
        state.metaloworkings.push({...operation, ...r.metal, description, operation_id: id})
      }
    },
  }
}