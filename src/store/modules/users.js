import Req from '../../js/req';

export default {
  state: {
  users: [],
  user_ban: [],

  searchUser: [],
  select_user: {}
  },
  getters: { 
    getUsers(state) {
      return state.users;
    },
    getUserBan(state) {
      return state.user_ban;
    },
    getSelectedUser(state) {
      return state.select_user;
    }
  }, 
  actions: {
    async saveUser(ctx, data) { 
      const res = await Req(`api/users`, {
        method: "post",
        body: data
      })
      const result = await res.json()

      if(result.statusCode == 400) 
        return { type: 'error', message: result.message}
      else if (result.id)
        return { type: 'success', message: 'Пользователь успешно создан'}

      return { type: 'error', message: 'Произошла ошика при добавлении пользователя'}
        
    },
    async updateUser(ctx, data) {
      const res =  await Req(`api/users/update`, {
        method: "post",
        body: data
      });

      if (!res.ok) return false;
      return res;
    },
    async getAllUsers(ctx, light=false) {
      const res = await Req(`api/users/data/${light}`)
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('updateUsers', result);
      return result;
    },
    async getAllUsersArchive(ctx) {
      const res = await Req(`api/users/archive/`)
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('updateUsersBan', result);
      return result;
    },
    async banUserById(crx, id) {
      const res = await Req(`api/users/ban`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: id,
          banReason: '...'
        })
      });

      if (!res.ok)
        return { type: 'e', message: 'Произошла ошика при изменении пользователя'}
      return { type: 's', message: 'Пользователь успешно изменен'}
    },
    async deleteFIleForUser(ctx, data) {
      return await Req(`api/users/fileban`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data})
      });
    },
    async getUserById(ctx, id) {
      const res = await Req(`api/users/${id}`);
      if (!res.ok) return false;

      const respons = await res.json();
      return respons;
    },
    async attachFileToUser(ctx, data) {
      const res = await Req(`api/users/files/${data.user_id}/${data.file_id}`);
      if (!res.ok) return false;

      const result = await res.json();
      return result;
    },
  },
  mutations: {
    updateUsers(state, users) {
      state.users = [];
      state.user_ban = [];
      state.users = users.filter(user => !user.banned);
      state.user_ban = users.filter(user => user.banned);
    },
    updateUsersBan(state, users) {
      state.users = users;
    },
    selectedUser(state, user) {
      state.select_user = user;
    },
    searchUser(state, str) {
      if(!state.searchUser.length) 
        state.searchUser = state.users;

      state.users = state.searchUser;
      if(!str) return;

      state.users = state.users
        .filter(t =>
          String(t.initial)
          .slice(0, String(str).length) == String(str) ||
          ((t.login.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1)
      );
    },
  }
}