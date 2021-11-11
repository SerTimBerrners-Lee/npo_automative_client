import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    files: [],
    noBanFiles: [],
    banFiles: [],

    filterFiles: [],
    filterBanFiles: []
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
      const res = await fetch(`${PATH_TO_SERVER}api/documents`)

      const result = await res.json()
      ctx.commit('updateFiles', result);
      ctx.commit('getNoBanFiles');
      ctx.commit('getBannedFiles');
    },

    async fetchFilesNames() {
      const res = await fetch(`${PATH_TO_SERVER}api/documents/names`)
      return await res.json()
    },

    async pushDocuments(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/documents/add`, {
        method: 'post',
        body: data
      })
      if(res.ok ) {
        const respons = await res.json()
        return respons
      } 
    },

    async bannedFiles(ctx, docs) {
      const res = await fetch(`${PATH_TO_SERVER}api/documents/` + docs.id, {
        method: 'delete',
      })
      const result = await res.json()
      if(res.ok) {
        let awar = await ctx.commit('banFiles', result)
        return { re: awar, type: 's', message: 'Файл успешно изменен'}
      }
      return { type: 'e', message: 'Произошла ошика при изменении'}
    },

    async fetchFileById(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/documents/${id}`)
      const result = await res.json()
      if(res.ok) 
        return result
    },

    async checkedType(ctx, {id, type}) {
      const res = await fetch(`${PATH_TO_SERVER}api/documents/editype`, {
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
    },

    async updateDataFile(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/documents/update`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if(res.ok) 
        return true
        else 
          return false
    },

    async setDetalForFile(ctx, data) {
      await fetch(`${PATH_TO_SERVER}api/documents/setdetal/`, {
        headers:{
          'Content-Type':'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },
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
    pushFilesMutation(state, file) {
      state.files.push(file)
      state.noBanFiles.push(file)
    },
    getNoBanFiles(state) {
      state.noBanFiles = state.files.filter(f => !f.banned)
    },
    getBannedFiles(state){
      state.banFiles = state.files.filter(f => f.banned)
    },
    searchToFiles(state, str) {
      if(!state.filterFiles.length)
        state.filterFiles = state.noBanFiles
      
      state.noBanFiles = state.filterFiles

      state.noBanFiles = state.noBanFiles.filter(file => 
        file.name.slice(0, str.length).toLowerCase() == str.toLowerCase()
        )
    },
    searchToBanFiles(state, str) {
      if(!state.filterBanFiles.length)
        state.filterBanFiles = state.banFiles
      
      state.banFiles = state.filterBanFiles

      state.banFiles = state.banFiles.filter(file => 
        file.name.slice(0, str.length).toLowerCase() == str.toLowerCase()
        )
    }
  }
}