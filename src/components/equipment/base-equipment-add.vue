<template>
  <div>
    <div>
      <h3> Создать оборудование </h3>
      <div class="block block_name">
        <p class="name_p">
          <span> Наименование: </span><input type="text" v-model.trim="obj.name">
        </p>
         <p class="name_p">
          <span> Ответственный: </span><input type="text" v-model.trim="obj.responsible">
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
        <AddFile :parametrs='docFiles' 
          :typeGetFile='"getfile"'
          v-if="isChangeFolderFile" 
          @unmount='file_unmount'
          :key='keyWhenModalGenerate'
            />
      </div>
    </div>
      <div class="edit-save-block block">
          <button class="btn-status" @click='$router.push("/basetools")'>Отменить</button>
          <button class="btn-status btn-black" @click="addEquipment">Сохранить</button>
        </div>
        <ListProvider  
          @unmount='pushProvider' 
          :key='keyWhenModalListProvider'
          v-if='showProvider'
          />
  </div>
</template>


<script>
import TableMaterial from '@/components/mathzag/table-material.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AddFile from '@/components/filebase/addfile.vue'
import ListProvider from '@/components/baseprovider/list-provider.vue';

import { random }  from 'lodash'

export default {
  data() {
    return {
      equipmentT: null,
      equipmentPT: null,
      docFiles: [],
      formData: null,
      isChangeFolderFile: false,
      showProvider: false,
      keyWhenModalGenerate: random(10, 384522333213313324),
      keyWhenModalListProvider: random(10, 384522333213313324),
      providers: [],
      providersId: [],
      obj: {
        name: '',
        parentId: null,
        deliveryTime: '',
        invNymber: '',
        description: '',
        responsible: ''
      }
    }
  },
  computed: mapGetters(['allEquipmentType', 'allEquipmentPType', 'allEdizm']),
  components: {TableMaterial, AddFile, ListProvider},
  methods: {
    addProvider() {
      this.showProvider = true
      this.keyWhenModalListProvider = random(10, 384522333213313324)
    },
    pushProvider(provider) { 
      if(!provider)
        return 0
      this.providers.push(provider)
      this.providersId.push({id: provider.id})
    },

    addEquipment() {
      if(!this.equipmentPT || this.obj.name.length < 3)
        return 0
      
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
      this.creqteEquipment(this.formData)

      this.$router.push('/baseequipment')
    },

    // ADD FILE and SET INSTRUMENT TO TABLE
    ...mapActions(['fetchAllEquipmentType', 'getAllEdizm', 'creqteEquipment']),
    ...mapMutations(['filterAllPTEquipment']),
    clickEquipment(eq) {
      this.equipmentT = eq
      this.filterAllPTEquipment(eq.equipmentsPT)
    },
    clickEquipmentPT(eq) {
      this.equipmentPT = eq
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
    this.fetchAllEquipmentType()
    this.getAllEdizm()
  }
}
</script>


<style>
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