<template>
  <div>
    <div>
      <h3> Создать инструмент или оснастку </h3>
      <div class="block block_name">
        <p class="name_p">
          <span> Наименование (Марка/типоразмер): </span>
          <input type="text" v-model.trim="obj.name">
          <label class='label' style='margin:3px;' for='attention'>Выделить</label>
          <input 
            style='width: 10px;'
            type="checkbox" 
            id='attention' 
            v-model='attention'>
        </p>
      </div>
    </div> 
    <div class="main_contents">
      <div class="left_content">
       <div>
         <h3>Выбор типа и подтипа</h3>
          <div>
            <TableMaterial 
              :title='"Тип (инструмента или оснастки)"' 
              :alltypeM="allTInstrument" 
              :type='"T"' 
              :width='"width-260"'
              @search='serhType'
              @clickMat="clickTInstrument"/>
            <TableMaterial 
              :title='"Подтип"' 
              :alltypeM="allPTInstrument" 
              :width='"width-260"'
              :type="'PT'" 
              @search='serhPType'
              @clickMat="clickPTInstrument"/>
        </div>
       </div>
       <div>
         <h3>Описание / примечание</h3>
         <textarea maxlength='250' cols="30" rows="10" v-model.trim="obj.description"></textarea>
       </div>
       <h3> История изменений</h3>
       <h3>Принадлежность</h3>
      </div>
      <div class="right_content">
        <div>
          <h3>Параметра</h3>
          <div class="block inputs_block">
            <p>
              <span>Срок поставки в днях: </span>
               <input type="text" v-model.trim="obj.deliveryTime">
            </p>
            <p>
              <span>Среднестатистическое мес. потребление: </span>
               <input type="text" v-model.trim="obj.mountUsed">
            </p>
            <p>
              <span>Мин. остаток на складе: </span>
               <input type="text" v-model.trim="obj.minOstatok">
            </p>
          </div>
        </div>
        <div>
          <h3>Поставщики</h3>
          <table class="table_provider">
            <tr>
              <th>ИНН</th>
              <th>Наименование</th>
            </tr>
            <tr v-for='prov in providers' :key='prov'>
              <td>{{ prov.inn }}</td>
              <td>{{ prov.name }}</td>
            </tr>
          </table>
          <div class="btn-control">
            <button class="btn-small btn-add" @click="addProvider">Добавить из базы</button>
          </div>
        </div>
        <!-- Добавить файл из базы файлов -->
        <div>

          <MiniTableDocuments :arrFileGet='[...arrFileGet, ...documents]' @unmount='setDocs' :key='new Date().getTime()'/>

          <div class="btn-control" style='margin-top: 50px;'>
            <button class="btn-small" @click='addFileModal'>Добавить файл из базы</button>
          </div>
        </div>
        <div style='height: 50px;'>
          <FileLoader 
            :typeGetFile='"getfile"'
            @unmount='file_unmount'
          />
        </div>
      </div>
    </div>
    <div class="edit-save-block block" v-if="getRoleAssets && getRoleAssets.assets.instrumentAssets.writeSomeone">
      <button class="btn-status" @click='exit'>Отменить</button>
      <button class="btn-status btn-black" @click="addInstrument">Сохранить</button>
    </div>
    <ListProvider  
      @unmount='pushProvider' 
      :key='keyWhenModalListProvider'
      v-if='showProvider'
      />
      <BaseFileModal 
        v-if='showModalFile'
        :key='fileModalKey'
        :fileArrModal='arrFileGet'
        @unmount='unmount_filemodal'
      />
    <Loader v-if='loader' />
  </div>
</template>
<script>
import { random }  from 'lodash';
import { showMessage } from '@/js/';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TableMaterial from '@/components/MathZag/table-material';
import MiniTableDocuments from '@/components/FileBase/mini-table';
import BaseFileModal from '@/components/FileBase/base-files-modal';
import ListProvider from '@/components/BaseProvider/list-provider';

export default {
  data() {
    return {
      TInstrument: null,
      PTInstrument: null,
      formData: null,
      showProvider: false,
      keyWhenModalListProvider: random(10, 999),
      providers: [],
      providersId: [],
      documents: [],
      obj: {
        name: '',
        parentId: null,
        deliveryTime: '',
        mountUsed: '',
        minOstatok: '',
        description: ''
      },
      fileModalKey: random(1, 999),
      showModalFile: false,
      arrFileGet: [],

      loader: false,
      attention: false
    }
  },
  computed: mapGetters([
    'allTInstrument', 
    'allPTInstrument', 
    'allEdizm', 
    'getLinkIdInstrument', 
    'getRoleAssets'
  ]),
  components: {
    TableMaterial,
    ListProvider,
    BaseFileModal,
    MiniTableDocuments
  },
  methods: {
    ...mapActions(['fetchAllInstruments', 
      'getAllEdizm', 
      'addNameInstrument',
      'getPTInstrumentList'
    ]),
    ...mapMutations(['filterAllpInstrument', 
      'getInstansTools',
      'searchTypeInst',
      'searchPTInst',
      'delitPathNavigate',
    ]),
    unmount_filemodal(res) {
      if(res) this.arrFileGet = res;
    },
    addProvider() {
      this.showProvider = true;
      this.keyWhenModalListProvider = random(10, 999);
    },
    pushProvider(provider) { 
      if(!provider) return 0;
      this.providers.push(provider);
      this.providersId.push({id: provider.id})
    },
    addFileModal() {
      this.fileModalKey = random(1, 999);
      this.showModalFile = true;
    },
    addInstrument() {
      if(!this.PTInstrument)
        return showMessage('', 'Выберите Подтип', 'w');
      if(!this.TInstrument)
        return showMessage('', 'Выберите тип', 'w');
      if(this.obj.name.length < 3)
        return showMessage('', 'Наименование должно быть длинее 3-символов', 'w');

      if(!this.formData) this.formData = new FormData();

      if(this.providersId)
        this.providersId = JSON.stringify(this.providersId);

      this.formData.append('rootParentId', this.TInstrument.id);
      this.formData.append('name', this.obj.name);
      this.formData.append('deliveryTime', this.obj.deliveryTime);
      this.formData.append('mountUsed', this.obj.mountUsed);
      this.formData.append('minOstatok', this.obj.minOstatok);
      this.formData.append('description', this.obj.description);
      this.formData.append('parentId', this.PTInstrument.id);
      this.formData.append('providers', this.providersId);
      this.formData.append('attention', this.attention);

      if(this.arrFileGet.length) {
        const file_arr = this.arrFileGet.map(el => el.id);
        this.formData.append('documents_base', JSON.stringify(file_arr));
      }
      this.addNameInstrument(this.formData);
      
      this.exit();
    },
    // ADD FILE and SET INSTRUMENT TO TABLE
    clickTInstrument(instrument) {
      this.TInstrument = instrument;
      this.filterAllpInstrument(instrument);
    },
    clickPTInstrument(PTInstrument) {
      this.PTInstrument = PTInstrument;
    },
    clickPPTInstrument(PPTInstrument) {
      this.PPTInstrument = PPTInstrument;
    },
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
      for(const fd of this.formData.getAll('document')) {
        this.documents.push(fd);
      }
    },
    serhType(inst) {
      this.searchTypeInst(inst);
    },
    serhPType(inst) {
      this.searchPTInst(inst);
    },
    exit() {
      this.$router.push("/basetools");
      this.delitPathNavigate(this.$route.path);
    }
  },
  async mounted() {
    this.loader = true;
    await this.fetchAllInstruments();
    await this.getAllEdizm();
    this.getInstansTools(this.getLinkIdInstrument || 0);
    if(!this.getLinkIdInstrument) {
      await this.fetchAllInstruments();
      await this.getPTInstrumentList();
    }
    this.loader = false;
  }
}
</script>
<style>
.instr_select {
  width: 210px;
}
.name_p{
  display: flex;
  align-items: center;
}
.name_p * {
  margin-left: 5px;
}
.name_p input[type='text']{
  width: 370px;
}
.block_name {
  width: 1200px;
  padding: 5px;
}
.width-260{
  width: 260px;
}
.main_contents {
  display: flex;
  width: 100%;
  flex-direction: row;
}
.left_content {
  width: 600px;
  display: flex;
  flex-direction: column;
}
.right_content {
  width: 600px;
}
textarea {
  width: 545px;
}
.inputs_block p {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table_provider {
  width: 100%;
}
.table_provider th:first-child {
  width: 30%;
}
.pointer-files-to-add {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>