import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        product: [],
        filterProduct: [],
        select_product: {},
    },
    getters: {
        allProduct(state) {
            return state.product
        },
        getOneSelectProduct(state) {
            return state.select_product
        }
    },
    actions: { 
        async createNewProduct(ctx, data) {
            if(!ctx.getters.getAuth)
                return 0

            const res = await fetch(`${PATH_TO_SERVER}api/product`, {
                method :  'post',
                body   :  data
            })
            if(res.ok) {
                const result = await res.json()
                return result
            }
        },

        async getAllProduct(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/product`)
            if(res.ok) {
                const result = await res.json()
                ctx.commit('addAllProduct', result)
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
        addAllProduct(state, products) {
            console.log(products)
            state.product = products.filter(prod => !prod.ban)
        }
    }
}