<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens">
      <h3>Добавление операции технологического процесса</h3>
      <div class="block">
        <div class='title_p'>
          <span>Выберите операцию из списка: </span>
          <select class='select-small' v-model='name'>
            <option 
              v-for='operation in getTypeOperations' 
              :key='operation'
              :value='operation.id'>{{ operation.name }}</option>
          </select>
          <div>Подготовительно время, н.м.:</div>
          <input type="number" v-model='preTime' > 
          <div>Вспомогательное время, н.м.:</div>
          <input type="number" v-model='helperTime'>
          <div>Основное время, н.м.:</div>
          <input type="number" v-model='mainTime'>
          <div>Общее число время, м.:</div>
          <span class='gen_time'>{{Number(preTime)+Number(helperTime)+Number(mainTime)}}</span>
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
              <tr >
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
              <tr v-for='(ins, inx) in instrumentOsnList' :key='ins'>
                <td>{{inx+1 }}. {{ ins.name }}</td>
              </tr>
              <tr>
                <td>...</td>
              </tr>
            </table>
             </div>
            <div class="btn-control">
              <button clas='btn-small' @click='instrumentOsnList=[]'>Сбросить</button>
              <button class='btn-add btn-small' @click='addInstrument("osn")'>Добавить</button>
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
              <tr>
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
              <tr>
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
            <tr 
              v-for='doc in documentsOperationList' 
              :key='doc'
              class='td-row'
              @click='setDocs(doc)'
              >
              <td>{{ doc.name }}</td>
            </tr>
          </table>
          <div class="btn-control" style='width: 100%;'>
            <button class="btn-small" @click='openDock'>Открыть</button>
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
          <textarea maxlength='250' cols="30" rows="10" 
            v-model='description'></textarea>
        </div>
      </div>

      <div class="btn-control out-btn-control wh_60p">
        <button class="btn-status" @click='destroyModalF'>Отменить</button>
        <button class="btn-status" @click='destroyModalF'>Печать технологического процесса</button>
        <button 
          class="btn-status btn-black" 
          style="height: 0px;" @click='saveOperation'>Сохранить</button>
      </div>
    </div>
  </div>
  <BaseTools 
    :key='instrumentKey'
    v-if='instrumentIsShow'
    @unmount_instrument='unmount_instrument'
    :listInstrument='instrumentList'
    :typeInstrument='1'
  />
  <BaseTools 
    :key='metInstrumentKey'
    v-if='instrumentMerIsShow'
    @unmount_instrument='unmount_instrument_mer'
    :listInstrument='instrumentMerList'
    :typeInstrument='3'
  />
  <BaseTools 
    :key='osnInstrumentKey'
    v-if='instrumentOsnIsShow'
    @unmount_instrument='unmount_instrument_osn'
    :listInstrument='instrumentOsnList'
    :typeInstrument='2'
  />
  <BaseEquipment 
    :key='eqKey'
    v-if='eqIsShow'
    @unmount_eq='unmount_eq'
    :listEquipment='eqList'
  />
  <OpensFile 
    :parametrs='itemFiles' 
    v-if="showFile" 
    :key='keyWhenModalGenerateFileOpen'
  />
</div> 
</template>
<script>
import PATH_TO_SERVER from '@/js/path';
import { random, isEmpty } from 'lodash';
import { mapActions, mapGetters } from 'vuex';
import AddFile from '@/components/FileBase/AddFile';
import OpensFile from '@/components/FileBase/OpenFile';
import MediaSlider from '@/components/FileBase/MediaSlider';
import BaseTools from '@/components/Instrument/ModalBaseTool';
import BaseEquipment from '@/components/Equipment/ModalBaseEquipment';

export default {
  props: ['operation'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',
      docFiles: [],
      keyWhenModalGenerate: random(10, 999),
      isChangeFolderFile: false,
      formData: null,
      dataMedia: [],
      randomDataMedia: random(10, 999),
      instrumentKey: random(10, 999),
      metInstrumentKey: random(10, 999),
      osnInstrumentKey: random(10, 999),
      instrumentIsShow: false,
      instrumentMerIsShow: false,
      instrumentOsnIsShow: false,
      instrumentList: [],
      instrumentMerList: [],
      instrumentOsnList: [],
      eqIsShow: false,
      eqList: [],
      eqKey: random(1, 13e29993),
      documentsOperationList: [],
      itemFiles: null,
      showFile: false,
      keyWhenModalGenerateFileOpen: random(10, 999),

      preTime: 0,
      helperTime: 0,
      mainTime: 0,
      generalCountTime: 0,
      
      name: 1,
      description: '',
      id: null,

    }
  },
  computed: mapGetters(['getTypeOperations']),
  components: {AddFile, MediaSlider, BaseTools, BaseEquipment, OpensFile},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden';
      this.destroyModalRight = 'content-modal-right-menu-hidden';
      this.hiddens = 'display: none;';
    },
    ...mapActions(['createOperation', 'updateOperation', 'fetchOneOperationById', 'getAllTypeOperations']),
    saveOperation() {
      if(!this.formData)
        this.formData = new FormData();

      this.formData.append('name', this.name);
      this.formData.append('preTime', this.preTime);
      this.formData.append('helperTime', this.helperTime);
      this.formData.append('mainTime', this.mainTime);
      this.formData.append('generalCountTime', 
        Number(this.preTime) + 
        Number(this.helperTime) +
        Number(this.mainTime));
      this.formData.append('description', this.description);
      this.formData.append('instrumentList',
        this.instrumentList.length ? 
          JSON.stringify(this.instrumentList) : null);
      this.formData.append('instrumentMerList',
        this.instrumentMerList.length ?
          JSON.stringify(this.instrumentMerList) : null);
      this.formData.append('instrumentOsnList',
        this.instrumentOsnList.length ? 
          JSON.stringify(this.instrumentOsnList) : null);
      this.formData.append('eqList',
        this.eqList.length ? 
          JSON.stringify(this.eqList) : null);

      if(this.$props.operation && this.id) {
        this.formData.append('id', this.id);
        this.updateOperation(this.formData);
        this.destroyModalF();
        this.$emit('unmount');
      } else {
        this.createOperation(this.formData);
        this.destroyModalF();
        this.$emit('unmount');
      }
      

    },
    addDock(val) {
      val.target.files.forEach(f => {
        this.docFiles.push(f);
      })
      this.keyWhenModalGenerate = random(10, 999);
      this.isChangeFolderFile = true;
    },
    file_unmount(e) { 
      if(!e) return 0;
      this.formData = e.formData;
      let all = this.formData.getAll("document");
      if(all) 
        all.forEach(f => {
          this.dataMedia.push({...f, path: f.url});
          this.randomDataMedia = random(10, 999);
        })
    },
    addInstrument(t = 'ins') {
      if(t == 'mer') {
        this.metInstrumentKey = random(1, 999);
        this.instrumentMerIsShow = true;
      }
        
      if(t == 'ins') {
        this.instrumentKey = random(10, 999);
        this.instrumentIsShow = true;
      }

      if(t == 'osn') {
        this.osnInstrumentKey = random(10, 999);
        this.instrumentOsnIsShow = true;
      }
    },
    addEquipment() {
      this.eqIsShow = true;
      this.eqKey = random(10, 999);
    },
    unmount_instrument(inst) {
      this.instrumentList = [];
      inst.instrumentList.forEach(e => this.instrumentList.push( {id: e.id, name: e.name}));
     
      this.instrumentIsShow = false
    },
    unmount_instrument_mer(inst) {
      this.instrumentMerList = [];
      inst.instrumentList.forEach(e => this.instrumentMerList.push({id: e.id, name: e.name}));
      this.instrumentMerIsShow = false;
    },
    unmount_instrument_osn(inst) {
      this.instrumentOsnList = [];
      inst.instrumentList.forEach(e => this.instrumentOsnList.push({id: e.id, name: e.name}));
      this.instrumentOsnIsShow = false;
    },
    unmount_eq(eq) {
      this.eqList = []
      eq.equipmentList.forEach(e => this.eqList.push({id: e.id, name: e.name}));
      this.eqIsShow = false;
    },
    changeGenTime(e){
      console.log(e);
    },
    setDocs(dc) {
      this.itemFiles = dc;
    },
    openDock() {
      if(isEmpty(this.itemFiles)) return 0;
      this.showFile = true;
      this.keyWhenModalGenerateFileOpen = random(10, 999);
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    this.getAllTypeOperations()
    
    if(this.$props.operation) {
      // Если есть операция показываем ее для редактирования ()
      const op = this.$props.operation;
      this.id = op.id;
      this.name = op.name;
      this.preTime = op.preTime;
      this.helperTime = op.helperTime;
      this.mainTime = op.mainTime;
      this.generalCountTime =
        (Number(this.preTime) + 
        Number(this.helperTime) +
        Number(this.mainTime))
      this.description = op.description;

      if(op.instrumentList)
        this.instrumentList = JSON.parse(op.instrumentList);
      if(op.instrumentMerList)
        this.instrumentMerList = JSON.parse(op.instrumentMerList);

      if(op.instrumentOsnList)
        this.instrumentOsnList = JSON.parse(op.instrumentOsnList);
      if(op.eqList) this.eqList = JSON.parse(op.eqList);

      // получать полностью всю операцию для отрисовки документов  
      const res = await this.fetchOneOperationById(op.id);
      this.documentsOperationList = res.documents
      res.documents.forEach(d => this.dataMedia.push({...d, path: PATH_TO_SERVER+d.path}))

      this.randomDataMedia = random(10, 999)

    }
  }
}
</script>

<style scoped>
.gen_time{
  font-weight: bold;
  color: #1e1e1f;
}
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
  width: 60px;
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
  height: 100vh;
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