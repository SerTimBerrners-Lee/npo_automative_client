import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    cbed: [],
    middleware_state: [],
    filterCbed: [],
    select_cbed: {},
  },
  getters: {
    allCbed(state) {
      return state.cbed
    },
    getOneSelectCbEd(state) {
      return state.select_cbed
    }
  },
  actions: { 
    async createNewCbEd(ctx, data) {
      if(!ctx.getters.getAuth)
        return 0

      const res = await fetch(`${PATH_TO_SERVER}api/cbed`, {
        method :  'post',
        body   :  data
      })
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },

    async getAllCbed(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addAllCbed', result)
        return result
      }
    },

    async getAllCbedArticl() {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/articl`)
      if(res.ok) 
        return await res.json()
    },

    async getOneCbEdField(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/field/${data.fields}/${data.id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },

    async attachFileToCbed(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/files/${data.cbed_id}/${data.file_id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },

    async updateCbed(ctx, data) {
      if(!ctx.getters.getAuth)
        return 0

      const res = await fetch(`${PATH_TO_SERVER}api/cbed/update`, {
        method :  'post',
        body   :  data
      })
      if(res.ok) {
        const result = await res.json()
        ctx.commit('updateCbedMutation', result)
        return result
      }
    },

    async deleteCbedById(ctx, id) {
      if(!ctx.getters.getAuth)
        return 0

      const res = await fetch(`${PATH_TO_SERVER}api/cbed/${id}`, {
        method :  'delete'
      })
      if(res.ok) {
        ctx.commit('deleteCbedByIdMutation', id)
      }
    },

    async getOneCbEdById(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/${id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },

    async setchDeficitCbed(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/deficit`)
      if(res.ok) {
        const result = await res.json()
        if(result.length) {
          for(let inx in result) {
            result[inx]['my_kolvo'] = result[inx]['shipments_kolvo']
          }
        }
        ctx.commit('addAllCbed', result)
        return result 
      }
    }

  },
  mutations: {
    addAllCbed(state, cbed) {
      state.cbed = cbed.filter(cb => !cb.ban)
    },
    updateCbedMutation(state, cbed) {
      for(let inx in state.cbed) {
        if(state.cbed[inx].id == cbed.id) state.cbed[inx] = cbed
      }
    },
    setOneCbed(state, cbed) {
      state.select_cbed = cbed
    },
    deleteCbedByIdMutation(state, id) {
      state.cbed = state.cbed.filter(cb => cb.id != id)
    },
    searchCbed(state, str) {
      if(!state.filterCbed.length)
        state.filterCbed = state.cbed
      
      state.cbed = state.filterCbed

      state.cbed = state.cbed.filter(prod => 
        prod.articl.slice(0, str.length).toLowerCase() == str.toLowerCase()
      )
    },
    getAllCbEdByProduct(state, product) {
      if(!state.middleware_state.length)
        state.middleware_state = state.cbed

      state.cbed = state.middleware_state

      let newCB = []
      for(let cb of state.cbed){
        for(let prod of product.cbeds) {
          // pars kol 
          let pars = null;
          try {
            if(product.listCbed) 
              pars = JSON.parse(product.listCbed)
          } catch (e) {
            console.log(e)
          }
          if(prod.id == cb.id) {
            let cbed_new = cb
            if(pars) {
              for(let uu of pars) {
                if(uu.cb.id == cb.id)
                  cbed_new['kolvo_for_product'] = uu.kol
              }
            }
            newCB.push(cbed_new)
          }
        }
      }
      state.cbed = newCB
    },
    clearFilterCbedByProduct(state) {
      state.cbed = state.middleware_state.map(e => {
        if(e.kolvo_for_product) 
          e.kolvo_for_product = 0 
        return e 
      })
    }
  }
}