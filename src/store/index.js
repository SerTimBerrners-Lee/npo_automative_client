import { createStore } from 'vuex'
import post from './modules/post'
import roles from './modules/roles'
import users from './modules/users'
import files from './modules/files'
import edizm from './modules/edizm'
import material from './modules/material'
import providers from './modules/providers'
import instruments from './modules/instruments'
import equipment from './modules/equipment'
import detal from './modules/detal'
import auth from './modules/auth'
import navigation from './modules/navigation'
import operation from './modules/operation'
import cbed from './modules/cbed'

export default createStore({
  modules: {
    post,
    roles,
    users,
    files,
    edizm,
    material,
    providers,
    instruments,
    equipment,
    detal,
    auth,
    navigation,
    operation,
    cbed
  }
})
  