import Req from '../../js/req';

export default {
  state: {
    auth: localStorage.getItem('auth') ? 
      JSON.parse(localStorage.getItem('auth')) : null,
    roleAssets: localStorage.getItem('roleAssets') ? 
      JSON.parse(localStorage.getItem('roleAssets')) : null,
  },
  getters: { 
    getAuth(state) {
      return state.auth;
    },
    getRoleAssets(state) {
      return state.roleAssets;
    }
  }, 
  actions: {
    async loginAuth(ctx, data) {
      const res = await Req(`api/auth/login`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify({...data})
      });
      const auth = await res.json();

      if (auth && !auth.id)
        return { type: 'e', message: auth.message}
      if (auth.id) {
        ctx.commit('updateAuth', {ctx, auth});
        return { type: 's', message: 'Пользователь авторизован'}
      }
      return { type: 'e', message: 'Произошла ошибка при авторизации'}
      
    }
  },
  mutations: {
    updateAuth(state, {ctx, auth}) {
      if (!auth?.role || !auth?.role?.assets) return ctx.commit('unAuth');
      ctx.commit('setRoleAssets', {...auth.role, assets: JSON.parse(auth.role.assets)});

      state.auth = auth;
      localStorage.setItem('auth', JSON.stringify(auth));
    },
    unAuth(state) {
      state.auth = null;
      state.roleAssets = null;
      localStorage.removeItem('auth');
      localStorage.removeItem('roleAssets');
    },
    setRoleAssets(state, role) {
      state.roleAssets = role;
      localStorage.setItem('roleAssets', JSON.stringify(state.roleAssets));
    }
  }
}