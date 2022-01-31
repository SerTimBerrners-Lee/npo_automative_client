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
      if(result.length) {
        for(let inx in result) {
          result[inx]['my_kolvo'] = result[inx]['min_remaining'] * 3 - result[inx]['cbed_kolvo']
        }
      }
      ctx.commit('addAllCbed', result)
      return result 
    },
    async setchDeficitDeficit(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit/detal`)
      if(!res.ok) return false

      const result = await res.json()
      if(result.length) {
        for(let inx in result) {
          result[inx]['my_kolvo'] = result[inx]['min_remaining'] * 3 - result[inx]['detal_kolvo']
        }
      }
      ctx.commit('setDetalMutation', result)
      return result
    },
    async setchDeficitProducts(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit/product`)
      if(res.ok) {
        const result = await res.json()
        if(result.length) {
          for(let inx in result) {
            result[inx]['my_kolvo'] = result[inx]['min_remaining'] * 3 - result[inx]['product_kolvo']
          }
        }
        
        ctx.commit('addAllProduct', result)
        return result 
      }
    },
  },
  mutations: {
    setDeficit(state, result) { 
      state.deficit = result;  
    },
  }
}