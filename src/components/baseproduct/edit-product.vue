<template>
  <div class='main_block_content'>
    <h3>{{ $route.name }}</h3>
    <div class="block title_block">
      <p><span>Заводской номер: </span><input type="text" v-model.trim='obj.fabricNumber'></p>
      <p><span>Артикул: </span><input type="text" v-model.trim='obj.articl'></p>
      <p><span>Наименование: </span><input type="text" v-model.trim='obj.name'></p>
      <span>Ответственный: </span>
        <select class="select-small sle"  
          v-model='obj.responsible'>
          <option  
          v-for='user in getUsers' 
          :key='user' 
          :value='user.id'>{{ user.login }}</option>
        </select>  
      <p>
        <label class='label' for='attention'>Выделить</label>
        <input 
          type="checkbox" 
          id='attention' 
          v-model='attention'>
      </p>
    </div>
    <div class="content_block">
      <div class="left_content">
        <div class="content_left_block">
          <div class="content_left_block_left">
            <div>
              <h3>Комплектация </h3>
              <TableSpetification
                :listCbed='listCbed'
                :listDetal='listDetal'
                :listPokDet='listPokDet'
                :materialList='materialList'
                :izd='getOneSelectProduct'
              />
              <ModalBaseMaterial 
                :key='modalMaterialKey'
                v-if='modalMaterialIsShow'
                @unmount_material='unmount_material'
                :instanMaterial='instanMaterial'
                :getOneMaterial='false'
                :allMaterial='listMaterials' 
              /> 
              <BaseDetalModal 
                v-if='showBFM'
                :key='generateKeyBFM'
                @responsDetal='responsDetal'
                :getListDetal='true'
                :listDetal='listDetal'
              />
              <div class="btn-control">
                <select class="btn-add select-small" 
                  v-model='select_model'
                  @change='changeSelected'>
                    <option value="1">Добавить</option>
                    <option value="2">Сборочную единицу (тип СБ)</option>
                    <option value="3">Деталь (тип Д)</option>
                    <option value="4">Стандартную или покупную деталь (тип ПД)</option>
                    <option value="5" >Расходный материал (тип РМ)</option>
                </select>
              </div>
               <div>
              <h3>Параметры</h3>
              <table class="tables_bf"> 
                <tr>
                  <th>Наименование</th> 
                  <th>ЕИ</th>
                  <th>Значение</th>
                </tr>
                <tr class='tr_haracteristic td-row' 
                    v-for='(par, inx) in obj.parametrs' 
                    :key='par'
                    @click='selectParametrs = {par, inx}'
                    >
                  <td>
                    <input 
                      type="text" 
                      :value='par.name' 
                      class='inputs-small'
                      @change='e => changeParametrs(e.target.value, "name", inx)'></td>
                  <td>
                    <input 
                      type="text" 
                      :value='par.ez'
                      style="width: 50px; text-align:center;"
                      class='inputs-small small'
                      @change='e => changeParametrs(e.target.value, "ez", inx)'></td>
                  <td>
                    <input 
                      type="text" 
                      :value='par.znach'
                      style="width: 50px; text-align:center;"
                      class='inputs-small'
                      @change='e => changeParametrs(e.target.value, "znach", inx)'></td>
                </tr>
              </table>
              <div class="btn-control">
                <button class="btn-add btn-small" @click='addParametrs'>Добавить</button>
                <button class="btn-small" @click='removeParametrs'>Удалить</button>
              </div>
            </div>
            </div>
          </div>
          <div class="content_left_block_right">
            <div>
              <h3>Описание / Примечание</h3>
              <textarea maxlength='250' class='textarea' v-model.trim='obj.description' cols="30" rows="10"></textarea>
            </div>
            <div>
              <TableDocument 
              v-if='documentsData.length' 
              :title='""' 
              :documents='documentsData' 
              :key='table_document_key'/>
            </div>
            <div>
              <h3>Документы</h3>
              <div style='height: 50px;'>
                <FileLoader 
                  :typeGetFile='"getfile"'
                  @unmount='file_unmount'/>
              </div>
              <div class="btn-control" style='margin-top: 20px;'>
                <button class="btn-small" @click='addFileModal' >Добавить из базы</button>
              </div>
            </div>
            <h3 class="link_h3" @click='showTechProcess' style='margin-top: 50px;'>Технологический процес
              <span style='font-size:12px;'>
              ({{ getOneSelectProduct && getOneSelectProduct.techProcesses && getOneSelectProduct.techProcesses.operations ? 
                getOneSelectProduct.techProcesses.operations.length : '0' }} операции)</span>
            </h3>
            <TechProcess 
              v-if='techProcessIsShow'
              :key='techProcessKey'
              @unmount='unmount_tech_process'
              :techProcessID='techProcessID'
            />
            <h3 class="link_h3">Себестоимость</h3>
            <h3 class="link_h3">История изменений</h3>
          </div>
        </div>
        <div class="btn-control out-btn-control control-save" v-if="getRoleAssets && getRoleAssets.assets.productAssets.writeSomeone" >
          <button 
            class="btn-status"
            @click='exit'
            >Отменить</button>
          <button class="btn-status btn-black" 
            style="height: 0px;" @click='saveProduct'>Сохранить</button>
          </div>
      </div>

    <div class="right_content">
      <div v-if='dataMedia'>
        <h3>Медиа файлы</h3>
        <MediaSlider 
          v-if='dataMedia' 
          :static='true' 
          :data='dataMedia' 
          :key='randomDataMedia'
          :width='"width: 30%;"'
          :width_main='"width: 97%;"'
          />
      </div>
        <div>
          <h3>Характеристики</h3>
          <table class="tables_bf">
            <tr>
              <th>Наименование</th> 
              <th>ЕИ</th>
              <th>Значение</th>
            </tr> 
            <tr class='tr_haracteristic td-row' 
                v-for='(har, inx) in obj.haracteriatic' 
                :key='har'
                @click='selectHaracteristic = {har, inx}'
                >
              <td>
                <input 
                  type="text" 
                  :value='har.name' 
                  class='inputs-small'
                  @change='e => changeHaracteristic(e.target.value, "name", inx)'></td>
              <td>
                <input 
                  type="text" 
                  :value='har.ez'
                  style="width: 50px; text-align:center;"
                  class='inputs-small small'
                  @change='e => changeHaracteristic(e.target.value, "ez", inx)'></td>
              <td>
                <input 
                  type="text" 
                  :value='har.znach'
                  style="width: 50px; text-align:center;"
                  class='inputs-small'
                  @change='e => changeHaracteristic(e.target.value, "znach", inx)'></td>
            </tr>
          </table>
          <div class="btn-control">
            <button class="btn-add btn-small" @click='addHaracteristic'>Добавить</button>
            <button class="btn-small" @click='removeHaracteristic'>Удалить</button>
          </div>
        </div>
        <h3 class="link_h3" @click='showModalNode'>Принадлежность</h3>
        <NodeParent
          v-if='getOneSelectProduct && show_node_modal'
          :izd='getOneSelectProduct'
          :key='key_node_modal'
          :no_show_det='"true"'
          :no_show_cb='"true"'
          :css='"full"'
          :title='" "'
          />
    </div>
    </div>
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
    <BaseCbedModal 
      v-if='showCbed'
      :key='generateKeyCbed'
      @responsCbed='responsCbed'
      :getListCbed='true'
      :listCbed='listCbed'
    />
    <BaseFileModal 
      v-if='showModalFile'
      :key='fileModalKey'
      :fileArrModal='documentsData'
      @unmount='unmount_filemodal'
      :search='this.obj.articl'
    />
    <Loader v-if='loader' /> 
  </div>
</template>
<script>
import { showMessage } from '@/js/';
import PATH_TO_SERVER from '@/js/path';
import { random, isEmpty } from 'lodash';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import NodeParent from '@/components/mathzag/table-node.vue';
import MediaSlider from '@/components/filebase/media-slider.vue';
import BaseCbedModal from '@/components/cbed/base-cbed-modal.vue';
import TableDocument from '@/components/filebase/table-document.vue';
import BaseFileModal from '@/components/filebase/base-files-modal.vue';
import TechProcess from '@/components/basedetal/tech-process-modal.vue';
import BaseDetalModal from '@/components/basedetal/base-detal-modal.vue';
import TableSpetification from '@/components/cbed/table-sptification.vue';
import ModalBaseMaterial from '@/components/mathzag/modal-base-material.vue';
export default {
  data() {
    return {
      obj: {
        articl: '', 
        name: '',
        responsible: '',
        description: '',
        parametrs: [
          { name: 'Норма времени на сборку', ez: 'ч', znach: 0 }
        ],
        haracteriatic: [
          { name: 'Рекомендуемый остаток', ez: 'шт', znach: 0},
          { name: 'Минимальный остаток', ez: 'шт', znach: 0}
        ],
        fabricNumber: ''
      },
      docFiles: [],
      formData: null,
      modalMaterialKey: random(10, 999),
      modalMaterialIsShow: false,
      materialList: [],
      listPokDet: [],
      listDetal: [],
      listCbed: [],

      listMaterials: [],

      selectHaracteristic: null,
      selectParametrs: null,

      techProcessIsShow: false,
      techProcessKey: random(10, 999),
      inputMassZag: 0,
      variableDensity: 0,
      techProcessID: localStorage.getItem('tpID') || null,

      titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,
      attention: false,

      select_model: 1,

      showBFM: false,
      generateKeyBFM: random (1, 999),
      show_node_modal: false, 
      key_node_modal: random(1, 999),

      showCbed: false,
      generateKeyCbed: random(1, 999),

      id: null,
      documentsData: [],
      dataMedia: [],
      randomDataMedia: random(10, 999),

      table_document_key: random(10, 999),

      showModalFile: false,
      fileModalKey: random(1, 999),
      data_arr: [],
      loader: false
    }
  },
  unmounted() {
    this.deleteStorageData()
  },
  watch: {
    'obj.articl': function (val, last_val) {
      if(!last_val) return false;
      for(let art of this.data_arr) {
				if(art.articl.toLowerCase() == val.trim().toLowerCase()) 
					return showMessage('', 'Объект с такими характеристиками уже существует', 'w', this)
			}
    },
    'documentsData.length': function () {
      this.table_document_key = random(1, 999)
    }
  },
  computed: mapGetters(['getUsers', 'getOneSelectProduct', 'getRoleAssets']),
  components: {
    ModalBaseMaterial, 
    TechProcess, 
    BaseDetalModal, 
    BaseCbedModal,
    MediaSlider,
    BaseFileModal,
    TableDocument,
    TableSpetification,
    NodeParent
  },
  methods: {
    ...mapActions([
      'createNewProduct', 
      'getAllUsers', 
      'updateProduct', 
      'getAllArticlProduct'
    ]),
    ...mapMutations(['removeOperationStorage', 'delitPathNavigate']),
     unmount_tech_process(tp) {
      if(tp.id) {
        this.techProcessID = tp.id
        localStorage.setItem('tpID', this.techProcessID)
        if(tp.opers.length) {
          this.obj.parametrs[0].znach = 0
          tp.opers.forEach(op => {
            this.obj.parametrs[0].znach = 
              Number(this.obj.parametrs[0].znach) + (Number(op.preTime) + Number(op.helperTime) + Number(op.mainTime)) 
          })
          this.obj.parametrs[0].znach = (this.obj.parametrs[0].znach / 60).toFixed(2)
        }
      }
    },
    unmount_filemodal(res) {
      if(res) 
        this.documentsData = res
    },
    file_unmount(e) { 
      if(!e) 
        return 0
      this.formData = e.formData
    },
    unmount_material(mat) {
      if(this.instanMaterial == 2) {
        this.listPokDet = mat.materialList
      }
      if(this.instanMaterial == 3) {
        this.materialList = mat.materialList
      }
    },
    saveProduct() {
      if(this.obj.name.length < 3) 
        return showMessage('', 'Наименование должно быть длинее или равно 2-м символам', 'w', this)

      if(!this.formData)
        this.formData = new FormData()

      this.formData.append('techProcessID', this.techProcessID || null)
      this.formData.append('name', this.obj.name)
      this.formData.append('articl', this.obj.articl)
      this.formData.append('responsible', this.obj.responsible)
      this.formData.append('description', this.obj.description)
      this.formData.append('parametrs', JSON.stringify(this.obj.parametrs))
      this.formData.append('haracteriatic', JSON.stringify(this.obj.haracteriatic))
      this.formData.append('fabricNumber', this.obj.fabricNumber)
      this.formData.append('attention', this.attention)

      if(this.listDetal.length)
        this.formData.append('listDetal', JSON.stringify(this.listDetal))
      if(this.listCbed.length)
        this.formData.append('listCbed', JSON.stringify(this.listCbed))

      for(let mat = 0; mat < this.listPokDet.length; mat++) {
        this.listPokDet[mat].mat = {
          id: this.listPokDet[mat].mat.id,
          name: this.listPokDet[mat].mat.name,
          kol: this.listPokDet[mat].mat.kolvo
        }
        if(mat == this.listPokDet.length - 1) {
          this.formData.append('listPokDet', JSON.stringify(this.listPokDet))
        }
      }
      
      for(let mat = 0; mat < this.materialList.length; mat++) {
          this.materialList[mat].mat = {
          id: this.materialList[mat].mat.id,
          name: this.materialList[mat].mat.name,
          kol: this.materialList[mat].mat.kolvo
          }
          if(mat == this.materialList.length - 1) {
            this.formData.append('materialList', JSON.stringify(this.materialList))
          }
      }

      if(this.documentsData.length) {
        let new_array = []
        for(let inx in this.documentsData) {
          new_array.push(this.documentsData[inx].id)
        }
        this.formData.append('file_base', JSON.stringify(new_array))
      }

      if(this.$route.params.copy == 'false')  { 
        this.formData.append('id', this.id)
        showMessage('', 'Изделие усешно обновлена. Перенаправление на главную страницу...', 's', this)
        this.updateProduct(this.formData)
      } else {
        showMessage('', 'Изделие усешно создано. Перенаправление на главную страницу...', 's', this)
        this.createNewProduct(this.formData)
      }

      this.deleteStorageData()
      setTimeout(() =>  {
        this.$router.back()
        this.delitPathNavigate(this.$route.path)
      }, 3000)
      
    },
    changeSelected() {
      switch (this.select_model) {
        case '2':
          this.showCbed = true;
          this.generateKeyCbed = random(1, 999)
          break;
        case '3':
          this.showBFM = true
          this.generateKeyBFM = random(1, 999)
          break;
        case '4':
          this.instanMaterial = 2
          this.listMaterials = this.listPokDet
          this.modalMaterialKey = random(10, 999)
          this.modalMaterialIsShow = true
          break;
        case '5':
          this.instanMaterial = 3
          this.listMaterials = this.materialList
          this.modalMaterialKey = random(10, 999)
          this.modalMaterialIsShow = true
          break;
      }
      this.select_model = 1;
    },
    responsDetal(detal) {
      this.listDetal = detal
    },
    addHaracteristic() {
      this.obj.haracteriatic.push({name: '', ez: '', znach: ''})
    },
    addParametrs() {
      this.obj.parametrs.push({name: '', ez: '', znach: ''})
    },
    removeHaracteristic() {
      if(this.selectHaracteristic) {
        this.obj.haracteriatic.splice(this.selectHaracteristic.inx, 1)
        this.selectHaracteristic = null
      }
    },
    removeParametrs() {
      if(this.selectParametrs) {
        this.obj.parametrs.splice(this.selectParametrs.inx, 1)
        this.selectParametrs = null
      }
    },
    changeHaracteristic(val, inst, inx) {
      if(inst == 'name')  
        this.obj.haracteriatic[inx].name = val
      if(inst == 'ez')  
        this.obj.haracteriatic[inx].ez = val
      if(inst == 'znach')  {
        this.obj.haracteriatic[inx].znach = val
      }
    },
    changeParametrs(val, inst, inx) {
      if(inst == 'name')  
        this.obj.parametrs[inx].name = val
      if(inst == 'ez')  
        this.obj.parametrs[inx].ez = val
      if(inst == 'znach')  {
        this.obj.parametrs[inx].znach = val
      }
    },
    showTechProcess() {
      this.techProcessIsShow = true
      this.techProcessKey = random(1, 12e8)
    },

    exit(){
      this.$router.back()
      this.deleteStorageData()
      this.delitPathNavigate(this.$route.path)
    },
    responsCbed(res) {
      this.listCbed = res 
    },
    updateForEdit() {
      this.attention = this.getOneSelectProduct.attention
      this.obj.name = this.getOneSelectProduct.name
      this.obj.articl = this.getOneSelectProduct.articl
      this.obj.responsible = this.getOneSelectProduct.user ? this.getOneSelectProduct.user.id :  null
      this.obj.description = this.getOneSelectProduct.description
      this.obj.parametrs = JSON.parse(this.getOneSelectProduct.parametrs)
      this.obj.haracteriatic = JSON.parse(this.getOneSelectProduct.haracteriatic)
      this.materialList = this.getOneSelectProduct.materialList ? JSON.parse(this.getOneSelectProduct.materialList) : []
      this.listPokDet = this.getOneSelectProduct.listPokDet ? JSON.parse(this.getOneSelectProduct.listPokDet) : []
      this.listDetal = this.getOneSelectProduct.listDetal ? JSON.parse(this.getOneSelectProduct.listDetal) : []
      this.listCbed = this.getOneSelectProduct.listCbed ? JSON.parse(this.getOneSelectProduct.listCbed) : []
      this.obj.fabricNumber = this.getOneSelectProduct.fabricNumber

      if(this.$route.params.copy == 'false')  {
        this.documentsData = this.getOneSelectProduct.documents
        this.getOneSelectProduct.documents.forEach((d) => {
            this.dataMedia.push({path: PATH_TO_SERVER+d.path, name: d.name})
        })
        this.randomDataMedia = random(10, 999) 

        this.techProcessID = !isEmpty(this.getOneSelectProduct.techProcesses) ? this.getOneSelectProduct.techProcesses.id : null

        this.id = this.getOneSelectProduct.id
      }
    },
    deleteStorageData() {
      localStorage.removeItem("tpID")
      this.removeOperationStorage()
    },
    addFileModal() {
      this.fileModalKey = random(1, 999)
      this.showModalFile = true
    },
    showModalNode() {
      this.show_node_modal = !this.show_node_modal
      this.key_node_modal = random(1, 999)
    }
  },
  async mounted() {
    if(isEmpty(this.getOneSelectProduct)) {
      this.$router.back()
      return 
    } 

    this.loader = true
    await this.getAllUsers(true)
    this.data_arr = await this.getAllArticlProduct()
    this.loader = false

    this.updateForEdit()
  }
}
</script>

<style scoped>
.sle {
  background-color: white;
}
.content_block {
  display: flex;
}
.absolute_znach {
  position: absolute;
  margin-left: 90px;
  margin-top: -21px;
  user-select: none;
}
.control-save{
  width: 60%; 
  position:fixed; 
  bottom: 10px;
  background-color: white;
}
.small {
  width: 120px;
}
.tr_haracteristic td {
  height: 10px;
}
.td_center {
  text-align: center;
}
.title_block{
  display: flex;
}
.title_block * {
  margin-left: 5px;
}
.title_block>div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.title_block input[type='text']{
  width: 190px;
}
.title_block  {
  height: 47px;
  display: flex;
  align-items: center;
}
.content_left_block {
  width: 100%;
  display: flex;
}
.content_left_block>div {
  margin: 10px;
}
.tables_bf th {
  width: 100%
}
.content_left_block_left {
  width: 50%;
}
.content_left_block_right{
  width: 50%;
}
.left_content {
  width: 1050px;
}
textarea {
  width: 100%;
}
.right_content {
  padding: 10px;
}
.td_link {
  cursor: pointer;
  user-select: none;
  text-decoration: underline;
  color: rgb(17, 90, 124);
  font-size: 14px;
  text-align: center;
  font-weight: bold;
}
.td_link:hover {
  color: rgb(36, 140, 189);
}
.select-small {
  width: 110px;
}
</style>