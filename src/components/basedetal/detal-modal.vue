<template>
<div class="right-menu-modal informat">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" > 

      <div class="right_info_block" >
      <h3>Краткая Информация о детали</h3>
      <div class="block">
        <p class='name_parg'>
        <span class="title_span">Наименование: </span><span>{{ getOneSelectDetal.name }}</span>
        </p>
        <p class='name_parg'>
        <span class="title_span">Артикул: </span><span>{{ getOneSelectDetal.articl }}</span>
        </p>
        <MediaSlider :width='"width: 93%;"' v-if='getOneSelectDetal.documents.length' :data='getOneSelectDetal.documents' :key='getOneSelectDetal.documents' />
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
        <div 
          class='scroll-table' 
          style='width:100%' 
          v-if='getOneSelectDetal.documents.length > 0'>
          <h3>Документы</h3>
          <table style="width: 100%;">
            <tr>
              <th>Файл</th>
            </tr>
            <tr class="td-row" 
              v-for='doc in getOneSelectDetal.documents' 
              :key='doc' @click='setDocs(doc)'>
              <td>{{ doc.name }}</td>
            </tr>
          </table>
          <div class="btn-control">
          <button class="btn-small" @click='openDock'>Открыть</button>
          </div>
          <OpensFile 
            :parametrs='itemFiles' 
            v-if="showFile" 
            @unmount='openFile'
            :key='keyWhenModalGenerateFileOpen'
          />
        </div>
        <h3 class="link_h3" @click='showTechProcess' v-if='techProcessID'>Технологический процес</h3>
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
import OpensFile from '@/components/filebase/openfile.vue';
import {isEmpty, random} from 'lodash';
import {mapGetters, mapMutations } from 'vuex';
import MediaSlider from '@/components/filebase/media-slider.vue';
import TechProcess from './tech-process-modal.vue';

export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
      inputs: '',
      itemFiles: null,
      showFile: false,
      showProviders: false,
      keyProvidersModal: random(1, 34342),
      keyWhenModalGenerateFileOpen: random(1, 23123),
      mat_zag: null,
      generateTime: null,

      techProcessIsShow: false,
      techProcessKey: random(10, 33e6),
      techProcessID: null,
    }
  },
  computed: mapGetters([ 
      'getOneSelectDetal']),
  components: {OpensFile, MediaSlider, TechProcess},
  methods: {
    ...mapMutations(['removeOperationStorage']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
      this.removeOperationStorage()
    },
    setDocs(dc) {
        this.itemFiles = dc
      },
      openDock() {
      if(isEmpty(this.itemFiles))
        return 0
      this.showFile = true
      this.keyWhenModalGenerateFileOpen = random(10, 384e5)
    },
    openFile(res) {
      console.log(res)
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
      this.techProcessKey = random(1, 12e8)
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
    if(isEmpty(this.getOneSelectDetal)) 
      return this.destroyModalF()
    
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