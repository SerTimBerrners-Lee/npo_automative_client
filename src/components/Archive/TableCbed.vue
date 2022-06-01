<template>
  <table class="table-base-detal">
    <tr>
      <th colspan="2" style='font-size: 12px'>Кол-во: {{ allCbed.length }}</th>
    </tr>
    <tbody class='fixed_table_10'>
      <tr>
        <th colspan="2" scope="col">Сборочная единица (Тип СБ)</th>
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
      v-for='cb in allCbed' 
      :key='cb'
      class='td-row'
      @click='e => setObject(detal, e.target.parentElement)'
      >
      <td>{{ cb.articl }}</td>
      <td>{{ cb.name }}
        <span class='exclamation_item' v-if='cb.attention'>!</span>
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
import { mapActions, mapGetters, mapMutations} from 'vuex';

export default {
  data() {
    return {
      selected: null,
      tr: null,
    }
  },
  computed: mapGetters(['allCbed']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['searchCbed']),
    async setObject(cbed, e) {
      this.selected = cbed;

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.searchCbed(String(str));
    }
  }
}

</script>
