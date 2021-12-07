import PATH_TO_SERVER from '@/js/path.js'
 
export default { 
  state: {
    detal: [],
    filterDetal: [],
    middleware_detals: [], 
    select_detal: {},
    operationNewList: localStorage.getItem('newOperationItem') ?
      JSON.parse(localStorage.getItem('newOperationItem')) : [],
    tmp_attention: [],
    tmp_operation: []
  },
  getters: {
    allDetal(state) {
      return state.detal
    },
    allOperationNewList(state) {
      return state.operationNewList
    },
    getOneSelectDetal(state) {
      return state.select_detal
    }
  },
  actions: { 
    async createNewDetal(ctx, data) {
      if(!ctx.getters.getAuth)
        return 0

      const res = await fetch(`${PATH_TO_SERVER}api/detal`, {
        headers: new Headers({
          'Authorization': ctx.getters.getAuth.id
        })  ,
        method :  'post',
        body   :  data
      })
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },
    async deleteDetelyId(ctx, id) { 
      if(!ctx.getters.getAuth)
        return 0

      const res = await fetch(`${PATH_TO_SERVER}api/detal/${id}`, {
        headers: new Headers({
          'Authorization': ctx.getters.getAuth.id
        }),
        method :  'delete'
      })
      if(res.ok) {
        ctx.commit('deleteDetalById', id)
      }
    },
    async fetchUpdateDetal(ctx, data) {
      if(!ctx.getters.getAuth)
        return 0
      const res = await fetch(`${PATH_TO_SERVER}api/detal/update`, {
        headers: new Headers({
          'Authorization': ctx.getters.getAuth.id
        }), 
        method :  'post',
        body   :  data
      })
      if(res.ok) {
        const result = await res.json()
        ctx.commit('fetchUpdateDetalMutation', result)
        return result
      }
    },
    async getAllDetals(ctx, light=false) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/${light}`)
      const result = await res.json()
      ctx.commit('setDetalMutation', result)
    },
    async setchDeficitDeficit(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/deficit`)
      const result = await res.json()
      if(result.length) {
        for(let inx in result) {
          result[inx]['my_kolvo'] = result[inx]['shipments_kolvo']
        }
      }
      ctx.commit('setDetalMutation', result)
      return result
    },
    async getAllDetalsArticl() {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/articl`)
      const result = await res.json()
      return result
    },
    async getOneDetal(ctx, id)  {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/one/${id}`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addOneSelectDetal', result)
        return result
      }
    },
    async fetchAddFilesForDetal(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/file`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(data),
      })
      if(res.ok) 
        return true
      else  
        return false

    },
    async createOperation(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation`, {
        method :  'post',
        body   :  data
      })
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addNewOperationToList', result)
      }
    },
    async updateOperation(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/update`, {
        method  :   'post',
        body    :   data
      })
      if(res.ok) {
        const result = await res.json()
        ctx.commit('updateOperationToList', result)
      }
    },
    async updateOperationTech(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/up/tech`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method  :   'post',
        body    :   JSON.stringify({
          ...data
        })
      })
      if(res.ok) {
        const result = await res.json()
        ctx.commit('updateOperationToList', result)
      }
    },
    async banOperation(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/${id}`, {
        method  : 'delete'
      })
      if(res.ok) {
        ctx.commit('banOperationMuttation', id)
      }
    },
    async createTechProcess(ctx, data) {
      if(!ctx.getters.getAuth)
        return 0
      data.append('responsibleActionId', ctx.getters.getAuth.id)
      const res = await fetch(`${PATH_TO_SERVER}api/detal/techprocess`, {
        method  :   'post',
        body    :   data
      })
      if(res.ok) {
        const result = await res.json()
        return result 
      }
    },
    async fetchTechProcess(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/techprocess/${id}`)
      const result = await res.json()
      if(res.ok) 
        return result 
        
    },
    async fetchOneOperationById(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/get/${id}`) 
      const result = await res.json()
      return result 
    },

    async fetchAllDetalOperation() {
      const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/include`)
      if(res.ok) return await res.json()
      return []
    }
  },
  mutations: {
    reverseMidlevareDetal(state) {
      if(!state.middleware_detals.length) return false
      state.detal = state.middleware_detals
      state.middleware_detals = []
    },
    detalToShipmentsSort(state, detal) {
      if(state.middleware_detals.length == 0) {
        state.middleware_detals = state.detal
        state.detal = []
      }

      for(let det of detal) {
        let check = true
        for(let det_two of state.detal) {
          if(det_two.id == det.id) check = false
        }
        if(check) state.detal.push(det)
        else check = false
      }
    },
    addNewDetalToArr(state, detal) {
      state.detal.push(detal)
    },
    fetchUpdateDetalMutation(state, new_detal) {
      for(let inx in state.detal) {
        if(state.detal[inx].id == new_detal.id) state.detal[inx] = new_detal
       }
    },
    addOneSelectDetal(state, detal) {
      state.select_detal = detal
    },
    allOperationMutations(state, data) {
      state.operationNewList = data
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    addNewOperationToList(state, operation) {
      state.operationNewList.push(operation)
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    /**
     * parametrs.inx: number;
     * parametrs.positionTo: "top" || "bottom"
     */
    movingOperation(state, parametrs) {
      let variable = state.operationNewList[parametrs.inx]
      if(!variable) return false
      if(parametrs.positionTo == 'top' && state.operationNewList[parametrs.inx - 1]) {
        state.operationNewList[parametrs.inx] = state.operationNewList[parametrs.inx - 1]
        state.operationNewList[parametrs.inx - 1] = variable
      }
      if(parametrs.positionTo == 'bottom' && state.operationNewList[parametrs.inx + 1]){
        state.operationNewList[parametrs.inx] = state.operationNewList[parametrs.inx + 1]
        state.operationNewList[parametrs.inx + 1] = variable
      }
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    updateOperationToList(state, operation) {
      for(let inx = 0; inx < state.operationNewList.length; inx++) {
        if(state.operationNewList[inx].id == operation.id) {
          state.operationNewList[inx] = operation
        }
      }
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    removeOperationStorage(state) {
      state.operationNewList = []
      localStorage.setItem('newOperationItem', state.operationNewList )
    },
    banOperationMuttation(state, id) {
      state.operationNewList = state.operationNewList.filter(op => op.id != id)
      localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
    },
    setDetalMutation(state, data) {
      state.detal = data.filter(detal => !detal.ban)
    },
    filterDetalToArticle(state, str) {
      if(!str) 
        state.detal = state.filterDetal
      if(state.filterDetal.length == 0)
        state.filterDetal = state.detal
      
      state.detal = state
      .filterDetal
      .filter(detal => 
        String(detal.articl)
        .slice(0, String(str).length) == String(str) || 
        ((detal.name.slice(0, str.length).toLowerCase()) == str.toLowerCase())
      ) 
    },
    deleteDetalById(state, id) {
      state.detal = state.detal.filter(detal => detal.id != id)
      if(state.filterDetal.length) 
        state.filterDetal = state.filterDetal.filter(detal => detal.id)
    },

    getAllDetalByProduct(state, product) {
      if(!state.middleware_detals.length)
        state.middleware_detals = state.detal

      state.detal = state.middleware_detals

      let newDetals = [] 
      for(let det of state.detal){
        for(let prod of product.detals) {
          let pars = null;
          try {
            if(product.listDetal) 
              pars = JSON.parse(product.listDetal)
          } catch (e) {console.error(e)}
          if(prod.id == det.id) {
            let detal_new = det
            if(pars && !product.fabricNumber) {
              for(let uu of pars) {
                if(uu.det.id == det.id)
                  detal_new['kolvo_for_detal'] = uu.kol
              }
            }
            newDetals.push(detal_new)
          }
        }
      }
      state.detal = newDetals
    },
    clearFilterDetalByProduct(state) {
      state.detal = state.middleware_detals.map(e => {
        if(e.kolvo_for_detal) 
          e.kolvo_for_detal = 0 
        return e 
      })
    },
    filterToAttention(state) {
      if(state.tmp_attention.length == 0)
        state.tmp_attention = state.detal
      else {
        state.detal = state.tmp_attention 
        return state.tmp_attention  = []
      }
      state.detal = state.detal.filter(detal => detal.attention)
    },
    sortByNonOperationDetal(state, arr_operation) {
      if(state.tmp_operation.length == 0)
        state.tmp_operation = state.detal

      if(arr_operation.length == state.detal.length) 
        return state.detal = state.tmp_operation

      state.detal = []
      for(let id of arr_operation) {
        for(let item of state.tmp_operation) {
          if(item.id == id) state.detal.push(item)
        }
      }
    },
  }
}