<template>
  <div>
    <h3>Остатки продукции, сборок и деталей на складе</h3>
    <div class='main'>
      <div class="main_table_control">
        <div>
          <div class="scroll-table" >
            <table class="table-base-detal">
              <tbody class='fixed_table_10'>
                <tr>
                  <th colspan="5" scope="col">Изделие</th>
                </tr> 
                <tr>
                  <th>Заводской номер</th>
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th>Остаток на складе</th>
                  <th style='width: 50px;'>План. приход</th>
                </tr> 
              <tr>
                <td colspan="5">
                  <Search 
                    :placeholder="'Поиск по Артиклу, Наименованию и Номеру'"
                    @unmount='keySearchProduct' 
                  />
                </td>
              </tr>
              </tbody> 
              <tr 
                v-for='product in allProduct' 
                :key='product'
                class='td-row'
                @click='e => setProduct(product, e.target.parentElement)'
                @dblclick="infoModalProduct(product)"
                >
                <td>{{ product.fabricNumber }}</td>
                <td>{{ product.articl }}</td>
                <td>{{ product.name }}</td>
                <td class="center">{{ product.product_kolvo }}</td>
                <td class="center">{{ product.assemble_kolvo }}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
        <div>
          <div class="scroll-table" >
            <table class="table-base-detal">
              <tbody class='fixed_table_10'>
                <tr>
                  <th colspan="5" scope="col">Сборочная единица (Тип СБ)</th>
                </tr>
                <tr>
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th>Остаток на складе</th>
                  <th>План. приход</th>
                </tr>
                <tr>
                  <td colspan="5">
                    <Search 
                      :placeholder="'Поиск по Артиклу и Наименованию'"
                      @unmount='keySearchCb' 
                    />
                  </td>
                </tr>
              </tbody>
              <tr v-for='cb in allCbed' 
                :key='cb'
                class='td-row'
                @click='e => setCbed(cb, e.target.parentElement)'
                @dblclick="infoModalCbed(cb)">
                <td>{{ cb.articl }}</td>
                <td>{{ cb.name }}</td>
                <td class="center">{{ cb.cbed_kolvo  }}</td>
                <td class="center">{{ cb.assemble_kolvo }}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
        <div>
          <div class="scroll-table">
            <table class="table-base-detal">
              <tbody class='fixed_table_10'>
                <tr>
                  <th colspan="5" scope="col">Деталь (Тип Д)</th>
                </tr>
                <tr>
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th>Остаток на складе</th>
                  <th>План. приход</th>
                </tr>
                <tr>
                  <td colspan="5">
                    <Search
                      :placeholder="'Поиск по Артиклу и Наименованию'"
                      @unmount='keySearch'
                    />
                  </td>
                </tr>
              </tbody>
              <tr 
                v-for='detal in allDetal' 
                :key='detal'
                class='td-row'
                @click='e => setDetals(detal, e.target.parentElement)'
                @dblclick="infoDetal"
                >
                <td>{{ detal.articl }}</td>
                <td>{{ detal.name }}
                  <span class='exclamation_item' v-if='detal.attention'>!</span></td>
                <td class="center">{{ detal.detal_kolvo }}</td>
                <td class="center">{{ detal.metalloworking_kolvo }}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <DetalModal
      :key='detalModalKey'
      v-if='parametrs_detal'
      :id='parametrs_detal'
    />
    <CbedModalInfo
      :id='parametrs_cbed'
      :key='cbedModalKey'
      v-if='parametrs_cbed'
    />
    <ProductModalInfo
      :id='parametrs_product'
      :key='productModalKey'
      v-if='parametrs_product'
    />
  </div>
</template>
<script>
import { random } from 'lodash';
import { eSelectSpan } from '@/js/methods';
import CbedModalInfo from '@/components/CbEd/CbedModal';
import DetalModal from '@/components/BaseDetal/DetalModal';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import ProductModalInfo from '@/components/BaseProduct/ProductModal';

export default {
  data() {
    return {
      selectedCbEd: null,
      selecteProduct: null,
      tr_cb: null,
      tr_product: null,

      selectedDetal: null,
      tr: null,
      detalModalKey: random(1, 999),
      cbedModalKey: random(1, 999),
      parametrs_cbed: null,
      parametrs_detal: null,
      parametrs_product: null,
      productModalKey: random(1, 999),
    }
  },
  computed: mapGetters(['allDetal', 'allCbed', 'allProduct', 'getAuth']),
  components: { DetalModal, CbedModalInfo, ProductModalInfo },
  methods: {
    ...mapActions([
      'fetchDetalsRemains', 
      'fetchProductRemains', 
      'fetchCbedRemains',
      'getAllProductById',
      'getOneCbEdById',
      'getOneDetal',
      'getOneCbEdBelongs'
    ]),
    ...mapMutations([
      'filterDetalToArticle',
      'clearFilterCbedByProduct',
      'getAllCbEdByProduct',
      'searchCbed',
      'searchProduct',
      'getAllDetalByProduct',
      'clearFilterDetalByProduct',
      'setOneProduct',
      'setOneCbed',
      'addOneSelectDetal',
    ]),
    infoModalCbed(cb) {
      if (!cb) return false;
      this.parametrs_cbed = cb.id;
      this.cbedModalKey = random(1, 999);
    },
    infoModalProduct(product) {
      if (!product) return false;
      this.parametrs_product = product.id;
      this.productModalKey = random(1, 999);
    },
    async setDetals(detal, e) {
      const res = await this.getOneDetal(detal.id);
      this.selectedDetal = res;
      this.addOneSelectDetal(res);

      this.tr = eSelectSpan(this.tr, e);
    },
    infoDetal() {
      if (!this.selectedDetal) return false;

      this.detalModalKey = random(1, 999);
      this.parametrs_detal = this.selectedDetal.id;
    },
    async setCbed(cbed, e) {
      console.log(cbed);
      if (this.selectedCbEd && this.selectedCbEd.id == cbed.id) {
        this.clearFilterDetalByProduct();
        e.classList.remove('td-row-all');
        return this.selectedCbEd = null;
      }

      const res = await this.getOneCbEdById(cbed.id);
      if (!res) return false;

      const result = await this.getOneCbEdBelongs(res.id);
      if (!result) return false;

      res.detals = result.detals;
      res.products = result.products;
      this.getAllDetalByProduct(res);
      this.selectedCbEd = res;
      this.setOneCbed(res);

      this.tr_cb = eSelectSpan(this.tr_cb, e);
    },
    async setProduct(product, e) {
      if (this.selecteProduct && this.selecteProduct.id == product.id) {
        this.clearFilterCbedByProduct();
        this.clearFilterDetalByProduct();
        e.classList.remove('td-row-all');
        this.selecteProduct = null;
        return;
      }

      const res = await this.getAllProductById(product.id);
      if (!res) return false;
      this.selecteProduct = res;
      this.setOneProduct(res);
      this.getAllCbEdByProduct(res);
      this.getAllDetalByProduct(res);

      this.tr_product = eSelectSpan(this.tr_product, e);
    },
    keySearch(v) {
      this.filterDetalToArticle(String(v));
    },
    keySearchCb(v) {
      this.searchCbed(String(v));
    },
    keySearchProduct(v) {
      this.searchProduct(String(v));
    },
  },
  async mounted() {
    await this.fetchProductRemains(true);
    await this.fetchCbedRemains(true);
    await this.fetchDetalsRemains(true);
  }
}
</script>

<style scoped>
.table-base-detal {
  float: left;
  width: 470px;
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
  text-align: center;
}
.btn-control {
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

</style>