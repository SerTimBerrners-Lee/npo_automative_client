<template>
  <table class="table-base-detal">
    <tr>
      <th style='font-size: 12px'>Кол-во: {{ getInventary.length }}</th>
    </tr>
    <tbody class='fixed_table_10'>
      <tr>
        <th>Инвентарь</th>
      </tr>
      <tr>
        <th>Наименование</th>
      </tr>   
      <tr>
        <td colspan="1">
          <Search 
            :placeholder="'Поиск по Наименованию'"
            @unmount='keySearch'
          />
        </td>
      </tr>
    </tbody>
    <tr 
      v-for='inv in getInventary' 
      :key='inv'
      class='td-row'
      @click='e => setObject(inv, e.target.parentElement)'
      >
      <td>{{ inv.name }}</td>
    </tr>
    <tr>
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
  computed: mapGetters(['getInventary']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['searchInventary']),
    async setObject(inv, e) {
      this.selected = inv;

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.searchInventary(str);
    }
  }
}

</script>