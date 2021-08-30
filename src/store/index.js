import { createStore } from 'vuex'
import post from './modules/post'
import roles from './modules/roles'
import users from './modules/users'

export default createStore({
  modules: {
    post,
    roles,
    users
  }
})
  