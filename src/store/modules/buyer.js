import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    buyer: [],
    buyerFilter: [],
    onebuyer: {}
  },
  getters: { 
    allBuyer(state) {
        return state.buyer
    },
    getSetBuyer(state) {
        return state.onebuyer
    }
  },
  actions: { 
    async fetchAllBuyers(ctx) {
      const res =  await fetch(`${PATH_TO_SERVER}api/buyer`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit("setAllBuyer", result)
        return result
      }
    },
    async addOneBuyer(ctx, buyer) {
      const res =  await fetch(`${PATH_TO_SERVER}api/buyer`, {
        method: 'POST',
        body:   buyer
      })
      if(res)
        ctx.dispatch('fetchAllBuyers')
    },
    async fetchBuyerBan(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/buyer/${id}`, {
        method: 'delete'
      })
      if(res.ok)
        ctx.commit('removeBuyer', id)
    },

    async updateOneBuyer(ctx, data) {
      const res =  await fetch(`${PATH_TO_SERVER}api/buyer/update`, {
        method: 'POST',
        body:   data
      })
      if(res)
        ctx.dispatch('fetchAllBuyers')
    }
  },
  mutations: {
    setAllBuyer(state, result) {
      state.buyer = result.filter(buyer => !buyer.ban)
    },
    removeBuyer(state, id) {
      state.buyer = state.buyer.filter(buyer => buyer.id != id)
    },
    setBuyerState(state, buyer) {
      state.onebuyer = buyer
    }
  }
}