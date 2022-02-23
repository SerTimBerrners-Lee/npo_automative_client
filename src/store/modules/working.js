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
    async fetchBannedWorkers(ctx, _id) {
      const res = await fetch(`${PATH_TO_SERVER}api/working/banned/${_id}`, {
        method: 'delete'
      });
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
    async fetchOneWorking(ctx, _id) {
      const res = await fetch(`${PATH_TO_SERVER}api/working/one/${_id}`);
      if(!res.ok) return false;

      const result = await res.json();
      ctx.commit('addOneWorking', result);
      return result;
    },
  },
  mutations: { 
   addAllWorkings(state, workings) {
      state.workings = workings;
   },
   addOneWorking(state, working) {
     state.workings.push(working);
   },
   deleteOneWorkign(state, _id) {
     state.workings = state.workings.filter(el => el.id != _id);
   }
  }
}