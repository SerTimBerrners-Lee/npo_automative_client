import { createStore } from 'vuex'
import post from './modules/post'
import roles from './modules/roles'

export default createStore({
  modules: {
    post,
    roles
  }
})
  