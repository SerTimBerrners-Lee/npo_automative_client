<template>
  <table class="table-base-detal">
    <tr>
      <th colspan="3" style='font-size: 12px'>Кол-во: {{ getUsers.length }}</th>
    </tr>
    <tbody class='fixed_table_10'>
      <tr>
        <th colspan="3" scope="col">Сорудники</th>
      </tr>
      <tr>
        <th>Табельный номер</th>
        <th>Должность</th>
        <th style="width: 300px;">Инициалы</th>
      </tr>   
      <tr>
        <td colspan="3">
          <Search 
            :placeholder="'Поиск по Инициалам'"
            @unmount='keySearch'
          />
        </td>
      </tr>
    </tbody>
    <tr 
      v-for='user in getUsers' 
      :key='user'
      class='td-row'
      @click='e => setObject(user, e.target.parentElement)'
      >
      <td style='width: 10%;'>{{ user.tabel }}</td>
      <td style='width: 20%;'>{{ user.role ? user.role.description : '' }}</td>
      <td>{{ user.initial }}</td>
    </tr>
    <tr>
      <td></td>
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
  computed: mapGetters(['getUsers']),
  methods: {
    ...mapActions(['']),
    ...mapMutations(['searchUser']),
    async setObject(user, e) {
      this.selected = user;

      this.tr = eSelectSpan(this.tr, e);
    },
    keySearch(str) {
      this.searchUser(String(str));
    }
  }
}

</script>