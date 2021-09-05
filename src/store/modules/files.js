export default {
    state: {
        files: [],
        noBanFiles: [],
        banFiles: []
    },
    getters: {
        allFiles(state) {
            return state.noBanFiles.reverse()
        },
        banFiles(state) {
            return state.banFiles.reverse()
        }
    },
    actions: { 
        async fetchFiles(ctx) {
            const res = await fetch('http://localhost:5000/api/documents')

            const result = await res.json()
            ctx.commit('updateFiles', result);
            ctx.commit('getNoBanFiles');
            ctx.commit('getBannedFiles');
        },

        async pushDocuments(ctx, data) {
            const res = await fetch('http://localhost:5000/api/documents/add', {
                method: 'post',
                body: data
            })
            const result = await res.json()
            console.log(result)
        },

        async bannedFiles(ctx, docs) {
            const res = await fetch('http://localhost:5000/api/documents/' + docs.id)
            const result = await res.json()
            if(res.ok) {
                let awar = await ctx.commit('banFiles', result)
                return { re: awar, type: 's', message: 'Файл успешно изменен'}
            }
            return { type: 'e', message: 'Произошла ошика при изменении'}
        },

        async checkedType(ctx, {id, type}) {
            const res = await fetch('http://localhost:5000/api/documents/editype', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    type
                })
            });

            if(res.ok) {
                ctx.dispatch('fetchFiles')
                return { type: 's', message: 'Тип успешно изменен'}
            }
            
            return { type: 'e', message: 'Произошла ошика при изменении типа файла'}
        }
    },
    mutations: {
        updateFiles(state, files) {
            state.files = files
        },
        banFiles(state, docs){
            if(docs.banned) {
                state.banFiles.push(docs)
                state.noBanFiles = state.noBanFiles.filter(f => f.id != docs.id)
            } else {
                state.noBanFiles.push(docs)
                state.banFiles = state.banFiles.filter(f => f.id != docs.id)
            }
        },
        getNoBanFiles(state) {
            state.noBanFiles = state.files.filter(f => !f.banned)
        },
        getBannedFiles(state){
            state.banFiles = state.files.filter(f => f.banned)
        }
    }
}