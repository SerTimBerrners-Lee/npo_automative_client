import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    equipmentType: [],
    equipmentPType: [],
    equipments: [],   
    equipment: {},

    tmp_attention: [],

    searchTypeEq: [],
    searchPTypeEq: [],
    searchEq: [] 
  },
  getters: {
    allEquipmentType(state) {
      return state.equipmentType
    },
    allEquipmentPType(state) {
      return state.equipmentPType
    },
    allEquipment(state) {
      return state.equipments
    },
    equipment(state) {
      return state.equipment
    }
  },
  actions: { 
    async fetchAllEquipmentType(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment`) 
      const result = await res.json() 

      ctx.commit('addAllEquipmentType', result)
    },
    async addEquipmentType(ctx, name) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...name
        })
      })

      if(res.ok) {
        const result = await res.json()
        ctx.commit('addOneEquipmentType', result)
      }
    },
    async removeEquipmentType(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/${id}`, {
        method: 'delete'
      })
      if(res.ok)
        ctx.commit('removeEquipmentTyp', id)
    },
    async updateEquipmentType(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/update`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data
        })
      })
      if(res.ok) 
        ctx.dispatch('fetchAllEquipmentType')
    },

    async createEquipmentPT(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/pt`, {
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
        ctx.dispatch('fetchAllEquipmentType')
        ctx.commit('mutationCreateEquipmentPT', result)
      }
    },
    async removeEquipmentPType(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/pt/${id}`, {
        method: 'delete'
      })
      if(res.ok)
        ctx.commit('removeEquipmentPType', id)
        ctx.dispatch('fetchAllEquipmentType')
    },
    async updateEquipmentPType(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/pt/update`, {
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
        ctx.commit('updateEquipmentPType', result)
        ctx.dispatch('fetchAllEquipmentType')
      }
    },
    async getOneEquipmentPType(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/pt/${id}`)
      const result = await res.json()
      ctx.commit('allEquipments', result)
    },
    async getAllEquipmentPType(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/pt/`)
      const result = await res.json()
      ctx.commit('pushAllEquipmentsPT', result)
    },
    async creqteEquipment(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/eq`, {
        method: 'post',
        body: data 
      })

      if(res.ok) {
        const result = await res.json()
        console.log(result)
      }
    },
    async fetchOneEquipment(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/eq/${id}`)
      const result = await res.json()
      ctx.commit('addOneEquipment', result)
      return result 
    },
    async fetchAllEquipment(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/eq/`)
      const result = await res.json()
      ctx.commit('pushAllEquipment', result)
      return result 
    },
    async removeFileEquipment(ctx, id) {
      await fetch(`${PATH_TO_SERVER}api/equipment/file/${id}`, {
        method: 'delete'
      })
    },
    async updateEquipment(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/eq/update`, {
        method: 'post',
        body: data
      })

      if(res.ok) {
        const result = await res.json()
        console.log(result)
      }
    },
    async banEquipment(ctx, id) {
      await fetch(`${PATH_TO_SERVER}api/equipment/ban/${id}`, {
        method: 'delete'
      })
      ctx.commit('hideEquipment', id)
      ctx.dispatch('fetchAllEquipmentType')
    },

    async attachFileToEquipment(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/equipment/files/${data.eq_id}/${data.file_id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },
  },
  mutations: {
    hideEquipment(state, id) {
      state.equipments = state.equipments.filter(eq => eq.id != id)
    },
    addOneEquipment(state, eq) {
      state.equipment = eq
    },
    allEquipments(state, data) {
      state.equipments = data.equipments.filter(eq => !eq.ban)
    },
    addAllEquipmentType(state, equipments) {
      state.equipmentType = equipments
    },
    addOneEquipmentType(state, equipments) {
      state.equipmentType.push(equipments)
    }, 
    removeEquipmentTyp(state, id) {
      state.equipmentType = state.equipmentType.filter(eq => eq.id != id)
    },
    mutationCreateEquipmentPT(state, equipmentsPT) {
      if(!state.equipmentPType)
        state.equipmentPType = []
      state.equipmentPType.push(equipmentsPT)
    },
    filterAllPTEquipment(state, equipmentT) {
      if(!equipmentT.equipmentsPT)   
        state.equipmentPType = []
      if(!equipmentT.equipments)
        state.equipments = []
      state.equipments = equipmentT.equipments.filter(el => !el.ban)
      state.equipmentPType = equipmentT.equipmentsPT
    },
    removeEquipmentPType(state, id) { 
      state.equipmentPType = state.equipmentPType.filter(eq => eq.id != id)
    },
    updateEquipmentPType(state, result) {
      state.equipmentPType = state.equipmentPType.map(eq => eq.id == result.id ? result : eq)
    },
    filterAllEquipmentById(state, id) {
      state.equipmentType = state.equipmentType.filter(eq => eq.id == id.type)
      state.equipmentPType = state.equipmentPType.filter(eq => eq.id == id.pType)
    },
    pushAllEquipmentsPT(state, data) {
      state.equipmentPType = data
    },
    pushAllEquipment(state, data) {
      state.equipments = data.filter(el => !el.ban)
    },
    searchTypeEq(state, eq) {
      if(!state.searchTypeEq.length) 
        state.searchTypeEq =  state.equipmentType

      state.equipmentType = state.searchTypeEq
      if(!eq) 
        return

      state.equipmentType = state.equipmentType
        .filter(t =>  (t.name.slice(0, eq.length).toLowerCase()) == eq.toLowerCase())
    },
    searchPTypeEq(state, eq) {
      if(!state.searchPTypeEq.length) 
        state.searchPTypeEq =  state.equipmentPType

      state.equipmentPType = state.searchPTypeEq
      if(!eq) 
        return

      state.equipmentPType = state.equipmentPType
        .filter(t =>  (t.name.slice(0, eq.length).toLowerCase()) == eq.toLowerCase())
    },
    searchEq(state, eq) {
      if(!state.searchEq.length) 
        state.searchEq =  state.equipments

      state.equipments = state.searchEq
      if(!eq) 
        return

      state.equipments = state.equipments
        .filter(t =>  (t.name.slice(0, eq.length).toLowerCase()) == eq.toLowerCase())
    },
    filterToAttentionEq(state) {
      if(state.tmp_attention.length == 0)
        state.tmp_attention = state.equipments
      else {
        state.equipments = state.tmp_attention 
        return state.tmp_attention  = []
      }
      state.equipments = state.equipments.filter(detal => detal.attention)
    },
    clearCascheEquipment(state) {
      state.equipments = []
      state.equipmentType = []
      state.equipmentPType = []
    },
  }
}