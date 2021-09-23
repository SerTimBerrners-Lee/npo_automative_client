import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        providers: [],
        onTimeProvider: [],
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
        },

        filterPByMaterial(state, material) {
            let idProvider = material.ProvidersMaterial.providerId
            if(!state.onTimeProvider.length)
                state.onTimeProvider = state.providers
            state.providers = state.providers.filter(p =>
                p.id == idProvider )
        },
        clearFilterProviders(state) {
            if(state.onTimeProvider.length)
                state.providers = state.onTimeProvider
        }
    }
}