<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Добавление документов всего: {{ parametrs.length }} шт</h3>
        <div class="block scroll-table">
          <div 
            v-for="(file, index) of arrItemsFile" 
            :key="file">
            <h4>Файл {{index + 1}}</h4>
            <div class='main_info'>
              <div class="fb-img-block">
                <span class="span-type-files" v-if='file.typefile != "img"'>.{{ file.typename }}</span>
                <div class="imgShow-modal-div" v-if="file.typefile == 'img'">
                  <img class="imgShow-modal" :src="file.url" alt="">
                </div>
              </div>
              <div class="main-fb-modal-block">
                <div>
                  <span>Файл: </span>
                  <div class='tooltip'>
                    <input 
                      type="text" 
                      :placeholder='file.name' 
                      :class='returnZnachName(file.name) && !file.newVersion ? "succsess_border" : "del_border"' >
                    <span class='tooltiptext' v-if='returnNamesExist(file.name).length'>
                      <strong>Список похожих файлов: </strong>
                      <span v-for='(name, inx) of returnNamesExist(file.name)' :key='name'>{{ inx + 1 + ' . ' + name }}</span>  
                    </span>  
                  </div>
                  <span>Тип:</span>
                  <select class="select-small" @change='e=>fileRead(e.target.value, "TypeDocument", index)'>
                    <option value="" >Изменить тип</option>
                    <option value="МД">Медиа (тип МД)</option>
                    <option value="КД">Конструкторская документация (тип КД)</option>
                    <option value="ЧЖ">Чертижи (тип ЧЖ)</option>
                    <option value="СД">Сопутствующие документы (тип СД)</option>
                    <option value="DXF">Резка листа (тип DXF)</option>
                  </select>
                </div>
                <div>
                  <span>Переименовать: </span>
                  <input 
                    type="text" 
                    :value='file.name.slice(0, file.name.length - 1 - file.name.split(".")[file.name.split(".").length - 1].length)' 
                    @change='e=>fileRead(e.target.value, "NameDocument" , index)'>
                    <p v-if='!returnZnachName(file.name)'>
                      <label for='newVersion' class='newVersion_label'>Новая версия</label>
                      <input 
                        type="checkbox"
                        id='newVersion'
                        :value='file.newVersion'
                        @click='e=>fileRead(!file.newVersion, "newVersion", index)'>
                    </p>
                </div>
                <p>
                  <span>Версия: </span><input type="text" disabled placeholder="1" @change='e=>fileRead(e.target.value, "VersionDocument", index)'>
                  <span>
                    <label class='label'>Главный: </label>
                    <span>
                      <input type="checkbox" @change='e => fileRead(!file.ava, "ava", index)'>
                    </span>
                  </span>
                </p>
                <p class="right-menu-p">
                  <span>Примечание: </span><input type="text" placeholder="Описание файла" @change='e=>fileRead(e.target.value, "DescriptionDocument", index)'>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-control out-btn-control">
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status btn-black" @click='addFiles("getfile")' v-if='typeGetFile == "getfile"'>Загрузить файлы</button>
          <button class="btn-status btn-black" @click='addFiles' v-if='typeGetFile !== "getfile"'>Загрузить все файлы</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { photoPreloadUrl } from '@/js/';

export default {
  props: ['parametrs', 'typeGetFile'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',
      typeDocs: ['МД', 'КД', 'ЧЖ', 'СД'],
      urlImg: '',
      imgShow: false,
      showDocType: false,
      docType: '',
      arrItemsFile: [],

      data_names: []
    }
  },
  methods: {
    ...mapActions(['pushDocuments', 'fetchFilesNames']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden';
      this.destroyModalRight = 'content-modal-right-menu-hidden';
      this.hiddens = 'display: none;';
      this.$emit('unmount', null);
    },
    async addFiles(getFormData = 'pushfile') {
      const formData = new FormData();
      const dataArr = [];
      for (const doc of this.arrItemsFile) {
        formData.append('document', doc);
        dataArr.push({
          type: doc.TypeDocument,
          version: doc.VersionDocument,
          description: doc.DescriptionDocument,
          name: doc.NameDocument,
          nameInstans: '',
          newVersion: doc.newVersion,
          ava: false
        });
      }
      formData.append('docs', JSON.stringify(dataArr));

      if(getFormData == 'getfile') {
        this.$emit('unmount', {
          formData
        })
        this.destroyModalF();
        return 0;
      }

      const res = await this.pushDocuments(formData);
      this.$emit('unmount', {
        files: res,
        type: 'w',
        message: 'Файлы переданы на сервер для обработки'
      });
      this.destroyModalF();
    },
    fileRead(val, folder, index) {
      this.arrItemsFile[index][folder] = val;
    },
    returnZnachName(file_name) {
      for (const name of this.data_names) {
        if(name.name?.toLocaleLowerCase() == file_name.toLocaleLowerCase()) return false;
      }
      return true;
    },
    returnNamesExist(file_name) {
      const arr_names = []
      for(const name of this.data_names) {
        if(name.name == file_name) arr_names.push(name.name);
      }
      return arr_names;
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';
    if(this.parametrs.type == 'create') {
      return 0;
    } else  {
      this.titleapp = 'Редактирование';
      this.inputs = this.parametrs.description;
      this.inputs_short = this.parametrs.value;
    }
    const arr = this.$props.parametrs;
    arr.forEach((doc, index) => {
      photoPreloadUrl(doc, (res) => {
        if (res.type == 'img') {
          arr[index].TypeDocument = '';
          arr[index].VersionDocument = 1;
          arr[index].DescriptionDocument = '';
          arr[index].url = res.url ;
          arr[index].NameDocument = '';
          arr[index].newVersion = false;
          arr[index].typefile = res.type;
          this.arrItemsFile.push(...[arr[index]]);
        } else { 
          arr[index].TypeDocument = '';
          arr[index].VersionDocument = 1;
          arr[index].DescriptionDocument = '';
          arr[index].NameDocument = '';
          arr[index].typename = res.typename;
          arr[index].newVersion = false;
          arr[index].typefile = res.type;
          this.arrItemsFile.push(...[arr[index]]);
        }
      }) 
    });
    this.data_names = await this.fetchFilesNames();
  },
}
</script>

<style scoped>
.newVersion_label {
  color: rgb(49, 201, 36);
  margin: 0px;
  font-size: 12px;
  user-select: none;
  cursor: pointer;
}
.main_info {
  display: flex;
  align-items: center;
}
.tooltiptext {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.right-menu-p>input {
  width: 70%;
}
.main-fb-modal-block p, .main-fb-modal-block div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.main-fb-modal-block {
  display: flex;
  flex-wrap: wrap;
  width: 64%;
  justify-content: space-between;
}
.main-fb-modal-block>p *, .main-fb-modal-block>div * {
  margin-left: 10px;
}
.fb-img-block {
  width: 36%;
  float: left;
  height: 190px;
}
.scroll-table {
  width: 98%;
  height: 78vh;
}
.out-btn-control {
  margin-top: 10px;
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