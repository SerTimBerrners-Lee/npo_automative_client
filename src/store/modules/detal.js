import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        detal: [],
    },
    getters: {
        allDetal(state) {
            return state.detal
        },
    },
    actions: { 
        async createNewDetal(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal`, {
                method: 'post',
                body: data
            })
            console.log(res)
        },
        async createOperation(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal/operation`, {
                method: 'post',
                body: data
            })
            if(res.ok) {
                console.log(res)
                const result = await res.json()
                console.log(result)
            }
        }
    },
    mutations: {
    }
}