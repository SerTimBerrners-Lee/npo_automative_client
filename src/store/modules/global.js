export default {
  state: {
    title_inform: '',
    message_inform: '',
    type_inform: '',
    key_inform: 999,
  },
  getters: {
    getTitleInform(state) {
      return state.title_inform;
    },
    getMessageInform(state) {
      return state.message_inform;
    },
    getTypeInform(state) {
      return state.type_inform;
    },
    getKeyInform(state) {
      return state.key_inform;
    }
  },
  mutations: {
    setTitleInform(state, val) {
      state.title_inform = val;
    },
    setMessageInform(state, val) {
      state.message_inform = val;
    },
    setTypeInform(state, val) {
      state.type_inform = val;
    },
    setKeyInform(state, val) {
      state.key_inform = val;
    }
  }
}