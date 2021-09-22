<template>
<div class="right-menu-modal informat">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" > 

        <div class="right_info_block" v-if='equipment.name'>
        <div class="block">
            <h3>Краткая Информация об оборудовании</h3>
            <p class='name_parg'>
            <span class="title_span">Наименование: </span><span>{{ equipment.name }}</span>
            </p>
            <MediaSlider :width='"width: 93%;"' v-if='equipment.documents.length' :data='equipment.documents' :key='equipment.documents' />
            <div>
            <span>Описание / Примечание</span>
            <textarea style="width: 90%; height: 120px;" cols="30" rows="10" :value='equipment.description'> </textarea>
            </div>
            <div v-if='equipment.documents.length > 0'>
                <h3>Документы</h3>
                <table style="width: 100%;">
                    <tr>
                        <th>Файл</th>
                    </tr>
                    <tr class="td-row" v-for='doc in equipment.documents' :key='doc' @click='setDocs(doc)'>
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
            <h3 @click="providershow" v-if='!equipment.providers.length' style='cursor:pointer;'>Поставищики {{ equipment.providers.length }}</h3>
                <ShowProvider
                    :allProvider='equipment.providers' 
                    :key='keyProvidersModalEq'
                    v-if='showProvidersEq'
                />
                <ModalInformation v-if='showModalInformation' :key='keyModalInformation' />
        </div>
        </div>

    </div>
  </div>
</div>
</template>

<script>
import OpensFile from '@/components/filebase/openfile.vue'
import ShowProvider from '@/components/baseprovider/all-fields-provider.vue';
import {isEmpty, random} from 'lodash'
import {mapGetters } from 'vuex'
import MediaSlider from '@/components/filebase/media-slider.vue';

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
            showProvidersEq: false,
            keyProvidersModalEq: random(1, 34342),
            keyWhenModalGenerateFileOpen: random(1, 23123),
      }
  },
    computed: mapGetters(['equipment']),
    components: {OpensFile, ShowProvider, MediaSlider},
  mounted() {
      this.destroyModalLeft = 'left-block-modal'
      this.destroyModalRight = 'content-modal-right-menu'
      this.hiddens = 'opacity: 1;'

  },
  methods: {
    destroyModalF() {
        this.destroyModalLeft = 'left-block-modal-hidden'
        this.destroyModalRight = 'content-modal-right-menu-hidden'
        this.hiddens = 'display: none;'
    },
    setDocs(dc) {
        this.itemFiles = dc
    },
    openDock() {
        if(isEmpty(this.itemFiles))
            return 0
        this.showFile = true
        this.keyWhenModalGenerateFileOpen = random(10, 38e7)
    },
    openFile(res) {
        console.log(res)
    },
    providershow() {
        if(this.getOneNameInstrument.providers.length > 0) {
            this.keyProvidersModalEq = random(1, 38e9)
            this.showProvidersEq = true
        }
    }
      
  }
}
</script>

<style scoped>
    .informat {
        z-index: 99999999;
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