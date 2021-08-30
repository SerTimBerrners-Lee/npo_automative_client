

export default {
    state: {
        users: [1, 2]
    },
    getters: { 
        getUsers(state) {
            return state.users
        }
    },
    actions: {
        async saveUser(ctx, data) {
            const res = await fetch('http://localhost:5000/api/users', {
                method: "post",
                body: data
            })
            const result = await res.json()

            if(result.statusCode == 400) {
                return { type: 'error', message: result.message}
            } else if (result.id) {
                return { type: 'success', message: 'Пользователь успешно создан'}
            }

            return { type: 'error', message: 'Произошла ошика при добавлении пользователя'}
            
        },
        async getAllUsers(ctx) {
            const res = await fetch('http://localhost:5000/api/users')
            const result = await res.json()

            ctx.commit('updateUsers', result)
        }
    },
    mutations: {
        updateUsers(state, users) { 
            state.users = users.filter((el) => !el.banned)
        }
    }
}