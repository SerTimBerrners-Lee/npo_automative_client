import auth from './modules/auth';
import cbed from './modules/cbed';
import { createStore } from 'vuex';
import detal from './modules/detal';
import roles from './modules/roles';
import users from './modules/users';
import files from './modules/files';
import edizm from './modules/edizm';
import buyer from './modules/buyer';
import sclad from './modules/sclad';
import issue from './modules/issue';
import socket from './modules/socket';
import moving from './modules/moving';
import library from './modules/library';
import product from './modules/product';
import settings from './modules/settings';
import assemble from './modules/assemble';
import material from './modules/material';
import inventary from './modules/inventary';
import providers from './modules/providers';
import equipment from './modules/equipment';
import operation from './modules/operation';
import shipments from './modules/shipments';
import navigation from './modules/navigation';
import instruments from './modules/instruments';
import metaloworking from './modules/metaloworking';

export default createStore({
  modules: {
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
    cbed,
    product,
    buyer,
    sclad,
    issue,
    shipments,
    assemble,
    metaloworking,
    settings,
    library,
    inventary,
    moving,
    socket
  }
})
  