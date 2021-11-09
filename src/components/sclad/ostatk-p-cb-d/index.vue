<template>
	<div>
		<h3>Остатки продукции, сборок и деталей на складе</h3>
		<div class='block_cb_ed'>
      <div class="main_table_control">
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
                  @unmount='keySearchProduct' 
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
        <div class="scroll-table" >
          <table class="table-base-cbed">
            <tr>
              <th colspan="6" scope="col">Сборочная единица (Тип СБ)</th>
            </tr>
            <tr>
              <th>Артикул</th>
              <th>Наименование</th>
              <th style='width: 50px;'>Кол-во СБ на Изделие</th>
              <th style='width: 50px;'>Остаток на складе</th>
              <th style='width: 10px;'>Планируемый приход</th>
            </tr>
            <tr>
              <td colspan="3">
                <Search 
                  :placeholder="'Поиск по Артиклу'"
                  @unmount='keySearch' 
                />
              </td>
            </tr>
              <tr v-for='cb in allCbed' 
                :key='cb'
                class='td-row'
                @click='e => setCbed(cb, e.target.parentElement)'>
                <td>{{ cb.articl }}</td>
                <td>{{ cb.name }}</td>
                <td class='center'>{{ cb.kolvo_for_product ? cb.kolvo_for_product : '' }}</td>
                <td class='center'>{{ cb.cbed_kolvo }}</td>
                <td class='center'>{{ cb.assemble_kolvo }}</td>
            </tr>
            <tr v-for="item in 42" :key="item">
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>
    </div>

	</div>
</template>

<script> 
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Search from '@/components/search.vue';
import CbEdVue from '../../../views/CbEd.vue';
export default {
	data() {
		return {
			span: null,
			instansLet: 0,

			selectedCbEd: null,
      selecteProduct: null,
      tr_cb: null,
      tr_product: null,
		}
	},
	components: {Search},
	computed: mapGetters(['allCbed', 'allProduct']),
	methods: {
		...mapActions(['getAllCbed', 'deleteCbedById', 'getAllProduct']),
    ...mapMutations([
      'setOneCbed', 
      'searchCbed', 
      'searchProduct', 
      'setOneProduct', 
      'getAllCbEdByProduct',
      'clearFilterCbedByProduct']),
    setCbed(cbEd, e) {
      console.log(cbEd)
      this.selectedCbEd = CbEdVue
			if(this.tr_cb) 
				this.tr_cb.classList.remove('td-row-all')
  
      this.tr_cb = e
      this.tr_cb.classList.add('td-row-all')
      this.setOneCbed(this.selectedCbEd)
    },
    setProduct(product, e) {
      if(this.selecteProduct && this.selecteProduct.id == product.id) {
        this.clearFilterCbedByProduct()
        e.classList.remove('td-row-all')
        this.selecteProduct = null
        return
      }
      this.selecteProduct = product
      if(this.tr_product) 
        this.tr_product.classList.remove('td-row-all')
  
      this.setOneProduct(product)
      this.getAllCbEdByProduct(product)

      this.tr_product = e
      this.tr_product.classList.add('td-row-all')
    },
    keySearch(v) {
      this.searchCbed(v)
    },
    keySearchProduct(v) {
      this.searchProduct(v)
    },
	},
	async mounted() {
		this.getAllProduct()
    this.getAllCbed()
	}
}
</script>

<style scoped>
.table-base-detal {
  float: left;
  width: 470px;
}
.table-base-cbed {
  float: left;
  width: 700px;
}
.main {
  width: fit-content;
}
td {
  height: 10px;
}
.scroll-table {
  height: 700px;
}
.tb-title {
  height: 50px;
  text-align: center;
}
.btn-control {
  width: 840px;
  flex-direction: column;
  align-items: flex-end;
}
.btn-control button {
  margin: 2px;
}
table {
  font-size: 14px;
}
.main_table_control {
  display: flex;
}
.right_info_block {
  width: 450px;
  margin-top: 20px;
}
.main_cbed {
  display: flex;
}
</style>