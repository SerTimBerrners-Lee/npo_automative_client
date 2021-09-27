import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        cbed: [],
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
        }

        // async deleteDetelyId(ctx, id) {
        //     if(!ctx.getters.getAuth)
        //         return 0

        //     const res = await fetch(`${PATH_TO_SERVER}api/detal/${id}`, {
        //         headers: new Headers({
        //             'Authorization': ctx.getters.getAuth.id
        //         }),
        //         method :  'delete'
        //     })
        //     if(res.ok) {
        //         ctx.commit('deleteDetalById', id)
        //     }
        // },
        // async fetchUpdateDetal(ctx, data) {
        //     if(!ctx.getters.getAuth)
        //         return 0
        //     const res = await fetch(`${PATH_TO_SERVER}api/detal/update`, {
        //         headers: new Headers({
        //             'Authorization': ctx.getters.getAuth.id
        //         }), 
        //         method :  'post',
        //         body   :  data
        //     })
        //     return res
        // },
        // async getAllDetals(ctx) {
        //     const res = await fetch(`${PATH_TO_SERVER}api/detal`)
        //     const result = await res.json()
        //     ctx.commit('setDetalMutation', result)
        // },
        // async getOneDetal(ctx, id)  {
        //     const res = await fetch(`${PATH_TO_SERVER}api/detal/${id}`)
        //     const result = await res.json()
        //     ctx.commit('addOneSelectDetal', result)
        //     return result
        // },

    },
    mutations: {
        addAllCbed(state, cbed) {
            state.cbed = cbed.filter(cb => !cb.ban)
        }
    }
}