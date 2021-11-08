<template>
  <div class='main_block_content'>
    <div class="left_content">
      <h3>Создать деталь</h3>
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
                :instanMaterial='instanMaterial'
                :getOneMaterial='getOneMaterial'
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
              <h3>Характеристики детали</h3>
              <table class="tables_bf">
                <tr>
                  <th>Наименование</th>
                  <th>ЕИ</th>
                  <th>Значение</th>
                </tr>
                <tr class='tr_haracteristic td-row' 
                    v-for='(har, inx) in obj.haracteriatic' 
                    :key='har'
                    @click='selectHaracteristicFunction(har, inx)'
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
                <button class="btn-sma" @click='removeHaracteristic'>Удалить</button>
              </div>
            </div>
            <div>
              <h3>Характеристики заготовки</h3>
              <table class="tables_bf">
                <tr>
                  <th>Наименование</th>
                  <th>ЕИ</th>
                  <th>Значение</th>
                </tr>
                <tr>
                  <td>Материал заготовки</td>
                  <td>шт</td>
                  <td class='td_link' @click='getMaterialForDetal' v-text='mat_zag.name || mat_zag' ></td>
                </tr>
                <tr>
                  <td>Материал заготовки(Заменитель)</td>
                  <td>шт</td>
                  <td class='td_link' @click='getMaterialForDetal("zam")' v-text='mat_zag_zam.name || mat_zag_zam' ></td>
                </tr>
                <tr>
                  <td>Размер заготовки DxL</td>
                  <td class='td_center'>мм</td>
                  <td class='td_center'>
                    <input type="text"
                        @change='e=>editHarZag(e.target.value, "DxL")'
                        style="width: 50px; text-align:center;"
                        class='inputs-small'
                        v-model='obj.DxL'>
                    <div class='absolute_znach'>
                        {{ obj.DxL.split('x')
                            .length == 2 ? 
                        `=${obj.DxL.split('x')[0] * obj.DxL.split('x')[1]}`
                        : ''
                        }}
                      </div>
                  </td>
                </tr>
                <tr>
                  <td>Расчетная масса заготовки</td>
                  <td class='td_center'>кг</td>
                  <td class='td_center'>
                    <input type="text"
                      @change='e=>editHarZag(e.target.value, "mass")'
                      style="width: 50px; text-align:center;"
                      class='inputs-small'
                      v-model='obj.massZag'>
                  </td>
                </tr>
                <tr>
                  <td>Отходы</td>
                  <td class='td_center'>кг</td>
                  <td class='td_center'>
                    <input type="text"
                      @change='e=>editHarZag(e.target.value, "trash")'
                      style="width: 50px; text-align:center;"
                      class='inputs-small'
                      v-model='obj.trash'>
                  </td>
                </tr>
              </table>
            </div>

            <h3 class="link_h3" @click='showTechProcess'>Технологический процес</h3>
            <TechProcess 
              v-if='techProcessIsShow'
              :key='techProcessKey'
              @unmount='unmount_tech_process'
              :techProcessID='techProcessID'
            />
            <h3 class="link_h3">Себестоимость</h3>
            <h3 class="link_h3" @click='historyAction'>История изменений</h3>
            <h3 class="link_h3">Принадлежность</h3>
          </div>
        </div>
        <div class="btn-control out-btn-control control-save" v-if="getRoleAssets && getRoleAssets.assets.detalAssets.writeSomeone">
          <button class="btn-status"
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
          <table style='width: 100%;'>
            <tr>
              <th >Файл</th>
            </tr>
            <tr 
              v-for='doc in  documentsData' 
              :key='doc'
              class='td-row'
              @click='setDocs(doc)'
              >
              <td>{{ doc.name }}</td>
            </tr>
          </table>
          <div class="btn-control" style='width: 100%;' v-if="getRoleAssets && getRoleAssets.assets.detalAssets.writeSomeone">
            <!-- <button class="btn-small">Удалить</button> -->
            <button class="btn-small" @click='addFileModal' >Добавить из базы</button>
          </div>
        <div style='height: 50px;'>
          <FileLoader 
            :typeGetFile='"getfile"'
            @unmount='file_unmount'/>
        </div>
          <OpensFile 
            :parametrs='itemFiles' 
            v-if="itemFiles" 
            :key='keyWhenModalGenerateFileOpen'
          />
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
      v-if='showInformPanel'
      :key='keyInformTip'
    />
    <BaseFileModal 
      v-if='showModalFile'
      :key='fileModalKey'
      :fileArrModal='fileArrModal'
      @unmount='unmount_filemodal'
      :search='this.obj.articl'
  />
  </div>
</template>

<script>
import ModalBaseMaterial from '@/components/mathzag/modal-base-material.vue';
import TechProcess from './tech-process-modal.vue';
import { random, padStart, padEnd, isNaN } from 'lodash';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import PATH_TO_SERVER from '@/js/path.js';
import { isEmpty } from 'lodash';
import MediaSlider from '@/components/filebase/media-slider.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import HistoryActions from '@/components/history-action.vue';
import { showMessage } from '@/js/';
import InformFolder from '@/components/InformFolder.vue';
import BaseFileModal from '@/components/filebase/base-files-modal.vue';
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
        massZag: '',
        trash: ''
      },
      showModalFile: false,
      fileModalKey: random(1, 999),
      fileArrModal: [],
      formData: null,
      modalMaterialKey: random(10, 12e8),
      modalMaterialIsShow: false,
      instanMaterial: 3,
      mat_zag: 'Задать', 
      mat_zag_zam: 'Задать', 
      getOneMaterial: false,
      materialList: [],
      selectHaracteristic: null,
      techProcessIsShow: false,
      techProcessKey: random(10, 33e6),
      inputMassZag: 0,
      techProcessID: localStorage.getItem('tpID') || null,
      id: null,
      documentsData: [],
      dataMedia: [],
      randomDataMedia: random(10, 24^4),

      itemFiles: null,
      keyWhenModalGenerateFileOpen: random(10, 323e8),

      showHAction: false,
      hAactionKey: random(1, 999),

      actions: [],

      titleMessage: '',
      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: 0,
      density: 0,

    }
  },
  unmounted() {
    this.deleteStorageData()
  },
  computed: mapGetters(['getOneSelectDetal', 'getUsers', 'getRoleAssets']),
  components: {BaseFileModal, ModalBaseMaterial, TechProcess, MediaSlider, OpensFile, HistoryActions, InformFolder},
  methods: {
    ...mapActions([
      'createNewDetal', 
      'fetchUpdateDetal', 
      'getAllUsers', 
      'createNewDetal',
      'fetchAddFilesForDetal']),
    ...mapMutations(['removeOperationStorage']),
    unmount_filemodal(res) {
      if(res && this.id) {
        const data = {
          files: res,
          detal_id: this.id
        }

        this.fetchAddFilesForDetal(data).then(respons => {
          if(respons) {
            res.forEach(e => this.documentsData.push(e))
            showMessage('', 'Файлы прикреплены к детали', 's', this)
          } else 
            showMessage('', 'Не удалось загрузить файлы на сервер', 'e', this)
        })
        
      }
    },
    saveDetal() {
      if(this.obj.name.length < 3) 
        return 0

      if(!this.formData)
        this.formData = new FormData()

      this.formData.append('techProcessID', this.techProcessID || null)
      this.formData.append('name', this.obj.name)
      this.formData.append('articl', this.obj.articl)
      this.formData.append('responsible', this.obj.responsible)
      this.formData.append('description', this.obj.description)
      this.formData.append('parametrs', JSON.stringify(this.obj.parametrs))
      this.formData.append('haracteriatic', JSON.stringify(this.obj.haracteriatic))
      this.formData.append('DxL', this.obj.DxL)
      this.formData.append('massZag', this.obj.massZag)
      this.formData.append('trash', this.obj.trash)
      this.formData.append('id', this.id)
      this.formData.append('mat_zag', this.mat_zag != 'Задать' ?
        this.mat_zag.id : null)
      this.formData.append('mat_zag_zam', this.mat_zag_zam != 'Задать' ?
         this.mat_zag_zam.id : null)
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
      setTimeout(() =>  this.$router.push('/basedetals'), 3000)
      this.deleteStorageData()
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
    file_unmount(e) { 
      if(!e) 
        return 0
      this.formData = e.formData
    },
    unmount_material(mat) {
      if(this.getOneMaterial) {
        if(!this.mat_zag) {
          this.mat_zag = mat.material || 'Задать'
          if(mat.material) 
            this.calcParametr(mat.material)
        }
        if(!this.mat_zag_zam)
          this.mat_zag_zam = mat.material || 'Задать'
        return 0
      } 

      if(mat)
        this.materialList = mat.materialList
    },
    addPokMat() {
      this.instanMaterial = 3
      this.modalMaterialKey = random(10, 2e6)
      this.modalMaterialIsShow = true
      this.getOneMaterial = false
    },
    getMaterialForDetal(t = '') {
      this.instanMaterial = 1
      this.modalMaterialKey = random(10, 43e5)
      this.modalMaterialIsShow = true
      this.getOneMaterial = true
      t == 'zam' ? this.mat_zag_zam = '' : this.mat_zag = ''
    },
    addHaracteristic() {
      this.obj.haracteriatic.push({name: '', ez: '', znach: ''})
    },
    removeHaracteristic() {
      if(this.selectHaracteristic) {
        this.obj.haracteriatic.splice(this.selectHaracteristic.inx, 1)
        this.selectHaracteristic = null
      }
    },
    selectHaracteristicFunction(har, inx) {
      this.selectHaracteristic = { har, inx}
    },
    changeHaracteristic(val, inst, inx) {
      if(inst == 'name')  
        this.obj.haracteriatic[inx].name = val
      if(inst == 'ez')  
        this.obj.haracteriatic[inx].ez = val
      if(inst == 'znach')  {
        this.obj.haracteriatic[inx].znach = val
      if(inx == 0) 
        this.obj.trash = this.obj.haracteriatic[0].znach - this.obj.massZag
      }
    },
    editHarZag(val, inx) {
      if(inx == 'DxL') {
        if(val.indexOf('x') < 0) {
          this.obj.DxL = 'x'
          return 0
        }
        let dxl = val.split('x')
        if(dxl.length == 2) {
          if(this.inputMassZag * dxl[1])
            this.obj.massZag = this.density * (this.inputMassZag * (Number(dxl[1])/1000))
          if(this.obj.massZag)
            this.obj.trash = this.obj.massZag - this.obj.haracteriatic[0].znach 
        }
      }
    },
    showTechProcess() {
      this.techProcessIsShow = true
      this.techProcessKey = random(1, 12e8)
    },
    calcParametr(m) {
      let oD = m.outsideDiametr // Наружный диаметр
      let leng = m.length // Длина
      let aCS = m.areaCrossSectional //  Площадь сечения
      let density = m.density
      if(oD) {
        oD = JSON.parse(oD)
        if(m.material.outsideDiametr) 
          this.obj.DxL = padStart('x', oD.znach.length + 1, oD.znach)
      }
      if(leng) {
        leng = JSON.parse(leng)
        if(m.material.length) 
          this.obj.DxL = padEnd(this.obj.DxL, this.obj.DxL.length + leng.znach.length, leng.znach)
      }
      //  Чтобы узнать Массу нужно ПЛОТНОСТЬ * (ПЛОЩАДЬ СЕЧЕНИЯ * ДЛИНУ)
      if(aCS) {
        aCS = JSON.parse(aCS)
        if(m.material.areaCrossSectional) {
          let dxl = this.obj.DxL.split('x')
          if(dxl.length == 2 && Number(dxl[1])) {
            if(isNaN(Number(aCS.znach))) 
              this.obj.massZag = this.floatParse(aCS.znach) 
              else this.obj.massZag = aCS.znach 
            this.inputMassZag = this.obj.massZag
            if(Number(dxl[1]) * Number(this.obj.massZag))
              this.obj.massZag = Number(dxl[1]) * Number(this.obj.massZag)
              else this.obj.massZag = 0
          } else {
            if(isNaN(Number(aCS.znach))) 
              this.obj.massZag = this.floatParse(aCS.znach) 
            else
              this.obj.massZag = aCS.znach 
            this.inputMassZag = this.obj.massZag
          }
          this.obj.trash = this.obj.haracteriatic[0].znach - this.obj.massZag

          console.log(this.inputMassZag)
        }
      }
      if(density) {
        try {
          density = JSON.parse(density)
          this.density = density.znach
        } catch(e) {
          console.log(e)
        }
      }
    },
    floatParse(n) {
      return parseFloat(n.replace(",", "."));
    },
    exit(){
      this.$router.push("/basedetals")
      this.deleteStorageData()
    },
    setDocs(dc) {
      this.itemFiles = dc
      this.keyWhenModalGenerateFileOpen = random(10, 38e9)
    },
    historyAction() {
      if(!this.actions.length)
        return
      this.hAactionKey = random(1, 888)
      this.showHAction = true
    },
    deleteStorageData(){
      localStorage.removeItem("tpID")
      this.removeOperationStorage()
    },
    addFileModal() {
      this.fileModalKey = random(1, 999)
      this.showModalFile = true
    }

  },
  async mounted() {
    if(isEmpty(this.getOneSelectDetal)){
      this.$router.push('/basedetals')
      return 0
    }
    if(this.getOneSelectDetal.actions)
      this.actions = this.getOneSelectDetal.actions

    this.getAllUsers()
        
    this.obj.articl = this.getOneSelectDetal.articl
    this.obj.name = this.getOneSelectDetal.name
    this.obj.description = this.getOneSelectDetal.description   
    this.obj.parametrs = JSON.parse(this.getOneSelectDetal.parametrs)
    this.obj.DxL = this.getOneSelectDetal.DxL
    this.obj.massZag = this.getOneSelectDetal.massZag
    this.obj.trash = this.getOneSelectDetal.trash
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
      this.dataMedia.push({path: PATH_TO_SERVER+d.path, name: d.name})
    })
    this.randomDataMedia = random(10, 38100)
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
.title_block input{
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