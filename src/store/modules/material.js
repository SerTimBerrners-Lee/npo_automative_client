import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        typeM: [],
        podTypeM: [],
        podMaterial: [],
        onePPT: {}
    },
    getters: {
        alltypeM(state) {
            return state.typeM
        },
        allPodTypeM(state) {
            return state.podTypeM
        },
        getOnePodMaterial(state) {
            return state.podMaterial
        },
        getOnePPT(state) {
            return state.onePPT
        }
    },
    actions: { 
        async getAllTypeMaterial(ctx) {
            const res =  await fetch(`${PATH_TO_SERVER}api/settings/material`)
            const result = await res.json()

            ctx.commit("getTypeMaterial", result)
        },
        async getAllPodTypeMaterial(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/settings/materials/typematerial`)
            const result = await res.json()

            ctx.commit('filterMatByPodType', result)
        },
        async createTypeM(ctx, material) {
            const res = await fetch(`${PATH_TO_SERVER}api/settings/material`, {
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
        async createPodType(ctx, pod_type) {
            const res = await fetch(`${PATH_TO_SERVER}api/settings/material/podtype`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    density: pod_type.density,
                    materialId: pod_type.parentId,
                    name: pod_type.name
                })
            })
            
            if(res.ok) {
                //const result = await res.json()
                ctx.dispatch('getAllPodTypeMaterial')
            }
        },
        async removeMaterial(ctx, id) {
            const res =  await fetch(`${PATH_TO_SERVER}api/settings/material/${id}`, {
                method: 'delete'
            })
            if(res.ok)
                ctx.dispatch('getAllTypeMaterial')
        },
        async updateTypeM(ctx, material) {
            const res = await fetch(`${PATH_TO_SERVER}api/settings/material/update`, {
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
        },
        async updatePodMaterial(ctx, podM) {
            const res = await fetch(`${PATH_TO_SERVER}api/settings/material/podtype/update`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    materialId: podM.id,
                    density: podM.density,
                    name: podM.name
                })
            });

            const result = await res.json()
            ctx.commit('updatePodMaterial', {result, matId: podM.parentId} )
        },
        async deletePodType(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/settings/material/podtype/${id}`, {
                method: 'delete'
            })

            if(res.ok)
                ctx.commit('deletePodMaterial', id)
        },
        async getOnePodType(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/settings/materials/typematerial/${id}`)
            const result = await res.json()
            
            ctx.commit('addOnePodType', result)
            return result
        },
        async createNewPodPodMaterial(ctx, data) {
            const res = fetch(`${PATH_TO_SERVER}api/settings/material/podpodtype/`, {
                method: 'post',
                body: data
            })
            if(res.ok) {
                ctx.dispatch('createTypeM')
                return true
            }
        },
        async removePPM(ctx, id) {
            const res =  await fetch(`${PATH_TO_SERVER}api/settings/material/podpodtype/${id}`, {
                method: 'delete'
            })
            if(res.ok)
                ctx.dispatch('getAllTypeMaterial')
        },
        async bannedPPM(ctx, id) {
            const res =  await fetch(`${PATH_TO_SERVER}api/settings/material/podpodtype/${id}`)
            if(res.ok) {
                ctx.dispatch('getAllTypeMaterial')
                ctx.commit('bannedPPM', id)
            }
        },
        async fetchGetOnePPM(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/settings/material/podpodtype/get/${id}`)
            if(res.ok) {
                const result = await res.json()
                ctx.commit('addOnePPTyep', result)
                return result
            }
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
            state.typeM = state.typeM.filter(mat => mat.id != material.id)
            state.typeM.push(material)
        },
        filterMatByPodType(state, podMaterials) {
            state.podTypeM = podMaterials
        },
        deletePodMaterial(state, id) {
            state.podTypeM = state.podTypeM.filter(typ => typ.id != id)
        },
        updatePodMaterial(state, data) {
            state.podTypeM = state.podTypeM.filter(typ => typ.id != data.result.id)
            state.podTypeM.push(data.result)
            state.typeM.forEach(res => {
                if(data.matId == res.id) {
                    res.podMaterials = res.podMaterials.filter(podM => podM.id != data.result.id)
                    res.podMaterials.push(data.result)
                }
            })
        },
        createPodType(state, data) { 
            state.typeM = state.typeM.map(mat => {
                if(mat.id == data.parentId) {
                    mat.podMaterials.push(data.result)
                }
                return mat
            })
        },
        addOnePodType(state, typMaterial) {
            console.log(typMaterial)
            state.podMaterial = typMaterial.podPodMaterials.filter(material => !material.ban)
        },
        addOnePPTyep(state, PPT) {
            state.onePPT = PPT
        },
        bannedPPM(state, id) {
            state.podMaterial = state.podMaterial.filter(ppm => ppm.id != id)
        }
    }
}