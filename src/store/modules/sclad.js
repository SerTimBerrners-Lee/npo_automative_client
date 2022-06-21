import PATH_TO_SERVER from '@/js/path';
import { differencesShipments } from '@/js/';

export default {
  state: {
    deficit: [],
  },
  getters: { 
    getDeficit(state) {
      return state.deficit;
    }
  }, 
  actions: {
    async fetchDeficit(ctx) { 
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit`);
      if (!res.ok) return false; 
      
      const result = await res.json();
      ctx.commit('setDeficit', result);
      return result;
    },
    async fetchUpdateDeficit(ctx, data) {
      return await fetch(`${PATH_TO_SERVER}api/sclad/deficit`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data})
      });
    },
    async setchDeficitCbed(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit/cbed`);
      if (!res.ok) return false;

      const result = await res.json();
      const cbeds = []
      if (result.length) {
        for (let inx in result) {
          result[inx]['my_kolvo'] = (result[inx]['min_remaining'] * 3) + result[inx]['shipments_kolvo'] - result[inx]['cbed_kolvo'];
          if (result[inx]['min_remaining'] > 0 || result[inx]['shipments_kolvo'] > 0)
            cbeds.push(result[inx]);
        }
      }
      ctx.commit('addAllCbed', cbeds);
      return result;
    },
    async setchDeficitDeficit(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit/detal`);
      if (!res.ok) return false;

      const result = await res.json();
      const detals = [];
      if (result.length) {
        for (let inx in result) {
          result[inx]['my_kolvo'] = (result[inx]['min_remaining'] * 3) + result[inx]['shipments_kolvo'] - result[inx]['detal_kolvo']
          if (result[inx]['min_remaining'] > 0 || result[inx]['shipments_kolvo'] > 0)
            detals.push(result[inx]);
          if (!result[inx].shipments || !result[inx].shipments.length) result[inx].date_shipments = undefined;
          else {
            const ships = differencesShipments(result[inx].shipments);
            result[inx].date_shipments = ships[0]?.date_shipments;
          }
        }
      } else return false;

      const noSortDate = differencesShipments(result).filter(el => !el.date_shipments);
      const sortDate = differencesShipments(result).filter(el => el.date_shipments);
      const arr = sortDate.concat(noSortDate);
      ctx.commit('setDetalMutation', arr);
      return arr;
    },
    async setchDeficitProducts(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit/product`);
      if (!res.ok) return false;
      const result = await res.json();

      const products = [];
      if (result.length) {
        for (let inx in result) {
          result[inx]['my_kolvo'] = (result[inx]['min_remaining'] * 3) + result[inx]['shipments_kolvo'] - result[inx]['product_kolvo']
          if (result[inx]['min_remaining'] > 0 || result[inx]['shipments_kolvo'] > 0) 
            products.push(result[inx]);
        }
      }
      
      ctx.commit('addAllProduct', products);
      return result;
    },
    async fetchGetAllDeficitPPM(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/materialdeficit`);
      if(!res.ok) return false;
      const result = await res.json();
      ctx.commit('sortAllForeficitMaterial', result);
      return result;
    },
    /**
     * 
     * @param {*} ctx 
     * @param {*} data { id: shipments.id, type: 'cbed' | 'detal' } 
     * @returns 
     */
    async fetchMaterialToShipments(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/materialdeficit/shipments/${data.id}/${data.type}`);
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('unsetSortMaterial');
      ctx.commit('setDeficitToPlan', result);
      return result;
    },
    async getShipmentsForOneMaterial(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/materialonecshipments/${id}`);
      if (!res.ok) return false;

      const result = await res.json();
      return result;
    },
    async fetchMatRemParent(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/materialparents/${id}`);
      if (!res.ok) return false;

      const result = await res.json();
      return result;
    },
    // Marks
    async fetchMarksByOperation(ctx, _id) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/marks/byoperation/${_id}`);
      if (!res.ok) return false;

      const result = await res.json();
      return result;
    },
    async fetchCreateMarks(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/sclad/mark`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data})
      });
      if (res.ok) return true;
      return false;
    },
  },
  mutations: {
    setDeficit(state, result) { 
      state.deficit = result;  
    },
  }
}