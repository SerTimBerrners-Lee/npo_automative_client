import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        TInstrument: [],
        PTInstrument: []
    },
    getters: {
        allTInstrument(state) {
            return state.TInstrument
        },
        allPTInstrument(state) {
            return state.PTInstrument
        }
    },
    actions: { 
        async fetchAllInstruments(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument`)
            const result = await res.json()
            ctx.commit('addAllTInstrument', result)
        },
        async addNewTInstrument(ctx, name) {
            const res = await fetch(`${PATH_TO_SERVER}api/instrument`, {
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
        }
    },
    mutations: {
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
        }
    }
}