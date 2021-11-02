<template> 
  <div>
    <h3> {{ $route.params.title == "edit" ? 'Редактировать' : 'Добавить' }} сотрудника</h3>

    <div class="block">
      <p class='flex'>
        <span>ФИО: </span> 
        <input type="text" style="width: 200px;" v-model="object.initial">
      </p>
      <p class='flex'>
        <span>Должность: </span>
        <select class="select-small" v-if="allRoles.length > 0" v-model='object.roles'>
          <option v-for="role in allRoles" :key='role' :value='role.id' >{{ role.description }}</option>
        </select>
        <select class="select-small" v-else>
          <option>Нет Ролей</option>
        </select>
      </p>
      <p class='flex'>
        <span>Табельный номер: </span>
        <input type="text" v-model='object.tabel'>      
      </p>
      <p class='flex'>
        <span>Дата приема на работу: </span>
        <DatePicterCustom 
          @unmount='change_date_picter' 
          :dateStart='object.dateWork'
          :dats='"false"'
        />
      </p>
      <p class='flex'>
        <span>Дата увольнения: </span>
        <DatePicterCustom 
          @unmount='change_date_picter' 
          :dateStart='object.dateWork'
          :dats='"false"'
        />
      </p>
      <p class='flex'>
        <span>Логин: </span>
        <input type="text" v-model.trim='object.login'>
      </p>
      <p class='flex'>
        <span>Пароль: </span>
        <input type="text" v-model.trim="object.password">
      </p>
      <p class='flex'>
        <span>День рождения: </span>
        <DatePicterCustom 
          @unmount='change_date_picter' 
          :dateStart='object.birthday'
          :dats='"false"'
        />
      </p>
    </div>

    <div class="editblock-main">
      <div class="left-cont">
        <div class="addedit-docks">
          <h3>Контактные данные</h3>
          <table>
            <tr>
              <th rowspan="1" scope="row" style="width: 250px;">Постоянный адрес проживания</th>
              <td ref='adress' v-text='object.adress' style="width: 260px;" :contenteditable="editTableKontact"></td>
            </tr>
            <tr>
              <th rowspan="1" scope="row">Адрес по прописке</th>
              <td ref='adressProps' v-text='object.adressProps' :contenteditable="editTableKontact"></td>
            </tr>
            <tr>
              <th rowspan="1" scope="row">Моб. телефон</th>
              <td ref='phone' v-text='object.phone' :contenteditable="editTableKontact"></td>
            </tr>
            <tr>
              <th rowspan="1" scope="row">Эл. почта</th>
              <td ref='email' v-text='object.email' :contenteditable="editTableKontact"></td>
            </tr>
          </table>
          <div class="btn-control">
            <button class="btn-small btn-add " @click="saveContact">
                Сохранить
            </button>
            <button class="btn-small" @click="editIsContac(editTableKontact), editTableKontact = !editTableKontact">{{ !editTableKontact ? 'Редактировать' : 'Отменить редактирование'}}</button>
          </div>
        </div>
        <div class="addedit-docks">
          <h3>Документы</h3>
          <table>
            <tr>
              <th class="width-350" style="width: 520px;">Файл</th>
            </tr>
            <tr 
              class="td-row" 
              v-for="doc in docFiles" 
              :key="doc"
              @click="setDocs(doc)">
              <td> {{ doc.name }}</td>
            </tr>
            <tr v-for='file in fileArrModal' 
              class="td-row"  
              @click="setDocs(file)"
              :key='file'>
              <td>{{ file.name }}</td>
            </tr>
          </table>
          <div class="pointer-files-to-add">
            <label for="docsFileSelected">Перенесите сюда файлы или кликните для добавления с вашего компьютера.</label>
            <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
          </div>
          <div class="btn-control">
            <button class="btn-small"
              @click='delitFilesDoc'
              v-if="$route.params.title == 'edit'">Удалить</button>
            <button class="btn-small" @click='addInBaseFile'>Добавить из базы</button>
          </div>
        </div>
      </div>

      <div class="center-cont">
        <h3>Характеристика</h3>
        <textarea maxlength='250' cols="30" rows="10" v-model="object.haracteristic"></textarea>
        <h3>Примечание</h3>
        <textarea maxlength='250' cols="30" rows="10" v-model="object.primetch"></textarea>
        <h3>Роль пользователя</h3>
        <h3>История изменений</h3>
      </div>
      <div class="img-ava-block">
        <img :src='urlImg' alt="avatar" v-if="imgShow">
        <div v-if="!imgShow">
          <label for="fileFolder" class="toltip">Нажмите чтобы загрузить фото</label>
          <input type="file" @change="e => fileFolderF(e)" id="fileFolder" style="display: none;">
        </div>
          <div v-if="imgShow" class='uploadPhoto'>
          <label for="fileFolder2" >Изменить фото</label>
          <input type="file" @change="e => fileFolderF(e)" id="fileFolder2" style="display: none;">
        </div>
      </div>
    </div>

    <div class="edit-save-block block">
        <button class="btn-status" 
            v-if="$route.params.title == 'edit'"
            @click='bannedUser'>В архив</button>
        <button class="btn-status" @click="$router.push('/employee')">Отменить</button>
        <button class="btn-status btn-black" @click="saveData">Сохранить</button>
    </div>
      <InformFolder :key="keyInformTip" :title='titleMessage' :message='message' :type='type' v-if='showInformPanel' />
  <OpensFile 
    :parametrs='itemFiles' 
    v-if="showFile" 
    :key='keyWhenModalGenerateFileOpen'
  />
  <BaseFileModal 
    v-if='showModalFile'
    :key='fileModalKey'
    :fileArrModal='fileArrModal'
    @unmount='unmount_filemodal'
  />
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';
import InformFolder from '@/components/InformFolder.vue';
import {photoPreloadUrl, showMessage} from '@/js/';
import {isEmpty, random} from 'lodash';
import PATH_TO_SERVER from '@/js/path.js';
import OpensFile from '@/components/filebase/openfile.vue';
import BaseFileModal from '@/components/filebase/base-files-modal.vue';
import DatePicterCustom from '@/components/date-picter.vue';

export default ({ 
  data() {
    return {
      docFiles: [],
      selectFiles: Object,
      editTableKontact: false,
      showInformPanel: false,
      titleMessage: '',
      keyInformTip: 21, 
      message: '',
      type: '',
      urlImg: '',
      imgShow: false,
      fileFolder: null,
      object: {
        adress: '',
        adressProps: '',
        phone: '', 
        email: '',
        initial: '',
        tabel: '',
        roles: '',
        dateWork: '',
        dateUnWork: '',
        login: '',
        password: '',
        birthday: '',
        haracteristic: '',
        primetch: ''
      },
      id: null,

      itemFiles: null,
      showFile: false,
      keyWhenModalGenerateFileOpen: random(10, 999),

      fileArrModal: [],
      fileModalKey: random(10, 999),
      showModalFile: false,
    }
  },
computed: {
    ...mapGetters(['allRoles', 'getSelectedUser']),
  },
  components: {
    InformFolder,
    OpensFile,
    BaseFileModal,
    DatePicterCustom
  },
  methods: {
    ...mapActions([
      'saveUser', 
      'fetchRoles', 
      'banUserById',
      'updateUser',
      'deleteFIleForUser'
    ]),

    saveData() {
      if(this.object.tabel.length > 4)
        return showMessage('', 'Тебель не может быть больше 4-х символов', 'w', this)
      if( this.object.password.length < 5)
        return showMessage('', 'Пароль не может быть меньше 5 символов', 'w', this)
      if(this.object.login.length < 3)
        return showMessage('', 'Логин не может быть менее 3-х символов', 'w', this)
      if(!this.object.roles)
        return showMessage('', 'Роль должна быть выбрана обязательно!', 'w', this)
      if(!Number(this.object.tabel))
        return showMessage('', 'Тебель должен быть числом', 'e', this)
      this.saveContact()
      const formData = new FormData()
      for (let dat in this.object) {
        formData.append(dat, this.object[dat])
      }
      if(this.fileFolder)
        formData.append('image', this.fileFolder)

      if(this.docFiles.length > 0) {
        for(let file of this.docFiles) {
          formData.append('document', file)
        }
      }

      if(this.fileArrModal.length)
        formData.append('fileArrModal', JSON.stringify(this.fileArrModal))

      if(this.$route.params.title == 'edit') {
        formData.append('id', this.id)
        this.updateUser(formData).then(res => {
          setTimeout(() => this.$router.push('/employee'), 4000)
          if(res.ok)
            return showMessage('', 'Данные переданны для обработки на сервер', 'w', this)
          else 
            return showMessage('', 'Произошла ошибка на сервере', 'e', this)
        })
        return 0;
      }

      this.saveUser(formData).then(m => {
        if(m.type == 'error')
          return showMessage('Ошибка', m.message, 'e', this)
        if(m.type == 'success') {
          showMessage('Успешно', 'Пользователь успешно создан', 's', this)
          setTimeout(() => this.$router.push('/employee'), 1000)
        }

      });

    },
    fileFolderF(e) {
      this.fileFolder = e.target.files[0]
      photoPreloadUrl(this.fileFolder,  res => {
        if(res && res.url) {
          this.imgShow = true
          this.urlImg = res.url
        }
      })
    },
    saveContact() {
      this.object.adress = this.$refs.adress.textContent
      this.object.adressProps = this.$refs.adressProps.textContent
      this.object.phone = this.$refs.phone.textContent
      this.object.email = this.$refs.email.textContent
    },
    editIsContac(isQ) {
      if(isQ) {
        this.$refs.adress.textContent = this.object.adress
        this.$refs.adressProps.textContent = this.object.adressProps
        this.$refs.phone.textContent = this.object.phone
        this.$refs.email.textContent = this.object.email
      }
    },
    delitFilesDoc(){
      if(this.itemFiles && this.docFiles.length) {
        this.docFiles = this.docFiles.filter(f => f.id != this.itemFiles.id)
        this.deleteFIleForUser({userId: this.id, fileId: this.itemFiles.id})
      }
    },
    addDock(val) {
      val.target.files.forEach(f => {
        this.docFiles.push(f)
      })
    },
    bannedUser() {
      if(isEmpty(this.getSelectedUser)) 
        return 0
      this.banUserById(this.getSelectedUser.id).then(mes => {
        showMessage('', mes.message, mes.type, this)
        setTimeout(() => this.$router.push({path: `/employee`}), 1000)
      })
    },
    setDocs(dc) {
      this.itemFiles = dc
      if(isEmpty(this.itemFiles))
        return 0
      this.showFile = true
      this.keyWhenModalGenerateFileOpen = random(10, 999)
    },
    addInBaseFile() {
      this.fileModalKey = random(10, 999),
      this.showModalFile = true 
    },
    unmount_filemodal (fileArrModal) {
      this.fileArrModal = fileArrModal
    }
  },
  async mounted() {
    this.fetchRoles()
    if(this.$route.params.title == 'edit') {
      if(isEmpty(this.getSelectedUser)) {
        this.$router.push(`/employee/`)
        return 0
      }
      this.id = this.getSelectedUser.id
      //Заполняем данные 
      this.object.adress = this.getSelectedUser.adress
      this.object.adressProps = this.getSelectedUser.adressProps
      this.object.phone = this.getSelectedUser.phone
      this.object.email = this.getSelectedUser.email
      this.object.initial = this.getSelectedUser.initial
      this.object.tabel = this.getSelectedUser.tabel
      this.object.roles = this.getSelectedUser.role ? this.getSelectedUser.role.id : null
      this.object.dateWork = this.getSelectedUser.dateWork
      this.object.dateUnWork = this.getSelectedUser.dateUnWork
      this.object.login = this.getSelectedUser.login
      this.object.password = this.getSelectedUser.password
      this.object.birthday = this.getSelectedUser.birthday
      this.object.haracteristic = this.getSelectedUser.haracteristic
      this.object.primetch = this.getSelectedUser.primetch

      if(this.getSelectedUser.image) {
        this.imgShow = true
        this.urlImg = PATH_TO_SERVER+this.getSelectedUser.image
      }

      if(this.getSelectedUser.documents.length) {
        this.docFiles = this.getSelectedUser.documents
      }

    }
  },
})
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
  margin-top: 0px;
}
.flex input {
  margin-left: 5px;
}
.uploadPhoto {
  background: #2b2b2b;
  padding: 4px;
  margin-top: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}
.uploadPhoto * {
  cursor: pointer;
}
.uploadPhoto:hover {
  background: #000000;
}
.img-ava-block {
  align-items: center;
  display: flex;
  flex-direction: column;
}
.ava-block>img {
  height: 200px;
  width: 160px;
}

textarea {
  height: 90px;
  width: 400px;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
}
.img-ava-block>img {
  max-width: 260px;
  max-height: 310px;
  margin-top: 30px;
}
.addedit-docks {
  width: max-content;
}
.select-small {
  width: max-content;
  height: 26px;
  padding: 0px;
  font-size: 13px;
  margin-top: 5px;
}
.block>p {
  margin-left: 10px;
}
.block>p input {
  width: 100px;
}
.block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.addedit-docks th {
  text-align: start;
}
.editblock-main {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.editblock-main>div {
  margin: 10px;
}
.editblock-main img {
  max-width: 260px;
  max-height: 195px;
}
.img-ava-block {
  max-width: 260px;;
}
.toltip {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1a1a1a;
  color: white;
  height: 250px;
  width: 170px;
  margin-bottom: 115px;
  bottom: 100px;
  padding: 20px;
  text-align: center;
}
.img-ava-block:hover {
  content: attr(href)
}
.pointer-files-to-add {
  height: 100px;
  display: flex;
}
.btn-control {
  height: 70px;
}
.addedit-docks {
  display: flex;
  flex-direction: column;

}
</style>
