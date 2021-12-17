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
    async createTypeOperation(ctx, data) { 
      const res = await fetch(`${PATH_TO_SERVER}api/detal/typeoperation`, {
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
    async updateTypeOperation(ctx, data) { 
      await fetch(`${PATH_TO_SERVER}api/detal/typeoperation/update`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify({...data})
      })
      ctx.dispatch('getAllTypeOperations')
    },
    async getAllTypeOperations(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/typeoperation`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addListTypeOperations', result)
        return result
      }
    },
    
    async deleteTypeOperation(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/typeoperation/${id}`, {
        method: 'delete'
      })
      const result = await res.json()
      ctx.commit('deleteTypeOperationMutation', id)
      return result
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
    }
  }
}