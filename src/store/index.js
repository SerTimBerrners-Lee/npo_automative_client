import { createStore } from 'vuex'
import post from './modules/post'
import roles from './modules/roles'
import users from './modules/users'
import files from './modules/files'
import edizm from './modules/edizm'
import material from './modules/material'
import providers from './modules/providers'

export default createStore({
  modules: {
    post,
    roles,
    users,
    files,
    edizm,
    material,
    providers
  }
})
  