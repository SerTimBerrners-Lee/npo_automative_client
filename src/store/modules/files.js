import Req from '../../js/req';

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
      return state.noBanFiles.reverse();
    },
    banFiles(state) {
      return state.banFiles.reverse();
    }
  },
  actions: { 
    async fetchFiles(ctx) {
      const res = await Req(`api/documents`);
      if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('updateFiles', result);
      ctx.commit('getNoBanFiles');
    },

    async fetchFilesArchive(ctx) {
      const res = await Req(`api/documents/archive`);
      if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('addBannedFile', result);
    },

    async fetchBannedFiles(ctx) {
      const res = await Req(`api/documents/banned/all/${ctx.state.banFiles.length}`);
      if (!res.ok) return false;
      const result = await res.json();
      if (result?.length)
        ctx.commit('getBannedFiles', result);
    },

    async fetchAvaChange(ctx, id) {
      const res = await Req(`api/documents/avachanges/${id}`);
      if (!res.ok) return false;
      return true;
    },

    async fetchFilesNames() {
      const res = await Req(`api/documents/names`);
      return await res.json();
    },

    async pushDocuments(ctx, data) {
      const res = await Req(`api/documents/add`, {
        method: 'post',
        body: data
      });
      if (!res.ok) return false;
      const respons = await res.json();
      return respons;
    },

    async bannedFiles(ctx, docs) {
      const res = await Req(`api/documents/` + docs.id, {
        method: 'delete',
      });
      const result = await res.json();
      if (!res.ok) return { type: 'e', message: 'Произошла ошика при изменении'}

      const re = await ctx.commit('banFiles', result);
      return { re, type: 's', message: 'Файл успешно изменен'}
    },

    async fetchFileById(ctx, id) {
      const res = await Req(`api/documents/${id}`);

      const result = await res.json();
      if (!res.ok) return false;
      return result;
    },

    async checkedType(ctx, {id, type}) {
      const res = await Req(`api/documents/editype`, {
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

      if (!res.ok) return { type: 'e', message: 'Произошла ошика при изменении типа файла'}

      ctx.dispatch('fetchFiles');
      return { type: 's', message: 'Тип успешно изменен'}
    },

    async updateDataFile(ctx, data) {
      const res = await Req(`api/documents/update`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) return false;
      return true;
    },

    async setDetalForFile(ctx, data) {
      await Req(`api/documents/setdetal/`, {
        headers:{
          'Content-Type':'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
  },
  mutations: {
    updateFiles(state, files) {
      state.files = files;
    },
    banFiles(state, docs){
      if(docs.banned) {
        state.banFiles.push(docs);
        state.noBanFiles = state.noBanFiles.filter(f => f.id != docs.id);
      } else {
        state.noBanFiles.push(docs);
        state.banFiles = state.banFiles.filter(f => f.id != docs.id);
      }
    },
    pushFilesMutation(state, file) {
      state.files.push(file);
      state.noBanFiles.push(file);
    },
    getNoBanFiles(state) {
      state.noBanFiles = state.files.filter(f => !f.banned);
    },
    getBannedFiles(state, files = []){
      if(files.length == 0)
        state.banFiles = state.files.filter(f => f.banned);
      if(files.length)
        state.banFiles = files.filter(f => f.banned);
    },
    addBannedFile(state, files) {
      state.banFiles = files;
    },
    searchToFiles(state, str) {
      if(!state.filterFiles.length)
        state.filterFiles = state.noBanFiles;
      
      state.noBanFiles = state.filterFiles;

      state.noBanFiles = state.noBanFiles.filter(file => 
        file.name.slice(0, str.length).toLowerCase() == str.toLowerCase()
        )
    },
    searchToBanFiles(state, str) {
      if(!state.filterBanFiles.length)
        state.filterBanFiles = state.banFiles;
      
      state.banFiles = state.filterBanFiles;

      state.banFiles = state.banFiles.filter(file => 
        file.name.slice(0, str.length).toLowerCase() == str.toLowerCase()
        )
    }
  }
}