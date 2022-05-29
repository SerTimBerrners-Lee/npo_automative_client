<template>
  <table class="table-base-detal">
    <tr>
      <th colspan="2" style='font-size: 12px'>Кол-во: {{ getOnePodMaterial.length }}</th>
    </tr>
    <tbody class='fixed_table_10'>
      <tr>
        <th colspan="2" scope="col">Деталь (Тип Д)</th>
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
      v-for='mat in getOnePodMaterial' 
      :key='mat'
      class='td-row'
      @click='e => setObject(mat, e.target.parentElement)'
      >
      <td v-if="mat?.podMaterial?.instansMaterial == 1">Мат. для деталей</td>
      <td v-else-if="mat?.podMaterial?.instansMaterial == 2">Покупные детали</td>
      <td v-else-if="mat?.podMaterial?.instansMaterial == 3">Расходные материалы</td>
      <td v-else>-</td>
      <td>{{ mat.name }}</td>
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
  computed: mapGetters(['getOnePodMaterial']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['searchMaterialMutation']),
    async setObject(mat, e) {
      this.selected = mat;

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.searchMaterialMutation(str);
    }
  }
}

</script>