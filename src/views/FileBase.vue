<template>
  <div>
    <div class="nav-base-file-page"> 
      <div class="left-div-bfp">
        <h3>База файлов</h3>
        <div class="type-issue">
          <span @click="e => getType('all', e.target)" ref="allFilesLink">Все</span>
          <span @click="e => getType('banned', e.target)">Архив</span>
          <span @click="e => getType('dxf', e.target)">DXF</span>
          <span @click="e => getType('noInstans', e.target)">Неприсвоенные</span>
          <span @click="e => getType('NonType', e.target)">Без типа</span>
        </div>
        <div class="type-issue">
          <span @click="e => getType('МД', e.target)">Медиа (тип МД)</span>
          <span @click="e => getType('КД', e.target)">Конструкторская документация (тип КД)</span>
          <span @click="e => getType('ЧЖ', e.target)">Чертижи (тип ЧЖ)</span>
          <span @click="e => getType('СД', e.target)">Сопутствующие документы (тип СД)</span>
        </div> 

        <div class="scroll-table" style="height: 600px;">
          <Tables v-if="nowType == 'all'" 
            :documents='allFiles' 
            @pushFile='getFilesToClick' 
            @dbPushFile='dbPushFile'
            @keySearch='keySearch'/>
          <Tables v-if="nowType == 'banned'" 
            :documents='banFiles' 
            @pushFile='getFilesToClick'
            @dbPushFile='dbPushFile'
            @keySearch='keyBanSearch'   />
          <Tables v-if="nowType == 'typesFile'" 
            :documents='arrFileGet' 
            @pushFile='getFilesToClick'
            @dbPushFile='dbPushFile'
            @keySearch='keySearch'   />
        </div>
        <div v-if="getRoleAssets && getRoleAssets.assets.basefileAssets.writeSomeone">
          <div style='height: 50px;'>
            <FileLoader @unmount='unmount'/>
          </div>
          <div class="btn-control">
            <select class="select-small" v-model='changeType' @change="changeTypeF">
              <option value="Изменить тип">Изменить тип</option>
              <option value="МД">Медиа (тип МД)</option>
              <option value="КД">Конструкторская документация (тип КД)</option>
              <option value="ЧЖ">Чертижи (тип ЧЖ)</option>
              <option value="СД">Сопутствующие документы (тип СД)</option>
              <option value="DXF">Резка листа (тип DXF)</option>
            </select>
            <button class="btn-small" @click='addingFileToDetal'>Присвоить к...</button>
            <button class="btn-small">Редактировать</button>
          </div>
          <div class="btn-control">
            <button class="btn-small" v-if='nowType == "banned"' @click='changeBanned'>Вернуть из архива</button>
            <button class="btn-small" v-if='nowType != "banned"' @click='changeBanned'>В архив</button>
          </div>
        </div>
      </div> 
      <NodeTable 
        :key='nodeTableKey'
        v-if='itemFiles'
        :file='itemFiles'
      />
    </div>
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
    <AddFile 
      :parametrs='docFiles' 
      v-if="isChangeFolderFile" 
      @unmount='unmount'
      :return_files="push"
      :key='keyWhenModalGenerate' />
    <OpensFile 
      :parametrs='itemFiles' 
      v-if="showModalOpenFile" 
      @unmount='unmount'
      :key='keyWhenModalGenerateFileOpen' />
    <BaseDetalModal 
      v-if='showBFM'
      :key='generateKeyBFM'
      :idFile='itemFiles.id'
      @responsDetal='responsDetal' />

    <Loader v-if='loader' />
  </div>
</template> 

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex';
import { getReversDate, showMessage } from '@/js/';
import Tables from '@/components/filebase/tables.vue';
import AddFile from '@/components/filebase/addfile.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import { random }  from 'lodash';
import NodeTable from '@/components/filebase/node-table.vue';
import BaseDetalModal from '@/components/basedetal/base-detal-modal.vue';
export default {
  data() {
    return {
      itemFiles: null,
      changeType: 'Изменить тип',
      titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,
      typeDocs: ['МД', 'КД', 'ЧЖ', 'СД', 'DXF'],
      targetLink: null,
      nowType: 'all',
      arrFileGet: [],
      searchToArr: [],
      nowFileType: '',
      searchFileType: '',
      docFiles: [],
      isChangeFolderFile: false,
      keyWhenModalGenerate: random(10, 999),
      keyWhenModalGenerateFileOpen: random(10, 999),
      showModalOpenFile: false,

      nodeTableKey: random(10, 999),

      showBFM: false,
      generateKeyBFM: random (1, 999),
      loader: false
    }
  },
  computed: {
    ...mapGetters([
      'allFiles', 
      'banFiles', 
      'getRoleAssets'
    ]),
  },
  components: {Tables, AddFile, OpensFile, NodeTable, BaseDetalModal},
  methods: {
    ...mapActions([
      'fetchFiles', 
      'bannedFiles', 
      'checkedType', 
      'fetchFileById', 
      'setDetalForFile'
    ]),
    ...mapMutations([
      'searchToFiles', 
      'searchToBanFiles',
      'pushFilesMutation'
    ]),
    getDateRevers(date) {
      return getReversDate(date).date
    },
    getFilesToClick(file) {
      this.fetchFileById(file.id).then((res) => {
        this.itemFiles = {...res, type_open_modal: 'edit'}
        this.nodeTableKey = random(5, 999)
      })
      console.log(this.showModalOpenFile)
    },
    dbPushFile(file) {
      if(this.itemFiles) {
        this.keyWhenModalGenerateFileOpen = random(5, 999)
        this.showModalOpenFile = true
      } else {
        this.fetchFileById(file.id).then((res) => {
          if(res) {
            this.itemFiles = {...res, type_open_modal: 'edit'}
            this.keyWhenModalGenerateFileOpen = random(5, 999)
            this.showModalOpenFile = true
          } 
        })
      }
    },
    addingFileToDetal() {
      if(this.itemFiles) {
        this.generateKeyBFM = random(5, 999)
        this.showBFM = true
      }
    },
    changeTypeF() {
      if(!this.itemFiles)
        return showMessage('', 'Вы не выбрали файл', 'w', this)
      if(this.itemFiles.type == this.changeType)
        return showMessage('', 'Файлу уже присвоен выбранный вами Тип', 'w', this)
      this.typeDocs.forEach(type => {
        if(type == this.changeType) 
          this.checkedType({id: this.itemFiles.id, type: this.changeType})
          .then(f => {
            showMessage('', f.message, f.type, this);
            if(this.nowType == 'typesFile') 
              this.getType(this.itemFiles.type, this.targetLink, this.itemFiles.id)
            this.changeType = 'Изменить тип'
          })
      })
    },
    changeBanned() {
      if(!this.itemFiles)
        return showMessage('', 'Вы не выбрали файл', 'w', this)

      this.bannedFiles(this.itemFiles).then(f => {
        showMessage('', f.message, f.type, this)
        this.getType(this.nowType)
      })
    },
    getType(types, e = this.targetLink, id = null) {
      if(this.targetLink)
        this.targetLink.style.color = 'black'
          
      this.targetLink = e
      if(this.nowType == 'typesFile')
        this.nowFileType = types
      this.targetLink.style.color = '#0c40dd'
      switch(types) {
        case 'all':
          this.nowType = 'all'
          break;
        case 'banned':
          this.nowType = 'banned'
          break;
        case 'МД':
          this.nowType = 'typesFile'
          if(id)
            return this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
          this.arrFileGet = this.allFiles.filter(f => f.type == 'МД')
          break;
        case 'КД':
          this.nowType = 'typesFile'
          if(id)
            return this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
          this.arrFileGet = this.allFiles.filter(f => f.type == 'КД')
          break;
        case 'ЧЖ':
          this.nowType = 'typesFile'
          if(id)
            return this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
          this.arrFileGet = this.allFiles.filter(f => f.type == 'ЧЖ')
          break;
        case 'СД': 
          this.nowType = 'typesFile'
          if(id)
            return this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
          this.arrFileGet = this.allFiles.filter(f => f.type == 'СД')
          break;
        case 'noInstans': 
          this.nowType = 'typesFile'
          this.arrFileGet = this.allFiles.filter(f => f.nameInstans == '')
          break;
        case 'dxf':
          this.nowType = 'typesFile'
          for(let f of this.allFiles) {
            if(f.name.split('.')[f.name.split('.').length - 1].toLowerCase() == 'dxf' || f.type == 'DXF') 
              this.arrFileGet.push(f)
          }
          break;
        case 'NonType':
          this.nowType = 'typesFile'
          if(id)
            return this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
          this.arrFileGet = this.allFiles.filter(f => f.type == '')
          break;
      }   
    },
    unmount(res){
      if(!res) {
        this.docFiles = []
        this.itemFiles = null,
        this.showModalOpenFile = false
        return 0;
      }
      if(res.files && res.files.length) {
        for(let file of res.files) {
          this.pushFilesMutation(file)
        }
      }
      showMessage('', res.message, res.type, this)
      this.getType('all')
    },
    responsDetal(detal) {
      if(!detal || !this.itemFiles.id) return 0 //
      this.setDetalForFile({id_detal: detal.id, id_document: this.itemFiles.id})

    },
    keySearch(str) {
      if(this.nowType == 'all') {
        this.searchToFiles(str)
      }
      if(!this.searchToArr.length ) {
        this.searchToArr = this.arrFileGet
        this.searchFileType = this.nowFileType
      }

      this.arrFileGet = this.searchToArr
      this.arrFileGet = this.arrFileGet.filter(file => 
        file.name.slice(0, str.length).toLowerCase() == str.toLowerCase()
        )
    },
    keyBanSearch(str) {
      this.searchToBanFiles(str)
    }
  },
  async mounted() { 
    this.targetLink = this.$refs.allFilesLink

    this.loader = true
    await this.fetchFiles()
    this.getType('all')
    this.loader = false
  }
}
</script>

<style scoped>
.table-fbp {
  width:100%;
  max-height: 250px;
  height: auto;
}
.table-fbp table {
  width: 100%
}
.nav-base-file-page {
  display: flex;
}
.right-div-bfp {
  width: 414px;
  margin-left: 10px;
}
.btn-control {
  margin-top: 30px;
}
</style>