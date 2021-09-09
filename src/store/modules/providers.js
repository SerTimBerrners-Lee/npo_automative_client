import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        providers: [],
        oneProvider: {}
    },
    getters: { 
        allProvider(state) {
            return state.providers
        },
        getSetProvider(state) {
            return state.oneProvider
        }
    },
    actions: { 
        async fetchGetProviders(ctx) {
            const res =  await fetch(`${PATH_TO_SERVER}api/provider`)
            const result = await res.json()
            console.log(result)
            ctx.commit("setAllProvider", result)
        },
        async addOneProvider(ctx, provider) {
            const res =  await fetch(`${PATH_TO_SERVER}api/provider`, {
                method: 'POST',
                body:   provider
            })
            if(res)
                ctx.dispatch('fetchGetProviders')
        },
        async fetchProviderBan(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/provider/ban/${id}`)
            if(res.ok)
                ctx.commit('removeProvider', id)
        }
    },
    mutations: {
        setAllProvider(state, result) {
            state.providers = result.filter(provider => !provider.ban)
        },
        removeProvider(state, id) {
            state.providers = state.providers.filter(provider => provider.id != id)
        },
        setProviderState(state, provider) {
            state.oneProvider = provider
        }
    }
}