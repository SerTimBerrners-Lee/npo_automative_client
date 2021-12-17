import PATH_TO_SERVER from '@/js/path.js';

export default {
  state: {
    metaloworkings: [],
    filter_metal: []
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
        ctx.commit('allMetaloworkingOperation', result)
        return result 
      }
    }
  },
  mutations: {
    allMetaloworking(state, result) { 
      state.metaloworkings = []
      for(let met of result) {
        met.tech_process = []
        if(met.detal && met.detal.techProcesses) {
          met.tech_process = met.detal.techProcesses
        }
        state.metaloworkings.push(met)
      }
    },
    allMetaloworkingOperation(state, result) {
      state.metaloworkings = []
      for(let r of result) {
        r.metal.tech_process = []
        if(r.metal.detal && r.metal.detal.techProcesses) 
          r.metal.tech_process = r.metal.detal.techProcesses

        let {description, id, ...operation} = r.operation
        state.metaloworkings.push({...operation, ...r.metal, description, operation_id: id})
      }
    },
    filterMetaloworkingByShipments(state, detals) {
      let new_arr = []
      for(let met of state.metaloworkings) {
        for(let detal of detals) {
          if(!met.detal) continue
          if(detal.id == met.detal.id) new_arr.push(met)
        }
      }
      if(state.filter_metal.length == 0)
        state.filter_metal = state.metaloworkings 
      state.metaloworkings = new_arr
    },
    breackFIlterMetal(state) {
      if(state.filter_metal.length)
        state.metaloworkings = state.filter_metal
    }
  }
}