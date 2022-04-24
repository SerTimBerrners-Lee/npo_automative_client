
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
      return state.cbed;
    }, 
    getOneSelectCbEd(state) {
      return state.select_cbed;
    }
  },
  actions: {  
    async createNewCbEd(ctx, data) {
      if(!ctx.getters.getAuth) return 0;

      const res = await fetch(`${PATH_TO_SERVER}api/cbed`, {
        method :  'post',
        body   :  data
      });
      if (!res.ok) return false;

      const result = await res.json();
      return result;
    },

    async getAllCbed(ctx, light=false) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/${light}`);
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('addAllCbed', result);
      return result;
    },

    async fetchCbedRemains(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/remains`);
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('addAllCbed', result);
      return result;
    },

    async getAllCbedArticl() {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/articl`);
      if (!res.ok) return false;

      return await res.json();
    },

    async getOneCbEdField(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/field/${data.fields}/${data.id}`);
      if (!res.ok) return false;

      const result = await res.json();
      return result;
    },

    async getOneCbEdBelongs(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/belongs/${id}/`);
      if (!res.ok) return false;
      const result = await res.json();
      return result;
    },

    async attachFileToCbed(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/files/${data.cbed_id}/${data.file_id}`);
      if(!res.ok) return false;
      const result = await res.json();
      return result;
    },

    async updateCbed(ctx, data) {
      if(!ctx.getters.getAuth) return 0;

      const res = await fetch(`${PATH_TO_SERVER}api/cbed/update`, {
        method :  'post',
        body   :  data
      });
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('updateCbedMutation', result);
      return result;
    },

    async deleteCbedById(ctx, id) {
      if (!ctx.getters.getAuth) return 0;

      const res = await fetch(`${PATH_TO_SERVER}api/cbed/${id}`, {
        method :  'delete'
      });
      if(!res.ok) return false;
      ctx.commit('deleteCbedByIdMutation', id);
    }, 

    async getOneCbEdById(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/one/${id}`);
      if (!res.ok) return false;

      const result = await res.json();
      return result;
    },

    async fetchAllCbedOperation() {
      const res = await fetch(`${PATH_TO_SERVER}api/cbed/operation`);
      if (!res.ok) return [];
      return await res.json();
    }

  },
  mutations: {
    reverseMidlevareCbed(state) {
      if(!state.middleware_state.length) return false;
      state.cbed = state.middleware_state;
      state.middleware_state = [];
    },
    cbedToShipmentsSort(state, cbed) {
      if(state.middleware_state.length == 0) {
        state.middleware_state = state.cbed;
        state.cbed = [];
      }

      for(const cb of cbed) {
        let check = true;
        for(const cb_two of state.cbed) {
          if(cb_two.id == cb.id) check = false;
        }
        if(check) {
          for(const item of state.middleware_state) {
            if(item.id == cb.id) state.cbed.push(item);
          }
        }
        else check = false;
      }
    },
    addOneCbed(state, cbed) {
      state.cbed.push(cbed);
    },
    addAllCbed(state, cbed) {
      state.cbed = cbed.filter(cb => !cb.ban);
    },
    updateCbedMutation(state, cbed) {
      for(let inx in state.cbed) {
        if(state.cbed[inx].id == cbed.id) state.cbed[inx] = cbed;
      }
    },
    setOneCbed(state, cbed) {
      state.select_cbed = cbed;
    },
    deleteCbedByIdMutation(state, id) {
      state.cbed = state.cbed.filter(cb => cb.id != id);
    },
    searchCbed(state, str) {
      if(!state.filterCbed.length)
        state.filterCbed = state.cbed;
      
      state.cbed = state.filterCbed;
 
      state.cbed = state.cbed.filter(prod => 
        prod.articl.slice(0, str.length).toLowerCase() == str.toLowerCase() ||
        ((prod.name.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1)
      );
    },
    getAllCbEdByProduct(state, product) {
      if(!state.middleware_state.length)
        state.middleware_state = state.cbed;

      state.cbed = state.middleware_state;

      let newCB = [];
      for(const cb of state.cbed){
        for(const prod of product.cbeds) {
          let pars = null;
          try {
            if(product.listCbed) 
              pars = JSON.parse(product.listCbed);
          } catch (e) {console.error(e)}
          if(prod.id == cb.id) {
            const cbed_new = cb;
            if(pars) {
              for(const uu of pars) {
                if(uu.cb.id == cb.id)
                  cbed_new['kolvo_for_product'] = uu.kol;
              }
            }
            newCB.push(cbed_new);
          }
        }
      }
      state.cbed = newCB;
    },
    clearFilterCbedByProduct(state) {
      state.cbed = state.middleware_state.map(e => {
        if(e.kolvo_for_product) 
          e.kolvo_for_product = 0;
        return e;
      })
    },
    filterToAttentionCbed(state) {
      if(state.tmp_attention.length == 0)
        state.tmp_attention = state.cbed;
      else {
        state.cbed = state.tmp_attention;
        return state.tmp_attention  = [];
      }
      state.cbed = state.cbed.filter(detal => detal.attention);
    },
    filterCbedToDate(state) {
      state.dete_id = sortState(state.cbed, state.dete_id);
    },
    filterCbedToMyObject(state, user_id) {
      if(state.tmp_responsible.length == 0) state.tmp_responsible = state.cbed;
      else {
        state.cbed = state.tmp_responsible;
        return state.tmp_responsible = [];
      }
      state.cbed = state.cbed.filter(cbed => cbed.responsibleId == user_id);
    },
    sortByNonOperationCbed(state, arr_operation) {
      if(state.tmp_operation.length == 0)
        state.tmp_operation = state.cbed;

      if(arr_operation.length == state.cbed.length) 
        return state.cbed = state.tmp_operation;

      state.cbed = [];
      for(const id of arr_operation) {
        for(const item of state.tmp_operation) {
          if(item.id == id) state.cbed.push(item);
        }
      }
    },
    changeStatusDeficitCbed(state, status) {
      if(state.middleware_state.length < 1)
        state.middleware_state = state.cbed;

      state.cbed = state.middleware_state;
      if(status == 'Все') return false;
      state.cbed = state.cbed.filter(el => {
        if(status == "Не заказано" && el.assemble_kolvo < 1) return el;
        if(status == "Заказано" && el.assemble_kolvo > 0) return el;
      })
    },
    changeDeficitCbed(state, props) {
      if(state.middleware_state.length < 1)
        state.middleware_state = state.cbed;

      state.cbed = state.middleware_state;
      if(props.status == 'Все') return false; 
      state.cbed = state.cbed.filter(el => {
        if(props.status == "Общий" && props.deficit(el, el.cbed_kolvo) < 0) return el;
        if(props.status == "По заказам покупателя" && el.shipments_kolvo > 0) return el;
      })

      state.cbed = state.cbed.sort((a, b) => a - b);
    }
  }
}