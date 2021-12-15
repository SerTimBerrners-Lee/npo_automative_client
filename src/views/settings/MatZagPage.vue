<template>
  <div class="main-dive">
    <h3>3. Материалы (типы и подтипы)</h3>
    <div class="cont">
      <TableMaterial :title='"Тип (Тип профиля заготовки)"' :alltypeM="alltypeM" :type='"type"' @clickMat="clickMat"/>
      <div class="btn-control" v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
        <button class="btn-add btn-small" @click='createEditMat("TYPE")'>Создать</button>
        <button class="btn-small"  @click='createEditMat("TYPE", "edit")'>Редактировать</button>
        <button class="btn-small" @click='removeItem("TYPE")'>Удалить</button>
      </div>
    </div>
    <div class="cont">
      <TableMaterial :title='"Подтип (Материал заготовки)"' :alltypeM="allPodTypeM" :type="'podT'" @clickMat="clickMat"/>
      <div class="btn-control" v-if="getRoleAssets && getRoleAssets.assets.settingsAssets.edit">
        <button class="btn-add btn-small" @click='createEditMat("PODTYPE")'>Создать</button>
        <button class="btn-small" @click="createEditMat('PODTYPE', 'edit')">Редактировать</button>
        <button class="btn-small" @click="removePodType">Удалить</button>
      </div>
    </div>
    <addEditMat
      @unmount='unmount' 
      :parametrs='parametrs' 
      v-if='showIs'
      :key='keyModals' />
  </div>
</template>
<script>
import { random } from 'lodash';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import addEditMat from '@/components/mathzag/addeditmat.vue';
import TableMaterial from '@/components/mathzag/table-material.vue';
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
  computed: mapGetters(['allEdizm', 'alltypeM', 'allPodTypeM', 'getRoleAssets']), 
  components: {addEditMat, TableMaterial},
  methods: {
    ...mapActions(['getAllEdizm', 
      'createTypeM', 
      'getAllTypeMaterial', 
      'updateTypeM', 
      'removeMaterial', 
      'createPodType', 
      'deletePodType',
      'updatePodMaterial',
      'getAllPodTypeMaterial'
    ]),
    ...mapMutations(['getInstansMaterial', 'throwInstans']),
    unmount(res) {
      if(!res)
        return 0;
      if(res.type == 'create') {
        this.createTypeM(res.data)
      }
      if(res.type == 'edit') {
        this.updateTypeM(res.data)
      }
      if(res.type == 'createPodMaterial') {
        this.createPodType({
          density: res.data.density,
          materialId: res.data.parentId,
          name: res.data.name
        })
      }
      if(res.type == 'editPodMaterial') {
        this.updatePodMaterial(res.data)
      }
    },
    createEditMat(typeMat, type = 'create') {
      if(typeMat == 'TYPE' && type == 'create') {
        this.parametrs = {
          type,
          mat: typeMat,
          edizm: this.allEdizm
        }
      } else if(typeMat == 'TYPE' && type == 'edit') {
        if(!this.material)
          return 0;

        this.parametrs = { 
          type,
          mat: typeMat,
          element: this.material,
          edizm: this.allEdizm
        }
      }

      if(typeMat == 'PODTYPE' && type == 'create') {
        this.parametrs = {
          type,
          mat: typeMat,
          edizm: this.allEdizm
        }
      }

      if(typeMat == 'PODTYPE' && type == 'edit') {
        if(!this.podType) return 0;
        this.parametrs = {
          type,
          material: this.podType,
          mat: typeMat,
          edizm: this.allEdizm 
        }
      }
      this.keyModals = random(20, 999)
      this.showIs = true
    },
    clickMat(mat, type) {
      if(type == 'type') {
        this.material = mat
      }
      if(type == 'podT') {
        this.podType = mat
      }
    },
    removePodType() {
      if(!this.podType) return null
      this.deletePodType(this.podType.id)
    },
    removeItem(type = 'TYPE') {
      if(!this.material) return 0;
      if(type == 'TYPE') {
        this.removeMaterial(this.material.id)
        this.material = null
      }
    }
  },
  async mounted() {
    this.getAllEdizm()
    this.throwInstans()
    await this.getAllTypeMaterial()
    await this.getAllPodTypeMaterial()
    this.getInstansMaterial(1)
  }
}
</script>


<style scoped>


 
</style>