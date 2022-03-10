import PATH_TO_SERVER from '@/js/path.js';

export default {
  state: {
    type_operations: []
  },
  getters: { 
    getTypeOperations(state) {
      return state.type_operations
    }
  }, 
  actions: {
    async createTypeOperation(ctx, data) {   // +
      const res = await fetch(`${PATH_TO_SERVER}api/operation/typeoperation`, {
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
      await fetch(`${PATH_TO_SERVER}api/operation/typeoperation/update`, {
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
      const res = await fetch(`${PATH_TO_SERVER}api/operation/typeoperation`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addListTypeOperations', result)
        return result
      }
    },
    async deleteTypeOperation(ctx, id) {  // +
      const res = await fetch(`${PATH_TO_SERVER}api/operation/typeoperation/${id}`, {
        method: 'delete'
      })
      const result = await res.json()
      ctx.commit('deleteTypeOperationMutation', id)
      return result
    },
    async fetchOneOperationById(ctx, id) { // +
      const res = await fetch(`${PATH_TO_SERVER}api/operation/operation/get/${id}`);

      if(!res.ok) return false;
      const result = await res.json()
      return result 
    },
    async updateOperationTech(ctx, data) { // +
      const res = await fetch(`${PATH_TO_SERVER}api/operation/operation/up/tech`, {
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
      const res = await fetch(`${PATH_TO_SERVER}api/operation/operation/${id}`, {
        method  : 'delete'
      });

      if(!res.ok) return false;
      ctx.commit('banOperationMuttation', id);
    },
    async createOperation(ctx, data) {// +
      const res = await fetch(`${PATH_TO_SERVER}api/operation/operation`, {
        method :  'post',
        body   :  data
      })

      if(!res.ok) return false;
      const result = await res.json();
      ctx.commit('addNewOperationToList', result);
    },
    async updateOperation(ctx, data) {// +
      const res = await fetch(`${PATH_TO_SERVER}api/operation/operation/update`, {
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
    }
  }
}