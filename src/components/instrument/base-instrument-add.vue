<template>
  <div>
    <div>
      <h3> Создать инструмент или оснастку </h3>
      <div class="block block_name">
        <p class="name_p">
          <span> Наименование (Марка/типоразмер): </span><input type="text" v-model.trim="obj.name">
        </p>
      </div>
    </div>
    <div class="main_contents">
      <div class="left_content">
       <div>
         <h3>Выбор типа и подтипа</h3>
          <div>
          <TableMaterial :title='"Тип (инструмента или оснастки)"' 
            :alltypeM="allTInstrument" 
            :type='"T"' 
            :width='"width-260"'
            @search='serhType'
            @clickMat="clickTInstrument"/>
          <TableMaterial :title='"Подтип"' 
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
            <!-- <p>
              <span>Единица измерения: </span>
              <select class='select-small instr_select' v-model='obj.edzim'>
                <option>Выберите тип ЕИ</option>
                <option value="">мм</option>
                <option value="">м</option>
              </select>
            </p> -->
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
         <div class="pointer-files-to-add">
            <label for="docsFileSelected">Перенесите сюда файлы или кликните для добавления с вашего компьютера.</label>
            <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
        </div>
        <AddFile :parametrs='docFiles' 
          :typeGetFile='"getfile"'
          v-if="isChangeFolderFile" 
          @unmount='file_unmount'
          :key='keyWhenModalGenerate'
            />
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
      <InformFolder  
        :title='titleMessage'
        :message = 'message'
        :type = 'type'
        v-if='showInformPanel'
        :key='keyInformTip'
      />
    <Loader v-if='loader' />
  </div>
</template>
<script>
import TableMaterial from '@/components/mathzag/table-material.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AddFile from '@/components/filebase/addfile.vue';
import ListProvider from '@/components/baseprovider/list-provider.vue';
import { random }  from 'lodash';
import InformFolder from '@/components/InformFolder.vue';
import { showMessage } from '@/js/';
export default {
  data() {
    return {
      TInstrument: null,
      PTInstrument: null,
      docFiles: [],
      formData: null,
      isChangeFolderFile: false,
      showProvider: false,
      keyWhenModalGenerate: random(10, 999),
      keyWhenModalListProvider: random(10, 999),
      providers: [],
      providersId: [],
      obj: {
        name: '',
        parentId: null,
        // edzim: 'Выбериате тип еи',
        deliveryTime: '',
        mountUsed: '',
        minOstatok: '',
        description: ''
      },

      loader: false,
      titleMessage: '',
      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: 0,
    }
  },
  computed: mapGetters([
    'allTInstrument', 
    'allPTInstrument', 
    'allEdizm', 
    'getLinkIdInstrument', 
    'getRoleAssets'
  ]),
  components: {TableMaterial, AddFile, ListProvider, InformFolder},
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
    addProvider() {
      this.showProvider = true
      this.keyWhenModalListProvider = random(10, 384^5)
    },
    pushProvider(provider) { 
      if(!provider)
        return 0
      this.providers.push(provider)
      this.providersId.push({id: provider.id})
    },

    addInstrument() {
      if(!this.PTInstrument)
        return showMessage('', 'Выберите Подтип', 'w', this)
      if(!this.TInstrument)
        return showMessage('', 'Выберите тип', 'w', this)
      if(this.obj.name.length < 3)
        return showMessage('', 'Наименование должно быть длинее 3-символов', 'w', this)

      if(!this.formData) 
        this.formData = new FormData()

      if(this.providersId)
        this.providersId = JSON.stringify(this.providersId)

      this.formData.append('rootParentId', this.TInstrument.id)
      this.formData.append('name', this.obj.name)
      this.formData.append('deliveryTime', this.obj.deliveryTime)
      this.formData.append('mountUsed', this.obj.mountUsed)
      this.formData.append('minOstatok', this.obj.minOstatok)
      this.formData.append('description', this.obj.description)
      this.formData.append('parentId', this.PTInstrument.id)
      this.formData.append('providers', this.providersId)
      this.addNameInstrument(this.formData)
      
      this.exit()
    },

    // ADD FILE and SET INSTRUMENT TO TABLE
    clickTInstrument(instrument) {
      this.TInstrument = instrument
      this.filterAllpInstrument(instrument)
    },
    clickPTInstrument(PTInstrument) {
      this.PTInstrument = PTInstrument
    },
    clickPPTInstrument(PPTInstrument) {
      this.PPTInstrument = PPTInstrument
    },
    addDock(val) {
      val.target.files.forEach(f => {
          this.docFiles.push(f)
      })
      this.keyWhenModalGenerate = random(10, 384e3)
      this.isChangeFolderFile = true
    },
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
    },
    serhType(inst) {
      this.searchTypeInst(inst)
    },
    serhPType(inst) {
      this.searchPTInst(inst)
    },
    exit() {
      this.$router.push("/basetools")
      this.delitPathNavigate(this.$route.path)
    }
  },
  async mounted() {
    this.loader = true
    await this.fetchAllInstruments()
    await this.getAllEdizm()
    this.getInstansTools(this.getLinkIdInstrument || 0)
    if(!this.getLinkIdInstrument) {
      await this.fetchAllInstruments()
      await this.getPTInstrumentList()
    }

    this.loader = false
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
.name_p input {
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