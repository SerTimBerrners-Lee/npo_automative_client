import Req from '../../js/req';

export default {
  state: {
    moving: [],
  },
  getters: { 
    getMoving(state) {
      return state.moving;
    },
  }, 
  actions: {
    async fetchAllMovings(ctx) { 
      const res = await Req(`api/moving`);
			if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('allMoving', result);
      return result;
    },
		async fetchCreateMoving(ctx, data) {
      const res = await Req(`api/moving`, {
				method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data})
			})
			
			if (!res.ok) return false;
			return true;
    },
  },
  mutations: {
    allMoving(state, result) { 
      state.moving = result;
    },
    addNewMoving(state, result) {
      state.moving.push(result);
    }
  }
}