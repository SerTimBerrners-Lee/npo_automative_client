<template>
  <h3>База инструмента и оснастки</h3>
   <div class="type-issue">
      <span ref="all" class='active' @click='e => instansTools(0, e.target)'>Все</span>
      <span @click='e => instansTools(1, e.target)'>Инструмент</span>
      <span @click='e => instansTools(2, e.target)'>Оснастка</span>
      <span @click='e => instansTools(3, e.target)'>Мерительный инструмент</span>
    </div>
  <div class="main_content">
    <div class="body_table">
      <div>
        <TableMaterial :title='"Тип (инструмента или оснастки)"' 
          :alltypeM="allTInstrument" 
          :type='"T"' 
          @search='serhType'
          @clickMat="clickTInstrument"/>
        <TableMaterial :title='"Подтип"' 
          :alltypeM="allPTInstrument" 
          :type="'PT'" 
          @search='serhPType'
          @clickMat="clickPTInstrument"/>
        <TableMaterial :title='" Наименование (Марка / типоразмер)"' 
          :alltypeM="allPPTInstrument" 
          :type="'PPT'" 
          :attention='true'
          @unmount_attention='unmount_attention'
          @search='serhName'
          @clickMat="clickPPTInstrument"/>
    </div>
    <div class="btn-control btn-control-tools-w" style="margin-top: 10px;">
        <button class="btn-small btn-add" @click="$router.push({path: '/instrument/add/create/0'})">Создать</button>
        <button class="btn-small btn-add" @click='addCopy'>Создать копированием</button>
        <button class="btn-small" @click='edit'>Редактировать</button>
      </div>  
      <div class="btn-control btn-control-tools-w">
        <button class="btn-small" @click="banned">В архив</button>
      </div>
    </div>

    <div class="right_info_block" v-if='getOneNameInstrument.name'>
      <div class="block">
        <h3>Краткая Информация о инструменте или оснастки</h3>
        <p>
          <span class="title_span">Наименование: </span><span>{{ getOneNameInstrument.name }}</span>
        </p>
         <MediaSlider v-if='getOneNameInstrument.documents.length' :data='getOneNameInstrument.documents' :key='getOneNameInstrument.documents' />
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
</template>
<script>
import {isEmpty, random} from 'lodash';
import OpensFile from '@/components/filebase/openfile.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import MediaSlider from '@/components/filebase/media-slider.vue';
import TableMaterial from '@/components/mathzag/table-material.vue';
import ShowProvider from '@/components/baseprovider/all-fields-provider.vue';
export default {
  data() {
    return {
      TInstrument: null,
      PTInstrument: null,
      PPTInstrument: null,
      itemFiles: null,
      showFile: false,
      showProviders: false,
      keyProvidersModal: random(1, 999),
      keyWhenModalGenerateFileOpen: random(1, 999),
      span: null
    }
  },
  computed: mapGetters(['allTInstrument', 'allPTInstrument', 'allPPTInstrument', 'getOneNameInstrument']),
  components: {TableMaterial, OpensFile, ShowProvider, MediaSlider},
  methods: {
    ...mapActions([
      'fetchAllInstruments', 
      'getAllPTInstances', 
      'fetchOneNameInstrument', 
      'banNameInstrument',
      'getPTInstrumentList', 
      'getAllNameInstrument'
    ]),
    ...mapMutations([
      'filterAllpInstrument', 
      'getInstansTools', 
      'throwInstansInstruments',
      'searchTypeInst',
      'searchPTInst',
      'searchNameInst', 
      'filterToAttentionTools'
    ]),
    unmount_attention() {
      this.filterToAttentionTools()
    },
    clickTInstrument(instrument) {
      this.TInstrument = instrument
      this.filterAllpInstrument(instrument)
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
      this.$router.push({path: `/instrument/edit/false/${this.getOneNameInstrument.id}`})
    },
    addCopy() {
      if(!this.getOneNameInstrument)
        return 0 
      this.$router.push({path: `/instrument/edit/true/${this.getOneNameInstrument.id}`})
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
      this.keyWhenModalGenerateFileOpen = random(10, 999)
    },
    providershow() {
      if(this.getOneNameInstrument.providers.length > 0) {
        this.keyProvidersModal = random(1, 999)
        this.showProviders = true
      }
    },
    instansTools(tools, span) {
      if(!this.span)
        this.span = (this.$refs.all)
      if(span.classList.contains('active'))
        return 0  
      this.span.classList.remove('active')
      span.classList.add('active')
      this.span = span
      this.getInstansTools(tools)
    },
    serhType(inst) {
      this.searchTypeInst(inst)
    },
    serhPType(inst) {
      this.searchPTInst(inst)
    },
    serhName(inst) {
      this.searchNameInst(inst)
    }
  },
  async mounted() {
    this.throwInstansInstruments()
    this.fetchAllInstruments()
    this.getPTInstrumentList()
    this.getAllNameInstrument()
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