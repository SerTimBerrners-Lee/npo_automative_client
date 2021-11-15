<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Выбрать изделие</h3>

			<div class="scroll-table" >
				<table class="table-base-detal">
					<tr>
						<th colspan="3" scope="col">Изделие</th>
					</tr>
					<tr>
						<th>Заводской номер</th>
						<th>Артикул</th>
						<th>Наименование</th>
					</tr>
					<tr>
						<td colspan="3">
							<Search 
								:placeholder="'Поиск по Артиклу'"
								@unmount='keySearch' 
							/>
						</td>
					</tr>
					<tr v-for='product in allProduct' 
						:key='product'
						class='td-row'
						@click='e => setProduct(product, e.target.parentElement)'
						>
						<td>{{ product.fabricNumber }}</td>
						<td>{{ product.articl }}</td>
						<td>{{ product.name }}</td>
					</tr>
					<tr v-for="item in 40" :key="item">
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</table>
			</div>
     <div class="btn-control out-btn-control">
      <button class="btn-status" 
        @click='destroyModalF'>Отменить</button>
      <button class="btn-status btn-black" 
				@click='responseProduct'>Выбрать</button>
    </div>
    </div>
  </div>
</div>
</template>

<script>

import {mapGetters, mapActions, mapMutations} from 'vuex';
import Search from '@/components/search.vue'
export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
			
			selecteProduct: null,
			tr: null,
    }
  },
  components: {Search},
  computed: mapGetters(['allProduct']),
	methods: {
		...mapActions(['getAllProduct']),
		...mapMutations(['setOneProduct', 'searchProduct']),

		destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'
    },

		setProduct(product, e) {	
      this.selecteProduct = product
      if(this.tr) 
        this.tr.classList.remove('td-row-all')
      this.setOneProduct(product)

      this.tr = e
      this.tr.classList.add('td-row-all')
    },
		keySearch(v) {
      this.searchProduct(v)
    },
		responseProduct() {
			if(!this.selecteProduct) 	return 0;
			this.destroyModalF()
			this.$emit('unmount', this.selecteProduct)
		}
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 

		this.getAllProduct()

  },

}
</script>

<style scoped>
.scroll-table {
	width: 100%;
	height: 650px;
}
table {
	width: 100%;
}
table td {
	height: 20px;
}
.out-btn-control {
	margin-top: 20px;
}
</style>