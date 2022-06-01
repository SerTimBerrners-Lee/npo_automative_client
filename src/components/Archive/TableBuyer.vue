<template>
  <table class="table-base-detal">
    <tr>
      <th colspan="2" style='font-size: 12px'>Кол-во: {{ allBuyer.length }}</th>
    </tr>
    <tbody class='fixed_table_10'>
      <tr>
        <th colspan="2" scope="col">Покупатели</th>
      </tr>
      <tr>
        <th>ИНН</th>
        <th>Наименование покупателя</th>
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
      v-for='buyer in allBuyer' 
      :key='buyer'
      class='td-row'
      @click='e => setObject(buyer, e.target.parentElement)'
      >
      <td style='width: 10%;'>{{ buyer.inn }}</td>
      <td>{{ buyer.name }}</td>
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
  computed: mapGetters(['allBuyer']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['searchBuyerMutations']),
    async setObject(buyer, e) {
      this.selected = buyer;

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.searchBuyerMutations(String(str));
    }
  }
}

</script>