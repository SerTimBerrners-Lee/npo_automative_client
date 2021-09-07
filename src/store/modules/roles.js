
const PATH_TO_SERVER = "http://10.14.109.5:5000/"

export default {
    state: {
        roles: []
    },
    getters: {
        allRoles(state) {
            return state.roles
        }
    },
    actions: {
        async fetchRoles(ctx) {
            const res = await fetch(`${PATH_TO_SERVER}api/roles/`)
            const result = await res.json()
            ctx.commit('updateRoles', result);
        },
        async removeRole(ctx, id) {
            const res = await fetch(`${PATH_TO_SERVER}api/roles/` + id, {
                method: 'delete',
            }) 
            if(res.status == 200) {
                ctx.commit('filterById', id)
            } else {
                return 'error'
            } 
        },
        async createRole(ctx, param) {
            const res = await fetch(`${PATH_TO_SERVER}api/roles/`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: param.dolzn,
                    value: param.short_dolzn
                })
            })
            if(res.status == 201) {
                ctx.dispatch('fetchRoles')
            } else {
                return 'error'
            }
        },
        async editRoleById(ctx, param) {
            console.log(param)
            const res = await fetch(`${PATH_TO_SERVER}api/roles/update`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: param.id,
                    description: param.dolzn,
                    value: param.short_dolzn
                })
            })
            if(res.status == 201) {
                ctx.dispatch('fetchRoles')
            } else {
                return 'error'
            }
        }
    },
    mutations: {
        updateRoles(state, roles) {
            state.roles = roles
        },
        filterById(state, id) {
            state.roles = state.roles.filter(el => el.id != id)
        }
    }
}