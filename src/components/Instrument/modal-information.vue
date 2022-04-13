<template>
<div class="right-menu-modal informat">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" > 

      <div class="right_info_block" v-if='getOneNameInstrument && getOneNameInstrument.name'>
        <div class="block">
          <h3>Краткая Информация об инструменте или оснастки</h3>
          <p class='name_parg'>
          <span class="title_span">Наименование: </span><span>{{ getOneNameInstrument.name }}</span>
          </p>
          <MediaSlider :width='"width: 93%;"' v-if='getOneNameInstrument.documents.length' :data='getOneNameInstrument.documents' :key='getOneNameInstrument.documents' />
          <button 
            style='width: 98%;'
            v-if='getOneNameInstrument' 
            @click='$router.push({path: `/instrument/edit/false/${getOneNameInstrument.id}`})'
            class="btn">Полная Информация</button>
          <div>
            <span>Описание / Примечание</span>
            <textarea maxlength='250' style="width: 90%; height: 120px;" cols="30" rows="10" :value='getOneNameInstrument.description'> </textarea>
          </div>
          <div v-if='getOneNameInstrument.documents.length > 0'>
            <h3>Документы</h3>
            <table style="width: 100%;">
              <tr>
                <th>Файл</th>
              </tr>
              <tr class="td-row" v-for='doc in getOneNameInstrument.documents' :key='doc' @click='setDocs(doc)'>
                <td>{{ doc.name }}</td>
              </tr>
            </table>
            <div class="btn-control">
            <button class="btn-small" @click='openDock'>Открыть</button>
            </div>
            <OpensFile 
              :parametrs='itemFiles' 
              v-if="showFile" 
              :key='keyWhenModalGenerateFileOpen'
            />
          </div>
          <h3 @click="providershow" style='cursor:pointer;'>Поставищики {{ getOneNameInstrument.providers.length }}</h3>
            <ShowProvider
              :allProvider='getOneNameInstrument.providers' 
              :key='keyProvidersModal'
              v-if='showProviders'
            />
        </div>
      </div>

    </div>
  </div>
</div>
</template>
<script>
import { isEmpty, random } from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import OpensFile from '@/components/FileBase/openfile';
import MediaSlider from '@/components/FileBase/media-slider';
import ShowProvider from '@/components/BaseProvider/all-fields-provider';

export default {
  props: ['id'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
      inputs: '',
      itemFiles: null,
      showFile: false,
      showProviders: false,
      keyProvidersModal: random(1, 999),
      keyWhenModalGenerateFileOpen: random(1, 999),
    }
  },
  computed: mapGetters([
    'allTInstrument', 
    'allPTInstrument', 
    'allPPTInstrument', 
    'getOneNameInstrument'
  ]),
  components: {OpensFile, ShowProvider, MediaSlider},
  methods: {
    ...mapActions([
      'fetchOneNameInstrument'
    ]),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    setDocs(dc) {
      this.itemFiles = dc
    },
    openDock() {
      if(isEmpty(this.itemFiles)) return 0
      this.showFile = true
      this.keyWhenModalGenerateFileOpen = random(10, 999)
    },
    providershow() {
      if(this.getOneNameInstrument.providers.length > 0) {
        this.keyProvidersModal = random(1, 999)
        this.showProviders = true
      }
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    if(!this.$props.id) return this.destroyModalF()

    await this.fetchOneNameInstrument(this.$props.id)
  },
}
</script>
<style scoped>
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