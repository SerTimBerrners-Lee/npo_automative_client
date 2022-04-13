<template>
  <div>
    <div>
      <h3> Создать оборудование </h3>
      <div class="block block_name">
        <p class="name_p">
          <span> Наименование: </span>
          <input type="text" v-model.trim="obj.name">
          <label class='label' style='margin:3px;' for='attention'>Выделить</label>
          <input 
            style='width: 10px;'
            type="checkbox" 
            id='attention' 
            v-model='attention'>
        </p>
         <p class="name_p">
          <span> Ответственный: </span>
          <select class="select-small sle"  
            v-model='obj.responsible'>
            <option 
              v-for='user in getUsers' 
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
            @search='serhType'
            @clickMat="clickEquipment"/>
          <TableMaterial :title='"Подтип"' 
            :alltypeM="allEquipmentPType" 
            :width='"width-260"'
            :type="'PT'" 
            @search='serhPType'
            @clickMat="clickEquipmentPT"/>
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
          <h3>Параметры</h3>
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
          <div class="btn-control">
            <button class="btn-small btn-add" @click="addProvider">Добавить из базы</button>
          </div>
        </div>
         <div class="pointer-files-to-add">
            <label for="docsFileSelected">Перенесите сюда файлы или кликните для добавления с вашего компьютера.</label>
            <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
        </div>
        <h3 @click="addInstrument" class="link_h3">Привязанный инструмент или оснастка</h3>
        <AddFile :parametrs='docFiles' 
          :typeGetFile='"getfile"'
          v-if="isChangeFolderFile" 
          @unmount='file_unmount'
          :key='keyWhenModalGenerate'
            />
      </div>
    </div>
    <div class="edit-save-block block" v-if="getRoleAssets && getRoleAssets.assets.equipmentAssets.writeSomeone">
        <button class="btn-status" @click='exit'>Отменить</button>
        <button class="btn-status btn-black" @click="addEquipment">Сохранить</button>
      </div>
      <ListProvider  
        @unmount='pushProvider' 
        :key='keyWhenModalListProvider'
        v-if='showProvider'
        />
      <BaseTools 
        :listInstrument='listInstrument'
        :key='instrumentKey'
        v-if='instrumentIsShow'
        @unmount_instrument='unmount_instrument'
      />
      <Loader v-if='loader' />
  </div>
</template>
<script>
import { random }  from 'lodash';
import { showMessage } from '@/js/';
import AddFile from '@/components/FileBase/addfile';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TableMaterial from '@/components/MathZag/table-material';
import BaseTools from '@/components/Instrument/modal-base-tool';
import ListProvider from '@/components/BaseProvider/list-provider';

export default {
  data() {
    return {
      equipmentT: null,
      equipmentPT: null,
      docFiles: [],
      formData: null,
      isChangeFolderFile: false,
      showProvider: false,
      keyWhenModalGenerate: random(10, 999),
      keyWhenModalListProvider: random(10, 999),
      providers: [],
      providersId: [],
      instrumentKey: random(10, 999),
      instrumentIsShow: false,
      obj: {
        name: '',
        parentId: null,
        deliveryTime: '',
        invNymber: '',
        description: '', 
        responsible: '',
        instrumentIdList: []
      },
      listInstrument: null,

      loader: false,
      attention: false
    }
  },
  computed: mapGetters([
    'allEquipmentType', 
    'allEquipmentPType', 
    'allEdizm', 
    'getUsers',
    'getRoleAssets'
  ]),
  components: {TableMaterial, AddFile, ListProvider, BaseTools},
  methods: {
    ...mapActions([
      'fetchAllEquipmentType', 
      'getAllEquipmentPType',
      'getAllEdizm', 
      'creqteEquipment',
      'getAllUsers'
      ]),
    ...mapMutations([ 
      'filterAllPTEquipment',
      'searchTypeEq',
      'searchPTypeEq',
      'delitPathNavigate'
      ]),
    addProvider() {
      this.showProvider = true
      this.keyWhenModalListProvider = random(10, 999)
    },
    pushProvider(provider) { 
      if(!provider)
        return 0
      this.providers.push(provider)
      this.providersId.push({id: provider.id})
    },
    addInstrument() {
      this.instrumentKey = random(10, 999)
      this.instrumentIsShow = true
    },
    addEquipment() {
      if(!this.equipmentPT)
        return showMessage('', 'Выберите Подтип', 'w');
      if(!this.equipmentT)
        return showMessage('', 'Выберите тип', 'w');
      if(this.obj.name.length < 3)
        return showMessage('', 'Наименование должно быть длинее 3-символов', 'w');
      
      if(!this.formData) 
        this.formData = new FormData()
      this.obj.parentId = this.equipmentPT.id 

      if(this.providersId)
        this.providersId = JSON.stringify(this.providersId)
      this.formData.append('name', this.obj.name)
      this.formData.append('deliveryTime', this.obj.deliveryTime)
      this.formData.append('invNymber', this.obj.invNymber)
      this.formData.append('description', this.obj.description)
      this.formData.append('parentId', this.obj.parentId)
      this.formData.append('providers', this.providersId)
      this.formData.append('responsible', this.obj.responsible)
      this.formData.append('instrumentIdList', JSON.stringify(this.obj.instrumentIdList))
      this.formData.append('rootParentId', this.equipmentT.id)
      this.formData.append('attention', this.attention)
      this.creqteEquipment(this.formData)
      this.exit()
    },
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
      this.keyWhenModalGenerate = random(10, 999)
      this.isChangeFolderFile = true
    },
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
    },
    unmount_instrument(instruement) {
      this.obj.instrumentIdList = instruement.instrumentListId
      this.listInstrument = instruement.instrumentList
    },
    serhType(eq) {
      this.searchTypeEq(eq)
    },
    serhPType(eq) {
      this.searchPTypeEq(eq)
    },
    exit() {
      this.$router.push('/baseequipment')
      this.delitPathNavigate(this.$route.path)
    }
  },
  async mounted() {
    this.loader = true
    await this.fetchAllEquipmentType()
    await this.getAllEdizm()
    await this.getAllUsers(true)
    await this.getAllEquipmentPType()
    this.loader = false
  }
}
</script>
<style>
.sle {
  background-color: white;
}
.block_name {
  display: flex;
}
.instr_select {
  width: 210px;
}
.name_p{
  display: flex;
  align-items: center;
  margin-left: 10px;
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