
let PATH_TO_SERVER = "http://localhost:5000"

export default {
    state: {
        typeM: [],
        podTypeM: []
    },
    getters: {
        alltypeM(state) {
            return state.typeM.reverse()
        },
        allPodTypeM(state) {
            return state.podTypeM.reverse()
        }
    },
    actions: { 
        async getAllTypeMaterial(ctx) {
            const res =  await fetch(`${PATH_TO_SERVER}/api/settings/material`)
            const result = await res.json()

            ctx.commit("getTypeMaterial", result)
        },

        async createTypeM(ctx, material) {
            const res = await fetch(`${PATH_TO_SERVER}/api/settings/material`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...material
                })
            })
            
            const result = await res.json()
            ctx.commit('addTypeMaterial', result)
        },

        async removeMaterial(ctx, id) {
            const res =  await fetch(`${PATH_TO_SERVER}/api/settings/material/${id}`, {
                method: 'delete'
            })

            if(res.ok)
                ctx.dispatch('getAllTypeMaterial')
        },
        async updateTypeM(ctx, material) {

            const res = await fetch(`${PATH_TO_SERVER}/api/settings/material/update`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...material
                })
            });

            const result = await res.json()
            ctx.commit('updateMaterial', result)
        }
    },
    mutations: {
        addTypeMaterial(state, material) {
            state.typeM.push(material)
        },
        getTypeMaterial(state, materisls) {
            state.typeM = materisls
        },
        updateMaterial(state, material) {
            state.typeM.filter(mat => mat.id != material.id)
            state.typeM.push(material)
        }
    }
}