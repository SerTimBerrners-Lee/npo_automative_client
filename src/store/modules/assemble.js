import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    assembles: [],
    filter_assembl: []
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
    },
    async fetchAllAssembleTypeOperation(ctx, op_id) { 
      const res = await fetch(`${PATH_TO_SERVER}api/assemble/typeoperation/${op_id}`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('allAssembleOperation', result)
        return result 
      }
    }
  },
  mutations: {
    allAssemble(state, result) { 
      state.assembles = result
    },
    allAssembleOperation(state, result) { 
      state.assembles = []
      for(let r of result) {
        let {description, id, ...operation} = r.operation
        state.assembles.push({...operation, ...r.ass, description, operation_id: id})
      }
    },
    filterAssemblByShipments(state, cbeds) {
      let new_arr = []
      for(let ass of state.assembles) {
        for(let cbed of cbeds) {
          if(cbed.id == ass.cbed.id) new_arr.push(ass)
        }
      }
      if(state.filter_assembl.length == 0)
        state.filter_assembl = state.assembles 
      state.assembles = new_arr
    },
    breackFIlterAssembl(state) {
      state.assembles = state.filter_assembl
    }
  }
}