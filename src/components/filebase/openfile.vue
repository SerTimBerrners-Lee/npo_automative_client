<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Карточка файла</h3>
        <div class="block"> 
          <div >
            <h4>Библиотека документов </h4>
            <div>
              <div class="span-type-files-pdf" 
                v-if="docType.typename == 'docx'" >
                <iframe id="viewer-frame-pdf" :src='`https://docs.google.com/viewer?url=${urlImg}&embedded=true`' 
                  frameborder="0" 
                  scrolling="no"></iframe>
              </div>
              <div class="span-type-files-pdf"
                v-if='docType.typename == "pdf"'>
                  <iframe id="viewer-frame-pdf" :src='urlImg' 
                    frameborder="0" 
                    scrolling="no"></iframe>
              </div>
              <div class="fb-img-block" 
                v-if="docType.type == 'doc' &&
                docType.typename != 'pdf' &&
                docType.typename != 'docx'">
                <span class="span-type-files">
                    .{{ docType.typename }}
                </span>
              </div>
              <div class="fb-img-block" v-if='docType.type == "img"'>
                <div class="imgShow-modal-div">
                    <img class="imgShow-modal" :src='urlImg' alt="">
                </div>
              </div>
              <div class="fb-img-block" v-if='docType.type == "movi"'>
                <div class="imgShow-modal-div">
                    <video
                      controls="controls">
                  <source :src='urlImg' >
                </video>
                </div>
              </div>
              <div class="slider" v-if='file.length > 1'>
                <span> {{ file_increment  }} / {{ file.length - 1}}</span>
                <span class="btn-small btn-add abnf" @click="nextFile">Следующий</span>
              </div>
              <table>
                <tr>
                  <th>Файл</th>
                </tr>
                <tr>
                  <td>{{ this.file[file_increment] ? this.file[file_increment].name : ''}}</td>
                </tr>
              </table>
              <div class="btn-control">
                <button 
                  class="btn-small" 
                  v-if='parametrs.type_open_modal == "edit" && getRoleAssets && getRoleAssets.assets.basefileAssets.writeSomeone' 
                  @click='e => edit(e.target)'>Редактировать</button>
                <button class="btn-small" @click="openfile(urlImg)">На печать</button>
                <button class="btn-small" @click="openfile(urlImg)">Открыть / Скачать</button>
              </div>
              <div class="main-fb-modal-block" v-if='!is_edit'>
                <div class="left-block">
                  <h4>Детальная информация</h4>
                  <p><b>Файл: </b><span> {{ docType.typename }}</span></p>
                  <p><b>Ответственный: </b>
                    <span>{{ responsible_name }}</span>
                  </p>
                  <p><b>Версия: </b>
                    <span> {{ this.file[file_increment] ? this.file[file_increment].version : '' }}
                    </span>
                  </p>
                  <p><b>Тип: </b><span> {{ this.file[file_increment] ? this.file[file_increment].type : '' }}</span></p>
                  <h4>Принадлежность</h4>
                  <span></span>
                </div>
                <div class="right-block">
                  <h4>Примечание</h4>
                  <textarea maxlength='250' cols="30" rows="10" :value='this.file[file_increment] ? this.file[file_increment].description : ""'></textarea>
                  <h4>История изменений</h4>
                  <button class="btn-small">Просмотреть другие версии документа</button>
                </div>
              </div>
              <div class='main-fb-modal-block' v-else>
                <div>
                  <p>
                    <span>Наименование: </span>
                    <input type="text" v-model='name'>
                  </p>
                  <p>
                    <span>Версия: </span>
                    <input type="text" v-model='version'>
                  </p>
                  <p>
                    <span>Тип:</span>
                    <select v-model='type_document' class='select-small'>
                      <option v-for='docs of typeDocs' :key='docs'>{{ docs }}</option>
                    </select>
                  </p>
                  <p>
                    <span>Ответственный: </span>
                    <select v-model='responsible_user_id' class='select-small'>
                      <option v-for='user of getUsers' :key='user' :value='user.id'>{{ user.login }}</option>
                    </select>
                  </p>
                  <h3>Описание: </h3>
                    <textarea 
                      maxlength='250' 
                      cols="30" 
                      rows="10" v-model='description'></textarea>
                </div>
              </div>
            </div>
          </div>
          </div> 
      </div>
    </div>
  </div>
</template>
<script>
import { photoPreloadUrl } from '@/js/';
import { mapActions, mapGetters } from 'vuex';
import {isArray} from 'lodash';
import PATH_TO_SERVER from '@/js/path.js';
export default { 
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',
      typeDocs: ['МД', 'КД', 'ЧЖ', 'СД', 'DXF'],
      urlImg: '',
      imgShow: false,
      showDocType: false,
      docType: {},
      file: [],
      file_increment: 0,
      is_edit: false,
      responsible_name: "",

      description: '',
      version: '',
      type_document: '',
      responsible_user_id: 0,
      name: '',
      id: null
    }
  },
  computed: mapGetters(['getUsers', 'getRoleAssets']),
  methods: {
    ...mapActions(['pushDocuments', 'getAllUsers', 'updateDataFile']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
      this.$emit('unmount', null)
    },
    nextFile(){
      if(this.file_increment == this.file.length - 1) 
        this.file_increment = 0
      else this.file_increment++
      
      this.showDocs(this.file[this.file_increment])
    },
    showDocs(file) {
      if(!file) 
        return 0
      photoPreloadUrl(file, (res) => {
        this.docType = {...res}
      }, true)
      this.urlImg = PATH_TO_SERVER + file.path
      
    },
    addFiles() {
      this.destroyModalF()
    },
    openfile(url) {
      window.open(url, '_blank')
    },
    edit(e) {
      if(this.is_edit) {
        this.is_edit = false
        e.innerText = 'Редактировать'
        this.update()
      } else {
        this.is_edit = true
        e.innerText = 'Сохранить'
      }
    },
    update() {
      const data = {
        name: this.name,
        version: this.version,
        type: this.type_document,
        responsible_user_id: this.responsible_user_id,
        id: this.id,
        description: this.description
      }

      this.updateDataFile(data).then(res => {
        if(res) {
          setTimeout(() => {
            this.destroyModalF()
            this.$emit('unmount', {
              message: 'Документ успено обновлен',
              type: 's'
            })
          }, 1000)
        } else
            this.$emit('unmount', {
              message: 'Произошла ошибка при обновлении документа',
              type: 'e'
            })
      })
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    this.getAllUsers()
    if(this.parametrs.type == 'create') {
      return 0;
    }
    if(this.parametrs.type_open_modal == 'edit') {
      this.titleapp = 'Редактирование'
      this.type_document = this.parametrs.type
      this.description = this.parametrs.description
      this.responsible_user_id = this.parametrs.responsible_user_id
      this.name = this.parametrs.name
      this.version = this.parametrs.version
      this.id = this.parametrs.id
    } 
    if(this.$props.parametrs && this.$props.parametrs.responsible_user_id) {
      for(let user of this.getUsers) {
        if(user.id == this.$props.parametrs.responsible_user_id) {
          this.responsible_name = user.login
        }
      }
    }

    let file = this.$props.parametrs
    if(isArray(file)) this.file = file
    else this.file.push(file)

    this.showDocs(this.file[0])
      
  },
}
</script>

<style scoped>
.main-fb-modal-block input {
  margin-left: 10px;
}
.span-type-files-pdf {
  height: 500px;
}
#viewer-frame-pdf {
  width: 100%;
  height: 100%;
}
.abnf{
  padding: 10px;
  cursor: pointer;
}
.slider {
  margin: 5px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 10px;
  user-select: none;
}
.left-block {
  width: 40%;
}
.left-block p {
  margin-top: 8px;
}
.left-block p span {
  padding: 2px;
}
.right-block{ 
  width: 60%;
  display: flex;
  justify-content: end;
  flex-direction: column;
}
textarea {
  height: 90px;
  width: 90%;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
}
h4 {
  font-weight: inherit;
  font-size: 20px;
}
.main-fb-modal-block p {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.main-fb-modal-block {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}
.main-fb-modal-block>p * {
  margin-left: 10px;
}
.fb-img-block {
  width: 100%;
  height: 300px;
}
.scroll-table {
  width: 98%;
  height: 78vh;
}
.out-btn-control {
  margin-top: 10px;
}
table{
  width: 100%;
}
table th {
  text-align: start;
}
.span-type-files {
  width: 100%;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 70px;
  color: #606060;
  background: #a4a4a4;
}
.imgShow-modal {
  height: 100%;
  max-width: 100%;
}
.imgShow-modal-div {
  display: flex;
  justify-content: center;
  widows: 100%;
  height: 100%;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;

  width: 40vw;
}
.left-block-modal {
  width: 60vw;
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
    width: 1vw;
  }
  to {
    width: 40vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 60vw;
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
    width: 60vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 50vw;
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