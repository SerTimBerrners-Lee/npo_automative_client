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
            <button class="btn-small" @click="editContact" v-if="contact">Редактировать</button>
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
    <div class="edit-save-block block" v-if="getRoleAssets && getRoleAssets.assets.buyerAssets.writeSomeone">
      <button class="btn-status" @click="exit">Отменить</button>
      <button class="btn-status btn-black" @click='addbuyer'>Сохранить</button>
    </div>
    <AddContact 
      :key='keyModal'
      @unmount='unmount'
      v-if="isShow"
      :parametrs='contact'
    />
    <OpensFile 
      :parametrs='itemFiles' 
      v-if="itemFiles"
      :key='keyWhenModalGenerateFileOpen'
    />
  </div>
</template>
<script scoped>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import OpensFile from '@/components/FileBase/OpenFile';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import AddContact from '@/components/BaseProvider/AddContact';

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
      keyWhenModalGenerateFileOpen: random(10, 999),

      attention: false
    }
  },
  computed: mapGetters(['getRoleAssets']),
  components: {AddContact, OpensFile},
  methods: {
    ...mapActions(['addOneBuyer']),
    ...mapMutations([
      'delitPathNavigate'
    ]),
    unmount(data) {
      if(!data)
        return 0;
      if(this.contact) return this.obj.contact[this.contact.index] = {...data}
      this.obj.contact.push({...data})
    },
    addContact() { 
      this.contact = null
      this.keyModal = random(1, 999)
      this.isShow = true
    },
    getContact(cont, index) {
      this.contact = { cont, index }
    },
    delContact() {
      if(!this.contact) return 0;
      this.obj.contact = this.obj.contact.filter((a, index) => index != this.contact.index)
    },
    editContact() {
      if(!this.contact) return 0;
      this.keyModal = random(1, 999)
      this.isShow = true
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

      this.addOneBuyer(this.formData).then(() => 
        showMessage('', 'Покупатель успешно создан. Перенаправление на главную страницу...', 's')
      )
      setTimeout(() => {
        this.$router.push('/basebuyer')
        this.delitPathNavigate(this.$route.path)
      }, 3000)
    },
    file_unmount(e) { 
      if(!e) return 0
      if(e.formData.getAll('document') && e.formData.getAll('document').length) {
        for(let doc of e.formData.getAll('document')) {
          this.obj.documents.push(doc)
        }
      }
      this.formData = e.formData
    },
    clickDoc(files) {
      if(files) { 
        this.itemFiles = files
        this.keyWhenModalGenerateFileOpen = random(10, 999)
      }
    },
    exit() {
      this.$router.push('/basebuyer')
      this.delitPathNavigate(this.$route.path)
    }
  },
  async mounted() {
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
</style>