<template>
  <h3>База инструмента и оснастки</h3>
  <div class="main_content">
    <div class="body_table">
          <div>
        <TableMaterial :title='"Тип (инструмента или оснастки)"' 
          :alltypeM="allTInstrument" 
          :type='"T"' 
          @clickMat="clickTInstrument"/>
        <TableMaterial :title='"Подтип"' 
          :alltypeM="allPTInstrument" 
          :type="'PT'" 
          @clickMat="clickPTInstrument"/>
        <TableMaterial :title='" Наименование (Марка / типоразмер)"' 
          :alltypeM="allPPTInstrument" 
          :type="'PPT'" 
          @clickMat="clickPPTInstrument"/>
    </div>
    <div class="btn-control btn-control-tools-w" style="margin-top: 10px;">
        <button class="btn-small btn-add" @click="$router.push({path: '/instrument/add/create'})">Создать</button>
        <button class="btn-small btn-add" >Создать копированием</button>
        <button class="btn-small" @click='edit'>Редактировать</button>
      </div>  
      <div class="btn-control btn-control-tools-w">
        <button class="btn-small" @click="banned">В архив</button>
      </div>
    </div>


    <div class="right_info_block" v-if='getOneNameInstrument.name'>
      <div class="block">
        <h3>Краткая Информация об инструменте или оснастки</h3>
        <p>
          <span class="title_span">Наименование: </span><span>{{ getOneNameInstrument.name }}</span>
        </p>
         <MediaSlider v-if='getOneNameInstrument.documents.length' :data='getOneNameInstrument.documents' :key='getOneNameInstrument.documents' />
        <div>
          <span>Описание / Примечание</span>
          <textarea style="width: 90%; height: 120px;" cols="30" rows="10" :value='getOneNameInstrument.description'> </textarea>
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
                @unmount='openFile'
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

</template>


<script>
import TableMaterial from '@/components/mathzag/table-material.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import OpensFile from '@/components/filebase/openfile.vue'
import ShowProvider from '@/components/baseprovider/all-fields-provider.vue';
import {isEmpty, random} from 'lodash'
import MediaSlider from '@/components/filebase/media-slider.vue';

export default {
  data() {
    return {
      TInstrument: null,
      PTInstrument: null,
      PPTInstrument: null,
      itemFiles: null,
      showFile: false,
      showProviders: false,
      keyProvidersModal: random(1, 34342),
      keyWhenModalGenerateFileOpen: random(1, 23123)
    }
  },
  computed: mapGetters(['allTInstrument', 'allPTInstrument', 'allPPTInstrument', 'getOneNameInstrument']),
  components: {TableMaterial, OpensFile, ShowProvider, MediaSlider},
  methods: {
    ...mapActions(['fetchAllInstruments', 'getAllPTInstances', 'fetchOneNameInstrument', 'banNameInstrument']),
    ...mapMutations(['filterAllpInstrument']),
    clickTInstrument(instrument) {
      this.TInstrument = instrument
      this.filterAllpInstrument(instrument.pInstruments)
    },
    clickPTInstrument(PTInstrument) {
      this.PTInstrument = PTInstrument
      this.getAllPTInstances(PTInstrument.id)
    },
    clickPPTInstrument(PPTInstrument) {
      this.PPTInstrument = PPTInstrument
      this.fetchOneNameInstrument(PPTInstrument.id)
    },
    edit() {
      if(!this.getOneNameInstrument)
        return 0 
      this.$router.push('/instrument/edit')
    },
    banned() {
      if(!this.getOneNameInstrument)
        return 0 
      this.banNameInstrument(this.getOneNameInstrument.id)
    },
    setDocs(dc) {
        this.itemFiles = dc
    },
    openDock() {
        if(isEmpty(this.itemFiles))
            return 0
        this.showFile = true
        this.keyWhenModalGenerateFileOpen = random(10, 384522333213313324)
    },
    openFile(res) {
      console.log(res)
    },
    providershow() {
      if(this.getOneNameInstrument.providers.length > 0) {
        this.keyProvidersModal = random(1, 123123123123)
        this.showProviders = true
      }
    }
  },
  async mounted() {
    this.fetchAllInstruments()
  }
}
</script>

<style scoped>
.title_span {
  font-weight: bold;
  font-size: 13px;
  color: #009fff;
}
  .main_content {
    width: 1600px;
    display: flex;
    flex-direction: row;
  }
  .body_table {
    width: 1150px;
    display: flex;
    flex-direction: column;
  }
  .right_info_block {
    width: 450px;
  }
  .btn-control-tools-w {
        width: 1100px;
    }
</style>