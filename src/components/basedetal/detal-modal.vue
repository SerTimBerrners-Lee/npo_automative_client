<template>
<div class="right-menu-modal informat">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" > 

      <div class="right_info_block" v-if='!isEmptyF(getOneSelectDetal)'>
      <h3>Краткая Информация о детали</h3>
      <div class="block">
        <p class='name_parg'>
          <span class="title_span">Наименование: </span><span>{{ getOneSelectDetal.name }}</span>
        </p>
        <p class='name_parg'>
          <span class="title_span">Артикул: </span><span>{{ getOneSelectDetal.articl }}</span>
        </p>
        <MediaSlider :width='"width: 93%;"' v-if='getOneSelectDetal.documents && getOneSelectDetal.documents.length' :data='getOneSelectDetal.documents' :key='getOneSelectDetal.documents' />
        <button 
          style='width: 98%;'
          v-if='getOneSelectDetal'
          @click='$router.push({path: "/detal/edit/false"})' 
          class="btn">Полная информация</button>
        <div>
          <h3>Характеристики</h3>
          <p>
            <span>Масса(кг):</span>
            <span style='font-weight: bold;'>{{ JSON.parse(getOneSelectDetal.haracteriatic)[0].znach }}</span>
          </p>
          <p>
            <span>Материал:</span>
            <span style='font-weight: bold;'>{{ mat_zag ? mat_zag.name : '' }}</span>
          </p>
          <p>
            <span>Масса заготовки(кг):</span>
            <span style='font-weight: bold;'>{{ getOneSelectDetal.massZag }}</span>
          </p>
          <p>
            <span>Размеры заготовки DxL(мм):</span>
            <span style='font-weight: bold;'>{{ getOneSelectDetal.DxL }}</span>
          </p>
          <p>
            <span>Норма времени изготовления общая(н.ч.):</span>
            <span style='font-weight: bold;'>{{ generateTime }}</span>
          </p>
        </div> 
        <TableDocument :documents='getOneSelectDetal.documents'/>
        <h3 class="link_h3" @click='showTechProcess' v-if='techProcessID'>Технологический процес 
          <span style='font-size:12px;'>
            ({{ getOneSelectDetal && getOneSelectDetal.techProcesses && getOneSelectDetal.techProcesses.operations ? 
              getOneSelectDetal.techProcesses.operations.length : '0' }} операции)</span></h3>
        <h3 v-else>Нет технологического процесса</h3>
      </div>
      </div>
    </div>
  </div>
</div>
 <TechProcess 
    v-if='techProcessIsShow'
    :key='techProcessKey'
    @unmount='unmount_tech_process'
    :techProcessID='techProcessID'
  />
</template>
<script>
import {isEmpty, random} from 'lodash';
import TechProcess from './tech-process-modal.vue';
import {mapGetters, mapMutations, mapActions } from 'vuex';
import MediaSlider from '@/components/filebase/media-slider.vue';
import TableDocument from '@/components/filebase/table-document.vue';
export default {
  props: ['id'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
      inputs: '',
      itemFiles: null,
      showProviders: false,
      keyProvidersModal: random(1, 999),
      keyWhenModalGenerateFileOpen: random(1, 999),
      mat_zag: null,
      generateTime: null,

      techProcessIsShow: false,
      techProcessKey: random(10, 999),
      techProcessID: null,

      materialList: [],
      listPokDet: [],
      listDetal: [],
      listCbed: [],
 
    }
  },
  computed: mapGetters(['getOneSelectDetal']),
  components: {
    TableDocument, 
    MediaSlider, 
    TechProcess
  },
  methods: {
    ...mapActions(['getOneDetal']),
    ...mapMutations(['removeOperationStorage', 'addOneSelectDetal']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
      this.removeOperationStorage()
    },
    setDocs(dc) {
      this.itemFiles = dc
      this.keyWhenModalGenerateFileOpen = random(10, 999)
    },
    openFile(res) {
      console.log(res)
    },
    isEmptyF(obj) {
      return isEmpty(obj)
    },
    unmount_tech_process(tp) {
      if(tp.id) {
        if(tp.opers.length) {
        tp.opers.forEach(op => {
          this.generateTime =  Number(op.preTime) + Number(op.helperTime)+ Number(op.mainTime)
        })
        }
      }
    },
    showTechProcess() {
      this.techProcessIsShow = true
      this.techProcessKey = random(1, 999)
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    if(!this.$props.id) return this.destroyModalF()

    const getDetal = await this.getOneDetal(this.$props.id)
    if(isEmpty(getDetal)) return this.destroyModalF()
    this.addOneSelectDetal(getDetal)
    
    this.getOneSelectDetal.materials.forEach(element => {
      if(element.id == this.getOneSelectDetal.mat_zag)
        this.mat_zag = element
    });
    let prs = JSON.parse(this.getOneSelectDetal.parametrs)
    this.generateTime = Number(prs.preTime.znach) + 
      Number(prs.helperTime.znach) + 
      Number(prs.mainTime.znach)
    if(this.getOneSelectDetal.techProcesses)
      this.techProcessID = this.getOneSelectDetal.techProcesses.id
  },
}
</script>

<style scoped>
.informat {
  z-index: 10;
}
.right-menu-p>input {
  width: 70%;
}
.input_znach {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
}
.input_znach p {
  display: flex;
  justify-content: space-between;
  margin-right: 5px;
  margin-left: 5px;
  margin: 0;
  width: 100%;
}
.select-small{
  font-size: 14px;
  padding: 5px;
  font-weight: bolder;
}
.block p * {
  margin-left: 10px;
}
.block p {
  display: flex;
  justify-content: start;
}
.block p input {
  width: 76%;
}
.select-small {
  width : 100%;
  height: 100%;
  margin: 0;
  border: none;
}
.out-btn-control{
  margin-top: 10px;
}
.p-types{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.p-types span:first-child {
  font-weight: bold;
}
table {
  user-select: none;
}
</style>