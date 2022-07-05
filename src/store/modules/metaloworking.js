import Req from '../../js/req';
import { comparison } from '../../js/';
import { returnKolvoCreate, returnShipmentsDate } from '../../js/operation';

export default {
  state: {
    metaloworkings: [],
    filter_metal: [],

    middleware: [],
    middleware_status: [],
    middleware_zag: [],
  },
  getters: { 
    getMetaloworkings(state) {
      return state.metaloworkings;
    },
  }, 
  actions: {
    async fetchMetaloworking(ctx, isBan = false) { 
      const res = await Req(`api/metaloworking/all/${isBan}`);
			if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('allMetaloworking', result);
      return result;
    },
		async fetchCreateMetaloworking(ctx, data) { 
      const res = await Req(`api/metaloworking`, {
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify({...data})
			});
			
			if (!res.ok) return false;
			return true;
    },
    async fetchUpdateMetaloworking(ctx, data) { 
      const res = await Req(`api/metaloworking`, {
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "put",
        body: JSON.stringify({...data})
			})
			
			if (!res.ok) return false;
			return true;
    },
    async fetchMetalloworkShapeBid(ctx, data) {
      const res = await Req(`api/metaloworking/shapebid`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify(data)
      });

      if (!res.ok) return false; 
      const result = await res.json()

      return result;
    },
    async fetchMetaloworkingById(ctx, id) {
      const res = await Req(`api/metaloworking/${id}`);
			if (!res.ok) return false;
      const result = await res.json();
      return result;
    },
    async fetchMetalloworkingDelete(ctx, id) {
      const res = await Req(`api/metaloworking/${id}`, {
        method: 'delete'
      });
			if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('deleteMetalloworking', id);
      return result;
    }, 
    async fetchCombackMetallowork(ctx, id) {
      const res = await Req(`api/metaloworking/comback/${id}`, {
        method: 'put'
      });
			if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('deleteMetalloworking', id);
      return result;
    },
    async fetchAllMetalloworkingTypeOperation(ctx, op_id) { 
      const res = await Req(`api/metaloworking/typeoperation/${op_id}`);
      if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('allMetaloworkingOperation', result);
      return result;
    }
  },
  mutations: {
    allMetaloworking(state, result) { 
      state.metaloworkings = [];
      const arr = [];
      for (const met of result) {
        met.tech_process = [];
        if (met.detal && met.detal.techProcesses) {
          met.tech_process = met.detal.techProcesses;
        }
        arr.push(met);
      }
      // Сортировака по дате
      const toFormatString = (date) => {
        const spl = date.split('.');
        return `${spl[2]}-${spl[1]}-${spl[0]}T10:20:30Z`;
      }

      const noShipmentsData = arr.filter(el => returnShipmentsDate(el.detal.shipments) == '-');
      const shipmentsData = arr.filter(el => returnShipmentsDate(el.detal.shipments) != '-');

      let sort = shipmentsData.sort((a, b) => {
        const aa = returnShipmentsDate(a.detal.shipments);
        const bb = returnShipmentsDate(b.detal.shipments);
          return new Date(toFormatString(aa)).getTime() - new Date(toFormatString(bb)).getTime() ;
      });

      sort = sort.concat(noShipmentsData);

      for (const item of sort) {
        let find = false;
        for (const met of state.metaloworkings) {
          if (met.detal.id == item.detal.id) {
            met.childrens.push(item);
            met.kolvo_shipments += item.kolvo_shipments;
            find = true;
          }
        }
        
        if (!find) {
          item.childrens = [];
          item.kolvo_for_parent = item.kolvo_shipments;
          state.metaloworkings.push(item);
        }
      }
    },
    deleteMetalloworking(state, id) {
      state.metaloworkings = state.metaloworkings.filter(metal => metal.id != id);
    },
    allMetaloworkingOperation(state, result) {
      state.metaloworkings = [];
      for (const r of result) {
        r.metal.tech_process = [];
        if (r.metal.detal && r.metal.detal.techProcesses) 
          r.metal.tech_process = r.metal.detal.techProcesses;

        const {description, id, ...operation} = r.operation;
        state.metaloworkings.push({...operation, ...r.metal, description, operation_id: id});
      }
    },
    filterMetaloworkingByShipments(state, detals) {
      let new_arr = [];
      for (const met of state.metaloworkings) {
        for (const detal of detals) {
          if (!met.detal) continue;
          if (detal.id == met.detal.id) new_arr.push(met);
        }
      }
      if(state.filter_metal.length == 0)
        state.filter_metal = state.metaloworkings;

      // Фильтруем по дате отгрузки
      new_arr = new_arr.sort((a, b) => {
        if (!a.detal.shipments || !a.detal.shipments.length) return false;
        if (!b.detal.shipments || !b.detal.shipments.length) return true;
        return comparison(returnShipmentsDate(a.detal.shipments), returnShipmentsDate(b.detal.shipments), '<');
      });

      state.metaloworkings = new_arr
    },
    breackFIlterMetal(state) {
      if (state.filter_metal.length)
        state.metaloworkings = state.filter_metal;
    },
    sortMatallZag(state, val) {
      if (!state.middleware.length)
        state.middleware = state.metaloworkings;
        
      state.metaloworkings = state.middleware;
      state.metaloworkings = state.metaloworkings
        .filter(el => val ? el?.detal?.mat_za_obj : !el?.detal?.mat_za_obj)
    },
    sortMaterialStatus(state, val) {
      if (state.middleware_status.length == 0) state.middleware_status = state.metaloworkings;
      
      state.metaloworkings = state.middleware_status;
      if (val == 'Все') return null;
     
      if (val == 'В работе')
        state.metaloworkings = state.middleware_status.filter(m => (m.kolvo_shipments - returnKolvoCreate(m)) != 0 && !returnKolvoCreate(m));

      if (val == 'Готово') 
        state.metaloworkings = state.middleware_status.filter(m => (m.kolvo_shipments - returnKolvoCreate(m)) < 1);
    },
    sortMetallZag(state, str) {
      if (!str) state.metaloworkings = state.middleware_zag;
      if (state.middleware_zag.length == 0)
        state.middleware_zag = state.metaloworkings;
      
      state.metaloworkings = state
      .middleware_zag
      .filter(metal =>
        ((metal?.detal?.mat_za_obj?.name.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1)
      );
    }
  }
}