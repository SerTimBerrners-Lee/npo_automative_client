<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <div>
        <h3>История изменений</h3>    
        <p>
        <span>{{ type }}: </span>
        <span style='font-weight: bold;'>&nbsp;{{ name }}</span>
        </p>

        <table>
          <tr>
            <th>Дата</th>
            <th>Пользователь</th>
            <th>Дейстие</th>
          </tr>
          <tr v-for='action in actions' :key='action'>
            <td style='width: 25%;'>{{ action.dateTime }} </td>
            <td v-if='getUsers && action.responsibleId'>{{ getUsers.filter(user => 
              user.id == action.responsibleId)[0].login}}
            </td>
            <td style='width: 50%;'>{{ action.action }} </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: ['type', 'name', 'actions'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
    }
  },
  computed: mapGetters(['getUsers']),
  methods: {
    ...mapActions(['getAllUsers']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    this.getAllUsers(true)
  },
}
</script>

<style scoped>
table {
  user-select: none;
  width: 100%;
}
</style>