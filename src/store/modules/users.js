

export default {
    state: {
        users: [1, 2]
    },
    getters: { 
        getUsers(state) {
            return state.users.filter(user => !user.banned)
        },
        getUserBan(state) {
            return state.users.filter(user => user.banned)
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
        },
        async banUserById(crx, id) {
            const res = await fetch('http://localhost:5000/api/users/ban', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: id,
                    banReason: '...'
                })
            })

            if(res.ok) {
                return { type: 's', message: 'Пользователь успешно изменен'}
            }
            return { type: 'e', message: 'Произошла ошика при изменении пользователя'}
        }
    },
    mutations: {
        updateUsers(state, users) { 
            state.users = users
        }
    }
}