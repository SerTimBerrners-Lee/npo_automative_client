<template>
  <div>
    <h3>2. Единицы измерения</h3>
    <div class="cont">
      <table class="edizm-table" style="width: 400px">
        <tr>
          <th>Краткая запись</th>
          <th>Полная запись</th>
        </tr>
        <tbody v-for='type in allTypeEdizm' :key="type.id">
          <tr>
            <th colspan="2" scope="colgroup">{{ type.name }}</th>
          </tr>
          <tr v-for='edizm in allEdizm.filter(ez => ez.typeEdizmId == type.id)'
            :key="edizm"
            @click='selectItems(edizm)'
            class='td-row'
            >
            <td>{{ edizm.name }}</td>
            <td>{{ edizm.short_name }}</td>
          </tr>
          <tr>
            <td>...</td>
            <td>...</td>
          </tr>
        </tbody>
      </table>

      <div 
        class="btn-control" 
        v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
        <button class="btn-add btn-small" @click='addEdizm("create")'>Создать</button>
        <button class="btn-small" @click='addEdizm("edit")'>Редактировать</button>
        <button class="btn-small" @click='delitEdizm'>Удалить</button>
      </div>
    </div>
    <addEdizm 
      @unmount='unmount' 
      :parametrs='parametrs' 
      v-if='showIs'
      :key='keyModals' />
  </div>
</template>


<script>

import { random } from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import addEdizm from '@/components/edizm/addedizm.vue';
export default {
  data() {
    return {
      typeapp: 'create',
      showIs: false,
      keyModals: random(20, 999),
      parametrs: {},
      itemsSelect: null
    }
  },
  computed: mapGetters(['allEdizm', 'allTypeEdizm', 'getRoleAssets']),
  components: {addEdizm},
  methods: {
    ...mapActions(['getAllEdizm', 'createEdizm', 'removeEdizm', 'updateEdizm']),
    addEdizm(tip) {
      this.keyModals = random(20, 999)
      this.showIs = true
      if(tip == 'create') {
        this.parametrs = {
        type: tip, 
        typeE: this.allTypeEdizm
      }
        return 0;
      }
      if(tip == 'edit' && this.itemsSelect) {
        this.parametrs = {
          type: tip,
          obj: this.itemsSelect
        }
      }
    },
    unmount(res) {
      if(!res)
        return 0
      if(res.type == 'create') {
        this.createEdizm(res)
      }
      if(res.type == 'edit') {
        this.updateEdizm(res)
      }
    },
    selectItems(edizm) {
      this.itemsSelect = edizm
    },
    delitEdizm() {
      if(!this.itemsSelect)
        return 0;
      this.removeEdizm(this.itemsSelect.id)
    }
  },
  async mounted() {
    this.getAllEdizm()
  }
}
</script>
<style >
.cont {
  width: max-content;
}
.edizm-table th {
  text-align: start;
}
.edizm-table {
  width: 400px;
}
</style>