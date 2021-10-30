<template>
  <div class="right-div-bfp">
    <h3>Принадлежность</h3>
    <div class="block scroll-table node_item">
      <h3 class="link_h3" @click='showIzd = !showIzd'>
        Изделие: {{ material.products ? material.products.length : 0 }} </h3>
      <div class="scroll-table table-fbp" v-if='showIzd'>
        <table>
          <tr>
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
           <tr v-for="product in material.products" :key="product" class="td-row">
            <td>{{ product.articl }}</td>
            <td>{{ product.name }}</td>
          </tr>
          <tr v-for="u in 10" :key="u" class="td-row">
            <td>...</td>
            <td>...</td>
          </tr>
        </table>
      </div>
      <h3 class="link_h3" @click='showSB = !showSB'>
        Сборочная единица: {{ material.cbeds ? material.cbeds.length : 0 }}</h3>
      <div class="scroll-table table-fbp" v-if='showSB'>
        <table>
          <tr class="td-row">
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
          <tr v-for="cbed in material.cbeds" :key="cbed" class="td-row">
            <td>{{ cbed.articl }}</td>
            <td>{{ cbed.name }}</td>
          </tr>
          <tr v-for="u in 10" :key="u" class="td-row">
            <td>...</td>
            <td>...</td>
          </tr>
        </table>
      </div>
      <h3 class="link_h3" @click='showDetal = !showDetal'>
        Деталь: {{ material.detals ? material.detals.length : 0 }} </h3>
      <div class="scroll-table table-fbp" v-if='showDetal'>
        <table>
          <tr class="td-row">
            <th>Артикул </th>
            <th>Наименование</th>
          </tr>
          <tr v-for='detal in material.detals' 
            :key="detal"
            class="td-row"
            @click='e => setDetals(detal, e.target.parentElement)'
          >
            <td>{{ detal.articl }}</td>
            <td>{{ detal.name }}</td>
          </tr>
          <tr v-for="u in 10" :key="u" class="td-row">
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
      v-if='detalIsShow'
    />
  </div>
</template>

<script>
import DetalModal from '@/components/basedetal/detal-modal.vue';
import { mapActions } from 'vuex';
import { random } from 'lodash'

export default {
  props: ['material'],
  data() {
    return {
      showIzd: false,
      showSB: false,
      showDetal: false,

      selectedDetal: null,
      tr: null,
      detalModalKey: random(1, 123e2),
      detalIsShow: false
    }
  },
  components: {DetalModal},
  methods: {
    ...mapActions(['getOneDetal']),
    setDetals(detal, e) {
      this.selectedDetal = detal
        if(this.tr) 
          this.tr.classList.remove('td-row-all')
      
      this.tr = e
      this.tr.classList.add('td-row-all')
      this.getOneDetal(this.selectedDetal.id).then(() => {
        this.detalModalKey = random(1, 34e5)
        this.detalIsShow = true
      })
    },
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
</style>