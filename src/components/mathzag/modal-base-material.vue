<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Добавление материала</h3>
        <div class="type-issue">
          <span ref="all" class='active' @click='e => instansMaterial(0, e.target)'>Все</span>
          <span @click='e => instansMaterial(1, e.target)'>Материалы для деталей</span>
          <span @click='e => instansMaterial(2, e.target)'>Покупные детали</span>
          <span @click='e => instansMaterial(3, e.target)'>Расходные материалы</span>
        </div>
        <div class="body_table_instr">
          <TableMaterial 
            :alltypeM='alltypeM' 
            :title='instanMaterial != 0 && instanMaterial != 1 ? "Тип (Категория)" : "Тип (Тип профиля заготовки)"' 
            :type='"type"' 
            @clickMat='clickMat'
            @search='searchTypeM' />
          <TableMaterial 
            :alltypeM='allPodTypeM' 
            :title='instanMaterial != 0 && instanMaterial != 1 ? "Подтип (Материал)" : "Подтип (Материал заготовки)"' 
            :type='"podM"' 
            @search='searchPT'
            @clickMat='clickMat' />
          <TableMaterial 
            :alltypeM='getOnePodMaterial' 
            :title='"Наименование (Марка / типоразмер)"' 
            :type='"podPM"' 
            @search='searchM' 
            @clickMat='clickMat'
            @dbClickMat="openMaterial" />
        </div>
          <div class="btn-control body_table_instr" v-if='!getOneMaterial'>
            <button class="btn-small btn-add" @click='addMaterialToList'>Выбрать</button>
        </div>
        <div v-if='materialList.length > 0 && !getOneMaterial'>
          <table>
            <tr>
              <th v-if='!matLightList'>Артикул</th>
              <th>Выбранное</th>
              <th v-if='!matLightList'>ЕИ</th>
              <th v-if='!matLightList'>Количество</th>
              <th>Действие</th>
            </tr>
            <tr v-for='mat of materialList' :key='mat.mat'>
              <td class='td_kolvo' v-if='!matLightList'>
                <input 
                  class='inputs-small' 
                  @change='e => changeArt(e.target, mat)' 
                  type='text' 
                  :value='mat.art'>
              </td>
              <td>{{ mat.mat.name }}</td>
              <td v-if='!matLightList' class='center'>
                <select 
                  class='select-small'
                  @change='e => selecter(e.target, mat)'
                  v-if='mat.ez && !Number(mat.ez)'>
                  <option :value='1' v-if='mat.ez.c1'>шт</option>
                  <option :value='2' v-if='mat.ez.c2'>л</option>
                  <option :value='3' v-if='mat.ez.c3'>кг</option>
                  <option :value='4' v-if='mat.ez.c4'>м</option>
                  <option :value='5' v-if='mat.ez.c5'>м.куб</option>
                </select>   
                <p v-else>
                  <span :value='1' v-if='mat.ez == 1'>шт</span>
                  <span :value='2' v-if='mat.ez == 2'>л</span>
                  <span :value='3' v-if='mat.ez == 3'>кг</span>
                  <span :value='4' v-if='mat.ez == 4'>м</span>
                  <span :value='5' v-if='mat.ez == 5'>м.куб</span>
                </p>
              </td>
              <td class='td_kolvo' v-if='!matLightList'>
                <input 
                class='inputs-small' 
                  @change='e => changeKolvo(e.target, mat)' 
                  type='text' 
                  :value='mat.kol'>
              </td>
              <td class='delete_span' @click='delMat(mat.mat.id)'>удалить</td>
            </tr>
          </table>
        </div>
        <div class="btn-control out-btn-control">
          <button class="btn-status" @click='destroyModalF' v-if='!getOneMaterial'>Отменить</button>
          <button 
            class="btn-status btn-black" 
            style="height: 0px;" 
            @click='addMaterials' v-if='!getOneMaterial'>Добавить выбранное</button>
          <button class="btn-status" @click='exit' v-if='getOneMaterial'>Отменить</button>
          <button 
            class="btn-status btn-black" 
            style="height: 0px;" 
            @click='returnOneMaterial' v-if='getOneMaterial'>Добавить выбранное</button>
        </div>
      </div>
    </div>
    <MaterialInformation 
      :key='material_key'
      v-if='material_id'
      :id='material_id'
    />
  </div> 
</template>
<script>
import {random} from 'lodash';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TableMaterial from '@/components/mathzag/table-material.vue';
import MaterialInformation from '@/components/mathzag/material-information.vue';
export default {
  props: [
    'allMaterial', 
    'instanMaterial', 
    'getOneMaterial', 
    'matLightList'
  ],
  data() {
    return {
      material: null,
      podMaterial: null,
      podPodMaterial: null,
      itemFiles: null,
      keyWhenModalGenerateFileOpen: random(10, 999),

      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',

      materialList: [],
      materialListId: [],

      material_key: random(1, 999),
			material_id: null,
    }
  },
  computed: mapGetters(['alltypeM', 'allPodTypeM', 'getOnePodMaterial']),
  components: {TableMaterial, MaterialInformation},
  methods: {
    ...mapActions([
      'getAllTypeMaterial', 
      'getOnePodType', 
      'bannedPPM', 
      'fetchGetOnePPM', 
      'getAllPodTypeMaterial'
    ]),
    ...mapMutations([
      'filterMatByPodType', 
      'filterMatByPodType',
      'addOnePPTyep', 
      'getInstansMaterial', 
      'throwInstans', 
      'toEmptyPPT',
      'searchTypeMutation', 
      'searchPTypeMutation', 
      'searchMaterialMutation',
      'setOneTypeMMytation'
    ]), 
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    clickMat(mat, type) {
      if(type == 'type') {
        this.material = mat
        this.setOneTypeMMytation(mat)
        if(this.$props.instanMaterial == 2 || this.$props.instanMaterial == 3)
          this.filterMatByPodType(mat.podMaterials)
      }

      if(type == 'podM') this.getOnePodType(mat.id)
      if(type == 'podPM') {
        this.podPodMaterial = mat
        this.fetchGetOnePPM(mat.id).then((material) => {
          this.podPodMaterial = material
        })
      }
    },
    instansMaterial(instans, span) {
      if(!this.span)
        this.span = (this.$refs.all)
      if(span.classList.contains('active')) 
        return 0  
      this.span.classList.remove('active')
      span.classList.add('active')
      this.span = span

      this.getInstansMaterial(instans)
      this.instansLet = instans

    },
    addMaterialToList() {
      if(!this.podPodMaterial)
        return 0;
      
      let add = true
      if(this.materialList.length > 0) {
        for(let mat of this.materialList) {
          if(mat.mat.id == this.podPodMaterial.id)
            add = false
        }
      }
      let kolvo = []
      let check = 0 
      let inx_end_ez;
      if(this.podPodMaterial.kolvo) {
        try {
          let pars = JSON.parse(this.podPodMaterial.kolvo)
          if(kolvo) {
            kolvo = {
              c1: pars.c1,
              c2: pars.c2,
              c3: pars.c3,
              c4: pars.c4,
              c5: pars.c5
            }
            for(let kol in Object.values(kolvo)) {
              if(Object.values(kolvo)[kol]) {
                inx_end_ez = kol
                check++
              }
            }
          }
        } catch(e) {console.error(e)}
      }
      if(add) {
        this.materialListId.push(this.podPodMaterial.id)
        this.materialList.push({ 
          art: '',
          mat: this.podPodMaterial,
          kol: 1,
          ez: check <=1 ? inx_end_ez : kolvo
        });
      }
    },
    delMat(id) {
      this.materialList = this.materialList.filter(mat => mat.mat.id != id)
      this.materialListId = this.materialListId.filter(mat => mat != id)
    },
    addMaterials() {
      for(let mat in this.materialList) {
        if(!Number(this.materialList[mat].ez)) {
          let count = 1
          for(let obj in this.materialList[mat].ez) {
            if(this.materialList[mat].ez[obj]) {
              this.materialList[mat].ez = count
              break
            }
            count++
          } 
        }
      } 
      this.destroyModalF()
      this.$emit('unmount_material', {
        materialListId: this.materialListId,
        materialList: this.materialList
      })
    },
    returnOneMaterial() {
      if(!this.podPodMaterial)
        return 0
      this.$emit('unmount_material', {
        material: this.podPodMaterial
      })
      this.destroyModalF()
    },
    exit() {
      this.$emit('unmount_material', {
        material:  null
      })
      this.destroyModalF()
    },
    changeKolvo(val, mat) {
      mat.kol = val.value
    },
    changeArt(val, mat) {
      mat.art = val.value
    },
    selecter(val, mat) {
      mat.ez = val.value
    },
    searchTypeM(val) {
      this.searchTypeMutation(val)
    },
    searchPT(val) {
      this.searchPTypeMutation(val)
    },
    searchM(val) {
      this.searchMaterialMutation(val)
    },
    openMaterial(mat) {
			this.material_key = random(1, 999)
			this.material_id = mat.id
		}
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    this.toEmptyPPT()

    await this.getAllTypeMaterial()
    await this.getAllPodTypeMaterial()
    if(this.$props.instanMaterial) 
      this.getInstansMaterial(this.$props.instanMaterial)
    if(this.$props.allMaterial) {
      this.materialList = this.$props.allMaterial
      this.materialList.forEach((el) => {
        this.materialListId.push(el.mat.id)
      })
    }
  }
}
</script>

<style scoped>
.inputs-small {
  width: 100px;
  max-width: 97%;
  text-align: center;
}
.body_table_instr {
  width: 1150px;
  display: flex;  
}
.table_rek{
  width: 420px;
}
.table-filter-bproveder th {
  width: 158px;
}
.left-block-bprovider {
  width: 528px;
  float: left;
}
.left-block-bprovider .btn-control {
  margin-top: 20px;
}
.right-block-bprovider {
  margin-left: 20px;
  width: 1030px;
}
.block {
  display: flex;
  flex-direction: column;
}
.flex-box-main {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.first-block-description p {
  margin-left: 5px;
  float: left;
  width: 30%;
}
.first-block-description input {
  width: 150px;
}
textarea {
  height: 90px;
  width: 350px;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
}
.block-d-r {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
.block-d-r>div>div {
  margin: 5px;
  margin-top: 10px;
  margin-left: 5px;
}
.block-d-r>div {
  width: 50%;
}
.block-d-r th {
  text-align: start;
}
.btn-black {
  width:max-content;
  height: 45px;
}
.endgroup {
  display: flex;
  justify-content: end;
  margin-top: 20px;
  align-items: end;
}
.provider_table {
  width: 520px;
}

.main-fb-modal-block p {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.main-fb-modal-block {
  display: flex;
  flex-wrap: wrap;
  width: 64%;
  justify-content: space-between;
}
.main-fb-modal-block>p * {
  margin-left: 10px;
}
.fb-img-block {
  width: 36%;
  float: left;
  height: 190px;
}
.scroll-table {
  width: 98%;
  height: 78vh;
}
.out-btn-control {
  margin-top: 10px;
}
.span-type-files {
  width: 100%;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 70px;
  color: #606060;
  background: #a4a4a4;
}
.imgShow-modal {
  height: 100%;
  width: 100%;
}
.imgShow-modal-div {
  display: flex;
  justify-content: center;
  widows: 100%;
  height: 100%;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  height: 100vh;
  width: 80%;
}
.left-block-modal {
  width: 20%;
  height: 10000px;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1%;
  }
  to {
    width: 80%;
  }
}
@keyframes width-right {
  from {
    width: 0%;
  }
  to {
    width: 20%;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 20vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 80vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>