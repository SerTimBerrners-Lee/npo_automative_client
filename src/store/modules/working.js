import PATH_TO_SERVER from '@/js/path.js';

/**
 * Working
 * Модель в БД
 * Содержит в себе Сборки или Металлообработки,
 * а также другую информацию по конкретному заказу.
 */

export default {
  state: {
    workings: [],
  },
  getters: {
    getWorkings(state) {
      return state.workings
    }
  },
  actions: { 
    async fetchAllWorkings(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/working/`);
      if(!res.ok) return false;

      const result = await res.json();
      ctx.commit('addAllWorkings', result);
    },
    async fetchWorkingsCount() {
      const res = await fetch(`${PATH_TO_SERVER}api/working/count/`);
      if(!res.ok) return false;

      const result = await res.json();
      return result;  
    },
    async fetchCreateWorking(ctx, data) { 
      const res = await fetch(`${PATH_TO_SERVER}api/working/`, {
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify(data)
			})
			
			if(!res.ok) return false; 
			return true
    },
  },
  mutations: { 
   addAllWorkings(state, workings) {
      state.workings = workings;
   }
  }
}