import PATH_TO_SERVER from '@/js/path.js'

export default {
	state: {
		shipments: []
	},
	getters: { 
		getShipments(state) {
			return state.shipments
		}
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
		}
	},
	mutations: {
		allShipments(state, result) {
			state.shipments = result
		}
	}
}