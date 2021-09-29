import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        cbed: [],
        middleware_state: [],
        filterCbed: [],
        select_cbed: {},
    },
    getters: {
        allCbed(state) {
            return state.cbed
        },
        getOneSelectCbEd(state) {
            return state.select_cbed
        }
    },
    actions: { 
        async createNewCbEd(ctx, data) {
            if(!ctx.getters.getAuth)
                return 0

            const res = await fetch(`${PATH_TO_SERVER}api/cbed`, {
                method :  'post',
                body   :  data
            })
            if(res.ok) {
                const result = await res.json()
                return result
            }
        },

        async getAllCbed(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/cbed`)
            if(res.ok) {
                const result = await res.json()
                ctx.commit('addAllCbed', result)
                return result
            }
        },

        async updateCbed(ctx, data) {
            if(!ctx.getters.getAuth)
                return 0

            const res = await fetch(`${PATH_TO_SERVER}api/cbed/update`, {
                method :  'post',
                body   :  data
            })
            if(res.ok) {
                const result = await res.json()
                console.log(result)
                return result
            }
        },

        async deleteCbedById(ctx, id) {
            if(!ctx.getters.getAuth)
                return 0

            const res = await fetch(`${PATH_TO_SERVER}api/cbed/${id}`, {
                method :  'delete'
            })
            if(res.ok) {
                ctx.commit('deleteCbedByIdMutation', id)
            }
        }

    },
    mutations: {
        addAllCbed(state, cbed) {
            state.cbed = cbed.filter(cb => !cb.ban)
        },
        setOneCbed(state, cbed) {
            state.select_cbed = cbed
        },
        deleteCbedByIdMutation(state, id) {
            state.cbed = state.cbed.filter(cb => cb.id != id)
        },
        searchCbed(state, str) {
            if(!state.filterCbed.length)
                state.filterCbed = state.cbed
            

            state.cbed = state.filterCbed

            state.cbed = state.cbed.filter(prod => 
                prod.articl.slice(0, str.length).toLowerCase() == str.toLowerCase()
            )
        },
        getAllCbEdByProduct(state, product) {
            if(!state.middleware_state.length)
                state.middleware_state = state.cbed

            state.cbed = state.middleware_state
 
            let newCB = []
            for(let cb of state.cbed){
                for(let prod of product.cbeds) {
                    if(prod.id == cb.id)
                        newCB.push(cb)
                }
            }
            state.cbed = newCB
        },
        clearFilterCbedByProduct(state) {
            state.cbed = state.middleware_state
        }
    }
}