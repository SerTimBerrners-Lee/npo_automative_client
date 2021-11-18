 <template>
  <div>
    <h3> Создать покупателя</h3>
    <div class="block">
      <span>Наименование:</span>
      <input class="input_name" type="text" v-model="obj.name">
      <span>ИНН:</span>
      <input type="text" v-model="obj.inn">
      <span>КПП:</span>
      <input type="text" v-model="obj.cpp">
      <label class='label' style='margin:3px;' for='attention'>Выделить</label>
      <input 
        style='width: 10px;'
        type="checkbox" 
        id='attention' 
        v-model='attention'>
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
            <tr class="td-row" 
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

      </div>
    </div>
    <div class="edit-save-block block"  v-if="getRoleAssets && getRoleAssets.assets.buyerAssets.writeSomeone">
      <button class="btn-status" @click="exit">Отменить</button>
      <button class="btn-status btn-black" @click='addbuyer'>Сохранить</button>
    </div>
    <AddContact 
      :key='keyModal'
      @unmount='unmount'
      v-if="isShow"
    />
    <OpensFile 
      :parametrs='itemFiles' 
      v-if="itemFiles"
      :key='keyWhenModalGenerateFileOpen'
    />
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
  </div>
</template>
<script scoped>

import AddContact from '@/components/baseprovider/add-contact.vue';
import { random, isEmpty } from 'lodash';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import OpensFile from '@/components/filebase/openfile.vue';
import { showMessage } from '@/js/';
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
        documents: []
      },
      keyModal: random(1, 2213),
      isShow: false,
      contact: null,
      formData: null,
      docFiles: [],

      itemFiles: null,
      keyWhenModalGenerateFileOpen: random(10, 1222),

      titleMessage: '',
      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: 0,
      attention: false,

      id: null
      }
  },
  computed: mapGetters(['getSetBuyer', 'getRoleAssets']),
  components: {AddContact, OpensFile},
  methods: {
    ...mapActions(['updateOneBuyer']),
    ...mapMutations([
      'delitPathNavigate'
    ]),
    unmount(data) {
      if(!data)
        return 0;
      this.obj.contact.push({...data})
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
    addbuyer() {
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
      this.formData.append('attention', this.attention)

      this.formData.append('id', this.id)

      this.updateOneBuyer(this.formData).then(() => 
          showMessage('', 'Покупатель успешно обновлен. Перенаправление на главную страницу...', 's', this)
      )
      setTimeout(() => {
        this.$router.push('/basebuyer')
        this.delitPathNavigate(this.$route.path)
      }, 3000)
    },
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
    },
    clickDoc(files) {
      if(files) { 
        this.itemFiles = files
        this.keyWhenModalGenerateFileOpen = random(10, 1222)
      }
    },
    setBuyer(buyer) {
      this.buyer = buyer
      this.obj.name = buyer.name
      this.obj.inn = buyer.inn
      this.obj.cpp = buyer.cpp
      this.obj.description = buyer.description
      this.attention = buyer.attention
      this.id = buyer.id
      if(buyer.contacts) 
        this.obj.contact = JSON.parse(buyer.contacts)
      
      if(buyer.rekvisit) 
        this.obj.rekvisit = JSON.parse(buyer.rekvisit)
      
      if(buyer.documents) 
        this.obj.documents = buyer.documents
    },
    exit() {
      this.$router.push('/basebuyer')
      this.delitPathNavigate(this.$route.path)
    }
  },
  async mounted() {
    if(isEmpty(this.getSetBuyer)) {
      this.$router.push('/basebuyer')
      return 
    }

    this.setBuyer(this.getSetBuyer)
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