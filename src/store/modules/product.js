import PATH_TO_SERVER from '@/js/path.js'

export default {
  state: {
    product: [],
    filterProduct: [],
    select_product: {},

    tmp_attention: [],
    tmp_operation: []
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

    async getAllProduct(ctx, light=false) {
      const res = await fetch(`${PATH_TO_SERVER}api/product/${light}`)
      if(res.ok) {
        const result = await res.json()
        ctx.commit('addAllProduct', result)
        return result
      }
    },

    async getAllArticlProduct() {
      const res = await fetch(`${PATH_TO_SERVER}api/product/articl`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },

    async getAllProductByIdLight(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/product/light/${id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },

    async getAllProductById(ctx, id) {
      const res = await fetch(`${PATH_TO_SERVER}api/product/one/${id}`)
      if(res.ok) {
        const result = await res.json()
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
        ctx.commit('updateProductMutation', result)
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

    async attachFileToProduct(ctx, data) {
      const res = await fetch(`${PATH_TO_SERVER}api/product/files/${data.product_id}/${data.file_id}`)
      if(res.ok) {
        const result = await res.json()
        return result
      }
    },
    
    async fetchAllProductOperation() {
      const res = await fetch(`${PATH_TO_SERVER}api/product/operation`)
      if(res.ok) return await res.json()
      return []
    }
  },
  mutations: {
    addAllProduct(state, products) {
      state.product = products.filter(prod => !prod.ban)
    },
    updateProductMutation(state, result) {
      for(let inx in state.product) {
        if(state.product[inx].id == result.id) state.product[inx] = result
      }
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
      console.log(state.product)
      state.product = state.product.filter(prod => 
        prod.articl.slice(0, str.length).toLowerCase() == str.toLowerCase() || 
        ((prod.name.slice(0, str.length).toLowerCase()) == str.toLowerCase()) ||
        ((prod.fabricNumber.slice(0, str.length).toLowerCase()) == str.toLowerCase())
      )
    },
    filterToAttentionProduct(state) {
      if(state.tmp_attention.length == 0)
        state.tmp_attention = state.product
      else {
        state.product = state.tmp_attention 
        return state.tmp_attention  = []
      }
      state.product = state.product.filter(detal => detal.attention)
    },
    sortByNonOperationProduct(state, arr_operation) {
      if(state.tmp_operation.length == 0)
        state.tmp_operation = state.product

      if(arr_operation.length == state.product.length) 
        return state.product = state.tmp_operation

      state.product = []
      for(let id of arr_operation) {
        for(let item of state.tmp_operation) {
          if(item.id == id) state.product.push(item)
        }
      }
    }
  }
}