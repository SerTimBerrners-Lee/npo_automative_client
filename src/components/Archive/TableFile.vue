<template>
  <table>
    <tbody class='fixed_table_10'>
      <tr>
        <td colspan="5" style='font-size: 12px' class='center'>Всего: {{ banFiles.length }}</td>
      </tr>
      <tr>
        <th>№</th>
        <th>Тип</th>
        <th>Наименование</th>
        <th>Дата</th>
        <th>Примечание</th>
      </tr>
      <tr>
        <td colspan="5">
          <Search 
            :placeholder="'Поиск по Наименованию'"
            @unmount='keySearch'
          />
        </td>
      </tr>
    </tbody>
    <tr v-for="(file, inx) in banFiles" 
      :key="file" 
      class="td-row" 
      @click="e => setObject(file, e.target.parentElement)"
      :class='file.banned ? "del_background" : ""'
      :style='file.ava ? "background: orange;" :""'
      >
      <td class='center' style="width: 10px">{{ inx + 1 }}</td>
      <td style="width: 10px">{{ file.type }}</td>
      <td width="400px">{{ file.name }}</td>
      <td width="100px">{{ file.updatedAt ?
        getDateRevers(file.updatedAt)
        : '...' }}</td>
      <td class="width-350">{{ file.description }}</td>
    </tr>
    
    <tr class="td-row">
      <td>...</td>
      <td width="400px">...</td>
      <td>...</td>
      <td class="width-350">...</td>
    </tr>
  </table>
</template>
<script>
import { getReversDate } from '@/js/';
import { eSelectSpan } from '@/js/methods';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      selected: null,
      tr: null,
    }
  },
  computed: mapGetters(['banFiles']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['searchToBanFiles']),
    getDateRevers(date) {
      return getReversDate(date).date;
    },
    async setObject(file, e) {
      this.selected = file;

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.searchToBanFiles(str);
    }
  }
}

</script>