<template>
  <div>
    <div class="type-issue">
      <span @click="e => getType('all', e.target)" ref="allFilesLink">Все {{`(${allFiles.length})`}}</span>
      <span @click="e => getType('banned', e.target)">Архив {{`(${banFiles.length || ''})`}}</span>
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
  </div>
</template>
<script>
import Tables from '@/components/FileBase/Tables';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      targetLink: null,
      nowType: 'all',
      arrFileGet: [],
      searchToArr: [],
      nowFileType: '',
      searchFileType: '',
    }
  },
  computed: {
    ...mapGetters([
      'allFiles', 
      'banFiles'
    ]),
  },
  components: {
    Tables
  },
  methods: {
    ...mapActions([
      'fetchFiles',
      'fetchBannedFiles'
    ]),
    ...mapMutations([
      'searchToFiles', 
      'searchToBanFiles'
    ]),
    getFilesToClick(file) {
      this.$emit('getFilesToClick', file)
    },
    dbPushFile(file) {
      this.$emit('dbPushFile', file)
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
          this.fetchBannedFiles()
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
            this.arrFileGet = this.arrFileGet.filter(f => f.id != id) 
          else this.arrFileGet = this.allFiles.filter(f => f.type == '')
          break;
      }
      this.$emit('changeEnv', {nowType: this.nowType})
    },
    keySearch(str) {
      if(this.nowType == 'all')
        this.searchToFiles(String(str))
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
    },
  },
  async mounted() { 
    this.targetLink = this.$refs.allFilesLink;
    
    await this.fetchFiles();
    this.getType('all');
  }
}
</script>