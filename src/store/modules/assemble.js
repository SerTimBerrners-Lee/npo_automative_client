import Req from '../../js/req';

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
    async fetchAssemble(ctx, isBan = false) { 
      const res = await Req(`api/assemble/all/${isBan}`);
			if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('allAssemble', result);
    },
    async fetchAssNoComing(ctx, isBan = false) { 
      const res = await Req(`api/assemble/allnocomducted/${isBan}`);
			if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('allAssemble', result);
    },
    async fetchAssemblePlan(ctx, type = 'all') { 
      const res = await Req(`api/assemble/asstoplan/${type}`);
			if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('allAssemble', result);
    },
		async fetchCreateAssemble(ctx, data) { 
      const res = await Req(`api/assemble`, {
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify({...data})
			});
			
			if (!res.ok) return false;
      return true;
    },
    async fetchUpdateAssemble(ctx, data) { 
      const res = await Req(`api/assemble`, {
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "put",
        body: JSON.stringify({...data})
			});
			
			if (!res.ok) return false;
			return true;
    },
    async fetchAssembleById(ctx, id) { 
      const res = await Req(`api/assemble/${id}`);
			if (!res.ok) return false;

      const result = await res.json();
      return result;
    },
    async fetchAssemblyDelete(ctx, id) {
      const res = await Req(`api/assemble/${id}`, {
        method: 'delete'
      });
			if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('deleteAssemble', id);
      return result;
    },
    async fetchCombackAssemble(ctx, id) {
      const res = await Req(`api/assemble/comback/${id}`, {
        method: 'put'
      });
			if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('deleteAssemble', id);
      return result;
    },
    async fetchAllAssembleTypeOperation(ctx, op_id) { 
      const res = await Req(`api/assemble/typeoperation/${op_id}`);
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('allAssembleOperation', result);
      return result;
  }
  },
  mutations: {
    allAssemble(state, result) { 
      state.assembles = [];
      for (const ass of result) {
        ass.tech_process = [];
        if (ass.cbed && ass.cbed?.techProcesses || []) {
          ass.tech_process = ass.cbed?.techProcesses || [];
        }
        state.assembles.push(ass);
      }
    },
    deleteAssemble(state, id) {
      state.assembles = state.assembles.filter(ass => ass.id != id);
    },
    allAssembleOperation(state, result) { 
      state.assembles = [];
      for (const r of result) {
        r.ass.tech_process = [];
        if (r.ass.cbed && r.ass.cbed?.techProcesses) {
          r.ass.tech_process = r.ass.cbed.techProcesses;
        }
        const {description, id, ...operation} = r.operation;
        state.assembles.push({...operation, ...r.ass, description, operation_id: id});
      }
      console.log(state.assembles);
    },
    filterAssemblByShipments(state, cbeds) {
      const new_arr = [];
      for (const ass of state.assembles) {
        for (const cbed of cbeds) {
          if (!ass.cbed) continue;
          if (cbed.id == ass.cbed.id) new_arr.push(ass);
        }
      }
      if (state.filter_assembl.length == 0)
        state.filter_assembl = state.assembles;
      state.assembles = new_arr;
    },
    breackFIlterAssembl(state) {
      if (state.filter_assembl.length)
        state.assembles = state.filter_assembl;
    }
  }
}