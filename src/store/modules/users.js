import PATH_TO_SERVER from '@/js/path.js'

export default {
    state: {
        users: [],
        user_ban: [],
        select_user: {}
    },
    getters: { 
        getUsers(state) {
            return state.users
        },
        getUserBan(state) {
            return state.user_ban
        },
        getSelectedUser(state) {
            return state.select_user
        }
    }, 
    actions: {
        async saveUser(ctx, data) { 
            const res = await fetch(`${PATH_TO_SERVER}api/users`, {
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
            return await fetch(`${PATH_TO_SERVER}api/users/update`, {
                method: "post",
                body: data
            })
        },
        async getAllUsers(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/users`)
            const result = await res.json()

            ctx.commit('updateUsers', result)
            return result
        },
        async banUserById(crx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/users/ban`, {
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
            state.users = []
            state.user_ban = []
            state.users = users.filter(user => !user.banned)
            state.user_ban = users.filter(user => user.banned)
        },
        selectedUser(state, user) {
            state.select_user = user
        }
    }
}