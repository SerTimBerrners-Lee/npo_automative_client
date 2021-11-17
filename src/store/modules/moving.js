import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    moving: [],
  },
  getters: { 
    getMoving(state) {
      return state.moving
    },
  }, 
  actions: {
    async fetchAllMovings(ctx) { 
      const res = await fetch(`${PATH_TO_SERVER}api/moving`)
			if(res.ok) {
				const result = await res.json()
        ctx.commit('allMoving', result)
        return result
			}
    },
		async fetchCreateMoving(ctx, data) { 
      console.log(data)
      const res = await fetch(`${PATH_TO_SERVER}api/moving`, {
				method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data})
			})
			
			if(res.ok) 
				return true
			return false
    },
  },
  mutations: {
    allMoving(state, result) { 
      state.moving = result
    },
    addNewMoving(state, result) {
      state.moving.push(result)
    }
  }
}