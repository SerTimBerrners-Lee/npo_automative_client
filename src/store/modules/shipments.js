import { dateDifference } from '@/js/';
import PATH_TO_SERVER from '@/js/path.js';
export default {
	state: {
		shipments: [],
		shipments_sclad: [],

		one_shipments: {}
	},
	getters: { 
		getShipments(state) {
			return state.shipments
		},
		getShipmentsSclad(state) {
			return state.shipments_sclad
		},
		getOneShipments(state) {
			return state.one_shipments
		}
	}, 
	actions: {
		async fetchCreateShipments(ctx, data) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments`, {
				method: "post",
				body: data
			})
			if(res.ok) 
				return true
			return false
		},
		async fetchUpdateShipments(ctx, data) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments`, {
				method: "put",
				body: data
			})
			if(res.ok) 
				return true
			return false
		},
		async fetchAllShipments(ctx, sort) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments`)
			if(res.ok) {
				const result = await res.json()
				ctx.commit('allShipments', {result, sort, ctx})
				return result
			}
		},
		async fetchDeleteShipments(ctx, id) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/${id}`, {
				method: 'delete'
			})
			if(res.ok)
				ctx.commit('deleteShipmentMutation', id)
		},
		async fetchAllShipmentsById(ctx, id) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/${id}`)
			if(res.ok) {
				const result = await res.json()
				return result
			}
		},
		async fetchAllShipmentsAssemble(ctx, sort) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/assemble`)
			if(res.ok) {
				const result = await res.json()
				ctx.commit('allShipments', {result, sort, ctx})
				return result
			}
		},
		async fetchAllShipmentsMetaloworking(ctx, sort) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/metaloworking`)
			if(res.ok) {
				const result = await res.json()
				ctx.commit('allShipments', {result, sort, ctx})
				return result
			}
		},
		async fetchChangeToSclad(ctx, id) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/sclad/${id}`, {
				method: 'PUT'
			})
			if(res.ok) {
				ctx.commit('deletToListShipments', id)
				return true
			}
		}
	},
	mutations: {
		allShipments(state, {result, sort = 'sort_sclad', ctx}) {
			state.shipments = []
			for(let ship of result) {
				if(ship.date_shipments) 
					ship.difference = dateDifference(undefined, ship.date_shipments)
				else ship.difference = 0
			}
			state.shipments = result.sort((a, b) => a.difference - b.difference)

			ctx.commit('sortShipmentParams', sort)
		},
		sortShipmentParams(state, sort) {
			if(!sort) return 
			// Сортируем все что заказано на склад идет в конец
			let arr_var1 = []
			let arr_var2 = []
			if(sort == 'sort_sclad') {
				for(let el of state.shipments) {
					if(el.to_sklad && el.number_order) {
						let char = el.number_order.split('')
						char.unshift('C')
						el.number_order = char.join('')
						arr_var1.push(el)
					}
					else arr_var2.push(el)
				}

				state.shipments = [].concat(arr_var2, arr_var1)
			}
		},
		pusshAddShipments(state, result) {
			state.shipments = result
		},
		shipmentsSclad(state, result) {
			state.shipments_sclad = result
		},
		deletToListShipments(state, id) {
			state.shipments_sclad = state.shipments_sclad.filter(sh => sh.id != id)
		},
		setOneShipment(state, shipments) {
			state.one_shipments = shipments
		},
		deleteShipmentMutation(state, id) {
			state.shipments = state.shipments.filter(ship => ship.id != id)
		},
		filterToParentShipments(state, id) {
			state.shipments = state.shipments.filter(ship => ship.id == id)
		}
	}
}