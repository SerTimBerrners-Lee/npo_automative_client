import Req from '../../js/req';

export default {
  state: {
    type_operations: [],
    operationNewList: localStorage.getItem('newOperationItem') ?
      JSON.parse(localStorage.getItem('newOperationItem')) : [],
  },
  getters: { 
    getTypeOperations(state) {
      return state.type_operations
    },
    allOperationNewList(state) {
      return state.operationNewList
    },
  }, 
  actions: {
    async createTypeOperation(ctx, data) {   // +
      const res = await Req(`api/operation/typeoperation`, {
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify({...data})
      })
      const result = await res.json()
      ctx.commit('addNewTypeOperation', result)
    },
    async updateTypeOperation(ctx, data) {   // +
      await Req(`api/operation/typeoperation/update`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify({...data})
      })
      ctx.dispatch('getAllTypeOperations')
    },
    async getAllTypeOperations(ctx) { // +
      const res = await Req(`api/operation/typeoperation`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addListTypeOperations', result)
        return result
      }
    },
    async deleteTypeOperation(ctx, id) {  // +
      const res = await Req(`api/operation/typeoperation/${id}`, {
        method: 'delete'
      })
      const result = await res.json()
      ctx.commit('deleteTypeOperationMutation', id)
      return result
    },
    async fetchOneOperationById(ctx, id) { // +
      const res = await Req(`api/operation/operation/get/${id}`);

      if(!res.ok) return false;
      const result = await res.json()
      return result 
    },
    async updateOperationTech(ctx, data) { // +
      const res = await Req(`api/operation/operation/up/tech`, {
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
    async banOperation(ctx, id) { // +
      const res = await Req(`api/operation/operation/${id}`, {
        method  : 'delete'
      });

      if(!res.ok) return false;
      ctx.commit('banOperationMuttation', id);
    },
    async createOperation(ctx, data) {// +
      const res = await Req(`api/operation/operation`, {
        method :  'post',
        body   :  data
      })

      if(!res.ok) return false;
      const result = await res.json();
      ctx.commit('addNewOperationToList', result);
    },
    async updateOperation(ctx, data) {// +
      const res = await Req(`api/operation/operation/update`, {
        method  :   'post',
        body    :   data
      })

      if(!res.ok) return false;
      const result = await res.json();
      ctx.commit('updateOperationToList', result);
    }
  },
  mutations: {
    addNewTypeOperation(state, to) {
      state.type_operations.push(to)
    },
    addListTypeOperations(state, operations) {
      state.type_operations = operations
    },
    deleteTypeOperationMutation(state, id) {
      state.type_operations = state.type_operations.filter(to => to.id != id)
    },
    addNewOperationToList(state, operation) {
      state.operationNewList.push(operation)
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    banOperationMuttation(state, id) {
      state.operationNewList = state.operationNewList.filter(op => op.id != id)
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    allOperationMutations(state, data) {
      state.operationNewList = data
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
  }
}