import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        equipmentType: [],
        equipmentPType: [],
        equipments: [],
        equipment: {}
    },
    getters: {
        allEquipmentType(state) {
            return state.equipmentType
        },
        allEquipmentPType(state) {
            return state.equipmentPType
        },
        allEquipment(state) {
            return state.equipments
        }
    },
    actions: { 
        async fetchAllEquipmentType(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/equipment`)
            const result = await res.json()
            ctx.commit('addAllEquipmentType', result)
        },
        async addEquipmentType(ctx, name) {
            const res = await fetch(`${PATH_TO_SERVER}api/equipment`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...name
                })
            })

            if(res.ok) {
                const result = await res.json()
                ctx.commit('addOneEquipmentType', result)
            }
        },
        async removeEquipmentType(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/equipment/${id}`, {
                method: 'delete'
            })
            if(res.ok)
                ctx.commit('removeEquipmentTyp', id)
        },
        async updateEquipmentType(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/equipment/update`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data
                })
            })
            if(res.ok) 
                ctx.dispatch('fetchAllEquipmentType')
        },

        async createEquipmentPT(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/equipment/pt`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data
                })
            })

            if(res.ok) {
                const result = await res.json()
                ctx.commit('mutationCreateEquipmentPT', result)
            }
        },
        async removeEquipmentPType(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/equipment/pt/${id}`, {
                method: 'delete'
            })
            if(res.ok)
                ctx.commit('removeEquipmentPType', id)
                ctx.dispatch('fetchAllEquipmentType')
        },
        async updateEquipmentPType(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/equipment/pt/update`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data
                })
            })
            if(res.ok) {
                const result = await res.json()
                ctx.commit('updateEquipmentPType', result)
                ctx.dispatch('fetchAllEquipmentType')
            }
        },
    //     async getAllPTInstances(ctx, id) {
    //         const res = await fetch(`${PATH_TO_SERVER}api/instrument/pt/${id}`)
    //         const result = await res.json()
    //         ctx.commit('getAllName', result)
    //     },

    //     async addNameInstrument(ctx, data) {
    //         const res = await fetch(`${PATH_TO_SERVER}api/instrument/nameinstrument`, {
    //             method: 'post',
    //             body: data
    //         })

    //         if(res.ok) {
    //             const result = await res.json()
    //             console.log(result)
    //         }
    //     },
    //     async fetchOneNameInstrument(ctx, id) {
    //         const res = await fetch(`${PATH_TO_SERVER}api/instrument/name/${id}`)
    //         const result = await res.json()
    //         ctx.commit('addOneNameInstrument', result)
    //     },
    //     async removeFileInstrument(ctx, id) {
    //         await fetch(`${PATH_TO_SERVER}api/instrument/file/${id}`, {
    //             method: 'delete'
    //         })
    //     },
    //     async updateNameInstrument(ctx, data) {
    //         const res = await fetch(`${PATH_TO_SERVER}api/instrument/nameinstrument/update`, {
    //             method: 'post',
    //             body: data
    //         })

    //         if(res.ok) {
    //             const result = await res.json()
    //             console.log(result)
    //         }
    //     },
    //     async banNameInstrument(ctx, id) {
    //         await fetch(`${PATH_TO_SERVER}api/instrument/ban/${id}`, {
    //             method: 'delete'
    //         })
    //         ctx.commit('hideNameInstrument', id)
    //         ctx.dispatch('fetchAllInstruments')
    //     },
    },
    mutations: {
        // hideNameInstrument(state, id) {
        //     state.PPTInstrument = state.PPTInstrument.filter(inst => inst.id != id)
        // },
        // addOneNameInstrument(state, nameInstrument) {
        //     state.nameInstrument = nameInstrument
        // },
        // getAllName(state, data) {
        //     state.PPTInstrument = data.nameInstrument.filter(nameInstrument => !nameInstrument.ban)
        // },
        addAllEquipmentType(state, equipments) {
            state.equipmentType = equipments
        },
        addOneEquipmentType(state, equipments) {
            state.equipmentType.push(equipments)
        },
        removeEquipmentTyp(state, id) {
            state.equipmentType = state.equipmentType.filter(eq => eq.id != id)
        },
        mutationCreateEquipmentPT(state, equipmentsPT) {
            if(!state.equipmentPType)
                state.equipmentPType = []
            state.equipmentPType.push(equipmentsPT)
        },
        filterAllPTEquipment(state, PTEquipment) {
            if(!PTEquipment)   
                state.equipmentPType = []
            state.equipmentPType = PTEquipment
        },
        removeEquipmentPType(state, id) {
            state.equipmentPType = state.equipmentPType.filter(eq => eq.id != id)
        },
        updateEquipmentPType(state, result) {
            state.equipmentPType = state.equipmentPType.map(eq => eq.id == result.id ? result : eq)
        }
    }
}