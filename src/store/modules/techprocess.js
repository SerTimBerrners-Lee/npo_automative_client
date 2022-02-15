
import PATH_TO_SERVER from '@/js/path.js';
export default { 
  state: {
    operationNewList: localStorage.getItem('newOperationItem') ?
      JSON.parse(localStorage.getItem('newOperationItem')) : [],
  },
  getters: {
    allOperationNewList(state) {
      return state.operationNewList
    },
  },
  actions: {
    async createOperation(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation`, {
        method :  'post',
        body   :  data
      })

      if(!res.ok) return false;
      const result = await res.json();
      ctx.commit('addNewOperationToList', result);
    },
    async updateOperation(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/update`, {
        method  :   'post',
        body    :   data
      })

      if(!res.ok) return false;
      const result = await res.json();
      ctx.commit('updateOperationToList', result);
    },
    async updateOperationTech(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/up/tech`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method  :   'post',
        body    :   JSON.stringify({
          ...data
        })
      });

      if(!res.ok) return false;
      const result = await res.json();
      ctx.commit('updateOperationToList', result);
      
    },
    async banOperation(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/${id}`, {
        method  : 'delete'
      });

      if(!res.ok) return false;
      ctx.commit('banOperationMuttation', id);
    },
    async createTechProcess(ctx, data) {
      if(!ctx.getters.getAuth)
        return 0
      data.append('responsibleActionId', ctx.getters.getAuth.id)
      const res = await fetch(`${PATH_TO_SERVER}api/detal/techprocess`, {
        method  :   'post',
        body    :   data
      });

      if(!res.ok) return false;
      const result = await res.json()
      return result 
    },
    async fetchTechProcess(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/techprocess/${id}`);
      const result = await res.json()

      if(!res.ok) return false; 
      return result 
    },
    async fetchOneOperationById(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/get/${id}`);

      if(!res.ok) return false;
      const result = await res.json()
      return result 
    },

    async fetchAllDetalOperation() {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/include`);

      if(!res.ok) return []
      return await res.json()
    }
  },
  mutations: {
    allOperationMutations(state, data) {
      state.operationNewList = data
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    addNewOperationToList(state, operation) {
      state.operationNewList.push(operation)
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    /**
     * parametrs.inx: number;
     * parametrs.positionTo: "top" || "bottom"
     */
    movingOperation(state, parametrs) {
      let variable = state.operationNewList[parametrs.inx]
      if(!variable) return false
      if(parametrs.positionTo == 'top' && state.operationNewList[parametrs.inx - 1]) {
        state.operationNewList[parametrs.inx] = state.operationNewList[parametrs.inx - 1]
        state.operationNewList[parametrs.inx - 1] = variable
      }
      if(parametrs.positionTo == 'bottom' && state.operationNewList[parametrs.inx + 1]){
        state.operationNewList[parametrs.inx] = state.operationNewList[parametrs.inx + 1]
        state.operationNewList[parametrs.inx + 1] = variable
      }
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    updateOperationToList(state, operation) {
      for(let inx = 0; inx < state.operationNewList.length; inx++) {
        if(state.operationNewList[inx].id == operation.id) {
          state.operationNewList[inx] = operation
        }
      }
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    removeOperationStorage(state) {
      state.operationNewList = []
      localStorage.setItem('newOperationItem', state.operationNewList )
    },
    banOperationMuttation(state, id) {
      state.operationNewList = state.operationNewList.filter(op => op.id != id)
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    }
  }
}