<template>
  <div class='main_block_content'>
    <div class="left_content">
      <h3>Создать деталь</h3>
      <div class="block title_block">
        <p>
          <span>Артикул: </span><input type="text" v-model.trim='obj.articl'>
          <span>Наименование: </span><input type="text" v-model.trim='obj.name'>
          <span>Ответственный: </span>
            <select class="select-small sle"  
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
                  <td> <span v-if="material.ez == 1"> шт</span> 
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
                <tr 
                  class='tr_haracteristic td-row' 
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
            <h3 class="link_h3">История изменений</h3>
            <h3 class="link_h3">Принадлежность</h3>
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
        <div style='height: 50px;'>
          <FileLoader 
            :typeGetFile='"getfile"'
            @unmount='file_unmount'/>
        </div>
      </div>
    </div>
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='showInformPanel'
      :key='keyInformTip'
    />
  </div>
</template>

<script>
import ModalBaseMaterial from '@/components/mathzag/modal-base-material.vue';
import TechProcess from './tech-process-modal.vue';
import { random, padStart, padEnd } from 'lodash';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { showMessage } from '@/js/';
import InformFolder from '@/components/InformFolder.vue';

export default {
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
      variableDensity: 0,
      techProcessID: localStorage.getItem('tpID') || null,

      titleMessage: '',
      message: '',
      type: '',
      showInformPanel: false,
      keyInformTip: 0,
    }
  },
  unmounted() {
    this.deleteStorageData()
  },
  computed: mapGetters(['getUsers', 'getRoleAssets']),
  components: {ModalBaseMaterial, TechProcess, InformFolder},
  methods: {
    ...mapActions(['createNewDetal', 'getAllUsers']),
    ...mapMutations(['removeOperationStorage']),
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
            this.createNewDetal(this.formData).then(res => {
              if(res) 
                showMessage('', 'Деталь усешно создана. Перенаправление на главную страницу...', 's', this)
            })
          }
        }
      } else {
         this.createNewDetal(this.formData).then(res => {
            if(res) 
              showMessage('', 'Деталь усешно создана. Перенаправление на главную страницу...', 's', this)
          })
      }
      
      this.deleteStorageData()
      setTimeout(() =>  this.$router.push('/basedetals'), 3000)
      
    },
    unmount_tech_process(tp) {
      if(tp.id) {
        this.techProcessID = tp.id
        localStorage.setItem('tpID', this.techProcessID)
        if(tp.opers.length) {
          tp.opers.forEach(op => {
            this.obj.parametrs.preTime.znach = Number(this.obj.parametrs.preTime.znach) + Number(op.preTime)
            this.obj.parametrs.helperTime.znach = Number(this.obj.parametrs.helperTime.znach) + Number(op.helperTime)
            this.obj.parametrs.mainTime.znach = Number(this.obj.parametrs.mainTime.znach) + Number(op.mainTime)
          })
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
          // обновляем значения в других инпутах 
          this.obj.massZag = Number(this.variableDensity) * (Number(this.inputMassZag) * (Number(dxl[1])/1000))
          this.obj.trash = this.obj.haracteriatic[0].znach - this.obj.massZag
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
        density = JSON.parse(density)
        if(m.material.areaCrossSectional) {
          let dxl = this.obj.DxL.split('x')
          if(dxl.length == 2) 
            this.obj.massZag = Number(density.znach) * ((Number(dxl[1])/1000) * Number(aCS.znach))
          else 
            this.obj.massZag = aCS.znach

          this.obj.trash = this.obj.haracteriatic[0].znach - this.obj.massZag
          this.inputMassZag = aCS.znach
          this.variableDensity = Number(density.znach)
        }
      }
    },
    exit(){
      this.$router.push("/basedetals")
      this.deleteStorageData()
    },
    deleteStorageData() {
      localStorage.removeItem("tpID")
      this.removeOperationStorage()
    }
  },
  async mounted() {
    this.getAllUsers()
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