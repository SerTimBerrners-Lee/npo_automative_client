export default {
    state: {
        posts: [1, 2]
    },
    // МОжно обращаться из гетера ко второму гетеру передав ему вторым параметром getters
    // и обращаться getters.имяМетода.ДлинаНапример если этот геттор возвращает массив 
    getters: {
        allPosts(state) {
            return state.posts
        }
    },
    // первым параметром принимает контекст (вызываетя без параметров)
    // {commit, dispatch, getters}
    actions: {
        async fetchPosts(ctx, limit = 3) {
            const res = await fetch(
                'https://jsonplaceholder.typicode.com/posts?_limit=' + limit
                )
            const result = await res.json()
            ctx.commit('updatePosts', result);
        }
    },
    // Всегда первым параметром принимает в себя стейт вторым то что передаем
    mutations: {
        updatePosts(state, posts) {
            state.posts = posts
        }
    }
}