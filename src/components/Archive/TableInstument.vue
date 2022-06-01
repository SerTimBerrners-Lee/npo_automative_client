<template>
  <table class="table-base-detal">
    <tr>
      <th colspan="2" style='font-size: 12px'>Кол-во: {{ allPPTInstrument.length }}</th>
    </tr>
    <tbody class='fixed_table_10'>
      <tr>
        <th colspan="2" scope="col">Инструмент</th>
      </tr>
      <tr>
        <th>Тип</th>
        <th>Наименование</th>
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
      v-for='instr in allPPTInstrument' 
      :key='instr'
      class='td-row'
      @click='e => setObject(instr, e.target.parentElement)'
      >
      <td v-if="instr?.instrumentType?.instans == 1">Инструмент</td>
      <td v-else-if="instr?.instrumentType?.instans == 2">Оснастка</td>
      <td v-else-if="instr?.instrumentType?.instans == 3">Мерительный инструмент</td>
      <td v-else>-</td>
      <td>{{ instr.name }}</td>
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
  computed: mapGetters(['allPPTInstrument']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['searchNameInst']),
    async setObject(instr, e) {
      this.selected = instr;
      console.log(instr)

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.searchNameInst(String(str));
    }
  }
}

</script>