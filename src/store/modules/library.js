import PATH_TO_SERVER from '@/js/path.js'
 
export default {
  state: {
    chapter: []
  },
  getters: {
    getChapter(state) {
      return state.chapter
    },
  },
  actions: { 
    async createChapter(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/library/chapter`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
				body: JSON.stringify({name: data})
      })
      if(res.ok) {
        const result = await res.json()
        ctx.commit('mutationsAddChapter', result)
      }
    },
    async updateChapter(ctx, data) {
      return await fetch(`${PATH_TO_SERVER}api/library/chapter/`, {
        method: "put",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
				body: JSON.stringify(data)
      })
    },
    async getAllChapter(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/library/chapter`)
      if(res.ok) {
        const result = await res.json()
        console.log(result)
        ctx.commit('mutationsAllChapter', result)
      }
    },
    async removeChapter(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/library/chapter/${id}`, {
        method :  'delete'
      })
      if(res.ok) 
        ctx.commit('mutationsRemoveChapter', id)
    },
  },
  mutations: {
    mutationsAddChapter(state, chapter) {
      state.chapter.push(chapter)
    },
    mutationsRemoveChapter(state, id) {
      state.chapter = state.chapter.filter(ch => ch.id != id)
    },
    mutationsAllChapter(state, chapters) {
      state.chapter = chapters
    },
    mutationsUpdateChapter(state, chapter) {
      for(let inx in state.chapter) {
        if(state.chapter[inx].id == chapter.id)
          state.chapter[inx] = chapter
      }
    }
  }
}