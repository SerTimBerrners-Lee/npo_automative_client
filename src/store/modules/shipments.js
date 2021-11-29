import PATH_TO_SERVER from '@/js/path.js'

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
		async fetchAllShipments(ctx) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments`)
			if(res.ok) {
				const result = await res.json()
				ctx.commit('allShipments', result)
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
		async fetchAllShipmentsAssemble(ctx) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/assemble`)
			if(res.ok) {
				const result = await res.json()
				ctx.commit('allShipments', result)
				return result
			}
		},
		async fetchAllShipmentsMetaloworking(ctx) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments/metaloworking`)
			if(res.ok) {
				const result = await res.json()
				ctx.commit('allShipments', result)
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
		allShipments(state, result) {
			state.shipments = []
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