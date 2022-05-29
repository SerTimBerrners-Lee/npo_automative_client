<template>
  <table class="table-base-detal">
    <tr>
      <th colspan="2" style='font-size: 12px'>Кол-во: {{ allProvider.length }}</th>
    </tr>
    <tbody class='fixed_table_10'>
      <tr>
        <th colspan="2" scope="col">Поставщики</th>
      </tr>
      <tr>
        <th>ИНН</th>
        <th>Наименование поставщика</th>
      </tr>   
      <tr>
        <td colspan="2">
          <Search 
            :placeholder="'Поиск по Наименованию'"
            @unmount='keySearch'
          />
        </td>
      </tr>
    </tbody>
    <tr 
      v-for='provider in allProvider' 
      :key='provider'
      class='td-row'
      @click='e => setObject(provider, e.target.parentElement)'
      >
      <td style='width: 10%;'>{{ provider.inn }}</td>
      <td>{{ provider.name }}</td>
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
  computed: mapGetters(['allProvider']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['searchProviderMutations']),
    async setObject(provider, e) {
      this.selected = provider;

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.searchProviderMutations(str);
    }
  }
}

</script>