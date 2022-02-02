<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
      <div :class='destroyModalRight'>
        <div :style="hiddens">

          <div class="nav-base-file-page"> 
          <div class="left-div-bfp">
            <h3>База файлов</h3>
            
            <FileWindow @getFilesToClick='getFilesToClick' @dbPushFile='dbPushFile'/>

            <div class="btn-control">
              <button class="btn-small btn-add"
                @click='addFile'>Выбрать</button>
            </div>

            <!-- File List -->
            <div v-if='modalArrFiles.length > 0'>
              <table>
                <tr>
                  <th>Выбранное</th>
                  <th>Действие</th>
                </tr>
                <tr v-for='file of modalArrFiles' :key='file'>
                    
                  <td>{{ file.name }}</td>
                  <td class='delete_span' 
                    @click='delFile(file.id)'>удалить</td>
                </tr>
              </table>
            </div>
            <div class="btn-control out-btn-control">
              <button class="btn-status btn-black" 
                style="height: 0px;" 
                @click='returmFileSelectList' 
                v-if='modalArrFiles'>
                Добавить выбранное</button>
            </div>
        </div>
      </div>
      <OpensFile 
        :parametrs='itemFiles' 
        v-if="WhenModalGenerateFileOpenShow" 
        @unmount='unmount'
        :key='keyWhenModalGenerateFileOpen'
      />
      </div>
      </div>
  </div> 
</template>

<script>
import { random }  from 'lodash';
import OpensFile from '@/components/filebase/openfile.vue';
import { mapActions } from 'vuex';
import FileWindow from '@/components/filebase/file-window.vue';
export default {
  props: ['fileArrModal', 'search'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',

      itemFiles: null,

      keyWhenModalGenerate: random(10, 99),
      keyWhenModalGenerateFileOpen: random(10, 99),

      WhenModalGenerateFileOpenShow: false,
      
      modalArrFiles: [],
    }
  },
  components: {OpensFile, FileWindow},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    ...mapActions(['fetchFileById']),
    getFilesToClick(file) {
      this.itemFiles = file
    },
    addFile() {
      if(!this.itemFiles)
        return

      let change = true
      for(let file of this.modalArrFiles) {
        if(file.id == this.itemFiles.id) change = false
      }
      if(change) this.modalArrFiles.push(this.itemFiles)
    },
    dbPushFile(file) {
      if(this.itemFiles) {
        this.keyWhenModalGenerateFileOpen = random(5, 99)
        this.WhenModalGenerateFileOpenShow = true
      }else {
        this.fetchFileById(file.id).then((res) => {
        this.itemFiles = res
        this.keyWhenModalGenerateFileOpen = random(5, 99)
        this.WhenModalGenerateFileOpenShow = true
        })
      }
    },
    returmFileSelectList() {
      this.$emit('unmount', this.modalArrFiles)
      this.destroyModalF()
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    if(this.$props.fileArrModal) 
      this.modalArrFiles = this.$props.fileArrModal
    
  }
}
</script>

<style scoped>
.delete_span {
  padding-top: 2px;
}
table{
  max-width: 97%;
}
.out-btn-control {
  margin-top: 20px;
}
.table-base-detal {
  float: left;
  width: 400px;
}
.table-base-detal tr {
  height: 65px;
}
.scroll-table {
  height: 600px;
  
}
.tb-title {
  height: 50px;
  text-align: center;
}
.btn-control {
  width: 94%;
  margin-top: 20px;
  flex-direction: column;
  align-items: flex-end;
}
.btn-control button {
  margin: 2px;
}
table {
  font-size: 14px;
}
.main_table_control {
  display: flex;
}
  
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  height: 100vh;
  width: 50%;
}
.left-block-modal {
  width: 50%;
  height: 10000px;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1%;
  }
  to {
    width: 50%;
  }
}
@keyframes width-right {
  from {
    width: 0%;
  }
  to {
    width: 50%;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 30vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 70vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>