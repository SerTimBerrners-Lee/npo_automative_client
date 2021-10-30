import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    product: [],
    filterProduct: [],
    select_product: {},
  },
  getters: {
    allProduct(state) {
      return state.product
    },
    getOneSelectProduct(state) {
      return state.select_product
    }
  },
  actions: { 
    async createNewProduct(ctx, data) {
      if(!ctx.getters.getAuth)
        return 0

      const res = await fetch(`${PATH_TO_SERVER}api/product`, {
        method :  'post',
        body   :  data
      })
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },

    async getAllProduct(ctx) {
      const res = await fetch(`${PATH_TO_SERVER}api/product`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addAllProduct', result)
        return result
      }
    },

    async updateProduct(ctx, data) {
      if(!ctx.getters.getAuth)
        return 0

      const res = await fetch(`${PATH_TO_SERVER}api/product/update`, {
        method :  'post',
        body   :  data
      })
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },

    async fetchDeleteProduct(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/product/${id}`, {method : 'delete'})
      if(res.ok) {
        const result = await res.json()
        ctx.commit('deleteProductById', id)
        return result
      }
    },
  },
  mutations: {
    addAllProduct(state, products) {
      state.product = products.filter(prod => !prod.ban)
    },
    setOneProduct(state, product) {
      state.select_product = product
    },
    deleteProductById(state, id) {
      state.product = state.product.filter(prod => prod.id != id)
    },
    searchProduct(state, str) {
      if(!state.filterProduct.length)
        state.filterProduct = state.product

      state.product = state.filterProduct
      state.product = state.product.filter(prod => 
        prod.articl.slice(0, str.length).toLowerCase() == str.toLowerCase()
      )
    },
  }
}