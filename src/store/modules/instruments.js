import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        TInstrument: [],
        PTInstrument: [],
        PPTInstrument: [],
        nameInstrument: {},

        instansTInstrument: [],
        instansPTInstrument: [],
    },
    getters: {
        allTInstrument(state) {
            return state.TInstrument
        },
        allPTInstrument(state) {
            return state.PTInstrument
        },
        allPPTInstrument(state) {
            return state.PPTInstrument
        },
        getOneNameInstrument(state) {
            return state.nameInstrument
        }
    },
    actions: { 
        async fetchAllInstruments(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument`)
            const result = await res.json()
            ctx.commit('addAllTInstrument', result)
        },
        async addNewTInstrument(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument`, {
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
                ctx.dispatch('fetchAllInstruments')
                ctx.commit('addOneTInstrument', result)
            }
        },
        async removeTInstrument(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument/${id}`, {
                method: 'delete'
            })
            if(res.ok)
                ctx.commit('removeTInstrument', id)
        },
        async updateTInstrument(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument/update`, {
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
                ctx.dispatch('fetchAllInstruments')
        },
        async addNewPTInstrument(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument/pt`, {
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
                ctx.commit('addOnePTInstrument', result)
            }
        },
        async removePTInstrument(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument/pt/${id}`, {
                method: 'delete'
            })
            if(res.ok)
                ctx.commit('removePTInstrument', id)
                ctx.dispatch('fetchAllInstruments')
        },
        async updatePTInstryment(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument/pt/update`, {
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
                ctx.commit('updatePTInstrument', result)
                ctx.dispatch('fetchAllInstruments')
            }
        },
        async getAllPTInstances(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument/pt/${id}`)
            const result = await res.json()
            ctx.commit('getAllName', result)
        },

        async addNameInstrument(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument/nameinstrument`, {
                method: 'post',
                body: data
            })

            if(res.ok) {
                const result = await res.json()
                console.log(result)
            }
        },
        async fetchOneNameInstrument(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument/name/${id}`)
            const result = await res.json()
            ctx.commit('addOneNameInstrument', result)
        },
        async removeFileInstrument(ctx, id) {
            await fetch(`${PATH_TO_SERVER}api/instrument/file/${id}`, {
                method: 'delete'
            })
        },
        async updateNameInstrument(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument/nameinstrument/update`, {
                method: 'post',
                body: data
            })

            if(res.ok) {
                const result = await res.json()
                console.log(result)
            }
        },
        async banNameInstrument(ctx, id) {
            await fetch(`${PATH_TO_SERVER}api/instrument/ban/${id}`, {
                method: 'delete'
            })
            ctx.commit('hideNameInstrument', id)
            ctx.dispatch('fetchAllInstruments')
        },
    },
    mutations: {
        hideNameInstrument(state, id) {
            state.PPTInstrument = state.PPTInstrument.filter(inst => inst.id != id)
        },
        addOneNameInstrument(state, nameInstrument) {
            state.nameInstrument = nameInstrument
        },
        getAllName(state, data) {
            state.PPTInstrument = data.nameInstrument.filter(nameInstrument => !nameInstrument.ban)
        },
        addAllTInstrument(state, instruments) {
            state.TInstrument = instruments
        },
        addOneTInstrument(state, instrument) {
            state.TInstrument.push(instrument)
        },
        removeTInstrument(state, id) {
            state.TInstrument = state.TInstrument.filter(instr => instr.id != id)
        },
        addOnePTInstrument(state, PTInstrument) {
            if(!state.PTInstrument)
                state.PTInstrument = []
            state.PTInstrument.push(PTInstrument)
        },
        filterAllpInstrument(state, pInstruments) {
            if(!pInstruments)   
                state.PTInstrument = []
            state.PTInstrument = pInstruments
        },
        removePTInstrument(state, id) {
            state.PTInstrument = state.PTInstrument.filter(pI => pI.id != id)
        },
        updatePTInstrument(state, result) {
            state.PTInstrument = state.PTInstrument.map(pt => pt.id == result.id ? result : pt)
        },
        filterAllInstrumentNyId(state, id) {
            state.TInstrument = state.TInstrument.filter(pI => pI.id == id.type)
            state.PTInstrument = state.PTInstrument.filter(p => p.id == id.pType)
        },
        throwInstansTools(state) {
            state.instansTInstrument = []
            state.instansPTInstrument = []
            state.linkId = 0
        },
        getInstansTools(state, instans) {
            if(instans == 0) {
                state.TInstrument = state.instansTInstrument
                state.PTInstrument = state.instansPTInstrument
                state.linkId = 0
                return 0
            }
            if(state.instansTInstrument.length == 0) 
                state.instansTInstrument = state.TInstrument
            if(state.instansPTInstrument.length == 0)
                state.instansPTInstrument = state.PTInstrument

            state.linkId = instans

            state.TInstrument = state.instansTInstrument
                .filter(inst => inst.instans == instans)
            state.PTInstrument = state.instansPTInstrument
                .filter(inst => inst.instans == instans)
        },
    }
}