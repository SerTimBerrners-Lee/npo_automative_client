<template>
  <div>
    <h3> {{ this.$route.params.type == 'edit' ? 'Редактировать' : 'Создать' }} поставщика</h3>
    <div class="block">
      <span>Наименование:</span>
      <input class="input_name" type="text" v-model="obj.name">
      <span>ИНН:</span>
      <input type="text" v-model="obj.inn">
      <span>КПП:</span>
      <input type="text" v-model="obj.cpp">
    </div> 
    <div class="main_content">
      <div class="left_content">
        <div>
          <h3>Реквизиты</h3>
          <table class="recvizits"> 
            <tr v-for="(rek, index) in obj.rekvisit" :key="rek">
              <th>{{ rek.name }}</th>
              <td class='td-row'>
                <input type="text" class="rek" :value="rek.description" @change='e => changeRek(e.target.value, index)'>
              </td>
            </tr>
          </table>
        </div>
        <div>
          <h3>Контакты</h3>
          <table class="recvizits">
            <tr class="td-row" v-for="(cont, index) in obj.contact" :key="cont" @click="getContact(cont, index)">
              <th v-text='cont.initial'></th>
              <td v-text='cont.description'></td>
            </tr>
          </table>
          <div class="btn-control">
            <button class="btn-small" @click="delContact" v-if="contact">Удалить</button>
            <button class="btn-small btn-add" @click="addContact">Добавить</button>
          </div>
        </div>
        <div>
          <h3>Описание / Примечание</h3>
          <textarea maxlength='250' v-model="obj.description" cols="30" rows="10"></textarea>
        </div>
      </div>

      <div class="right_content">
        <div>
          <h3>Документы</h3>
          <table style="width: 100%">
            <tr>
              <th>Файл</th>
            </tr>
            <tr 
              class="td-row" 
              v-for="doc in obj.documents" 
              :key="doc"
              @click="clickDoc(doc)">
              <td> {{ doc.name }} </td>
            </tr>
          </table>
          <div style='height: 50px;'>
            <FileLoader 
              :typeGetFile='"getfile"'
              @unmount='file_unmount'/>
          </div>
        </div>
        <h3 class="link_h3" @click='openMaterial' style='margin-top: 30px;'>Поставляемый материал</h3>
        <TableMaterialFilter 
          :id_product='id_product'
        />

        <div v-if='materialList.length'>
          <h3>Добавленные материалы</h3>
          <div>
            <table style='width: 100%;'>
              <tr>
                <th>Наименование</th>
              </tr>
              <tr 
                v-for='material of materialList' 
                :key='material'
                class='td-row'>
                <td>{{ material.mat.name }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
      <div class="edit-save-block block" v-if="getRoleAssets && getRoleAssets.assets.providerAssets.writeSomeone">
        <button class="btn-status" @click="$router.push('/baseprovider')">Отменить</button>
        <button class="btn-status btn-black" @click='addProvider'>Сохранить</button>
      </div>
      <AddContact 
        :key='keyModal'
        @unmount='unmount'
        v-if="isShow"
      />
      <ModalBaseMaterial 
        :key='modalMaterialKey'
        v-if='modalMaterialIsShow'
        @unmount_material='unmount_material'
        :instanMaterial='3'
        :getOneMaterial='false'
        :matLightList='true'
        :allMaterial='materialList'
        />
      <OpensFile 
        :parametrs='itemFiles' 
        v-if="itemFiles"
        :key='keyWhenModalGenerateFileOpen'
      />
  </div>
</template>
<script scoped>

import AddContact from './add-contact.vue';
import { random, isEmpty } from 'lodash';
import { mapActions, mapGetters } from 'vuex';
import ModalBaseMaterial from '@/components/mathzag/modal-base-material.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import TableMaterialFilter from '@/components/baseprovider/table-material-filter.vue';
export default {
  data() {
    return {
      obj: {
        id: null,
        name: '',
        inn: '',
        cpp: '',
        description: '',
        contact: [],
        rekvisit: [
          { name: 'Юр. адрес', description: ''},
          { name: 'Телефон', description: ''},
          { name: 'Сайт', description: ''},
          { name: 'Эл.почта', description: ''}
        ],
        materials: [],
        documents: []
      },
      keyModal: random(1, 2213),
      isShow: false,
      contact: null,
      formData: null,
      docFiles: [],
      materials: [],
      id_product: null,

      modalMaterialKey: random(1, 999),
      modalMaterialIsShow: false,
      materialList: [],

      itemFiles: null,
      keyWhenModalGenerateFileOpen: random(10, 1222)
    }
  },
  computed: mapGetters([
    'getSetProvider',
    'getRoleAssets'
  ]),
  components: {AddContact, ModalBaseMaterial, OpensFile, TableMaterialFilter},
  methods: {
    ...mapActions(['addOneProvider']),
    unmount(data) {
      if(!data)
        return 0;
      this.obj.contact.push({...data})
    },
    unmount_material(res) {
      if(res.materialList) {
        this.obj.materials = []
        for(let e of res.materialList) {
          this.obj.materials.push(e.mat.id)
        }
        this.materialList = res.materialList
      }
    },
    addContact() { 
      this.keyModal = random(1, 22312)
      this.isShow = true
    },
    getContact(cont, index) {
      this.contact = { cont, index }
    },
    delContact() {
      if(!this.contact) return 0;
      this.obj.contact = this.obj.contact.filter((a, index) => index != this.contact.index)
    },
    changeRek(e, inx) {
      this.obj.rekvisit.forEach((rek, index) => {
        if(index == inx) {
          this.obj.rekvisit[index].description = e.trim()
        }
      })
    },
    addProvider() {
      if(this.obj.name.length < 5)
        return 0
      
      if(!this.formData)
        this.formData = new FormData()

      this.formData.append('name', this.obj.name)
      let rekvisit = JSON.stringify(this.obj.rekvisit)
      this.formData.append('rekvisit', rekvisit)
      let contact = JSON.stringify(this.obj.contact)
      this.formData.append('contacts', contact)
      this.formData.append('inn', this.obj.inn)
      this.formData.append('cpp', this.obj.cpp)
      this.formData.append('description', this.obj.description)
      this.formData.append('id', this.obj.id)
      this.formData.append('materialList', 
        JSON.stringify(this.obj.materials))

      this.addOneProvider(this.formData)
      this.$router.push('/baseprovider')
    },
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
    },
    openMaterial() {
      this.modalMaterialKey = random(10, 2e3)
      this.modalMaterialIsShow = true
    },
    clickDoc(files) {
      if(files) { 
        this.itemFiles = files
        this.keyWhenModalGenerateFileOpen = random(10, 1222)
      }
    },
  },
  async mounted() {
    if(this.$route.params.type == 'add') {
        //  Очищаем прикрепленных поставщиков 

    }

    if(this.$route.params.type == 'edit') {
      if(isEmpty(this.getSetProvider))
          this.$router.push('/baseprovider')
      let provider = this.getSetProvider  
      this.materials = provider.materials
      this.obj.id = provider.id
      this.obj.name = provider.name
      this.obj.inn = provider.inn
      this.obj.cpp = provider.cpp
      this.obj.description = provider.description
      if(provider.contacts) 
        this.obj.contact = JSON.parse(provider.contacts)
      
      if(provider.rekvisit) 
        this.obj.rekvisit = JSON.parse(provider.rekvisit)
      if(provider.documents) 
        this.obj.documents = provider.documents
      
      if(provider.materials.length) 
        this.id_product = provider.id
    }
  }
}
</script>

<style scoped>
.pointer-files-to-add {
  margin: 10px;
  height: 120px;
  display:flex;
}
.pointer-files-to-add label {
  display: flex;
  align-items: center;
}
.rek {
  border: none;
  width: 95%;   
}
.block{
  width: 1050px;
}
.block * {
  margin: 5px;
}
.input_name {
  width: 310px;
}
.recvizits td {
  width: 400px;
}
.recvizits th {
  width: 169px;
}
textarea {
  width: 100%;
}
.left_content {
  width: 600px;
}
.right_content {
  width: 600px;
  margin-left: 40px;
}
.main_content {
  display: flex;
  margin-bottom: 50px;
}
.material_post_table th, td{
  width: 33%;
}
.material_post_table {
  width: 100%;
}
.scroll-table{
  width: 100%;
  height: 450px;
}
</style>