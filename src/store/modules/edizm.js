const PATH_TO_SERVER = "http://10.14.109.5:5000/"

export default {
    state: {
        typeEdizm: [],
        edizm: []
    },
    getters: {
        allEdizm(state) {
            return state.edizm.reverse()
        },
        allTypeEdizm(state) {
            return state.typeEdizm.reverse()
        }
    },
    actions: { 
        async getAllEdizm(ctx) {
            let eType =  await fetch(`${PATH_TO_SERVER}/api/settings/typeedizm`)
            let edizm = await fetch(`${PATH_TO_SERVER}/api/settings/edizm`)
            eType = await eType.json()
            edizm = await edizm.json()

            ctx.commit("updateTypeEdizm", eType)
            ctx.commit("updateEdizm", edizm)
        },

        async createEdizm(ctx, edizm) {
            const res = await fetch(`${PATH_TO_SERVER}/api/settings/edizm`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name : edizm.name,
                    short_name: edizm.short_name,
                    typeEdizmId : edizm.typeEdizmId
                })
            })
            const result = await res.json()

            ctx.commit('addEdizm', result)
        },

        async removeEdizm(ctx, id) {
            const res =  await fetch(`${PATH_TO_SERVER}/api/settings/edizm/${id}`, {
                method: 'delete'
            })
            const result = await res.json()
            console.log(result)

            ctx.dispatch('getAllEdizm')
        },
        async updateEdizm(ctx, ez) {

            const res = await fetch(`${PATH_TO_SERVER}/api/settings/edizm/update`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: ez.id,
                    name: ez.name,
                    short_name: ez.short_name
                })
            });
            const result = await res.json()
            ctx.commit('updateEdizmOne', result)
        }
    },
    mutations: {
        updateTypeEdizm(state, edizm) {
            state.typeEdizm = edizm
        },
        updateEdizm(state, edizm) {
            state.edizm = edizm
        },
        addEdizm(state, edizm) {
            state.edizm.push(edizm)
        },
        updateEdizmOne(state, ez) {
            state.edizm.map((ediz) => {
                if(ediz.id == ez.id) {
                    ediz.name = ez.name
                    ediz.short_name = ez.short_name
                }
            })
        }
    }
}