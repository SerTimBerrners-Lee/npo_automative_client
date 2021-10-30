import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    providers: [],
    onTimeProvider: [],
    oneProvider: {},

    deliveries: [],
    waybills: []
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
      if(res.ok) {
        console.log(res)
        return true
      }
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

    filterPByMaterial(state, material) {
      let idProvider = material.ProvidersMaterial.providerId
      if(!state.onTimeProvider.length)
        state.onTimeProvider = state.providers
      state.providers = state.providers.filter(p =>
        p.id == idProvider )
    },
    clearFilterProviders(state) {
      if(state.onTimeProvider.length)
        state.providers = state.onTimeProvider
    }
  }
}