<template>
  <div>
    <div class="nav-base-file-page"> 
      <div class="left-div-bfp">
        <h3>База файлов</h3>

        <FileWindow @getFilesToClick='getFilesToClick' @dbPushFile='dbPushFile' @changeEnv='changeEnv' />

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
            <button class="btn-small " @click='this.showMiniModal = !this.showMiniModal'>
              Присвоить к...
            </button>
            <button class="btn-small" @click='editFile'>Редактировать</button>
          </div>
          
          <Assign v-if='showMiniModal && itemFiles' :itemFiles='itemFiles'  @unmount='exitModalAttach' />
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
  </div>
</template> 
<script>
import { random }  from 'lodash';
import { showMessage } from '@/js/';
import Assign from '@/components/FileBase/Assign';
import AddFile from '@/components/FileBase/AddFile';
import OpensFile from '@/components/FileBase/OpenFile';
import NodeTable from '@/components/FileBase/NodeTable';
import FileWindow from '@/components/FileBase/FileWindow';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      itemFiles: null,
      changeType: 'Изменить тип',
      typeDocs: ['МД', 'КД', 'ЧЖ', 'СД', 'DXF'],
      targetLink: null,
      nowType: 'all',
      docFiles: [],
      isChangeFolderFile: false,
      keyWhenModalGenerate: random(10, 999),
      keyWhenModalGenerateFileOpen: random(10, 999),
      showModalOpenFile: false,

      nodeTableKey: random(10, 999),

      showMiniModal: false
    }
  },
  computed: {
    ...mapGetters([
      'getRoleAssets'
    ]),
  },
  components: { AddFile, OpensFile, NodeTable, Assign, FileWindow },
  methods: {
    ...mapActions([
      'bannedFiles', 
      'checkedType', 
      'fetchFileById'
    ]),
    ...mapMutations([
      'pushFilesMutation'
    ]),
    unmount(res){
      if (!res) {
        this.docFiles = []
        this.itemFiles = null,
        this.showModalOpenFile = false
        return 0;
      }
      if (res.files && res.files.length) {
        for (const file of res.files) {
          this.pushFilesMutation(file)
        }
      }
      showMessage('', res.message, res.type);
    },
    changeEnv(env) {
      if (!env) return false;
      this.nowType = env.nowType;
    },
    getFilesToClick(file) {
      this.fetchFileById(file.id).then((res) => {
        this.itemFiles = {...res, type_open_modal: 'edit'};
        this.nodeTableKey = random(5, 999);
      })
    },
    dbPushFile(file) {
      if (this.itemFiles) {
        this.keyWhenModalGenerateFileOpen = random(5, 999);
        this.showModalOpenFile = true;
      } else {
        this.fetchFileById(file.id).then((res) => {
          if (!res) return false;
          this.itemFiles = {...res, type_open_modal: 'edit'}
          this.keyWhenModalGenerateFileOpen = random(5, 999);
          this.showModalOpenFile = true;
        })
      }
    },
    editFile() {
      if (!this.itemFiles) return showMessage('', 'Для начала выберите файл', 'w');
      this.dbPushFile(this.itemFiles);
    },
    changeTypeF() {
      if (!this.itemFiles)
        return showMessage('', 'Вы не выбрали файл', 'w', this)
      if (this.itemFiles.type == this.changeType)
        return showMessage('', 'Файлу уже присвоен выбранный вами Тип', 'w');
      this.typeDocs.forEach(type => {
        if (type == this.changeType) 
          this.checkedType({id: this.itemFiles.id, type: this.changeType})
          .then(f => {
            showMessage('', f.message, f.type, this);
            this.changeType = 'Изменить тип';
          })
      })
    },
    changeBanned() {
      if (!this.itemFiles)
        return showMessage('', 'Вы не выбрали файл', 'w');

      this.bannedFiles(this.itemFiles).then(f => {
        showMessage('', f.message, f.type);
      })
    },
    exitModalAttach() {
      this.showMiniModal = false;
    }
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