import PATH_TO_SERVER from '@/js/path.js';
import { differencesShipments, comparison, shipmentsNull } from '@/js/';

export default {
	state: {
		shipments: [],
		shipments_sclad: [],
		shipments_parents: [],
		
		sh_complits: [],
		date_sort_shcomplit: [],
		str_sort_complit: [],

		variable_shipments: [],
		buyer_sort_shipments: [],
		date_sort_shipments: [],
		str_sort_shipments: [],

		one_shipments: {}
	},
	getters: { 
		getShipments(state) {
			return state.shipments;
		},
		getShipmentsSclad(state) {
			return state.shipments_sclad;
		},
		getOneShipments(state) {
			return state.one_shipments;
		},
		getParentsShipments(state) {
			return state.shipments_parents;
		},
		getShComplits(state) {
			return state.sh_complits;
		}
	}, 
	actions: {
		async fetchCreateShipments(ctx, data) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments`, {
				method: "post",
				body: data
			});
			if (!res.ok) return false;
			return true;
		},
		async fetchCreateShComplit(ctx, data) {
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/shcheck`, {
				method: "post",
				body: data
			});

			if (!res.ok) return false;
			return true;
		},
		async fetchCreateShUpdate(ctx, data) {
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/shcheckupdate`, {
				method: "post",
				body: data
			});

			if (!res.ok) return false;
			return true;
		},
		async fetchShComplitById(ctx, id) {
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/shcomplite/${id}`);
			if (!res.ok) return false;
			const result = await res.json();
			return result;
		},
		async fetchShComplit(ctx) {
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/shcheck`);
			if (!res.ok) return false;
			const result = await res.json();
			ctx.commit('allShComplit', result);
			return result;
		},
		async fetchCombackComplit(ctx, id) {
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/combackcomplit/${id}`);
			if (!res.ok) return false;
			ctx.commit('deleteComplit', id);
			return true;
		},
		async fetchUpdateShipments(ctx, data) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments`, {
				method: "put",
				body: data
			});
			if (!res.ok) return false;
			return true;
		},
		async fetchAllShipments(ctx, {sort = "sort_sclad", light = false}) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/all/${light}`);
			if (!res.ok) return false;

			const result = await res.json();
			ctx.commit('allShipments', {result, sort, ctx});
			return result;
		},
		async fetchAllShipmentsNoStatus(ctx, status = 2) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/status/${status}`);
			if (!res.ok) return false;

			const result = await res.json();
			ctx.commit('allShipments', {result, undefined, ctx});
			return result;
		},
		async fetchAllShipmentsTo(ctx) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/all/to/shipments/`);
			if (!res.ok) return false;

			const result = await res.json();
			ctx.commit('allShipments', {result, undefined, ctx});
			return result;
		},
		async fetchDeleteShipments(ctx, id) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/${id}`, {
				method: 'delete'
			});
			if (!res.ok) return false;

			ctx.commit('deleteShipmentMutation', id);
		},
		async fetchIncludesFolderSh(ctx, data) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/getinclude/${data.id}/`, {
				method: 'post',
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
				body: JSON.stringify(data)
			});
			if (!res.ok) return false;

			const result = res.json();
			return result;
		},
		// getattribute
		async fetchIncludesAttributesSh(ctx, data) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/getattribute/${data.id}/`, {
				method: 'post',
				headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
				body: JSON.stringify(data)
			});
			if (!res.ok) return false;

			const result = res.json();
			return result;
		},
		async fetchAllShipmentsById(ctx, obj) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/light/${obj.id}/${obj.light}`);
			if (!res.ok) return false;
			
			const result = await res.json();
			return result;
		},
		async fetchAllIzdToShipments(ctx, id) {
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/one/izd/${id}/`);
			if (!res.ok) return false;

			const result = await res.json();
			return result;
		},
		async fetchAllShipmentsAssemble(ctx, {sort = "sort_sclad", light = false}) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/assemble/${light}`);
			if (!res.ok) return false;

			const result = await res.json();
			ctx.commit('allShipments', {result, sort, ctx});
			return result;
		},
		async fetchAllShipmentsMetaloworking(ctx, {sort = "sort_sclad", light = false}) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/metaloworking/${light}`);
			if (!res.ok) return false;

			const result = await res.json();
			ctx.commit('allShipments', { result, sort, ctx });
			return result;
		},
		async fetchChangeToSclad(ctx, id) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/sclad/${id}`, {
				method: 'PUT'
			});
			if (!res.ok) return false;

			ctx.commit('deletToListShipments', id);
			return true;
		},	
		async fetchDocumentsShipments(ctx, id) {
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/documents/${id}`);
			if (!res.ok) return false;

			const result = await res.json();
			return result;
		}
	},
	mutations: {
		allShipments(state, { result, sort = 'sort_sclad', ctx = undefined }) {
			state.shipments = differencesShipments(result);
			if (ctx) {
				shipmentsNull(state.shipments);
				ctx.commit('sortShipmentParams', sort);
			}
		},
		sortShipmentParams(state, sort) {
			if (!sort) return;
			// Сортируем все что заказано на склад идет в конец
			const arr_var1 = [];
			const arr_var2 = [];
			if (sort == 'sort_sclad') {
				for(const el of state.shipments) {
					if (el.to_sklad && el.number_order) {
						const char = el.number_order.split('');
						char.unshift('C');
						el.number_order = char.join('');
						arr_var1.push(el);
					}
					else arr_var2.push(el);
				}

				state.shipments = [].concat(arr_var2, arr_var1);
			}
		},
		pusshAddShipments(state, result) {
			state.shipments = result;
		},
		shipmentsSclad(state, result) {
			state.shipments_sclad = result;
		},
		deletToListShipments(state, id) {
			state.shipments_sclad = state.shipments_sclad.filter(sh => sh.id != id);
		},
		setOneShipment(state, shipments) {
			state.one_shipments = shipments;
		},
		deleteShipmentMutation(state, id) {
			state.shipments = state.shipments.filter(ship => ship.id != id);
		},
		filterToParentShipments(state, id) {
			state.shipments_parents = state.shipments.filter(ship => ship.id == id);
		},
		filterShipmentsToStatus(state, value) {
			if (state.variable_shipments.length == 0)
				state.variable_shipments = state.shipments;
			state.shipments = state.variable_shipments;
			if (value == 'Все') return false;

			state.shipments = state.shipments.filter((el) => {
				if (value == 'Заказано')
					if (el.status == value || el.status == 'Просрочено') return el;
				if (el.status == value)return el;
			});
		},
		filterShipmentsToBuyer(state, buyerId) {
			if (!state.buyer_sort_shipments.length)
				state.buyer_sort_shipments = state.shipments;
			
			state.shipments = state.buyer_sort_shipments.filter(el => el.buyerId == buyerId);
		},
		setStatusShipments(state, sh_id) {
			for (const item of state.shipments) {
				if (item.id === sh_id) item.status = 'Отгружено';
			}
		},
		/**
		 * Очищает все временные сорт state
		 */
		clearFilters(state) {
			state.buyer_sort_shipments = [];
			state.variable_shipments = [];
			state.shipments_parents = [];
			state.shipments_sclad = [];
			state.date_sort_shipments = [];
		},
		/**
		 * Получаем все отметки о выполнении
		*/
		allShComplit(state, results) {
			state.sh_complits = results;
		},
		deleteComplit(state, id) {
			state.sh_complits = state.sh_complits.filter(el => el.id !== id);
		},
		filterShComplitData(state, range) {
			if (!state.date_sort_shcomplit.length)
				state.date_sort_shcomplit = state.sh_complits;

			const start = new Date(range.start).toLocaleDateString('ru-RU');
			const end = new Date(range.end).toLocaleDateString('ru-RU');
			state.sh_complits = state.date_sort_shcomplit.filter((el) => {
				if (el.date_order && 
						comparison(start, el.date_order, '<=') &&
						comparison(end, el.date_order, '>='))
					return el;
			});
		},
		filterShipmentsData(state, range) {
			if (!state.date_sort_shipments.length)
				state.date_sort_shipments = state.shipments;

			const start = new Date(range.start).toLocaleDateString('ru-RU');
			const end = new Date(range.end).toLocaleDateString('ru-RU');
			state.shipments = state.date_sort_shipments.filter((el) => {
				if (comparison(start, el.date_order, '<=') && comparison(end, el.date_order, '>='))
					return el;
			});
		},
		searchShipments(state, str) {
			if(!state.str_sort_shipments.length)
				state.str_sort_shipments = state.shipments;
			
			state.shipments = state.str_sort_shipments;
			state.shipments = state.shipments.filter(el => 
        el.number_order.slice(0, str.length).toLowerCase() == str.toLowerCase() ||
        ((el.number_order.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1)
      );
		},
		searchComplitSh(state, str) {
			if(!state.str_sort_complit.length)
				state.str_sort_complit = state.sh_complits;
			
			state.sh_complits = state.str_sort_complit;
			state.sh_complits = state.sh_complits.filter(el => {
				const prod = el?.shipments?.product?.articl;
				if (prod && el.number_complit) {
					console.log(el.number_complit)
					return (prod.slice(0, str.length).toLowerCase() == str.toLowerCase() ||
					((prod.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1)) || 
					(el.number_complit.slice(0, str.length).toLowerCase() == str.toLowerCase() ||
					((el.number_complit.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1))
				} else if(el.number_complit) return (el.number_complit.slice(0, str.length).toLowerCase() == str.toLowerCase() ||
					((el.number_complit.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1));
					else return (el.number_order.slice(0, str.length).toLowerCase() == str.toLowerCase() ||
					((el.number_order.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1));
			});
		}
	}
}