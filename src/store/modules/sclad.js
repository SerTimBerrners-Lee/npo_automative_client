import PATH_TO_SERVER from '@/js/path.js';

export default {
  state: {
    deficit: [],
  },
  getters: { 
    getDeficit(state) {
      return state.deficit
    }
  }, 
  actions: {
    async fetchDeficit(ctx) { 
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit`)
      if(res.ok == true) {
        const result = await res.json()
        ctx.commit('setDeficit', result)
        return result
      } 
    },
    async fetchUpdateDeficit(ctx, data) {
      return await fetch(`${PATH_TO_SERVER}api/sclad/deficit`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data})
      })
    },
    async fetchCreateMarks(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/mark`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data})
      })
      if(res.ok) return true
      return false
    },
    async setchDeficitCbed(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit/cbed`)
      if(!res.ok) return false

      const result = await res.json()
      let cbeds = []
      if(result.length) {
        for(let inx in result) {
          result[inx]['my_kolvo'] = (result[inx]['min_remaining'] * 3) + result[inx]['shipments_kolvo'] - result[inx]['cbed_kolvo']
          if(result[inx]['min_remaining'] > 0 || result[inx]['shipments_kolvo'] > 0) 
            cbeds.push(result[inx])
        }
      }
      ctx.commit('addAllCbed', cbeds)
      return result 
    },
    async setchDeficitDeficit(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit/detal`)
      if(!res.ok) return false

      const result = await res.json()
      let detals = []
      if(result.length) {
        for(let inx in result) {
          result[inx]['my_kolvo'] = (result[inx]['min_remaining'] * 3) + result[inx]['shipments_kolvo'] - result[inx]['detal_kolvo']
          if(result[inx]['min_remaining'] > 0 || result[inx]['shipments_kolvo'] > 0) 
            detals.push(result[inx])
        }
      }
      ctx.commit('setDetalMutation', detals)
      return result
    },
    async setchDeficitProducts(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit/product`)
      if(!res.ok) return false;
      const result = await res.json()

      let products = []
      if(result.length) {
        for(let inx in result) {
          result[inx]['my_kolvo'] = (result[inx]['min_remaining'] * 3) + result[inx]['shipments_kolvo'] - result[inx]['product_kolvo']
          if(result[inx]['min_remaining'] > 0 || result[inx]['shipments_kolvo'] > 0) 
            products.push(result[inx])
        }
      }
      
      ctx.commit('addAllProduct', products)
      return result 
    },
    async fetchGetAllDeficitPPM(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/materialdeficit`)
      if(!res.ok) return false;
      const result = await res.json()
      ctx.commit('sortAllForeficitMaterial', result)
      return result
    },
    async getShipmentsForOneMaterial(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/materialonecshipments/${id}`)
      if(!res.ok) return false;
      const result = await res.json()
      return result;
    },
    async fetchMatRemParent(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/materialparents/${id}`)
      if(!res.ok) return false;
      const result = await res.json()
      return result
    },
  },
  mutations: {
    setDeficit(state, result) { 
      state.deficit = result;  
    },
  }
}