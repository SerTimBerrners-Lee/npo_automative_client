import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        deficit: [],
    },
    getters: { 
        getDeficit(state) {
            return state.deficit
        }
    }, 
    actions: {
        async fetchDeficit(ctx) { 
            const res = await fetch(`${PATH_TO_SERVER}api/sclad/deficit`)
            if(res.ok == true) {
                const result = await res.json()
                ctx.commit('setDeficit', result)
                return result
            }
        },
        async fetchUpdateDeficit(ctx, data) {
            return await fetch(`${PATH_TO_SERVER}api/sclad/deficit`, {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...data})
            })
        },
    },
    mutations: {
        setDeficit(state, result) { 
            state.deficit = result;
            
        },
    }
}