<template>
  <h3>База техники и инвентаря</h3>
  <div class="main_content">
    <div class="body_table">
      <div>
        <TableMaterial 
          :title='"Тип"' 
          :alltypeM="getTInventary" 
          :type='"T"' 
          @search='searchT'
          @clickMat="clickTInventary"/>
        <TableMaterial 
          :title='"Подтип"' 
          :alltypeM="getPTInventary" 
          :type="'PT'" 
          @search='searchTP'
          @clickMat="clickPTInventary"/>
        <TableMaterial :title='" Наименование"' 
          :alltypeM="getInventary" 
          :type="'PPT'" 
          :attention='true'
          @unmount_attention='unmount_attention'
          @search='search'
          @clickMat="clickInventary"/>
    </div>
    <div class="btn-control btn-control-tools-w" style="margin-top: 10px;">
        <button class="btn-small btn-add" @click="$router.push({path: '/inventary/create/'})">Создать</button>
        <button class="btn-small btn-add" @click='copy'>Создать копированием</button>
        <button class="btn-small" @click='edit'>Редактировать</button>
      </div>  
      <div class="btn-control btn-control-tools-w">
        <button class="btn-small" @click="banned">В архив</button>
      </div>
    </div>

    <div class="right_info_block" v-if='getOneInventary.name'>
      <div class="block">
        <h3>Краткая Информация</h3>
        <p>
          <span class="title_span">Наименование: </span><span>{{ getOneInventary.name }}</span>
        </p>
         <MediaSlider v-if='getOneInventary.documents.length' :data='getOneInventary.documents' :key='getOneInventary.documents' />
        <div>
          <span>Описание / Примечание</span>
          <textarea maxlength='250' style="width: 90%; height: 120px;" cols="30" rows="10" :value='getOneInventary.description'> </textarea>
        </div>
         <div v-if='getOneInventary.documents.length > 0'>
          <h3>Документы</h3>
          <table style="width: 100%;">
            <tr>
              <th>Файл</th>
            </tr>
            <tr class="td-row" v-for='doc in getOneInventary.documents' :key='doc' @click='setDocs(doc)'>
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
        <h3 @click="providershow" style='cursor:pointer;'>Поставищики {{ getOneInventary.providers.length }}</h3>
          <ShowProvider
            :allProvider='getOneInventary.providers' 
            :key='keyProvidersModal'
            v-if='showProviders'
          />
      </div>
    </div>
    <Loader v-if='loader' />
  </div>
</template>


<script>
import TableMaterial from '@/components/mathzag/table-material.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import OpensFile from '@/components/filebase/openfile.vue';
import ShowProvider from '@/components/baseprovider/all-fields-provider.vue';
import {random, isEmpty} from 'lodash';
import MediaSlider from '@/components/filebase/media-slider.vue';
export default {
  data() {
    return {
      inventaryT: null,
      inventaryPT: null,
      inventary: null,

      itemFiles: null,
      showFile: false,
      showProviders: false,
      keyProvidersModal: random(1, 34342),
      keyWhenModalGenerateFileOpen: random(1, 23123),
      span: null,
      loader: false,
    }
  },
  computed: mapGetters([
    'getRoleAssets', 
    'getTInventary', 
    'getPTInventary',
    'getInventary',
    'getOneInventary'
  ]),
  components: {
    TableMaterial,
    OpensFile,
    ShowProvider,
    MediaSlider
    },
  methods: {
    ...mapActions([
      'fetchAllInventary',
      'fetchAllPInventary',
      'fetchOneInventary',
      'fetchAllNameInventary',
      'banInventary'
    ]),
    ...mapMutations([
      'filterPTByTInvetary', 
      'resetFilterTInventary',
      'searchTInventary',
      'searchPTInventary',
      'searchInventary',
      'filterNameMaterialByPT',
      'resetFilterInventary',
      'filterToAttentionInventary'
    ]), 
    unmount_attention() {
      this.filterToAttentionInventary()
    },
    search(val) {
      this.searchInventary(val)
    },
    searchT(val) {
      this.searchTInventary(val)
    },
    searchTP(val) {
      this.searchPTInventary(val)
    },
    clickTInventary(inventary) {
      if(this.inventaryT && this.inventaryT.id == inventary.id) {
        this.resetFilterInventary()
        return this.resetFilterTInventary()
      }
      this.inventaryT = inventary
      this.filterPTByTInvetary(inventary)
      if(inventary.inventary)
        this.filterNameMaterialByPT(inventary.inventary)
    },
    clickPTInventary(inventary) {
      if(this.inventaryPT && this.inventaryPT.id == inventary.id) 
        return this.resetFilterInventary()
      this.inventaryPT = inventary
      if(inventary.inventary)
        this.filterNameMaterialByPT(inventary.inventary)
    },
    clickInventary(inventary) {
      this.inventary = inventary
      this.fetchOneInventary(inventary.id)
    },
    edit() {
      if(!this.getOneInventary)
        return 0 
      this.$router.push({path: '/inventary/edit'})
    },
    copy() {
      if(!this.getOneInventary)
        return 0 
      this.$router.push({path: '/inventary/copy'})
    },
    banned() {
      if(!this.getOneInventary)
        return 0 
      this.banInventary(this.getOneInventary.id)
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
      if(this.getOneInventary.providers.length > 0) {
        this.keyProvidersModal = random(1, 1111)
        this.showProviders = true
      }
    },
  },
  async mounted() {
    this.loader = true
    await this.fetchAllInventary()
    await this.fetchAllPInventary()
    await this.fetchAllNameInventary()
    this.loader = false
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