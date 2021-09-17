<template>
<div class="right-menu-modal">
        <div :class='destroyModalLeft' @click="destroyModalF"></div>
        <div :class='destroyModalRight'>
           <div :style="hiddens">
                <h3>Технологический процесс</h3>
                <table>
                    <tr>
                        <th>№</th>
                        <th>Нименование операции</th>
                        <th>Подготовительное время, н.ч.</th>
                        <th>Вспомогательное время, н.ч.</th>
                        <th>Основное время, н.ч.</th>
                        <th>Требуемое оборудование</th>
                        <th>Требуемый инструмент</th>
                        <th>Оснастка</th>
                        <th>Меритеьный инструмент</th>
                    </tr>
                </table>
                <div class="btn-control">
                    <button class="btn-small btn-add" @click='addNewOperation'>Добавить операцию</button>
                    <button class="btn-small">Редактировать</button>
                    <button class="btn-small">В архив</button>
                </div>
                <div class="file_container">
                    <div class="slider">
                        <h3>Фото и видео</h3>
                        <MediaSlider 
                          v-if='dataMedia' 
                          :static='true' 
                          :data='dataMedia' 
                          :key='randomDataMedia'
                          :width='"width: 47%;"'
                          :width_main='"width: 97%;"'
                           />
                    </div>
                    <div class="docs">
                        <h3>Документы</h3>
                        <table>
                            <tr>
                                <th>Файл</th>
                            </tr>
                            <tr 
                              v-for='doc in formData ? formData.getAll("document") : []' 
                              :key='doc'
                              class='td-row'
                              >
                              <td>{{ doc.name }}</td>
                            </tr>
                        </table>
                        <div class="btn-control" style='width: 100%;'>
                            <button class="btn-small">Открыть</button>
                            <button class="btn-small">Удалить</button>
                            <button class="btn-small">Добавить из базы</button>
                        </div>
                        <div class="pointer-files-to-add" style='width: 100%;'>
                          <label for="docsFileSelected">Перенесите сюда файлы или кликните для добавления с вашего компьютера.</label>
                          <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
                        </div>
                        <AddFile 
                          :parametrs='docFiles' 
                          :typeGetFile='"getfile"'
                          v-if="isChangeFolderFile" 
                          @unmount='file_unmount'
                          :key='keyWhenModalGenerate'
                            />
                    </div>
                </div>
                <div class="desctiption_container">
                    <div>
                        <h3>Описание / примечание</h3>
                        <textarea cols="30" rows="10"></textarea>
                    </div>
                    <div>
                        <h3>История изменений</h3>
                        <table>
                            <tr>
                                <th>Дата</th>
                                <th>Пользователь</th>
                                <th>Действие</th>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="btn-control out-btn-control">
                    <button class="btn-status" @click='destroyModalF'>Отменить</button>
                    <button class="btn-status" @click='destroyModalF'>Печать технологического процесса</button>
                    <button class="btn-status btn-black" 
                            style="height: 0px;">Сохранить</button>
                </div>
           </div>
        </div>
        <AddOperation 
            v-if='operationPanelShow' 
            :key='operationKey'/>
    </div> 

</template>

<script>

import {random} from 'lodash'
import AddFile from '@/components/filebase/addfile.vue'
import AddOperation from '@/components/basedetal/add-operation.vue'

export default {

  props: [],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',
      docFiles: [],
      keyWhenModalGenerate: random(10, 231^2376),
      isChangeFolderFile: false,
      formData: null,
      dataMedia: [],
      randomDataMedia: random(10, 24^34),
      operationPanelShow: false,
      operationKey: random(10, 384e10)
    }
  },
  computed: {},
  components: {AddFile, AddOperation},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
  addDock(val) {
      val.target.files.forEach(f => {
        this.docFiles.push(f)
      })
      this.keyWhenModalGenerate = random(10, 2342e12)
      this.isChangeFolderFile = true
    },
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
      let all = this.formData.getAll("document")
      if(all) 
        all.forEach(f => {
          this.dataMedia.push({name: f.name, path: f.url})
          this.randomDataMedia = random(10, 38e100)
        })
    },
    addNewOperation() {
        this.operationPanelShow = true
        this.operationKey = random(10, 384123432423)
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'
  }
}
</script>

<style scoped>
  .file_container, .desctiption_container{
      display: flex;
      justify-content: space-between;
  }
  .file_container div,
  .desctiption_container div{
      margin: 5px;
      width: 50%;
  }
  .desctiption_container textarea {
      width: 90%;
  }
  table{
      width: 100%;
  }
    .delete_span {
        font-size: 11px;
        cursor: pointer;
        display: flex;
        justify-content:center;
        align-items:center;
        color: rgb(211, 102, 102);
        border: none;
        font-weight: bold;
    }
    .delete_span:hover{
        color: rgb(184, 52, 52);
    }
    .body_table_instr {
     width: 1150px;
     display: flex;  
    }
    .table_rek{
        width: 420px;
    }
    .table-filter-bproveder th {
        width: 158px;
    }
    .left-block-bprovider {
        width: 528px;
        float: left;
    }
    .left-block-bprovider .btn-control {
        margin-top: 20px;
    }
    .right-block-bprovider {
        margin-left: 20px;
        width: 1030px;
    }
    .block {
        display: flex;
        flex-direction: column;
    }
    .flex-box-main {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    .first-block-description p {
        margin-left: 5px;
        float: left;
        width: 30%;
    }
    .first-block-description input {
        width: 150px;
    }
    textarea {
        height: 90px;
        width: 350px;
        border: 1px solid #d3d3d3;
        border-radius: 4px;
    }
    .block-d-r {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
    }
    .block-d-r>div>div {
        margin: 5px;
        margin-top: 10px;
        margin-left: 5px;
    }
    .block-d-r>div {
        width: 50%;
    }
    .block-d-r th {
        text-align: start;
    }
    .btn-black {
        width:max-content;
        height: 45px;
    }
    .endgroup {
        display: flex;
        justify-content: end;
        margin-top: 20px;
        align-items: end;
    }
    .provider_table {
        width: 520px;
    }

     .main-fb-modal-block p {
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
    .main-fb-modal-block>p * {
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
        width: 98%;
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
        width: 100%;
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
    height: 10000px;
    width: 70%;
}
.left-block-modal {
    width: 30%;
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
        width: 70%;
    }
}
@keyframes width-right {
    from {
        width: 0%;
    }
    to {
        width: 30%;
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