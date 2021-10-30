<template>
    <div class="main-dive">
        <h3>8. База Оборудования (типы и подтипы)</h3>
        <div class="cont">
            <TableMaterial :title='"Тип"' 
                :alltypeM="allEquipmentType" 
                :type='"T"' 
                @clickMat="clickEquipmentType"/>
            <div class="btn-control" v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
                <button class="btn-add btn-small" @click='create("TYPE")'>Создать</button>
                <button class="btn-small"  @click='edit("TYPE", "edit")'>Редактировать</button>
                <button class="btn-small" @click='remove("TYPE")'>Удалить</button>
            </div>
        </div>
        <div class="cont">
            <TableMaterial :title='"Подтип"' 
                :alltypeM="allEquipmentPType" 
                :type="'PT'" 
                @clickMat="clickEquipmentPType"/>
            <div class="btn-control" v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
                <button class="btn-add btn-small" @click='create("PODTYPE")'>Создать</button>
                <button class="btn-small" @click="edit('PODTYPE', 'edit')">Редактировать</button>
                <button class="btn-small" @click="remove('PODTYPE')">Удалить</button>
            </div>
        </div>
        <addEditEquipment
                @unmount='unmount' 
                :parametrs='parametrs' 
                v-if='showIs'
                :key='keyModals' />
    </div>
</template>

<script>
import TableMaterial from '@/components/mathzag/table-material.vue'
import addEditEquipment from '@/components/equipment/add-edit-equipment.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { random } from 'lodash'

export default {
  data() {
    return{
      showIs: false,
      parametrs: null,
      keyModals: random(20, 999),
      equipment: null,
      equipmentPT: null
    } 
  },
  computed: mapGetters([
    'allEquipmentType', 'allEquipmentPType', 'getRoleAssets'
    ]),
  components: {addEditEquipment, TableMaterial},
  methods: {
    ...mapActions([
      'fetchAllEquipmentType', 
      'addEquipmentType', 
      'removeEquipmentType', 
      'updateEquipmentType', 
      'createEquipmentPT',
      'updateEquipmentPType',
      'removeEquipmentPType',
      'getAllEquipmentPType'
    ]),
    ...mapMutations(['filterAllPTEquipment']),
    unmount(res) {
      if(!res)
        return 0
      if(res.type == "TYPE") {
        if(res.action == 'edit')
          this.updateEquipmentType({id: this.equipment.id, name: res.name})
        if(res.action == 'create')
          this.addEquipmentType({name: res.name})
      }
      if(res.type == "PODTYPE") {
        if(!this.equipment)
          return 0
        if(res.action == 'create')
          this.createEquipmentPT({name: res.name, parentId: this.equipment.id})
        if(res.action == 'edit')
          this.updateEquipmentPType({id: this.equipmentPT.id, name: res.name})
      }
    },
    clickEquipmentType(equipment) {
      this.equipment = equipment
      if(equipment.equipmentsPT)
        this.filterAllPTEquipment(this.equipment)
    },
    clickEquipmentPType(equipmentPT) {
      this.equipmentPT = equipmentPT
    },
    create(equipment, type = 'create') {
      if(equipment == 'PODTYPE') {
        if(!this.equipment)
          return 0
        this.parametrs = { equipment, type, parent: this.equipment }
      }
      
      if(equipment == 'TYPE') 
      this.parametrs = { equipment, type }
  
      this.keyModals = random(2, 1222)
      this.showIs = true
    },
    edit(equipment, type = 'edit') {
      if(!this.equipment)
        return 0
      if(equipment == 'TYPE') {
        this.parametrs = {
          equipment, 
          type,
          data: { name: this.equipment.name }
        }
      }

      if(equipment == 'PODTYPE') {
        if(!this.equipmentPT)
          return 0
        this.parametrs = {
          equipment, 
          type,
          parent: this.equipment,
          data: { name: this.equipmentPT.name }
        }
      }
      
      this.keyModals = random(2, 3332)
      this.showIs = true
    },
    remove(type) {
      if(type == 'TYPE' && this.equipment) 
        this.removeEquipmentType(this.equipment.id)
      if(type == 'PODTYPE' && this.equipmentPT)
        this.removeEquipmentPType(this.equipmentPT.id)

    }
  },
  async mounted() {
    this.fetchAllEquipmentType()
    this.getAllEquipmentPType()
  }
}
</script>