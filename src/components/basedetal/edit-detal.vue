<template>
  <div class='main_block_content'>
    <div class="left_content">
      <h3>{{ $route.name }}</h3>
      <div class="block title_block">
        <p>
          <span>Артикул: </span><input type="text" v-model.trim='obj.articl'>
          <span>Наименование: </span><input type="text" v-model.trim='obj.name'>
          <span>Ответственный: </span>
          <select 
            class="select-small sle"  
            v-model='obj.responsible'>
            <option v-for='user in getUsers' 
              :key='user' 
              :value='user.id'>{{ user.login }}</option>
          </select> 
          <label class='label' for='attention'>Выделить</label>
          <input 
            type="checkbox" 
            id='attention' 
            v-model='attention'>
        </p>
      </div>

        <div class="content_left_block">
          <div class="content_left_block_left">
            <div>
              <h3>Комплектация </h3>
              <table class="tables_bf" >
                <tr>
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th>Ед.</th>
                  <th>Кол-вл</th>
                </tr>
                <tr>
                  <th colspan="4">Расходные материалы (Тип РМ)</th>
                </tr>
                <tr v-for='material in materialList' :key='material.mat'>
                  <td>{{ material.art }} </td>
                  <td>{{ material.mat.name }}</td>
                  <td> 
                    <span v-if="material.ez == 1"> шт</span> 
                    <span v-if="material.ez == 2"> л </span>
                    <span v-if="material.ez == 3"> кг</span> 
                    <span v-if="material.ez == 4"> м </span>
                    <span v-if="material.ez == 5"> м.куб</span>
                  </td>
                  <td>{{ material.kol }}</td>
                </tr>
              </table>
              <ModalBaseMaterial 
                :key='modalMaterialKey'
                v-if='modalMaterialIsShow'
                @unmount_material='unmount_material'
                :instanMaterial='3'
                :getOneMaterial='false'
                :allMaterial='materialList'
              />
              <div class="btn-control">
                <button class="btn-small btn-add" @click='addPokMat'>Добавить</button>
              </div>
            </div>
            <div>
              <h3>Описание / Примечание</h3>
              <textarea maxlength='250' class='textarea' v-model.trim='obj.description' cols="30" rows="10"></textarea>
            </div>
          </div>
          <div class="content_left_block_right">
            <div>
              <h3>Параметры детали</h3>
              <table class="tables_bf">  
                <tr>
                  <th>Наименование</th>
                  <th>ЕИ</th>
                  <th>Значение</th>
                </tr>
                <tr>
                  <td>Норма времени подготовительная (учитывается только один раз при изготовлении партии)</td>
                  <td class='td_center'>{{ obj.parametrs.preTime.ez }}</td>
                  <td class='td_center'>{{ obj.parametrs.preTime.znach }}</td>
                </tr>
                <tr>
                  <td>Норма времени вспомогателная</td>
                  <td class='td_center'>{{ obj.parametrs.helperTime.ez }}</td>
                  <td class='td_center'>{{ obj.parametrs.helperTime.znach }}</td>
                </tr>
                <tr>
                  <td>Норма времени основная</td>
                  <td class='td_center'>{{ obj.parametrs.mainTime.ez }}</td>
                  <td class='td_center'>{{ obj.parametrs.mainTime.znach }}</td>
                </tr>
              </table>
            </div>
            <div>
              <HaracteristicZag @unmount_har_zam='unmount_har_zam' :parametrs='{obj, mat_zag, mat_zag_zam}' v-if='show_harater_zag'/>
            </div>

            <h3 class="link_h3" @click='showTechProcess'>Технологический процес <span style='font-size:12px;'>
              ({{ getOneSelectDetal && getOneSelectDetal.techProcesses && getOneSelectDetal.techProcesses.operations ? 
                getOneSelectDetal.techProcesses.operations.length : '0' }} операции)</span></h3>
            <TechProcess 
              v-if='techProcessIsShow'
              :key='techProcessKey'
              @unmount='unmount_tech_process'
              :techProcessID='techProcessID'
            />
            <h3 class="link_h3">Себестоимость</h3>
            <h3 class="link_h3" @click='historyAction'>История изменений</h3>
            <h3 class="link_h3" @click='showModalNode'>Принадлежность</h3>
            <NodeParent
              v-if='getOneSelectDetal && show_node_modal'
              :izd='getOneSelectDetal'
              :key='key_node_modal'
              :no_show_det='"true"'
              :css='"full"'
              :title='" "'
              />
          </div>
        </div>
        <div class="btn-control out-btn-control control-save" v-if="getRoleAssets && getRoleAssets.assets.detalAssets.writeSomeone">
          <button 
            class="btn-status"
            @click='exit'
            >Отменить</button>
          <button class="btn-status btn-black" 
            style="height: 0px;" @click='saveDetal'>Сохранить</button>
          </div>
      </div>

    <div class="right_content">
      <div>
        <h3>Документы</h3>
        <div class="slider">
          <h3>Фото и видео</h3>
          <MediaSlider 
            v-if='dataMedia' 
            :static='true' 
            :data='dataMedia' 
            :key='randomDataMedia'
            :width='"width: 30%;"'
            :width_main='"width: 97%;"'
            />
        </div>
        <TableDocument v-if='documentsData.length' :title='""' :documents='documentsData' :key='table_document_key'  />
        <div class="btn-control" style='width: 100%;' v-if="getRoleAssets && getRoleAssets.assets.detalAssets.writeSomeone">
          <button class="btn-small" @click='addFileModal'>Добавить из базы</button>
        </div>
        <div style='height: 50px;'>
          <FileLoader 
            :typeGetFile='"getfile"'
            @unmount='file_unmount'/>
        </div>
      </div>
    </div>
    <HistoryActions 
      v-if='showHAction'
      :key='hAactionKey'
      :type='"Деталь"'
      :name='obj.name'
      :actions='actions'
    />
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
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
import { random, isEmpty } from 'lodash';
import PATH_TO_SERVER from '@/js/path.js';
import TechProcess from './tech-process-modal.vue';
import HaracteristicZag from './haracteristic-zag.vue';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import HistoryActions from '@/components/history-action.vue';
import NodeParent from '@/components/mathzag/table-node.vue';
import MediaSlider from '@/components/filebase/media-slider.vue';
import TableDocument from '@/components/filebase/table-document.vue';
import BaseFileModal from '@/components/filebase/base-files-modal.vue';
import ModalBaseMaterial from '@/components/mathzag/modal-base-material.vue';
export default {
  props: ['editAndCopt'],
  data() {
    return {
      obj: {
        articl: '',
        name: '',
        responsible: '',
        description: '',
        parametrs: {
          preTime: {ez: 'ч', znach: ''},
          helperTime: {ez: 'ч', znach: ''},
          mainTime: {ez: 'ч', znach: ''}
        },
        haracteriatic: [
          { name: 'Масса детали', ez: 'кг', znach: 0}
        ],
        DxL: 'x',

        diametr: '',
				lengt: '',
				height: '',
				thickness: '',
				wallThickness: '',
				width: '',
				areaCS: '',

        massZag: '',
        trash: ''
      },
      showModalFile: false,
      fileModalKey: random(1, 999),
      show_node_modal: false, 
      key_node_modal: random(1, 999),
      formData: null,
      modalMaterialKey: random(10, 999),
      modalMaterialIsShow: false,
      mat_zag: 'Задать', 
      mat_zag_zam: 'Задать', 
      materialList: [],
      selectHaracteristic: null,
      techProcessIsShow: false,
      techProcessKey: random(10, 999),
      inputMassZag: 0,
      techProcessID: localStorage.getItem('tpID') || null,
      id: null,
      documentsData: [],
      dataMedia: [],
      randomDataMedia: random(10, 999),
      attention: false,

      showHAction: false,
      hAactionKey: random(1, 999),
      table_document_key: random(10, 999),

      actions: [],
 
      titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,
      data_arr: [],
      loader: false,
      show_harater_zag: false
    }
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
  computed: mapGetters(['getOneSelectDetal', 'getUsers', 'getRoleAssets']),
  components: {
    BaseFileModal, 
    ModalBaseMaterial, 
    TechProcess, 
    MediaSlider, 
    HaracteristicZag,
    TableDocument,
    HistoryActions,
    NodeParent,
  },
  methods: {
    ...mapActions([
      'createNewDetal', 
      'fetchUpdateDetal', 
      'getAllUsers', 
      'createNewDetal',
      'fetchAddFilesForDetal',
      'getAllDetalsArticl']),
    ...mapMutations(['delitPathNavigate']),
    unmount_filemodal(res) {
      if(res) 
        this.documentsData = res;
    },
    unmount_har_zam(obj) {
      this.obj.DxL = obj.DxL;
      this.obj.diametr = obj.diametr;
      this.obj.lengt = obj.lengt;
      this.obj.height = obj.height;
      this.obj.thickness = obj.thickness;
      this.obj.wallThickness = obj.wallThickness;
      this.obj.width = obj.width;
      this.obj.areaCS = obj.areaCS;

      this.obj.massZag = obj.massZag;
      this.obj.trash = obj.trash;
      this.obj.haracteriatic = obj.haracteriatic;
      this.mat_zag = obj.mat_zag;
      this.mat_zag_zam = obj.mat_zag_zam;
    },
    file_unmount(e) { 
      if(!e) 
        return 0
      this.formData = e.formData
    },
    unmount_material(mat) {
      if(mat)
        this.materialList = mat.materialList
    },
    unmount_tech_process(tp) {
      if(tp.id) {
        this.techProcessID = tp.id
        localStorage.setItem('tpID', this.techProcessID)
        if(tp.opers.length) {
          this.obj.parametrs.preTime.znach = 0
          this.obj.parametrs.helperTime.znach = 0
          this.obj.parametrs.mainTime.znach = 0
          tp.opers.forEach(op => {
            this.obj.parametrs.preTime.znach = Number(this.obj.parametrs.preTime.znach) + Number(op.preTime)
            this.obj.parametrs.helperTime.znach = Number(this.obj.parametrs.helperTime.znach) + Number(op.helperTime)
            this.obj.parametrs.mainTime.znach = Number(this.obj.parametrs.mainTime.znach) + Number(op.mainTime)
          })
          this.obj.parametrs.preTime.znach = (this.obj.parametrs.preTime.znach / 60).toFixed(2)
          this.obj.parametrs.helperTime.znach = (this.obj.parametrs.helperTime.znach / 60).toFixed(2)
          this.obj.parametrs.mainTime.znach = (this.obj.parametrs.mainTime.znach / 60).toFixed(2)
        }
      }
    },
    saveDetal() {
      if(this.obj.diametr == '0' || this.obj.lengt == '0' || this.obj.height == '0' || this.obj.thickness == '0' || this.obj.wallThickness == '0' || this.obj.width == '0' || this.obj.areaCS == '0') {
        return showMessage('', 'Заполните все поля для характеристик заготовки', 'w', this);
      }

      if(this.obj.name.length < 3) 
        return 0

      if(!this.formData)
        this.formData = new FormData()

      this.formData.append('techProcessID', this.techProcessID || null);
      this.formData.append('name', this.obj.name);
      this.formData.append('articl', this.obj.articl);
      this.formData.append('responsible', this.obj.responsible);
      this.formData.append('description', this.obj.description);
      this.formData.append('parametrs', JSON.stringify(this.obj.parametrs));
      this.formData.append('haracteriatic', JSON.stringify(this.obj.haracteriatic));
      this.formData.append('DxL', this.obj.DxL);

      this.formData.append('diametr', this.obj.diametr);
      this.formData.append('lengt', this.obj.lengt);
      this.formData.append('height', this.obj.height);
      this.formData.append('thickness', this.obj.thickness);
      this.formData.append('wallThickness', this.obj.wallThickness);
      this.formData.append('width', this.obj.width);
      this.formData.append('areaCS', this.obj.areaCS);

      this.formData.append('massZag', this.obj.massZag);
      this.formData.append('trash', this.obj.trash);
      this.formData.append('attention', this.attention);
      this.formData.append('id', this.id);

      if(this.documentsData.length) {
        let new_array = []
        for(let inx in this.documentsData) {
          new_array.push(this.documentsData[inx].id)
        }
        this.formData.append('file_base', JSON.stringify(new_array))
      }

      this.formData.append('mat_zag', this.mat_zag != 'Задать' ?
        this.mat_zag.id : '')
      this.formData.append('mat_zag_zam', this.mat_zag_zam != 'Задать' ?
         this.mat_zag_zam.id : '')

      if(this.materialList.length > 0) {
        for(let mat = 0; mat < this.materialList.length; mat++) {
          this.materialList[mat].mat = {
            id: this.materialList[mat].mat.id,
            name: this.materialList[mat].mat.name,
            kol: this.materialList[mat].mat.kolvo
          }
          if(mat == this.materialList.length - 1) {
            this.formData.append('materialList', JSON.stringify(this.materialList))
            if(this.$props.editAndCopt == 'true') {
              this.clearData()
              this.createNewDetal(this.formData).then(res => {
                if(res)
                  showMessage('', 'Деталь усешно создана. Перенаправление на главную страницу...', 's', this)
              })
              return 
            }
            this.fetchUpdateDetal(this.formData).then(res => {
              if(res) 
                showMessage('', 'Деталь усешно обновлена. Перенаправление на главную страницу...', 's', this)
            })
          }
        }
      } else {
        if(this.$props.editAndCopt == 'true') {
          this.clearData()
          this.createNewDetal(this.formData).then(res => {
            if(res)
              showMessage('', 'Деталь усешно создана. Перенаправление на главную страницу...', 's', this)
          })
          return 
        }
        this.fetchUpdateDetal(this.formData).then(res => {
          if(res) 
            showMessage('', 'Деталь усешно обновлена. Перенаправление на главную страницу...', 's', this)
        })
      }

      this.clearData()
    },
    clearData() {
      setTimeout(() =>  this.$router.push('/basedetals'), 3000);
      this.delitPathNavigate(this.$route.path);
    },
    addPokMat() {
      this.modalMaterialKey = random(10, 999)
      this.modalMaterialIsShow = true
    },
    showTechProcess() {
      this.techProcessIsShow = true
      this.techProcessKey = random(1, 999)
    },
    exit(){
      this.$router.push("/basedetals");
      this.delitPathNavigate(this.$route.path);
    },
    historyAction() {
      if(!this.actions.length)
        return
      this.hAactionKey = random(1, 888)
      this.showHAction = true
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
    if(isEmpty(this.getOneSelectDetal)){
      this.$router.push('/basedetals')
      return 0
    }
    if(this.getOneSelectDetal.actions)
      this.actions = this.getOneSelectDetal.actions

    this.loader = true
    await this.getAllUsers(true)
        
    this.obj.articl = this.getOneSelectDetal.articl
    this.obj.name = this.getOneSelectDetal.name
    this.obj.description = this.getOneSelectDetal.description   
    this.obj.parametrs = JSON.parse(this.getOneSelectDetal.parametrs)
    this.obj.DxL = this.getOneSelectDetal.DxL

     console.log(this.getOneSelectDetal)

    this.obj.diametr = this.getOneSelectDetal.diametr
    this.obj.lengt = this.getOneSelectDetal.lengt
    this.obj.height = this.getOneSelectDetal.height
    this.obj.thickness = this.getOneSelectDetal.thickness
    this.obj.wallThickness = this.getOneSelectDetal.wallThickness
    this.obj.width = this.getOneSelectDetal.width
    this.obj.areaCS = this.getOneSelectDetal.areaCS

    this.obj.massZag = this.getOneSelectDetal.massZag
    this.obj.trash = this.getOneSelectDetal.trash
    this.attention = this.getOneSelectDetal.attention
    this.obj.haracteriatic = JSON.parse(this.getOneSelectDetal.haracteriatic)
    this.obj.responsible = this.getOneSelectDetal.user ? 
      this.getOneSelectDetal.user.id : null
    if(this.getOneSelectDetal.materials.length) {
      this.getOneSelectDetal.materials.forEach(e => {
        if(this.getOneSelectDetal.mat_zag && this.getOneSelectDetal.mat_zag == e.id)
          this.mat_zag = e
        if(this.getOneSelectDetal.mat_zag_zam && this.getOneSelectDetal.mat_zag_zam == e.id)
          this.mat_zag_zam = e
      })
    }
    if(this.getOneSelectDetal.techProcesses && this.$props.editAndCopt == 'false') {
      this.techProcessID = this.getOneSelectDetal.techProcesses.id
    }
    if(this.getOneSelectDetal.materialList && this.getOneSelectDetal.materialList.length) {
      this.materialList = JSON.parse(this.getOneSelectDetal.materialList)
    }
    this.id = this.getOneSelectDetal.id

    this.documentsData = this.getOneSelectDetal.documents
    this.getOneSelectDetal.documents.forEach(d => {
      this.dataMedia.push({path: PATH_TO_SERVER+d.path, name: d.name, banned: d.banned})
    })
    this.randomDataMedia = random(10, 999)
    this.show_harater_zag = true

    this.data_arr = await this.getAllDetalsArticl()
    this.loader = false
  }
}
</script>

<style scoped>
.sle {
  background-color: white;
}
select {
  width: 100px;
}
.right_content>div {
  margin-top: 100px;
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
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.title_block p * {
  margin-left: 5px;
}
.title_block input[type='text']{
  width: 190px;
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
.main_block_content {
  display: flex;
}
textarea {
  width: 100%;
}
.right_content {
  padding: 10px;
  margin-top: 20px;
}
.right_content h3 {
  margin-left: 40px;
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
</style>