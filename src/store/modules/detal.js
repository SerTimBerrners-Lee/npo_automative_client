
import {sortState} from '@/js/index';
import PATH_TO_SERVER from '@/js/path.js';
export default { 
  state: {
    detal: [],
    filterDetal: [],
    middleware_detals: [], 
    select_detal: {},
    tmp_attention: [],
    tmp_operation: [], 
    tmp_responsible: [],

    date_is: '<'
  },
  getters: {
    allDetal(state) { 
      return state.detal
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
  },
  mutations: {
    reverseMidlevareDetal(state) {
      if(!state.middleware_detals.length) return false
      state.detal = state.middleware_detals
      state.middleware_detals = []
    },
    detalToShipmentsSort(state, detal) {
      if(state.middleware_detals.length == 0) {
        state.middleware_detals = state.detal;
        state.detal = [];
      }

      for(const det of detal) {
        let check = true
        for(const det_two of state.detal) {
          if(det_two.id == det.id) check = false;
        }
        if(check) {
          for(const item of state.middleware_detals) {
            if(item.id == det.id) state.detal.push(item);
          }
        }
        else check = false;
      }
    },
    addNewDetalToArr(state, detal) {
      state.detal.push(detal);
    },
    fetchUpdateDetalMutation(state, new_detal) {
      for(let inx in state.detal) {
        if(state.detal[inx].id == new_detal.id) state.detal[inx] = new_detal;
       }
    },
    addOneSelectDetal(state, detal) {
      state.select_detal = detal;
    },
    setDetalMutation(state, data) {
      state.detal = data.filter(detal => !detal.ban);
    },
    filterDetalToArticle(state, str) {
      if(!str) state.detal = state.filterDetal;
      if(state.filterDetal.length == 0)
        state.filterDetal = state.detal;
      
      state.detal = state
      .filterDetal
      .filter(detal => 
        String(detal.articl)
        .slice(0, String(str).length) == String(str) || 
        ((detal.name.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1)
      )
    },
    deleteDetalById(state, id) {
      state.detal = state.detal.filter(detal => detal.id != id);
      if(state.filterDetal.length) 
        state.filterDetal = state.filterDetal.filter(detal => detal.id);
    },

    getAllDetalByProduct(state, product) {
      if(!state.middleware_detals.length)
        state.middleware_detals = state.detal;

      state.detal = state.middleware_detals;

      const newDetals = [];
      for(const det of state.detal){
        for(let prod of product.detals) {
          let pars = null;
          try {
            if(product.listDetal) 
              pars = JSON.parse(product.listDetal);
          } catch (e) {console.error(e)}
          if(prod.id == det.id) {
            const detal_new = det;
            if(pars && !product.fabricNumber) {
              for(let uu of pars) {
                if(uu.det.id == det.id)
                  detal_new['kolvo_for_detal'] = uu.kol;
              }
            }
            newDetals.push(detal_new);
          }
        }
      }
      state.detal = newDetals;
    },
    clearFilterDetalByProduct(state) {
      state.detal = state.middleware_detals.map(e => {
        if(e.kolvo_for_detal) e.kolvo_for_detal = 0;
        return e;
      })
    },
    filterToAttention(state) {
      if(state.tmp_attention.length == 0)
        state.tmp_attention = state.detal;
      else {
        state.detal = state.tmp_attention 
        return state.tmp_attention  = [];
      }
      state.detal = state.detal.filter(detal => detal.attention);
    },
    filterDetalToDate(state) {
      state.dete_id = sortState(state.detal, state.dete_id);
    },
    filterDetalToMyObject(state, user_id) {
      if(state.tmp_responsible.length == 0) state.tmp_responsible = state.detal;
      else {
        state.detal = state.tmp_responsible;
        return state.tmp_responsible = [];
      }
      state.detal = state.detal.filter(detal => detal.responsibleId == user_id);
    },
    sortByNonOperationDetal(state, arr_operation) {
      if(state.tmp_operation.length == 0)
        state.tmp_operation = state.detal;

      if(arr_operation.length == state.detal.length) 
        return state.detal = state.tmp_operation;

      state.detal = []
      for(let id of arr_operation) {
        for(let item of state.tmp_operation) {
          if(item.id == id) state.detal.push(item);
        }
      }
    },
    changeStatusDeficitDetal(state, status) {
      if(state.middleware_detals.length < 1)
        state.middleware_detals = state.detal

      state.detal = state.middleware_detals
      if(status == 'Все') return false;
      state.detal = state.detal.filter(el => {
        if(status == "Не заказано" && el.metalloworking_kolvo < 1) return el;
        if(status == "Заказано" && el.metalloworking_kolvo > 0) return el;
      })
    },
    changeDeficitDetal(state, props) {
      if(state.middleware_detals.length < 1)
        state.middleware_detals = state.detal

      state.detal = state.middleware_detals
      if(props.status == 'Все') return false; 
      state.detal = state.detal.filter(el => {
        if(props.status == "Общий" && props.deficit(el, el.detal_kolvo) < 0) return el;
        if(props.status == "По заказам покупателя" && el.shipments_kolvo > 0) return el;
      })

      state.detal = state.detal.sort((a, b) => a - b);
    }
  }
}