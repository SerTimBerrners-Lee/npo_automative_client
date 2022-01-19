
import {sortState} from '@/js/index';
import PATH_TO_SERVER from '@/js/path.js';

export default {
  state: {
    cbed: [],
    middleware_state: [],
    filterCbed: [],
    select_cbed: {},

    tmp_attention: [],
    tmp_operation: [],
    tmp_responsible: [],

    date_is: '<'
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

    async getAllCbed(ctx, light=false) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/${light}`)
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
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/one/${id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },

    async setchDeficitCbed(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/cbed/deficit`)
      if(res.ok) {
        const result = await res.json()
        if(result.length) {
          for(let inx in result) {
            result[inx]['my_kolvo'] = result[inx]['shipments_kolvo'] * 3 - result[inx]['shipments_kolvo']
          }
        }
        ctx.commit('addAllCbed', result)
        return result 
      }
    },

    async fetchAllCbedOperation() {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/operation`)
      if(res.ok) return await res.json()
      return []
    }

  },
  mutations: {
    reverseMidlevareCbed(state) {
      if(!state.middleware_state.length) return false
      state.cbed = state.middleware_state
      state.middleware_state = []
    },
    cbedToShipmentsSort(state, cbed) {
      if(state.middleware_state.length == 0) {
        state.middleware_state = state.cbed
        state.cbed = []
      }

      for(let cb of cbed) {
        let check = true
        for(let cb_two of state.cbed) {
          if(cb_two.id == cb.id) check = false
        }
        if(check) state.cbed.push(cb)
        else check = false
      }
    },
    addOneCbed(state, cbed) {
      state.cbed.push(cbed)
    },
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
        prod.articl.slice(0, str.length).toLowerCase() == str.toLowerCase() ||
        ((prod.name.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1)
      )
    },
    getAllCbEdByProduct(state, product) {
      if(!state.middleware_state.length)
        state.middleware_state = state.cbed

      state.cbed = state.middleware_state

      let newCB = []
      for(let cb of state.cbed){
        for(let prod of product.cbeds) {
          let pars = null;
          try {
            if(product.listCbed) 
              pars = JSON.parse(product.listCbed)
          } catch (e) {console.error(e)}
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
    },
    filterToAttentionCbed(state) {
      if(state.tmp_attention.length == 0)
        state.tmp_attention = state.cbed
      else {
        state.cbed = state.tmp_attention 
        return state.tmp_attention  = []
      }
      state.cbed = state.cbed.filter(detal => detal.attention)
    },
    filterCbedToDate(state) {
      state.dete_id = sortState(state.cbed, state.dete_id)
    },
    filterCbedToMyObject(state, user_id) {
      if(state.tmp_responsible.length == 0) state.tmp_responsible = state.cbed
      else {
        state.cbed = state.tmp_responsible
        return state.tmp_responsible = []
      }
      state.cbed = state.cbed.filter(cbed => cbed.responsibleId == user_id)
    },
    sortByNonOperationCbed(state, arr_operation) {
      if(state.tmp_operation.length == 0)
        state.tmp_operation = state.cbed

      if(arr_operation.length == state.cbed.length) 
        return state.cbed = state.tmp_operation

      state.cbed = []
      for(let id of arr_operation) {
        for(let item of state.tmp_operation) {
          if(item.id == id) state.cbed.push(item)
        }
      }
    }
  }
}