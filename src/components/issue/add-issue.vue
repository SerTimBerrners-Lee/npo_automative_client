<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Новая задача №  от {{ dataReturn() }}</h3>
			<h3>Примечание</h3>
			<textarea v-model='description'></textarea>
      <div class='iform_block'>
        <h3>Информация</h3>
        <p>
          <span>Дата использования: </span>
          <input type="text" v-model='dateUse'>
        </p>
        <p>
          <span>Норма времени на выполнение: </span>
          <input type="text" v-model='normTime'>
          <span>ч.</span>
        </p>
        <p>
          <span>Источник: </span>
          <input type="text" :value='sourse.login'>
        </p>
        <p>
          <span>Исполнитель: </span>
          <span v-for='user in executorList' :key='user' class='user_select_span'>{{ user.login }}</span>
          <button class="btn-small btn-add" @click='selectUser("executor")'>Добавить</button>
        </p>
        <p>
          <span>Контролер: </span>
          <span v-for='user in controllerList' :key='user' class='user_select_span'>{{ user.login }}</span>
          <button class="btn-small btn-add"  @click='selectUser("controller")'>Добавить</button>
        </p>
        <p>
          <span>Время на контроль: </span>
          <input type="text">
          <span>дней(0-неопределено) </span>
        </p>
        <p>
          <span>Срочность: </span>
          <select class='select-small' v-model="srok">
            <option v-for='(srok, inx) in srokList' :key='srok' :value='inx'>{{ srok }}</option>
          </select>
        </p>
        <p>
          <span>Статус: </span>
          <input type="text" v-model='status'>
        </p>
      </div>
      <div>
        <h3>Скриншот</h3>
        <div class="main_screen">
          <div v-for='scren in docFilesPreload' :key='scren'>
            <img class='screen_size' :src="scren.url" alt="Изображение">
          </div>
          <div>
            <label for="add_block" class='add_block screen_size'>+</label>
            <input 
              id="add_block" 
              @change="e => addDock(e)" 
              type="file" 
              accept="image/png, image/gif, image/jpeg" 
              style="display:none;">
          </div>
        </div>
      </div>
      <div class='prov_block'>
        <h3>Привязка</h3>
        <div class='izd_block'>
          <span>Изделия, СБ, детали:</span>
          <div v-for='izd in izdList' :key='izd' class='izd_block_two'>
            <span class='user_select_span'>{{ izd.name }}</span>
            <span class='delete_span' @click='deleteIzd(izd)'><unicon name="minus-square-full" fill="red" height='16' width='16' /></span>
          </div>
          <button class="btn-small btn-add" @click='addProduct'>Добавить</button>
        </div>
        <div class='izd_block'>
          <span>Файлы:</span>
          <div v-for='file in fileArrModal' 
              class='izd_block_two' 
              @click="setDocs(file)"
              :key='file'>
              <span class='user_select_span'>{{ file.name }}</span>
          </div>
          <button class="btn-small btn-add" @click='openFileModal'>Добавить</button>
        </div>
        <p>
          <span>Общецеховые нужды: </span>
          <input type="text" style='width: 20px' v-model='shopNeeds'>
        </p>
      </div>
    
     <div class="btn-control out-btn-control">
      <button class="btn-status" 
        @click='destroyModalF'>Отменить</button>
      <button class="btn-status btn-black" @click='addIssue'>Дать задачу</button>
    </div>

    <ModalUsersList 
      v-if='showModalUser'
      :key='keyModalUser'
      :usersList='usersList'
      @unmount='responseUserList'
    />
    </div>
  </div>
    <BaseProductModal
    v-if='showModalProduct'
    :key='keyModalProduct'
    @responsDetal='responsDetal'
  />
  <BaseFileModal 
    v-if='showModalFile'
    :key='fileModalKey'
    :fileArrModal='fileArrModal'
    @unmount='unmount_filemodal'
    />
    <OpensFile 
      :parametrs='itemFiles' 
      v-if="showFile" 
      :key='keyWhenModalGenerateFileOpen'
    />
</div>
</template>

<script>
import ModalUsersList from '@/components/users/modal-list-user.vue';
import BaseProductModal from '@/components/baseproduct/base-product-all-modal.vue';
import BaseFileModal from '@/components/filebase/base-files-modal.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import { dataFormat, photoPreloadUrl } from '@/js/';
import {random, isEmpty} from 'lodash';
import {mapGetters, mapActions} from 'vuex';

export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      showModalUser: false,
      keyModalUser: random(1, 999),

      usersList: [],
      typeUserList: '',

      showModalProduct: false,
      keyModalProduct: random(1, 999),

      fileArrModal: [],
      fileModalKey: random(10, 999),
      showModalFile: false,

      itemFiles: null,
      showFile: false,
      keyWhenModalGenerateFileOpen: random(10, 999),

      srokList: [
        'Срочно',
        'Нормально',
        'Отложено',
        'На контроль'
      ],

      docFilesPreload: [],
      docFiles: [],
      formData: new FormData(),

      description: '',
      dateUse: '',
      normTime: '',
      sourse: '',
      srok: '0',
      status: '',
      controllerList: [],
      executorList: [],
      izdList: [],
      shopNeeds: ''
    }
  },
  components: {ModalUsersList, BaseProductModal, BaseFileModal, OpensFile},
  computed: mapGetters(['getAuth']),
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 

    if(this.getAuth)
      this.sourse = {login: this.getAuth.login, id: this.getAuth.id}
  },
  methods: {
    ...mapActions(['createIssue']),
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'
    },
    dataReturn() {
      return dataFormat()
    },
    addIssue() {
      this.destroyModalF()
      this.$emit('unmount', 'test')

      this.formData.append('description', this.description)
      this.formData.append('dateUse', this.dateUse)
      this.formData.append('normTime', this.normTime)
      this.formData.append('sourse', JSON.stringify(this.sourse))
      this.formData.append('srok', this.srok)
      this.formData.append('status', this.status)
      this.formData.append('controllerList', JSON.stringify(this.controllerList))
      this.formData.append('executorList', JSON.stringify(this.executorList))
      this.formData.append('izdList', JSON.stringify(this.izdList))
      this.formData.append('shopNeeds', this.shopNeeds)
      this.formData.append('fileArrModal', JSON.stringify(this.fileArrModal))

      this.createIssue(this.formData)
    },  

    selectUser(type) {
      this.typeUserList = type
      if(type == 'executor') 
        this.usersList = this.executorList
      if(type == 'controller') 
        this.usersList = this.controllerList

      this.showModalUser = true
      this.keyModalUser = random(1, 999)
    },
    responseUserList(addUser) {
      if(this.typeUserList == 'executor')
        this.executorList = addUser
      if(this.typeUserList == 'controller')
        this.controllerList = addUser
    },
    responsDetal(res) {
      if(res) {
        this.izdList.push({
          id: res.id,
          name: res.name
        })
      }
    },
    addProduct() {
      this.showModalProduct = true
      this.keyModalProduct = random(1, 999)
    },
    openFileModal() {
      this.fileModalKey = random(10, 999)
      this.showModalFile = true
    },
    deleteIzd(izd) {
      console.log(this.izdList)
      this.izdList = this.izdList.filter(z => z.name != izd.name)
    },
    unmount_filemodal(res) {
      console.log(res)
    },
    setDocs(dc) {
      this.itemFiles = dc
      if(isEmpty(this.itemFiles))
        return 0
      this.showFile = true
      this.keyWhenModalGenerateFileOpen = random(10, 999)
    },
    addDock(val) {
      val.target.files.forEach(f => {
          photoPreloadUrl(f, (res) => {
            this.docFilesPreload.push(res)
          })
          this.docFiles.push(f)
          this.formData.append('document', f)
      })

    },
  },

}
</script>

<style scoped>
.user_select_span {
  padding-left: 5px;
  text-decoration: underline;
  color: #0008ffce;
  border-radius: 5px;
  cursor: pointer;
}
.izd_block {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}
.izd_block_two {
  display: flex;
  align-items: flex-start;
}
.delete_span{
  padding: 0;
  margin: 0;
  margin-right: 2px;
}
.delete_span div {
  margin: 0px;
  padding: 0px;
}
textarea {
  height: 130px;
  width: 99%;
}
.iform_block *, .prov_block * {
  margin-left: 5px;
}
.iform_block input {
  width: 90px;
}
.add_block {
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  cursor: pointer;
}
.add_block:hover {
  background-color: rgb(71, 71, 71);
}
.main_screen {
  display: flex;
  flex-wrap: wrap;
}
.screen_size {
  width: 50px;
  height: 50px;
  margin-right: 5px;
  margin-top: 5px;
}
</style>