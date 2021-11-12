<template>
  <div class="main-dive">
    <h3>9. База непроизводственной техники и инвентаря (типы и подтипы)</h3>
    <div class="cont">
      <div class="cont scroll-table scrolls-type-490">
        <TableMaterial 
          :title='"Тип"' 
          :alltypeM="getTInventary" 
          :type='"T"' 
          @search='searchT'
          @clickMat="clickTInventary"/>
      </div>
      <div class="btn-control"  v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
        <button class="btn-add btn-small" @click='create("TYPE")'>Создать</button>
        <button class="btn-small" @click='edit("TYPE", "edit")'>Редактировать</button>
        <button class="btn-small" @click='remove("TYPE")'>Удалить</button>
      </div>
    </div>
    <div class="cont">
      <div class="cont scroll-table scrolls-type-490">
        <TableMaterial 
          :title='"Подтип"' 
          :alltypeM="getPTInventary" 
          :type="'PT'" 
          @search='searchTP'
          @clickMat="clickPTInventary"/>
      </div>
      <div class="btn-control"  v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
        <button class="btn-add btn-small" @click='create("PODTYPE")'>Создать</button>
        <button class="btn-small" @click="edit('PODTYPE', 'edit')">Редактировать</button>
        <button class="btn-small" @click="remove('PODTYPE')">Удалить</button>
      </div>
    </div>
    <addEditInventary 
      :key='keyModalInventary'
      v-if='showModalInventary'
      :parametrs='parametrs'
      @unmount='unmount'
    />
  </div>
</template>
<script>
import TableMaterial from '@/components/mathzag/table-material.vue';
import addEditInventary from '@/components/inventary/add-edit-modal.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { random } from 'lodash';
export default {
  data() {
    return{
      keyModalInventary: random(1, 999),
      showModalInventary: false,
      inventaryT: null,
      inventaryPT: null,
      parametrs: null
    }
  },
  components: {TableMaterial, addEditInventary},
  computed: mapGetters(['getRoleAssets', 'getTInventary', 'getPTInventary']),
  methods: {
    ...mapActions([
      'addNewTInventary',
      'fetchAllInventary',
      'updateNewTInventary',
      'removeTInventary',
      'addNewPTInventary',
      'updatePTInventary',
      'fetchAllPInventary',
      'removePTInventary'
    ]),
    ...mapMutations([
      'filterPTByTInvetary', 
      'resetFilterTInventary',
      'searchTInventary',
      'searchPTInventary'
    ]), 
    unmount(res) {
      if(!res)
        return 0
      if(res.type == "TYPE") {
        if(res.action == 'edit') 
          this.updateNewTInventary({
            id: this.inventaryT.id, 
            name: res.name
          })
        if(res.action == 'create')
          this.addNewTInventary({
            name: res.name
          })
      }
      if(res.type == "PODTYPE") {
        if(res.action == 'create') {
          if(!this.inventaryT) return 0
          this.addNewPTInventary({name: res.name, inventary_type_id: this.inventaryT.id})
        }
        if(res.action == 'edit')
          this.updatePTInventary({id: this.inventaryPT.id, name: res.name})
      }
    },
    searchT(val) {
      this.searchTInventary(val)
    },
    searchTP(val) {
      this.searchPTInventary(val)
    },
    clickTInventary(inventary) {
      if(this.inventaryT && this.inventaryT.id == inventary.id)
        return this.resetFilterTInventary()
      this.inventaryT = inventary
      this.filterPTByTInvetary(inventary)
    },
    clickPTInventary(inventary) {
      this.inventaryPT = inventary
    },
    create(inventary, type = 'create') {
      if(inventary == 'PODTYPE') {
        if(!this.inventaryT)
          return 0
        this.parametrs = { inventary, type, parent: this.inventaryT }
      }
      if(inventary == 'TYPE') 
        this.parametrs = { inventary, type }
  
      this.keyModalInventary = random(2, 999)
      this.showModalInventary = true
    },
    edit(inventary, type = 'edit') {
      if(inventary == 'TYPE') {
        if(!this.inventaryT)
          return 0
        this.parametrs = {
          inventary, 
          type,
          data: { name: this.inventaryT.name }
        }
      }

      if(inventary == 'PODTYPE') {
        if(!this.inventaryPT)
          return 0
        this.parametrs = {
          inventary, 
          type,
          parent: this.inventaryT,
          data: { name: this.inventaryPT.name }
        }
      }
      this.keyModalInventary = random(2, 999)
      this.showModalInventary = true
    },
    remove(type) {
      if(type == 'TYPE' && this.inventaryT) 
        this.removeTInventary(this.inventaryT.id)
      if(type == 'PODTYPE' && this.inventaryPT)
        this.removePTInventary(this.inventaryPT.id)
    }
  },
  async mounted() {
    this.loader = true;
    await this.fetchAllInventary()
    await this.fetchAllPInventary()
    this.loader = false
  }
}
</script>