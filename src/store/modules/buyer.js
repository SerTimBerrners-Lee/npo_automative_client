import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    buyer: [],
    buyerFilter: [],
    onebuyer: {},

    searchBuyer: [],
    tmp_attention: [],
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
    },
    async attachFileToBuyer(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/buyer/files/${data.buyer_id}/${data.file_id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },
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
    },
    searchBuyerMutations(state, tm) {
      if(!state.searchBuyer.length) 
        state.searchBuyer = state.buyer
      state.buyer = state.searchBuyer
      if(!tm) 
        return
          
      state.buyer = state.buyer
        .filter(t =>  ((t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase()) || ((t.inn.slice(0, tm.length).toLowerCase()) == tm.toLowerCase()))
    },
    filterToAttentionBuyer(state) {
      if(state.tmp_attention.length == 0)
        state.tmp_attention = state.buyer
      else {
        state.buyer = state.tmp_attention 
        return state.tmp_attention  = []
      }
      state.buyer = state.buyer.filter(detal => detal.attention)
    }
  }
}