<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Создание Перемещение от {{ new Date().toLocaleString('ru-RU').split(',')[0] }}</h3>
        <div class="block header_block">
          <p>
            <span>Выбор отправителя:</span>
            <input type="text" :value='to_user ? to_user.login : ""'>
            <button class="btn-small" @click='openUserModal("to")'>Выбрать</button>
            <label for='from_sklad'>Склад:</label>
            <input type="checkbox" id='from_sklad' v-model='to_sklad'>
          </p>
          <p>
            <span>Выбор получаеля:</span>
            <input type="text" :value='from_user ? from_user.login : ""'>
            <button class="btn-small" @click='openUserModal("from")'>Выбрать</button>
            <label for='to_sklad'>Склад:</label>
            <input type="checkbox" id='to_sklad' v-model='from_sklad'>
          </p>
          <p>
            <label for="cause">Причина перемещения </label>
            <select 
              id="cause" 
              class='select-small btn-add'
              v-model='cause'>
              <option value="Возврат на склад (товар в годном сосотоянии)">Возврат на склад (товар в годном сосотоянии)</option>
              <option value="Износ (естественный износ или плохой товар)">Износ (естественный износ или плохой товар)</option>
              <option value="Поломка (виноват сотрудник)">Поломка (виноват сотрудник)</option>
              <option value="Брак (виноват сотрудник)">Брак (виноват сотрудник)</option>
            </select>
          </p>
        </div>
        
        <div>
          <table>
            <tr>
              <th><unicon name="check" fill="royalblue" /></th>
              <th>Категория</th>
              <th>Тип</th>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>ЕИ</th>
              <th>Кол-во</th>
              <th>Кол-во на перемещение</th>
            </tr>
            <tr v-for='(prod, inx) of all_product' :key='prod'>
              <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                <p class="checkbox_block" @click='e => toElements(prod, e.target)'></p>
              </td>
              <td>Продукция</td>
              <td>П</td>
              <td>{{ prod.articl }}</td>
              <td>{{ prod.name }}</td>
              <td class='center'>шт</td>
              <td class='center'>{{ prod.product_kolvo }}</td>
              <td contenteditable="true" @keyup='e => editMove(inx, e.target)'>{{ prod.movind_kolvo }}</td>
            </tr>
          </table>
        </div>

        <div>
          <h3>Причина перемещения</h3>
          <textarea maxlength='250' class='textarea' v-model='description'></textarea>
        </div>

        <div class="block block_file">
          <input 
            type="file" 
            id='file' 
            hidden
            @change='e => addDock(e.target)'>
          <label 
            for='file' 
            class='btn-small append_file'>Прикрепить файл</label>
          <span v-if='formData.get("document")'>{{ formData.get('document').name }}</span>
        </div>

        <div class="btn-control out-btn-control">
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status" @click='destroyModalF'>Печать</button>
          <button class="btn-status btn-black" @click='save'>Создать перемещение</button>
        </div>
      </div>
    </div>
    <AddFile 
      :parametrs='docFiles' 
      v-if="isChangeFolderFile" 
      @unmount='unmount'
      :typeGetFile='"getfile"'
      :key='keyWhenModalGenerate' />
    <ModalUsersList 
      v-if='showModalUser'
      :key='keyModalUser'
      :get_one='true'
      @unmount='response_user_list'
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
<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import { mapActions, mapGetters } from 'vuex';
import AddFile from '@/components/filebase/addfile.vue';
import ModalUsersList from '@/components/users/modal-list-user.vue';
export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',   
      message: '',
      type: '',
      keyInformTip: random(1, 999),

      docFiles: [],
      keyWhenModalGenerate: random(1, 999),
      isChangeFolderFile: false,
      showModalUser: false, 
      keyModalUser: random(1, 999),
      formData: new FormData,

      cause: 'Возврат на склад (товар в годном сосотоянии)',
      to_user: null,
      from_user: null,
      to_sklad: false,
      from_sklad: false,
      description: '',
      from_is_to: '',

      all_product: [],
      new_arr_product: [],
    }
  },
  computed: mapGetters([
    'getOnePodMaterial',
    'allProduct',
  ]),
  components: {
    AddFile,
    ModalUsersList
  },
  methods: {
    ...mapActions([
      'fetchCreateMoving',
      'getAllProduct',
    ]),
    save() {
      if(!this.to_user && !this.to_sklad) return showMessage('', 'Выберите отправителя', 'w', this)
      if(!this.from_user && !this.from_sklad) return showMessage('', 'Выберите получателя', 'w', this)

      this.formData.append('arr_product', JSON.stringify(this.new_arr_product))
      this.formData.append('description', this.description)
      this.formData.append('to_user', this.to_user)
      this.formData.append('to_sklad', this.to_sklad)
      this.formData.append('from_user', this.from_user)
      this.formData.append('from_sklad', this.from_sklad)
      this.formData.append('cause', this.cause)

      this.fetchCreateMoving(this.formData)
    },
    response_user_list(user) {
      if(this.from_is_to == 'to') this.to_user = user
      if(this.from_is_to == 'from') this.from_user = user
    },
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    unmount(e) {
      if(!e) 
        return 0
      this.formData = e.formData
    },
    addDock(val) {
      val.files.forEach(f => {
        this.docFiles.push(f)
      })
      this.keyWhenModalGenerate = random(10, 1111)
      this.isChangeFolderFile = true
    },
    openUserModal(from_is_to) {
      this.from_is_to = from_is_to
      this.showModalUser = true
      this.keyModalUser = random(1, 999)
    },
    editVariables() {
      
    },
    editMove(inx, e) {
      if(!Number(e.innerText)) return false
      this.all_product[inx].movind_kolvo = Number(e.innerText)
      for(let prod in this.new_arr_product) {
        if(this.new_arr_product[prod].id ==  this.all_product[inx].id) 
          this.new_arr_product[prod].movind_kolvo = Number(e.innerText)
      }
    },
    toElements(prod, e) {
      e.classList.toggle('checkbox_block_select')
      for(let nap of this.new_arr_product) {
        if(nap.id == prod.id) {
          this.new_arr_product = this.new_arr_product.filter(p => p.id !== prod.id)
          return false
        }
      }
      this.new_arr_product.push(prod)
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    await this.getAllProduct()
    this.all_product = this.allProduct
    for(let prod in this.all_product) {
      this.all_product[prod].movind_kolvo = 0
    }
  },
}
</script>

<style scoped>
.append_file {
  margin: 20px;
  color: black;
  border: 1px solid rgba(160, 160, 160, 0.377);
  cursor: pointer;
  border-radius: 10px;
  padding: 10px;
  background: #e9e9e9;
}
.block_file {
  height: 30px;
  padding: 20px;
}
.textarea {
  margin: 10px;
  width: 48%;
  height: 120px;
}
.header_block * {
  margin-left: 6px;
}
.btn-file{
  color: black;
  background: #d3d3d3;
  padding: 6px;
  font-weight: normal;
  font-size: 16px;
  cursor: pointer;
}
.header_block {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.header_block>p:not(:last-child) {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.header_block input[type='text'] {
  width: 50%;
}
.block {
  margin-bottom: 10px;
}
table {
  width: 100%;
}
label {
  margin: 0px;
}
.two_header * {
  margin:4px;
}
.two_header input{
  width:23%;
}
.two_header  p {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  width: 50vw;
}
.left-block-modal {
  width: 50vw;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1vw;
  }
  to {
    width: 50vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 50vw;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 50vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 50vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>