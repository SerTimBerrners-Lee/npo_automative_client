import Req from '../../js/req';

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
      return state.workings;
    }
  },
  actions: { 
    async fetchAllWorkings({ commit }, archive = false) {
      const res = await Req(`api/working/all/${archive}`);
      if (!res.ok) return false;

      const result = await res.json();
      commit('addAllWorkings', result);
    },
    async fetchWorkingsCount() {
      const res = await Req(`api/working/count/`);
      if (!res.ok) return false;

      const result = await res.json();
      return result;  
    },
    async fetchBannedWorkers(_, _id) {
      const res = await Req(`api/working/banned/${_id}`, {
        method: 'delete'
      });
      if (!res.ok) return false;

      const result = await res.json();
      return result;  
    },
    async fetchCreateWorking(_, data) { 
      const res = await Req(`api/working/`, {
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify(data)
			})
			
			if (!res.ok) return false; 
			return true
    },
    async fetchOneWorking({ commit }, _id) {
      const res = await Req(`api/working/one/${_id}`);
      if (!res.ok) return false;

      const result = await res.json();
      commit('addOneWorking', result);
      return result;
    },
    async fetchUpdateWorking({ commit }, data) {
      const res = await Req(`api/working/update/${data.id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "put",
        body: JSON.stringify(data)
      });
      if (!res.ok) return false;
      const result = await res.json();
      commit('updateWorking', result);
      return result;
    }
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
    },
    updateWorking(state, data) {
      state.workings.forEach(el => {
        if (el.id === data.id) {
          el.date_shipments = data.date_shipments;
          el.description = data.description;
        }
      })
    }
  }
}