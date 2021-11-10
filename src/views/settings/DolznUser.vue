<template>
  <div>
    <h3>13. Должности сотрудников</h3>
    <div class="cont">
      <table>
        <tr>
          <th>№</th>
          <th class="width-350">Название должности</th>
        </tr>
        <tr class="td-row" 
          v-for="role in allRoles" 
          :key="role.id"
          @click="clickRole(role)"
        >
          <td>{{ role.id }}</td>
          <td>{{ role.description }}</td>
        </tr>
      </table>
      <div class="btn-control" v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
        <button class="btn-small btn-add" @click="addRole">Создать</button>
        <button class="btn-small" @click="editRole">Редактировать</button>
        <button class="btn-small" @click="delitRole">Удалить</button>
      </div>
    </div>
    <AddRoles v-if="addPanel" :parametrs='parametrs' @unmount='unmountModalData' />
    <InformFolder 
      :title='titleMessage' 
      :message='bodyMessage'
      :type='typeMessage'
      v-if='bodyMessage' />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AddRoles from '@/components/dolznuser/addroles.vue';
import { isEmpty } from 'lodash';
export default {
  data() {
    return {
      role: Object,
      titleMessage: String,
      bodyMessage: String,
      typeMessage: String,
      addPanel: false,
      parametrs: ''
    }
  },
  components: {
    AddRoles
  },
  computed: mapGetters(['allRoles', 'getRoleAssets']),
  methods: {
    ...mapActions(['fetchRoles', 'removeRole', 'createRole', 'editRoleById']),
    addRole() {
      this.parametrs = { type: 'create'}
      this.addPanel = true
    },
    editRole() {
      if (isEmpty(this.role)) {
        return this.addMessageF('Ошибка', 'Выберите объект для редактирования', 'e')
      }
      this.parametrs = { 
        type: 'edit',
        id: this.role.id,
        value: this.role.value,
        description: this.role.description
      }
      this.addPanel = true
    },
    unmountModalData(param) {
      this.addPanel = false
      if (isEmpty(param)) {
        return 0
      }

      if (param.type == 'create') {
        this.createRole(param).then(mes => {
          mes == 'error' ? 
            this.addMessageF('Ошибка', 'Не удалось добавить роль', 'e') :
              this.addMessageF('Успешно', 'Новая роль добавлена', 's')
        })
      } else if (param.type == 'edit') {
        this.editRoleById(param).then(mes => {
          mes == 'error' ? 
            this.addMessageF('Ошибка', 'Не удалось обновить роль', 'e') :
            this.addMessageF('Успешно', 'Роль успешно обновлена', 's')
        })
      } else if (param.type == 'error') {
        this.addMessageF('Ошибка', param.message, 'e')
      }
    },
    clickRole(role) {
      this.role = role
    },
    delitRole() {
      if(isEmpty(this.role)){
        return 0;
      }

      this.removeRole(this.role.id).then(m => {
        if(m == 'error') {
          return this.addMessageF('Ошибка', "Не получилось удалить роль", 'e');
        }
        this.addMessageF('Успешно!', "Роль успешно удалена", 's')
      })
    },
    addMessageF(title, body, type) {
      this.titleMessage = title,
      this.bodyMessage = body,
      this.typeMessage = type 
    },
  },
  async mounted() {
    this.fetchRoles();
  }
}
</script>