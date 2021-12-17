import PATH_TO_SERVER from '@/js/path.js';
 
export default {
  state: {
    chapter: [],
    links: [],

    instansLinks: []
  },
  getters: {
    getChapter(state) {
      return state.chapter
    },
    getLinks(state) {
      return state.links
    }
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
        ctx.commit('mutationsAllChapter', result)
        return result
      }
    },
    async removeChapter(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/library/chapter/${id}`, {
        method :  'delete'
      })
      if(res.ok) 
        ctx.commit('mutationsRemoveChapter', id)
    },
    async saveNewLink(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/library/links`, {
        method :  'post', 
        body: data
      })
      if(res.ok) {
        const result = await res.json()
        ctx.commit('pushOneLinks', result)
        return result
      }
    },
    async updateFileLink(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/library/links`, {
        method :  'put', 
        body: data
      })
      if(res.ok) {
        const result = await res.json()
        ctx.commit('updateLinks', result)
        return result
      }
    },
    async getAllLinks(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/library/links`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('pushAllLinks', result)
        return result
      }
    },
    async fetchToBanLinks(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/library/links/${id}`, {
        method: 'delete'
      })
      if(res.ok) {
        ctx.commit('toBanLinks', id)
        return true
      }
    },
    async addLinkToFavorite(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/library/links/favorite/${data.user_id}/${data.links_id}`)
      if(res.ok) {
        ctx.commit('clearInstans')
        ctx.dispatch('getAllChapter')
        ctx.dispatch('getAllLinks')
      }
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
    },
    pushOneLinks(state, links) {
      state.links.push(links)
    },
    pushAllLinks(state, links) {
      state.links = links.filter(lin => !lin.ban)
    },
    filterLinksToChapter(state, chapter) {
      if(!chapter.links) return false
      if(state.instansLinks.length == 0)
        state.instansLinks = state.links
      state.links = chapter.links
    },
    returnAllLinks(state) {
      state.links = []
      for(let instans of state.instansLinks) {
        if(!instans.ban) state.links.push(instans)
      }
    },
    clearInstans(state) {
      state.instansLinks = []
    },
    toBanLinks(state, id) {
      state.links = state.links.filter(link => link.id != id)
    },
    updateLinks(state, link) {
      for(let lin in state.links) {
        if(state.links[lin].id == link.id) state.links[lin] = link
      }
      for(let lin in state.instansLinks) {
        if(state.instansLinks[lin].id == link.id) state.instansLinks[lin] = link
      }
    },
  }
}