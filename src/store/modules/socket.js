import { random } from 'lodash';

export default {
	state: {
		connection: {},
		loader: false,
		keyLoader: random(1, 999)
	},
	getters: { 
		getConnection(state) {
			return state.connection
		},
		getLoader(state) {
			return state.loader;
		},
		getKeyLoader(state) {
			return state.keyLoader;
		}
	}, 
	actions: {
		async socketConnect() {
		},
	},
	mutations: {
		loaderChange(state, bools = undefined) {
			if (bools === undefined) state.loader = !state.loader;
			else state.loader = bools;
			
			state.keyLoader = random(1, 999);
		}
	}
}