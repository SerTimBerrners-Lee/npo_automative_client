<template>
  <div>
    <div>
      <h3> Редактировать оборудование </h3>
      <div class="block block_name">
          <p class="name_p">
            <span> Наименование: </span><input type="text" v-model.trim="obj.name">
          </p>
          <p class="name_p">
            <span> Ответственный: </span>
            <select class="select-small sle"  
                    v-model='obj.responsible'>
              <option v-for='user in getUsers' 
                      :key='user' 
                      :value='user.id'>{{ user.login }}</option>
            </select> 
          </p>
        </div>
    </div>
    <div class="main_contents">
      <div class="left_content">
       <div>
         <h3>Выбор типа и подтипа</h3>
          <div>
           <TableMaterial :title='"Тип (инструмента или оснастки)"' 
            :alltypeM="allEquipmentType" 
            :type='"T"' 
            :width='"width-260"'
            @clickMat="clickEquipment"/>
          <TableMaterial :title='"Подтип"' 
            :alltypeM="allEquipmentPType" 
            :width='"width-260"'
            :type="'PT'" 
            @clickMat="clickEquipmentPT"/>
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
            <p>
              <span>Срок поставки в днях: </span>
               <input type="text" v-model.trim="obj.deliveryTime">
            </p>
            <p>
              <span>Инвентарный №: </span>
               <input type="text" v-model.trim="obj.invNymber">
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
        <h3 @click="addInstrument" class="link_h3">Привязанный инструмент или оснастка</h3>
      </div>
    </div>
        <div class="edit-save-block block">
          <button class="btn-status" @click='$router.push("/baseequipment")'>Отменить</button>
          <button class="btn-status btn-black" @click="saveEquipment">Сохранить</button>
        </div>
        <OpensFile 
            :parametrs='itemFiles' 
            v-if="showFile" 
            @unmount='openFile'
            :key='keyWhenModalGenerateFileOpen'
        />
        <BaseTools 
            :listInstrument='listInstrument'
            :key='instrumentKey'
            v-if='instrumentIsShow'
            @unmount_instrument='unmount_instrument'
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
import BaseTools from '@/components/instrument/modal-base-tool.vue';

export default {
  data() {
    return {
      listInstrument: null,
      equipmentT: null,
      equipmentPT: null,
      docFiles: [],
      formData: null,
      isChangeFolderFile: false,
      keyWhenModalGenerate: random(10, 323e8),
      itemFiles: null,
      showFile: false,
      keyWhenModalGenerateFileOpen: random(10, 323e8),
      documents: [],
      showProvider: false,
      keyWhenModalListProvider: random(10, 323e8),
      providers: [],
      providersId: [],
      instrumentKey: random(10, 323e8),
      instrumentIsShow: false,
      obj: {
        name: '',
        parentId: null,
        deliveryTime: '',
        invNymber: '',
        description: '',
        responsible: '',
        id: null,
        instrumentIdList: []
      }
    }
  },
  updated() {
      if(isEmpty(this.equipment))
        this.$router.push('/baseequipment')
  },
  computed: mapGetters(['allEquipmentType', 
                        'allEquipmentPType', 
                        'allEdizm', 
                        'equipment',
                        'getUsers']),
  components: {TableMaterial, AddFile, OpensFile, ListProvider, BaseTools},
  methods: {
    saveEquipment() {
        if(!this.obj.id || this.obj.name.length < 3)
            return 0
        
        if(!this.formData) 
            this.formData = new FormData()
        
        if(this.providersId)
          this.providersId = JSON.stringify(this.providersId)

        this.formData.append('id', this.obj.id)
        this.formData.append('name', this.obj.name)
        this.formData.append('deliveryTime', this.obj.deliveryTime)
        this.formData.append('responsible', this.obj.responsible)
        this.formData.append('invNymber', this.obj.invNymber)
        this.formData.append('description', this.obj.description)
        this.formData.append('providers', this.providersId)
        this.formData.append('instrumentIdList', JSON.stringify(this.obj.instrumentIdList))
        this.updateEquipment(this.formData) 

    this.$router.push('/baseequipment')
    },
    addInstrument() {
      this.instrumentKey = random(10, 38e9)
      this.instrumentIsShow = true
    },
    removeFile() {
        if(isEmpty(this.itemFiles))
            return 0
    },
    pushProvider(provider) { 
      if(!provider)
        return 0
      this.providers.push(provider)
      this.providersId.push({id: provider.id})
    },
    addProvider() {
      this.showProvider = true
      this.keyWhenModalListProvider = random(10, 38e9)
    },
    setDocs(dc) {
        this.itemFiles = dc
    },
    openDock() {
        if(isEmpty(this.itemFiles))
            return 0
        this.showFile = true
        this.keyWhenModalGenerateFileOpen = random(10, 38e9)
    },
    openFile(res) {
        console.log(res)
    },
    checkedUpdate() {
        if(isEmpty(this.equipment)) 
            return this.$router.push('/baseequipment')
                           
        if(this.equipment.nameInstrument)
          this.listInstrument = this.equipment.nameInstrument
        this.filterAllEquipmentById({ type: this.equipment.rootParentId, pType: this.equipment.parents[0].id})
        this.obj.id = this.equipment.id
        this.obj.name = this.equipment.name
        this.obj.parentId = this.equipment.parents[0].id
        this.obj.deliveryTime = this.equipment.deliveryTime
        this.obj.invNymber = this.equipment.invNymber
        this.obj.description = this.equipment.description
        this.documents = this.equipment.documents
        this.providers = this.equipment.providers
        this.providers.forEach(provider => {
          this.providersId.push({id: provider.id})
        })
        
        if(this.equipment.user) {
          this.obj.responsible = this.equipment.user.id
        }
    },

    // ADD FILE and SET INSTRUMENT TO TABLE
    ...mapActions(['fetchAllEquipmentType', 'getAllEdizm', 
    'updateEquipment', 'removeFileEquipment',
    'getAllUsers']),
    ...mapMutations(['filterAllPTEquipment', 'filterAllEquipmentById']),
    clickEquipment(eq) {
      this.equipmentT = eq
      this.filterAllPTEquipment(eq)
    },
    clickEquipmentPT(eq) {
      this.equipmentPT = eq
    },
    addDock(val) { 
      val.target.files.forEach(f => {
          this.docFiles.push(f)
      })
      this.keyWhenModalGenerate = random(10, 34e9)
      this.isChangeFolderFile = true
    },
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
    },
    unmount_instrument(instruement) {
      this.obj.instrumentIdList = instruement.instrumentListId
      this.listInstrument = instruement.instrumentList
    }
  },
  async mounted() {
    this.getAllEdizm()
    this.checkedUpdate()
    this.getAllUsers()

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