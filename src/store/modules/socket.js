//import PATH_TO_SERVER from '@/js/path.js';

export default {
	state: {
		connection: {}
	},
	getters: { 
		getConnection(state) {
			return state.connection
		},
	}, 
	actions: {
		async socketConnect() {
		},
	},
	mutations: {

	}
}