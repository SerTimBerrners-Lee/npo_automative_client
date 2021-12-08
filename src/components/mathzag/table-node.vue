<template>
  <div :class="border_show ? '' + css : 'right-div-bfp '+ css">
    <h3>Принадлежность</h3>
    <div :class="border_show ? 'node_item' + css  : 'block node_item' + css ">
      <h3 class="link_h3" @click='showIzd = !showIzd' v-if='izd.products'>
        Изделие: {{ izd.products.length }} </h3>
      <div class="scroll-table table-fbp" v-if='showIzd'>
        <table>
          <tr>
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
           <tr v-for="product in izd.products" :key="product" class="td-row"
            @click='e => setProduct(product, e.target.parentElement)'>
            <td>{{ product.articl }}</td>
            <td>{{ product.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
            <td>...</td>
          </tr>
        </table>
      </div>
      <h3 class="link_h3" @click='showSB = !showSB' v-if='izd.cbeds || izd.cbed'>
        Сборочная единица: {{ izd.cbeds ? izd.cbeds.length : izd.cbed.length }}</h3>
      <div class="scroll-table table-fbp" v-if='showSB'>
        <table>
          <tr class="td-row">
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
          <tr v-for="cbed in izd.cbeds || izd.cbed" :key="cbed" 
            @click='e => setCbed(cbed, e.target.parentElement)'
            class="td-row">
            <td>{{ cbed.articl }}</td>
            <td>{{ cbed.name }}</td>
          </tr>
          <tr class="td-row"> 
            <td>...</td>
            <td>...</td>
          </tr>
        </table>
      </div>
      <h3 class="link_h3" @click='showDetal = !showDetal'  v-if='izd.detals'>
        Деталь: {{ izd.detals.length }} </h3>
      <div class="scroll-table table-fbp" v-if='showDetal'>
        <table>
          <tr class="td-row">
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
          <tr v-for='detal in izd.detals' 
            :key="detal"
            class="td-row"
            @click='e => setDetals(detal, e.target.parentElement)'
          >
            <td>{{ detal.articl }}</td>
            <td>{{ detal.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
            <td>...</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="btn-control">
      <button class="btn-small">
        Сохранить в виде отчета EXEL
      </button>
    </div>
    <DetalModal
      :key='detalModalKey'
      :id='parametrs_detal'
      v-if='parametrs_detal'
    />
    <ModalCbed
      :id='parametrs_cbed'
      :key='cbedModalKey'
      v-if='parametrs_cbed'
    />
    <ModalProduct
      :id='parametrs_product'
      :key='product_modal_key'
      v-if='parametrs_product'
    />
  </div>
</template>
<script>
import { random } from 'lodash';
import { mapActions } from 'vuex';
import ModalCbed from '@/components/cbed/cbed-modal.vue';
import DetalModal from '@/components/basedetal/detal-modal.vue';
import ModalProduct from '@/components/baseproduct/product-modal.vue';
export default {
  props: ['izd', 'border_show', 'css'],
  data() {
    return {
      showIzd: false,
      showSB: false,
      showDetal: false,

      tr: null,
      detalModalKey: random(1, 999),
      parametrs_detal: null,
      cbedModalKey: random(1, 999),
      parametrs_cbed: null,
      parametrs_product: null,
      product_modal_key: random(1, 999)
    }
  },
  components: {DetalModal, ModalCbed, ModalProduct},
  methods: {
    ...mapActions(['']),
    setDetals(detal, e) {
      this.setTr(e)
      this.parametrs_detal = detal.id
			this.detalModalKey = random(1, 999)
    },
    setCbed(cbed, e) {
      this.setTr(e)
      this.cbedModalKey = random(1, 999)
      this.parametrs_cbed = cbed.id
    },
    setProduct(prod, e) {
      this.setTr(e)
      this.product_modal_key = random(1, 999)
      this.parametrs_product = prod.id
    },
    setTr(e) {
      if(this.tr) 
        this.tr.classList.remove('td-row-all')
      this.tr = e
      this.tr.classList.add('td-row-all')
    },
  },
  async mounted() {
    console.log(this.$props.izd)
  }
}
</script>


<style scoped>
.right-div-bfp {
  width: 414px;
  margin-left: 10px;
}
th {
  width: 350px;
}
.node_item {
  width: 400px;
  height: 700px;
}
.table-fbp {
  width:100%;
  max-height: 250px;
  height: auto;
}
.full {
  width:100%;
}
</style>