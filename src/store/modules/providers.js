import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    providers: [],
    onTimeProvider: [],
    oneProvider: {},

    tmp_attention: [],

    searchProvider: [],

    deliveries: [],
    waybills: [],

    material: [],
    materialT: [],
    materialPT: [],

    sMaterial: [],
    sMaterialT: [],
    sMaterialPT: [],
  },
  getters: { 
    allProvider(state) {
      return state.providers
    },
    getSetProvider(state) {
      return state.oneProvider
    },
    getAllDeliveries(state) {
      return state.deliveries
    },
    getAllWaybills(state) {
      return state.waybills
    },

    getMaterialProvider(state) {
      return state.material
    },
    getMaterialTProvider(state) {
      return state.materialT
    },
    getMaterialPTProvider(state) {
      return state.materialPT
    }
  },
  actions: { 
    async fetchGetProviders(ctx) {
      const res =  await fetch(`${PATH_TO_SERVER}api/provider`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit("setAllProvider", result)
        return result
      }
    },
    async addOneProvider(ctx, provider) {
      const res =  await fetch(`${PATH_TO_SERVER}api/provider`, {
        method: 'POST',
        body:   provider
      })
      if(res)
        ctx.dispatch('fetchGetProviders')
    },
    async fetchProviderBan(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/provider/ban/${id}`)
      if(res.ok)
        ctx.commit('removeProvider', id)
    },
    async fetchNewDeliveries(ctx, data) {
      const res =  await fetch(`${PATH_TO_SERVER}api/provider/deliveried`, {
        method: 'POST',
        body:   data
      })
      if(res.ok) return true
      return false
    },
    async fetchGetDeliveries(ctx) {
      const res =  await fetch(`${PATH_TO_SERVER}api/provider/deliveried`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit("setAllDeliveries", result)
        return result
      }
    },
    async updateDeliveries(ctx, data) {
      const res =  await fetch(`${PATH_TO_SERVER}api/provider/deliveried/update`, {
        method: 'POST',
        body:   data
      })
      if(res.ok) {
        return true
      }
    },
    async fetchGetDeliveriesCaming(ctx) {
      const res =  await fetch(`${PATH_TO_SERVER}api/provider/deliveriedcoming`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit("setAllDeliveries", result)
        return result
      }
    },
    async fetchPushWaybillCreate(ctx, data) {
      const res =  await fetch(`${PATH_TO_SERVER}api/provider/waylbil/create`, {
        method: 'POST',
        body:   data
      })
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },
    async fetchWaybill(ctx) {
      const res =  await fetch(`${PATH_TO_SERVER}api/provider/waylbil`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit("setAllWaybill", result)
        return result
      }
    },
    async fetchAllProviderMaterialById(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/settings/materialprovider/${id}`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('materialForProvider', result)
        return result
      }
    },
    async attachFileToProvider(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/provider/files/${data.provider_id}/${data.file_id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },
  },
  mutations: {
    setAllWaybill(state, result) {
      state.waybills = result
    },
    setAllDeliveries(state, result) {
      state.deliveries = result
    },
    setAllProvider(state, result) {
      state.providers = result.filter(provider => !provider.ban)
    },
    removeProvider(state, id) {
      state.providers = state.providers.filter(provider => provider.id != id)
    },
    setProviderState(state, provider) {
      state.oneProvider = provider
    },
    filterByMaterial(state, providers) {
      if(state.onTimeProvider.length == 0)
        state.onTimeProvider = state.providers

      state.providers = []
      for(let provider of state.onTimeProvider) {
        for(let mat_provider of providers) {
          if(mat_provider.id == provider.id) 
            state.providers.push(provider)
        }
      }
    },
    clearFilterProviders(state) {
      if(state.onTimeProvider.length)
        state.providers = state.onTimeProvider
    },
    materialForProvider(state, material) {
      state.material = material

      for(let mat of material) {
        let check = false
        if(mat.material) {
          for(let inx in state.materialT) {
            if(state.materialT[inx].id == mat.material.id) {
              check = true
              state.materialT[inx].podPodMaterials.push(mat)
            }
          }
          if(!check) 
            state.materialT.push({ ...mat.material, podPodMaterials: [mat]})        
            else check = false 
          if(!state.materialT.length)
            state.materialT.push({ ...mat.material, podPodMaterials: [mat]})
        }

        check = false
        if(mat.podMaterial) {
          for(let inx in state.materialPT) {
            if(state.materialPT[inx].id == mat.podMaterial.id) {
              check = true
              if(state.materialPT[inx].podPodMaterials && state.materialPT[inx].podPodMaterials.length) 
                state.materialPT[inx].podPodMaterials.push(mat)
              else 
                state.materialPT[inx].podPodMaterials = [mat]
            }
          }
          if(!check) 
            state.materialPT.push({ ...mat.podMaterial, podPodMaterials: [mat]})        
            else check = false 
          if(!state.materialPT.length)
            state.materialPT.push({ ...mat.podMaterial, podPodMaterials: [mat]})
        } 
      }
    },
    searchProviderMaterial(state, tm) {
      if(!state.sMaterial.length) 
        state.sMaterial =  state.material
      state.material = state.sMaterial
      if(!tm) 
        return
      state.material = state.material
        .filter(t =>  (t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase())
    },
    searchProviderTMaterial(state, tm) {
      if(!state.sMaterialT.length) 
        state.sMaterialT =  state.materialT
      state.materialT = state.sMaterialT
      if(!tm) 
        return
      state.materialT = state.materialT
        .filter(t =>  (t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase())
    },
    searchProviderPTMaterial(state, tm) {
      if(!state.sMaterialPT.length) 
        state.sMaterialPT =  state.materialPT
      state.materialPT = state.sMaterialPT
      if(!tm) 
        return
      state.materialPT = state.materialPT
        .filter(t =>  (t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase())
    },
    clearMaterialCurrentProducts(state) {
      state.material    = []
      state.materialT   = []
      state.materialPT  = []

      state.sMaterial   = [] 
      state.sMaterialT  = []
      state.sMaterialPT = []
    },
    searchProviderMutations(state, tm) {
      if(!state.searchProvider.length) 
        state.searchProvider = state.providers
      state.providers = state.searchProvider
      if(!tm) 
        return
          
      state.providers = state.providers
        .filter(t =>  ((t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase()) || ((t.inn.slice(0, tm.length).toLowerCase()) == tm.toLowerCase()))
    },
    filterToAttentionProvider(state) {
      if(state.tmp_attention.length == 0)
        state.tmp_attention = state.providers
      else {
        state.providers = state.tmp_attention 
        return state.tmp_attention  = []
      }
      state.providers = state.providers.filter(detal => detal.attention)
    }
  }
}