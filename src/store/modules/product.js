
import Req from '../../js/req';
import { sortState } from '@/js/index';

export default {
  state: {
    product: [],
    filterProduct: [],
    select_product: {},
    middleware_state: [],

    tmp_attention: [],
    tmp_operation: [],
    tmp_responsible: [],

    date_is: '<' 
  },
  getters: {
    allProduct(state) {
      return state.product;
    },
    getOneSelectProduct(state) {
      return state.select_product;
    }  
  },
  actions: { 
    async createNewProduct(ctx, data) {
      if(!ctx.getters.getAuth) return 0;

      const res = await Req(`api/product`, {
        method :  'post',
        body   :  data
      });
      if (!res.ok) return false;

      const result = await res.json();
      return result;
    },

    async getAllProduct(ctx, light=false) {
      const res = await Req(`api/product/${light}`);
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('addAllProduct', result);
      return result;
    },

    async getAllProductArchive(ctx) {
      const res = await Req(`api/product/archive/`);
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('addAllProduct', result);
      return result;
    },

    async fetchProductRemains(ctx) {
      const res = await Req(`api/product/remains`);
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('addAllProduct', result);
      return result;
    },

    async getAllArticlProduct() {
      const res = await Req(`api/product/articl`);
      if (!res.ok) return false;
      const result = await res.json();
      return result;
    },

    async getAllProductByIdLight(ctx, id) {
      const res = await Req(`api/product/light/${id}`);
      if (!res.ok) return false;
      const result = await res.json();
      return result;
    },

    async getAllProductById(ctx, id) {
      const res = await Req(`api/product/one/${id}`);
      if (!res.ok) return false;
      const result = await res.json();
      return result;
    },

    async getAllProductShipmentsById(ctx, id) {
      const res = await Req(`api/product/shipments/${id}`);
      if (!res.ok) return false;
      return await res.json();
    },

    async updateProduct(ctx, data) {
      if (!ctx.getters.getAuth) return 0;

      const res = await Req(`api/product/update`, {
        method :  'post',
        body   :  data
      });

      if (!res.ok) return false;
      const result = await res.json();
      ctx.commit('updateProductMutation', result);
      return result;
    },

    async fetchDeleteProduct(ctx, id) {
      const res = await Req(`api/product/${id}`, {method : 'delete'});
      if (!res.ok) return false;

      const result = await res.json();
      ctx.commit('deleteProductById', id);
      return result;
    },

    async attachFileToProduct(ctx, data) {
      const res = await Req(`api/product/files/${data.product_id}/${data.file_id}`);
      if (!res.ok) return false;

      const result = await res.json();
      return result;
    },    
    async fetchAllProductOperation() {
      const res = await Req(`api/product/operation`);
      if (!res.ok) return [];
      const result = await res.json();
      return result;
    }
  },
  mutations: {
    addAllProduct(state, products) {
      state.product = products;
    },
    updateProductMutation(state, result) {
      for (let inx in state.product) {
        if (state.product[inx].id == result.id) state.product[inx] = result;
      }
    },
    setOneProduct(state, product) {
      state.select_product = product;
    },
    deleteProductById(state, id) {
      state.product = state.product.filter(prod => prod.id != id);
    },
    searchProduct(state, str) {
      if (!state.filterProduct.length)
        state.filterProduct = state.product

      state.product = state.filterProduct;
      state.product = state.product.filter(prod => 
        prod.articl.slice(0, str.length).toLowerCase() == str.toLowerCase() || 
        ((prod.name.toLowerCase()).indexOf(str.toLowerCase(), 0) != -1) ||
        ((prod.fabricNumber.slice(0, str.length).toLowerCase()) == str.toLowerCase())
      )
    },
    filterToAttentionProduct(state) {
      if (state.tmp_attention.length == 0)
        state.tmp_attention = state.product;
      else {
        state.product = state.tmp_attention;
        return state.tmp_attention = [];
      }
      state.product = state.product.filter(product => product.attention)
    },
    filterProductToDate(state) {
      state.dete_id = sortState(state.product, state.dete_id)
    },
    filterProductToMyObject(state, user_id) {
      if (state.tmp_responsible.length == 0) state.tmp_responsible = state.product;
      else {
        state.product = state.tmp_responsible;
        return state.tmp_responsible = [];
      }
      state.product = state.product.filter(product => product.responsibleId == user_id);
    },
    sortByNonOperationProduct(state, arr_operation) {
      if (state.tmp_operation.length == 0)
        state.tmp_operation = state.product;

      if (arr_operation.length == state.product.length) 
        return state.product = state.tmp_operation;

      state.product = []
      for (const id of arr_operation) {
        for (const item of state.tmp_operation) {
          if (item.id == id) state.product.push(item);
        }
      }
    },
    reverseMidlevareProduct(state) {
      if (!state.middleware_state.length) return false;
      state.product = state.middleware_state;
      state.middleware_state = [];
    },
    productToShipmentsSort(state, product) {
      if (state.middleware_state.length == 0)
        state.middleware_state = state.product;
      state.product = [];

      for (const prod of product) {
        if (!prod) continue;
        for (const prod_two of state.middleware_state) {
          if (prod_two.id == prod.id) state.product.push(prod_two);
        }
      }
    },
    changeStatusDeficitProduct(state, status) {
      if (state.middleware_state.length < 1)
        state.middleware_state = state.product;

      state.product = state.middleware_state;
      if (status == 'Все') return false; 
      state.product = state.product.filter(el => {
        if (status == "Не заказано" && el.assemble_kolvo < 1) return el;
        if (status == "Заказано" && el.assemble_kolvo > 0) return el;
      })
    },
    changeKolDeficitProduct(state, props) {
      if (state.middleware_state.length < 1)
        state.middleware_state = state.product;

      state.product = state.middleware_state;
      if (props.status == 'Все') return false; 
      state.product = state.product.filter(el => {
        if (props.status == "Общий" && props.deficit(el, el.product_kolvo) < 0) return el;
        if (props.status == "По заказам покупателя" && el.shipments_kolvo > 0) return el;
      })

      state.product = state.product.sort((a, b) => a - b);
    }
  }
}