import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        detal: [],
        select_detal: {},
        operationNewList: localStorage.getItem('newOperationItem') ?
            JSON.parse(localStorage.getItem('newOperationItem')) : [],
    },
    getters: {
        allDetal(state) {
            return state.detal
        },
        allOperationNewList(state) {
            return state.operationNewList
        },
        getOneSelectDetal(state) {
            return state.select_detal
        }
    },
    actions: { 
        async createNewDetal(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal`, {
                method :  'post',
                body   :  data
            })
            console.log(res)
        },
        async fetchUpdateDetal(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal/update`, {
                method :  'post',
                body   :  data
            })
            console.log(res)
        },
        async getAllDetals(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal`)
            const result = await res.json()
            ctx.commit('setDetalMutation', result)
        },
        async createOperation(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal/operation`, {
                method :  'post',
                body   :  data
            })
            if(res.ok) {
                const result = await res.json()
                ctx.commit('addNewOperationToList', result)
            }
        },
        async updateOperation(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/update`, {
                method  :   'post',
                body    :   data
            })
            if(res.ok) {
                const result = await res.json()
                ctx.commit('updateOperationToList', result)
            }
        },

        async updateOperationTech(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/up/tech`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method  :   'post',
                body    :   JSON.stringify({
                    ...data
                })
            })
            if(res.ok) {
                const result = await res.json()
                ctx.commit('updateOperationToList', result)
            }
        },

        async banOperation(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/${id}`, {
                method  : 'delete'
            })
            if(res.ok) {
                ctx.commit('banOperationMuttation', id)
            }
        },

        async createTechProcess(ctx, data) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal/techprocess`, {
                method  :   'post',
                body    :   data
            })
            if(res.ok) {
                const result = await res.json()
                return result 
            }
        },

        async fetchTechProcess(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal/techprocess/${id}`)
            const result = await res.json()
            if(res.ok) {
                return result 
            }
            
        },
        async fetchOneOperationById(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/detal/operation/get/${id}`) 
            const result = await res.json()
            return result 
        }
    },
    mutations: {
        addOneSelectDetal(state, detal) {
            state.select_detal = detal
        },
        allOperationMutations(state, data) {
            state.operationNewList = data
            localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
        },
        addNewOperationToList(state, operation) {
            state.operationNewList.push(operation)
            localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
        },
        updateOperationToList(state, operation) {
            state.operationNewList = state.operationNewList.filter(op => op.id != operation.id)
            state.operationNewList.push(operation)
            localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
        },
        removeOperationStorage(state) {
            state.operationNewList = []
            localStorage.setItem('newOperationItem', state.operationNewList )
        },
        banOperationMuttation(state, id) {
            state.operationNewList = state.operationNewList.filter(op => op.id != id)
            localStorage.setItem('newOperationItem', JSON.stringify(state.operationNewList))
        },
        setDetalMutation(state, data) {
            state.detal = data.filter(detal => !detal.ban)
        }
    }
}