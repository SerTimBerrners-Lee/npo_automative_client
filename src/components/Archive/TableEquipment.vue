<template>
  <table class="table-base-detal">
    <tr>
      <th style='font-size: 12px'>Кол-во: {{ allEquipment.length }}</th>
    </tr>
    <tbody class='fixed_table_10'>
      <tr>
        <th>Оборудование</th>
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
      v-for='eq in allEquipment' 
      :key='eq'
      class='td-row'
      @click='e => setObject(eq, e.target.parentElement)'
      >
      <td>{{ eq.name }}</td>
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
  computed: mapGetters(['allEquipment']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['searchEq']),
    async setObject(eq, e) {
      this.selected = eq;

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.searchEq(str);
    }
  }
}

</script>