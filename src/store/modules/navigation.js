export default {
  state: {
    nav: localStorage.getItem('nav') ? 
      JSON.parse(localStorage.getItem('nav')) : []
  },
  getters: { 
    getNav(state) {
      return state.nav
    }
  },
  mutations: {
    delitPathNavigate(state, path) {
      if(!state.nav.length)
        return 

      state.nav = state.nav.filter(nav => nav.path != path)
      localStorage.setItem('nav', JSON.stringify(state.nav))
    },
    pushPathNavigate(state, to) {
      if(state.nav.length > 0) {
        state.nav.forEach((e, inx) => {
          if(e.path == to.path) {
            state.nav.splice(inx, 1)
          }
        })
      } 

      if(state.nav.length > 8)
        state.nav.pop()
      state.nav.unshift({name: to.name, path: to.path})
      localStorage.setItem('nav', JSON.stringify(state.nav))
    },
    deleteAllNav(state){
      state.nav = []
      localStorage.setItem('nav', [])
    }
  }
}