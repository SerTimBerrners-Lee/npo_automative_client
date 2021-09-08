//import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        provider: []
    },
    getters: {
        allProvider(state) {
            return state.provider
        }
    },
    actions: { 
        async fetchGetProviders() {
            // const res =  await fetch(`${PATH_TO_SERVER}api/settings/providers`)
            // const result = await res.json()

            // ctx.commit("setAllProvider", result)
        },
        async addOneProvider(ctx, provider) {
            console.log(provider)
        }
    },
    mutations: {
        setAllProvider(state, result) {
            state.provider = result
        }
    }
}