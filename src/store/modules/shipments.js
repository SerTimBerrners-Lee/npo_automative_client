import PATH_TO_SERVER from '@/js/path.js'

export default {
	state: {
		shipments: [],
		shipments_sclad: []
	},
	getters: { 
		getShipments(state) {
			return state.shipments
		},
		getShipmentsSclad(state) {
			return state.shipments_sclad
		},
	}, 
	actions: {
		async fetchCreateShipments(ctx, data) { 
			const res = await fetch(`${PATH_TO_SERVER}api/shipments`, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: "post",
				body: JSON.stringify(data)
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
			state.shipments = result
		},
		shipmentsSclad(state, result) {
			state.shipments_sclad = result
		},
		deletToListShipments(state, id) {
			state.shipments_sclad = state.shipments_sclad.filter(sh => sh.id != id)
		}
	}
}