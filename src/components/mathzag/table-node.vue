<template>
  <div :class="border_show ? '' + css : 'right-div-bfp '+ css">
    <h3>Принадлежность</h3>
    <div :class="border_show ? 'node_item' + css  : 'block node_item' + css ">
      <h3 class="link_h3" @click='showIzd = !showIzd'>
        Изделие: {{ izd.products ? izd.products.length : 0 }} </h3>
      <div class="scroll-table table-fbp" v-if='showIzd'>
        <table>
          <tr>
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
           <tr v-for="product in izd.products" :key="product" class="td-row">
            <td>{{ product.articl }}</td>
            <td>{{ product.name }}</td>
          </tr>
          <tr class="td-row">
            <td>...</td>
            <td>...</td>
          </tr>
        </table>
      </div>
      <h3 class="link_h3" @click='showSB = !showSB'>
        Сборочная единица: {{ izd.cbeds ? izd.cbeds.length : 0 }}</h3>
      <div class="scroll-table table-fbp" v-if='showSB'>
        <table>
          <tr class="td-row">
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
          <tr v-for="cbed in izd.cbeds" :key="cbed" 
            @click='e => setCbed(detal, e.target.parentElement)'
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
      <h3 class="link_h3" @click='showDetal = !showDetal'>
        Деталь: {{ izd.detals ? izd.detals.length : 0 }} </h3>
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
  </div>
</template>
<script>
import { random } from 'lodash';
import { mapActions } from 'vuex';
import DetalModal from '@/components/basedetal/detal-modal.vue';
export default {
  props: ['izd', 'border_show', 'css'],
  data() {
    return {
      showIzd: false,
      showSB: false,
      showDetal: false,

      tr: null,
      detalModalKey: random(1, 999),
      parametrs_detal: null
    }
  },
  components: {DetalModal},
  methods: {
    ...mapActions(['']),
    setDetals(detal, e) {
      this.setTr(e)
      this.parametrs_detal = detal.id
			this.detalModalKey = random(1, 999)
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