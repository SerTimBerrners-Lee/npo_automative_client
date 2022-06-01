<template>
  <table class="table-base-detal">
    <tr>
      <th colspan="2" style='font-size: 12px'>Кол-во: {{ allDetal.length }}</th>
    </tr>
    <tbody class='fixed_table_10'>
      <tr>
        <th colspan="2" scope="col">Деталь (Тип Д)</th>
      </tr>
      <tr>
        <th>Артикул</th>
        <th>Наименование</th>
      </tr>   
      <tr>
        <td colspan="2">
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
      @click='e => setObject(detal, e.target.parentElement)'
      >
      <td>{{ detal.articl }}</td>
      <td>{{ detal.name }}
        <span class='exclamation_item' v-if='detal.attention'>!</span>
      </td>
    </tr>
    <tr>
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
  computed: mapGetters(['allDetal']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['filterDetalToArticle']),
    async setObject(detal, e) {
      this.selected = detal;

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.filterDetalToArticle(String(str));
    }
  }
}

</script>