import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    inventaryT: [],
    inventaryPT: [],
    inventary: [],
    nameInventary: {},

    tmp_attention: [],

    instansInventaryPT: [],
    instansInventary: [],

    searchTypeInv: [],
    searchPTypeInv: [],
    searchInventary: [] 
  },
  getters: {
    getTInventary(state) {
      return state.inventaryT
    },
    getPTInventary(state) {
      return state.inventaryPT
    },
    getInventary(state) {
      return state.inventary
    },
    getOneInventary(state) {
      return state.nameInventary
    },
  },
  actions: { 
    async fetchAllInventary(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('pushAllTInventary', result)
        return result
      }
    },
    async addNewTInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary`, {
        method: 'post',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })

      if(res.ok) {
        const result = await res.json()
        ctx.commit('addNewTInventaryMutation', result)
        return result
      }
    },
    async removeTInventary(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/${id}`, {
        method: 'delete'
      })
      if(res.ok)
        ctx.commit('removeTInventaryMutation', id)
    },
    async updateNewTInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })
      if(res.ok) {
        const result = await res.json()
        console.log('result', result)
        ctx.commit('updateTInventary', result)
        return result
      }
    },
    async fetchAllPInventary(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/pt/`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('pushAllPTInventary', result)
        return result
      }
    },
    async addNewPTInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/pt/`, {
        method: 'post',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })

      if(res.ok) {
        const result = await res.json()
        ctx.commit('addNewPTInventaryMutation', result)
        return result
      }
    },
    async removePTInventary(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/pt/${id}`, {
        method: 'delete'
      })
      if(res.ok)
        ctx.commit('removePTInventaryMutation', id)
    },
    async updatePTInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/pt/`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })
      if(res.ok) {
        const result = await res.json()
        console.log('result', result)
        ctx.commit('updatePTInventary', result)
        return result
      }
    },
    async fetchOneInventary(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/name/${id}`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addOneInventaryMytation', result)
        return result
      }
    },
    async fetchAllNameInventary(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/name/`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addAllInventary', result)
        return result
      }
    },
    async createNewInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/name/`, {
        method: 'post',
        body: data
      })
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },
    async fetchUpdateInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/name/`, {
        method: 'put',
        body: data
      })
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },
    async banInventary(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/name/${id}`, {
        method: 'delete',
      })
      if(res.ok)
        ctx.commit('banInventaryMutation', id)
    },
    async attachFileToInventary(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/inventary/files/${data.inventary_id}/${data.file_id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },
  },
  mutations: { 
    pushAllTInventary(state, inventary) {
      state.inventaryT = inventary
    },
    addNewTInventaryMutation(state, inventary) {
      state.inventaryT.push(inventary)
    },
    updateTInventary(state, inventary) {
      for(let inx in state.inventaryT) {
        if(state.inventaryT[inx].id == inventary.id) state.inventaryT[inx] = inventary
      }
    },
    removeTInventaryMutation(state, id) {
      state.inventaryT = state.inventaryT.filter(e => e.id != id)
    },

    pushAllPTInventary(state, inventary) {
      state.inventaryPT = inventary
    },
    addNewPTInventaryMutation(state, inventary) {
      state.inventaryPT.push(inventary)
    },
    updatePTInventary(state, inventary) {
      for(let inx in state.inventaryPT) {
        if(state.inventaryPT[inx].id == inventary.id) state.inventaryPT[inx] = inventary
      }
    },
    removePTInventaryMutation(state, id) {
      state.inventaryPT = state.inventaryPT.filter(e => e.id != id)
    },
    filterPTByTInvetary(state, inventary) {
      if(state.instansInventaryPT.length == 0)
        state.instansInventaryPT = state.inventaryPT
      state.inventaryPT = inventary.pt_inventary
    },
    resetFilterTInventary(state) {
      state.inventaryPT = state.instansInventaryPT
    },
    resetFilterInventary(state) {
      state.inventary = state.instansInventary
    },
    searchTInventary(state, inst) {
      if(!state.searchTypeInv.length) 
        state.searchTypeInv =  state.inventaryT

      state.inventaryT = state.searchTypeInv
      if(!inst) 
        return

      state.inventaryT = state.inventaryT
        .filter(t =>  (t.name.slice(0, inst.length).toLowerCase()) == inst.toLowerCase())
    },
    searchPTInventary(state, inst) {
      if(!state.searchPTypeInv.length) 
        state.searchPTypeInv =  state.inventaryPT

      state.inventaryPT = state.searchPTypeInv
      if(!inst) 
        return

      state.inventaryPT = state.inventaryPT
        .filter(t =>  (t.name.slice(0, inst.length).toLowerCase()) == inst.toLowerCase())
    },
    searchInventary(state, inst) {
      if(!state.searchInventary.length) 
        state.searchInventary =  state.inventary

      state.inventary = state.searchInventary
      if(!inst) 
        return

      state.inventary = state.inventary
        .filter(t =>  (t.name.slice(0, inst.length).toLowerCase()) == inst.toLowerCase())
    },
    addOneInventaryMytation(state, result) {
      state.nameInventary = result
    },
    addAllInventary(state, inventary) {
      state.inventary = inventary.filter(inv => !inv.ban)
    },
    filterByTypeInventary(state, id) {
      state.searchTypeInv = state.inventaryT
      state.inventaryT = state.inventaryT.filter(inv => inv.id == id)
    },
    filterByPTypeInventary(state, id) {
      state.searchPTypeInv = state.inventaryPT
      state.inventaryPT = state.inventaryPT.filter(inv => inv.id == id)
    },
    clearFilterTypeInventary(state) {
      state.inventaryT = state.searchTypeInv
    },
    clearFilterPTypeInventary(state) {
      state.inventaryPT = state.searchPTypeInv
    },
    banInventaryMutation(state, id) {
      state.inventary = state.inventary.filter(inv => inv.id != id)
    },
    filterNameMaterialByPT(state, inventary) {
      if(state.instansInventary.length == 0)
        state.instansInventary = state.inventary
      state.inventary = inventary.filter(inv => !inv.ban)
    },
    filterToAttentionInventary(state) {
      if(state.tmp_attention.length == 0)
        state.tmp_attention = state.inventary
      else {
        state.inventary = state.tmp_attention 
        return state.tmp_attention  = []
      }
      state.inventary = state.inventary.filter(detal => detal.attention)
    },
    clearCascheInventary(state) {
      state.inventary = []
    },
  }
}