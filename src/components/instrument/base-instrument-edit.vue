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
            @clickMat="clickTInstrument"/>
          <TableMaterial :title='"Подтип"' 
            :alltypeM="allPTInstrument" 
            :width='"width-260"'
            :type="'PT'" 
            @clickMat="clickPTInstrument"/>
        </div>
       </div>
       <div>
         <h3>Описание / примечание</h3>
         <textarea cols="30" rows="10" v-model.trim="obj.description"></textarea>
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
          <ListProvider 
            @unmount='pushProvider' 
            :key='keyWhenModalListProvider'
            v-if='showProvider'
          />
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
        <div v-if='documents.length > 0'>
            <h3>Документы</h3>
            <table class="file_table">
                <tr>
                    <th>Файл</th>
                </tr>
                <tr class="td-row" v-for='doc in documents' :key='doc' @click='setDocs(doc)'>
                    <td>{{ doc.name }}</td>
                </tr>
            </table>
            <div class="btn-control">
              <button class="btn-small" @click='openDock'>Открыть</button>
              <button class="btn-small" @click='removeFile'>Удалить</button>
            </div>
        </div>
      </div>
    </div>
        <div class="edit-save-block block">
          <button class="btn-status" @click='$router.push("/basetools")'>Отменить</button>
          <button class="btn-status btn-black" @click="addInstrument">Сохранить</button>
        </div>
        <OpensFile 
            :parametrs='itemFiles' 
            v-if="showFile" 
            @unmount='openFile'
            :key='keyWhenModalGenerateFileOpen'
        />
  </div>
</template>


<script>
import TableMaterial from '@/components/mathzag/table-material.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AddFile from '@/components/filebase/addfile.vue'
import OpensFile from '@/components/filebase/openfile.vue'
import ListProvider from '@/components/baseprovider/list-provider.vue';
import { random }  from 'lodash'
import { isEmpty }  from 'lodash'

export default {
  data() {
    return {
        TInstrument: null,
        PTInstrument: null,
        docFiles: [],
        formData: null,
        isChangeFolderFile: false,
        keyWhenModalGenerate: random(10, 384522333213313324),
        itemFiles: null,
        showFile: false,
        keyWhenModalGenerateFileOpen: random(10, 384522333213313324),
        documents: [],
        showProvider: false,
        keyWhenModalListProvider: random(10, 384522333213313324),
        providers: [],
        providersId: [],
      obj: {
        name: '',
        parentId: null,
        // edzim: 'Выбериате тип еи',
        deliveryTime: '',
        mountUsed: '',
        minOstatok: '',
        description: '',
        id: null
      }
    }
  },
  updated() {
      if(isEmpty(this.getOneNameInstrument))
        this.$router.push('/basetools')
  },
  computed: mapGetters(['allTInstrument', 'allPTInstrument', 'allEdizm', 'getOneNameInstrument']),
  components: {TableMaterial, AddFile, OpensFile, ListProvider},
  methods: {
    addInstrument() {
        if(!this.obj.id || this.obj.name.length < 3)
            return 0
        
        if(!this.formData) 
            this.formData = new FormData()
        
        if(this.providersId)
          this.providersId = JSON.stringify(this.providersId)

        this.formData.append('id', this.obj.id)
        this.formData.append('name', this.obj.name)
        this.formData.append('deliveryTime', this.obj.deliveryTime)
        this.formData.append('mountUsed', this.obj.mountUsed)
        this.formData.append('minOstatok', this.obj.minOstatok)
        this.formData.append('description', this.obj.description)
        this.formData.append('providers', this.providersId)
        this.updateNameInstrument(this.formData)

    this.$router.push('/basetools')
    },
    removeFile() {
        if(isEmpty(this.itemFiles))
            return 0
        this.removeFileInstrument(this.itemFiles.id)
        this.documents = this.document.filter(dc => dc.id != this.itemFiles.id   )
    },
    pushProvider(provider) { 
      if(!provider)
        return 0
      this.providers.push(provider)
      this.providersId.push({id: provider.id})
    },
    addProvider() {
      this.showProvider = true
      this.keyWhenModalListProvider = random(10, 384522333213313324)
    },
    setDocs(dc) {
        this.itemFiles = dc
    },
    openDock() {
        if(isEmpty(this.itemFiles))
            return 0
        this.showFile = true
        this.keyWhenModalGenerateFileOpen = random(10, 384522333213313324)
    },
    openFile(res) { 
        console.log(res)
    },
    checkedUpdate() {
        if(isEmpty(this.getOneNameInstrument)) 
            return this.$router.push('/basetools')
                           
        console.log(this.getOneNameInstrument)
        this.filterAllInstrumentNyId({
          type: this.getOneNameInstrument.rootParentId, 
          pType: this.getOneNameInstrument.parents[0].id
        })
        this.obj.id = this.getOneNameInstrument.id
        this.obj.name = this.getOneNameInstrument.name
        this.obj.parentId = this.getOneNameInstrument.parents[0].id
        this.obj.deliveryTime = this.getOneNameInstrument.deliveryTime
        this.obj.mountUsed = this.getOneNameInstrument.mountUsed
        this.obj.minOstatok = this.getOneNameInstrument.minOstatok
        this.obj.description = this.getOneNameInstrument.description
        this.documents = this.getOneNameInstrument.documents
        this.providers = this.getOneNameInstrument.providers
        this.providers.forEach(provider => {
          this.providersId.push({id: provider.id})
        })

    },

    // ADD FILE and SET INSTRUMENT TO TABLE
    ...mapActions(['fetchAllInstruments', 'getAllEdizm', 'updateNameInstrument', 'removeFileInstrument']),
    ...mapMutations(['filterAllpInstrument', 'filterAllInstrumentNyId']),
    clickTInstrument(instrument) {
      this.TInstrument = instrument
      this.filterAllpInstrument(instrument.pInstruments)
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
      this.keyWhenModalGenerate = random(10, 384522333213313324)
      this.isChangeFolderFile = true
    },
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
    },
  },
  async mounted() {
    this.getAllEdizm()
    this.checkedUpdate()
    // добавлять документы и удалять их по желанию
  }
}
</script>


<style>
.file_table {
    width: 590px;
    margin-left: 10px;   
}
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
    width: 70%;
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