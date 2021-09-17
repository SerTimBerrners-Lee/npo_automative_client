<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens">
      <h3>Добавление операции технологического процесса</h3>
      
      <div class="block">
        <div class='title_p'>
          <span>Выберите операцию из списка: </span>
          <select class='select-small ' name="" id="">
            <option 
              v-for='(operation, inx) in operatioinList' 
              :key='operation'
              :value='inx'>{{ operation }}</option>
          </select>
          <div>Подготовительно время, н.ч.:</div>
          <input type="text">
          
          <div>Вспомогательное время, н.ч.:</div>
          <input type="text">
          <div>Основное время, н.ч.:</div>
          <input type="text">
          <div>Общее число время, ч.:</div>
          <div></div>
        </div>
      </div>

      <div class="content_block">
        <div class="left_block">
          <div>
            <h3>Выбор оборудования</h3>
            <div style='height: 200px;' class='scroll-table'>
              <table>
              <tr>
                <th>Выбранное оборудование</th>
              </tr>
              <tr v-for='(eq, inx) in eqList' :key='eq'>
                <td>{{ inx + 1 }}. {{ eq.name }}</td>
              </tr>
              <tr v-for='r in 8' :key='r'>
                <td>...</td>
              </tr>
            </table>
            </div>
            <div class="btn-control">
              <button clas='btn-small' @click='eqList=[]'>Сбросить</button>
              <button class='btn-add btn-small' @click='addEquipment'>Добавить</button>
            </div>
          </div>
          <div>
            <h3>Выбор оснастки</h3>
             <div style='height: 200px;' class='scroll-table'>
            <table>
              <tr>
                <th>Выбранная оснастка</th>
              </tr>
              <tr v-for='r in 8' :key='r'>
                <td>...</td>
              </tr>
            </table>
             </div>
            <div class="btn-control">
              <button clas='btn-small'>Сбросить</button>
              <button class='btn-add btn-small'>Добавить</button>
            </div>
          </div>
        </div>
        <div class="right_block">
          <div>
            <h3>Выбор инструмента</h3>
             <div style='height: 200px;' class='scroll-table'>
            <table>
              <tr>
                <th>Выбранный инструмент</th>
              </tr>
              <tr v-for='(ins, inx) in instrumentList'
                 :key='ins'>
                <td>{{inx+1 }}. {{ ins.name }}</td>
              </tr>
              <tr v-for='r in 8' :key='r'>
                <td>...</td>
              </tr>
            </table>
             </div>
            <div class="btn-control">
              <button clas='btn-small' @click='instrumentList=[]'>Сбросить</button>
              <button class='btn-add btn-small' @click='addInstrument("ins")'>Добавить</button>
            </div>
          </div>
          <div>
            <h3>Выбор мерительного интрумента </h3>
             <div style='height: 200px;' class='scroll-table'>
            <table>
              <tr>
                <th>Выбранный мерительный инструмент</th>
              </tr>
               <tr v-for='(ins, inx) in instrumentMerList'
                 :key='ins'>
                <td>{{inx+1 }}. {{ ins.name }}</td>
              </tr>
              <tr v-for='r in 8' :key='r'>
                <td>...</td>
              </tr>
            </table>
             </div>
            <div class="btn-control">
              <button clas='btn-small' @click='instrumentMerList=[]'>Сбросить</button>
              <button class='btn-add btn-small' @click='addInstrument("mer")'>Добавить</button>
            </div>
          </div>
        </div>
      </div>
      <div class="hooter">
        <div>
          <h3>Фото и видео</h3>
          <MediaSlider 
                v-if='dataMedia' 
                :static='true' 
                :data='dataMedia' 
                :key='randomDataMedia'
                :width='"width: 31%;"'
                :width_main='"width: 100%;"'
                  />
        </div>
        <div>
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
                <label for="docsFileSelectedOperation">Перенесите сюда файлы или кликните для добавления с вашего компьютера.</label>
                <input id="docsFileSelectedOperation" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
              </div>
              <AddFile 
                :parametrs='docFiles' 
                :typeGetFile='"getfile"'
                v-if="isChangeFolderFile" 
                @unmount='file_unmount'
                :key='keyWhenModalGenerate'
                  />
        </div>
        <div>
          <h3>Примечание</h3>
          <textarea cols="30" rows="10"></textarea>
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
  <BaseTools 
    :key='instrumentKey'
    v-if='instrumentIsShow'
    @unmount_instrument='unmount_instrument'
    :listInstrument='instrumentList'
  />
  <BaseTools 
    :key='instrumentKey'
    v-if='instrumentMerIsShow'
    @unmount_instrument='unmount_instrument_mer'
    :listInstrument='instrumentMerList'
  />
  <BaseEquipment 
    :key='eqKey'
    v-if='eqIsShow'
    @unmount_eq='unmount_eq'
    :listInstrument='eqList'
  />

</div> 

</template>

<script>

import {random} from 'lodash'
import AddFile from '@/components/filebase/addfile.vue'
import MediaSlider from '@/components/filebase/media-slider.vue';
import BaseTools from '@/components/instrument/modal-base-tool.vue';
import BaseEquipment from '@/components/equipment/modal-base-equipment.vue';

export default {

  props: [],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',
      docFiles: [],
      keyWhenModalGenerate: random(10, 384e12),
      isChangeFolderFile: false,
      formData: null,
      dataMedia: [],
      randomDataMedia: random(10, 384e12),
      operatioinList: [
          'Заготовительная',
          'Токарная',
          'Слесарная',
          'Термообработка',
          'Фрезерная',
          'Сверлильная',
          'Сварочная',
          'Сборка',
          'Покраска',
          'Упаковка',
      ],
      instrumentKey: random(10, 384e12),
      instrumentIsShow: false,
      instrumentMerIsShow: false,
      instrumentList: [],
      instrumentMerList: [],
      eqIsShow: false,
      eqList: [],
      eqKey: random(1, 123e23)
    }
  },
  computed: {},
  components: {AddFile, MediaSlider, BaseTools, BaseEquipment},
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
      this.keyWhenModalGenerate = random(10, 384e12)
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
    addInstrument(t = 'ins') {
      if(t == 'mer')
        this.instrumentMerIsShow = true
      if(t == 'ins')
        this.instrumentIsShow = true

      this.instrumentKey = random(10, 384e12)
    },
    addEquipment() {
      this.eqIsShow = true
      this.eqKey = random(10, 384e12)
    },
    unmount_instrument(inst) {
      this.instrumentList = inst.instrumentList
      this.instrumentIsShow = false
    },
    unmount_instrument_mer(inst) {
      this.instrumentMerList = inst.instrumentList
      this.instrumentMerIsShow = false
    },
    unmount_eq(eq) {
      this.eqList = eq.equipmentList
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
  .hooter {
    display: flex;
  }
  .hooter>div {
    width: 32%;
    margin: 5px;
  }
  .left_block, .right_block {
    width: 48%;
    margin: 5px;
  }
  .content_block {
    display: flex;
    width: 100%;
  }
  .title_p input {
    width: 22px;
    height: fit-content;
  }
  .title_p div {
    width: 146px;
    height: fit-content;
    margin-left: 6px;
  }
  .title_p span {
    width: 250px;
  }
  .title_p {
    margin: 0;
    display: flex ;
    align-items: center
  }
  select {
    background: none;
    font-weight: bold;
    font-size: 16px;
  }
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