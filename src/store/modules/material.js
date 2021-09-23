import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        typeM: [],
        instansTypeM: [],
        podTypeM: [],
        instansPodTypeM: [],
        
        podMaterial: [],
        onePPT: {},
        linkId: 0,

        providerTypeM: [],
        providerPTypeM: [],
        providerPM: [],

        sTypeM: [],
        sPTypeM: [],
        sProviderPM: [],

        stateMaterialTime: [],

        searchTypeM: [],
        searchPTypeM: [],
        searchMaterial: [],

        //* Поиск по глобальному провайдеру
        GlobalProviderTypeM: [],
        GlobalProviderPTypeM: [],
        GlobalProviderPM: [],

        sGlobalProviderTypeM: [],
        sGlobalProviderPTypeM: [],
        sGlobalProviderPM: [],
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
        },
        getLinkId(state) {
            return state.linkId
        },
        getproviderTypeM(state) {
            return state.providerTypeM
        },
        getproviderPTypeM(state) {
            return state.providerPTypeM
        },
        getproviderMaterial(state) {
            return state.providerPM
        },
        getGlobalProviderTypeM(state) {
            return state.GlobalProviderTypeM
        },
        getGlobalProviderPTypeM(state) {
            return state.GlobalProviderPTypeM
        },
        getGlobalProviderPM(state) {
            return state.GlobalProviderPM
        }
    },
    actions: { 
        async getAllTypeMaterial(ctx) {
            const res =  await fetch(`${PATH_TO_SERVER}api/settings/material`)
            const result = await res.json()

            await ctx.commit("getTypeMaterial", result)
            return result
        },
        async getAllPodTypeMaterial(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/settings/materials/typematerial`)
            const result = await res.json()

            await ctx.commit('filterMatByPodType', result)
            return result
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
                    ...pod_type
                })
            })
            
            if(res.ok) {
                const result = await res.json()
                ctx.commit('createPodType', result)
            }
        },
        async removeMaterial(ctx, id) {
            const res =  await fetch(`${PATH_TO_SERVER}api/settings/material/${id}`, {
                method: 'delete'
            })
            if(res.ok)
                ctx.commit('deleteMaterial', id)
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
                    ...podM
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
                ctx.commit('onePPTClear')
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
        },
        async fetchGetAllPPM(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/settings/material/podpodtype`)
            if(res.ok) {
                const result = await res.json()
                ctx.commit('pushAllPPT', result)
                return result
            }
        }
    },
    mutations: {
        throwInstans(state) {
            state.instansTypeM = []
            state.instansPodTypeM = []
            state.linkId = 0
        },
        getInstansMaterial(state, instans) {
            state.searchMaterial = []
            state.searchPTypeM = []
            state.searchTypeM = []
            
            state.podMaterial = []
            if(instans == 0) {
                state.typeM = state.instansTypeM
                state.podTypeM = state.instansPodTypeM
                state.typeM.forEach(el => {
                    el.podPodMaterials.forEach(e => {
                        state.podMaterial.push(e)
                    })
                })
                state.linkId = 0
                return 0
            }
            if(state.instansTypeM.length == 0) 
                state.instansTypeM = state.typeM
            if(state.instansPodTypeM.length == 0)
                state.instansPodTypeM = state.podTypeM

            state.linkId = instans

            state.typeM = state.instansTypeM.filter(mat => mat.instansMaterial == instans)
            state.podTypeM = state.instansPodTypeM.filter(mat => mat.instansMaterial == instans)
            state.typeM.forEach(el => {
                el.podPodMaterials.forEach(e => {
                    state.podMaterial.push(e)
                })
            })
        },
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
        deleteMaterial(state, id) {
            state.typeM = state.typeM.filter(typ => typ.id != id)
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
            state.podTypeM.push(data)
        },
        addOnePodType(state, typMaterial) {
            state.podMaterial = typMaterial.podPodMaterials.filter(material => !material.ban)
        },
        addOnePPTyep(state, PPT) {
            state.onePPT = PPT
        },
        bannedPPM(state, id) {
            state.podMaterial = state.podMaterial.filter(ppm => ppm.id != id)
        },
        filterMaterialById(state, id) {
            state.typeM = state.typeM.filter(m => m.id == id)
        },
        filterPodMaterialById(state, id) {
            state.podTypeM = state.podTypeM.filter(m => m.id == id)
        },
        onePPTClear(state) {
            state.onePPT = {}
        },
        filterMaterialByProvider(state, material) {
            state.providerTypeM = []
            state.providerPTypeM = []
            state.providerPM = []

            material.forEach(m => {
                if(m.ban)
                    return 0
                let mat = state.typeM.filter(t => t.id == m.materialsId)
                let pt = state.podTypeM.filter(pt => pt.id == m.ProvidersMaterial.providerId)
                state.providerTypeM.push(mat[0])
                state.providerPTypeM.push(pt[0])
                state.providerPM.push(m) 
            })
        },
        filterByProviderPM(state, str) {
            if(!state.sProviderPM.length) 
            state.sProviderPM =  state.providerPM

            state.providerPM = state.sProviderPM
            if(!str) 
                return

            state.providerPM = state.providerPM
                .filter(t =>  (t.name.slice(0, str.length).toLowerCase()) == str.toLowerCase())
        },
        filterByProviderPTypeM(state, str) {
            if(!state.sPTypeM.length) 
            state.sPTypeM =  state.providerPTypeM

            state.providerPTypeM = state.sPTypeM
            if(!str) 
                return

            state.providerPTypeM = state.providerPTypeM
                .filter(t =>  (t.name.slice(0, str.length).toLowerCase()) == str.toLowerCase())
        },
        filterByProviderTypeM(state, str) {
            if(!state.sTypeM.length) 
            state.sTypeM =  state.providerTypeM

            state.providerTypeM = state.sTypeM
            if(!str) 
                return

            state.providerTypeM = state.providerTypeM
                .filter(t =>  (t.name.slice(0, str.length).toLowerCase()) == str.toLowerCase())
        },
        filterToClickProviderTypeM(state, t) {
            if(!state.stateMaterialTime.length)
                state.stateMaterialTime = state.providerPM
            else 
                state.providerPM = state.stateMaterialTime
            state.providerPM = state.providerPM.filter(m => m.materialsId == t.id)
        },
        filterToClickProviderPTypeM(state, t) {
            if(!state.stateMaterialTime.length)
                state.stateMaterialTime = state.providerPM
            else 
                state.providerPM = state.stateMaterialTime

            state.providerPM = t.podPodMaterials
        },


        // Фильтруем все для глобального поиска по провайдеру
        globalProviderFilter(state, provider) {
            for(let prov of provider) {
                if(!prov.materials.length) continue;
                for(let mat of prov.materials) {
                    let check = true
                    for(let m of state.GlobalProviderPM) {
                        if(m.id == mat.id)
                            check = false
                    }
                    if(check)
                        state.GlobalProviderPM.push(mat)
                    check = true
                }
            }
            // Находим все типы
            for(let pm of state.GlobalProviderPM) {
                for(let type of state.typeM) {
                    if(pm.materialsId == type.id) {
                        let check = true
                        for(let tt of state.GlobalProviderTypeM) {
                            if(tt.id == type.id)
                                check = false
                        } 
                        if(check)
                            state.GlobalProviderTypeM.push(type)
                        check = true
                    }
                }
                // Находим все подтипы
                for(let pt of state.podTypeM) {
                    if(pt.podPodMaterials.length) {
                        for(let ppt of pt.podPodMaterials) {
                            if(ppt.id == pm.id) {
                                let check = true
                                for(let pTM of state.GlobalProviderPTypeM) {
                                    if(pTM.id == pt.id)
                                        check = false
                                }
                                if(check)
                                    state.GlobalProviderPTypeM.push(pt)
                                check = true
                            }
                        }
                    }
                }
            }
        },
        filterByProviderGTypeM(state, str) {
            if(!state.sGlobalProviderTypeM.length) 
            state.sGlobalProviderTypeM =  state.GlobalProviderTypeM

            state.GlobalProviderTypeM = state.sGlobalProviderTypeM
            if(!str) 
                return

            state.GlobalProviderTypeM = state.GlobalProviderTypeM
                .filter(t =>  (t.name.slice(0, str.length).toLowerCase()) == str.toLowerCase())
        },
        filterByProviderGPTypeM(state, str) {
            if(!state.sGlobalProviderPTypeM.length) 
            state.sGlobalProviderPTypeM =  state.GlobalProviderPTypeM

            state.GlobalProviderPTypeM = state.sGlobalProviderPTypeM
            if(!str) 
                return

            state.GlobalProviderPTypeM = state.GlobalProviderPTypeM
                .filter(t =>  (t.name.slice(0, str.length).toLowerCase()) == str.toLowerCase())
        },
        filterByProviderGNameM(state, str) {
            if(!state.sGlobalProviderPM.length) 
            state.sGlobalProviderPM =  state.GlobalProviderPM

            state.GlobalProviderPM = state.sGlobalProviderPM
            if(!str) 
                return

            state.GlobalProviderPM = state.GlobalProviderPM
                .filter(t =>  (t.name.slice(0, str.length).toLowerCase()) == str.toLowerCase())
        },

        toEmptyPPT(state) {
            state.podMaterial = []
        },
        filterByNameMaterial(state, mat) {
            state.podMaterial = mat.podPodMaterials
        },
        pushAllPPT(state, data) {
            state.podMaterial = data
        },
        searchTypeMutation(state, tm) {
            if(!state.searchTypeM.length) 
                state.searchTypeM =  state.typeM

            state.typeM = state.searchTypeM
            if(!tm) 
                return

            state.typeM = state.typeM
                .filter(t =>  (t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase())
        },
        searchPTypeMutation(state, tm) {
            if(!state.searchPTypeM.length) 
                state.searchPTypeM = state.podTypeM
            state.podTypeM = state.searchPTypeM
            if(!tm) 
                return
                
            state.podTypeM = state.podTypeM
                .filter(t =>  (t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase())
        },
        searchMaterialMutation(state, tm) {
            if(!state.searchMaterial.length) 
                state.searchMaterial = state.podMaterial

            state.podMaterial = state.searchMaterial
            if(!tm) 
                return
                
            state.podMaterial = state.podMaterial
                .filter(t =>  (t.name.slice(0, tm.length).toLowerCase()) == tm.toLowerCase())
        }
    }
}