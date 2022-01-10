<template>
  <table>
    <tbody class='fixed_table_10'>
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
            :placeholder="'Поиск по Артиклу'"
            @unmount='keySearch' 
            :search_data='search_data'
          />
        </td>
      </tr>
    </tbody>
    <tr v-for="(file, inx) in documents" 
      :key="file" 
      class="td-row" 
      @click="e => propEvent(file, e.target.parentElement)"
      @dblclick="dbEvent(file)"
      :class='file.banned ? "del_background" : ""'
      >
      <td class='center' style="width: 10px">{{ inx }}</td>
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
import Search from '@/components/search.vue';
export default {
  props: ['documents', 'search_data'],
  data() {
    return {
      td: null
    }
  },
  components: {Search},
  methods: {
    getDateRevers(date) {
      return getReversDate(date).date
    },
    propEvent(file, e) {
      if(this.td)
          this.td.classList.remove('td-row-all')
      this.td = e
      this.td.classList.add('td-row-all')

      this.$emit('pushFile', file)
    },
    dbEvent(file) {
      this.$emit('dbPushFile', file)
    },
    keySearch(str) {
      this.$emit('keySearch', str)
    }
  }
}
</script>
<style scoped>
table {
  user-select: none;
  width: min-content;
}
</style>