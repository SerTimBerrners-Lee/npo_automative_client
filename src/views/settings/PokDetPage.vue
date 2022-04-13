<template>
  <div class="main-dive">
    <h3>4. Покупные Детали (типы и подтипы)</h3>
    <div class="cont">
      <TableMaterial 
        :title='"Тип (Тип категория)"' 
        :alltypeM="alltypeM" 
        :type='"type"'
          @clickMat="clickMat"/>
      <div class="btn-control"  v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
        <button class="btn-add btn-small" @click='createEditMat("TYPE")'>Создать</button>
        <button class="btn-small"  @click='createEditMat("TYPE", "edit")'>Редактировать</button>
        <button class="btn-small" @click='removeType'>Удалить</button>
      </div>
    </div>
    <div class="cont">
      <TableMaterial :title='"Подтип (Материл)"' :alltypeM="allPodTypeM" :type="'podT'" @clickMat="clickMat"/>
      <div class="btn-control"  v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
        <button class="btn-add btn-small" @click='createEditMat("PODTYPE")'>Создать</button>
        <button class="btn-small" @click="createEditMat('PODTYPE', 'edit')">Редактировать</button>
        <button class="btn-small" @click="removePodType">Удалить</button>
      </div>
    </div>
    <addEditMat
      @unmountAdd='unmountAdd' 
      @unmountUpdate='unmountUpdate'
      :parametrs='parametrs' 
      v-if='showIs'
      :key='keyModals' />
  </div>
</template>
<script>
import { random } from 'lodash';
import addEditMat from '@/components/MathZag/addeditpokma';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TableMaterial from '@/components/MathZag/table-material';

export default {
  data() {
    return {
      typeapp: 'create',
      showIs: false,
      keyModals: random(20, 999),
      parametrs: {},
      itemsSelect: null,
      material: null,
      podType: null
    }
  },
  computed: mapGetters(['alltypeM', 'allPodTypeM', 'getRoleAssets']), 
  components: {addEditMat, TableMaterial},
  methods: {
    ...mapActions([
      'createTypeM', 
      'getAllTypeMaterial', 
      'updateTypeM', 
      'removeMaterial', 
      'createPodType', 
      'deletePodType',
      'updatePodMaterial',
      'getAllPodTypeMaterial'
    ]),
    ...mapMutations(['getInstansMaterial', 'throwInstans', 'filterMatByPodType']),
    unmountAdd(res) {
      if(res.type == 'TYPE') {
        this.createTypeM({
          name: res.name,
          instansMaterial: 2
        })
      }
      if(res.type == 'PODTYPE') {
        this.createPodType({
          name: res.name,
          instansMaterial: 2,
          parentMaterialId: this.material.id
        })
      }
    },
    unmountUpdate(res) {
      if(res.type == 'TYPE') {
        this.updateTypeM({
          id: res.id,
          name: res.name
        })
      }
      if(res.type == 'PODTYPE') {
        this.updatePodMaterial({
          id: res.id,
          name: res.name
        })
      }
    },
    createEditMat(typeMat, type = 'create') {
      if(typeMat == 'TYPE' && type == 'create') {
        this.parametrs = {
          type,
          mat: typeMat
        }
      } 
      if(typeMat == 'TYPE' && type == 'edit') {
        if(!this.material)
          return 0
        this.parametrs = {
          type,
          mat: typeMat,
          data: this.material
        }
      } 
      if(typeMat == 'PODTYPE' && type == 'create') {
        if(!this.material)
          return 0
        this.parametrs = {
          type,
          mat: typeMat,
          material: this.material
        }
      }

      if(typeMat == 'PODTYPE' && type == 'edit') {
        if(!this.podType)
          return  0
        this.parametrs = {
          type,
          mat: typeMat,
          data: this.podType
        }
      } 
      this.keyModals = random(20, 999)
      this.showIs = true
    },
    clickMat(mat, type) {
      if(type == 'type') { 
        if(mat.podMaterials) 
        this.filterMatByPodType(mat.podMaterials)
        this.material = mat
      }
      if(type == 'podT') 
        this.podType = mat
    },
    removePodType() {
      if(!this.podType) 
        return null
      this.deletePodType(this.podType.id)
      this.podType = null
    },
    removeType() {
      if(!this.material) 
        return 0;
      this.removeMaterial(this.material.id)
      this.material = null
    }
  },
  async mounted() {
    this.throwInstans()
    await this.getAllTypeMaterial()
    await this.getAllPodTypeMaterial()
    this.getInstansMaterial(2)
  }
}
</script>


<style scoped>



</style>