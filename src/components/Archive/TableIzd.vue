<template>
  <table class="table-base-detal">
    <tr>
      <th colspan="3" style='font-size: 12px'>Кол-во: {{ allProduct.length }}</th>
    </tr>
    <tbody class='fixed_table_10'>
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
            :placeholder="'Поиск по Артиклу, Наименованию и Номеру'"
            @unmount='keySearch' 
          />
        </td>
      </tr>
    </tbody>
    <tr 
      v-for='prod in allProduct' 
      :key='prod'
      class='td-row'
      @click='e => setObject(prod, e.target.parentElement)'
      >
      <td>{{ prod.fabricNumber }}</td>
      <td>{{ prod.articl }}</td>
      <td>{{ prod.name }}</td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </table>
</template>
<script>
import { eSelectSpan } from '@/js/methods';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      selected: null,
      tr: null,
    }
  },
  computed: mapGetters(['allProduct']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['searchProduct']),
    async setObject(prod, e) {
      this.selected = prod;

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.searchProduct(str);
    }
  }
}

</script>