<template>
  <div class='main_block_content'>
    <div class="left_content">
      <h3>Создать деталь</h3>
      <div class="block title_block">
        <p>
          <span>Артикул: </span><input type="text" v-model.trim='obj.atricl'>
          <span>Наименование: </span><input type="text" v-model.trim='obj.name'>
          <span>Ответственный: </span><input type="text" v-model.trim='obj.responsible'>
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
              <textarea class='textarea' v-model.trim='obj.description' cols="30" rows="10"></textarea>
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
            <h3 class="link_h3">История изменений</h3>
            <h3 class="link_h3">Принадлежность</h3>
          </div>
        </div>
        <div class="btn-control out-btn-control control-save" >
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
          <div class="pointer-files-to-add">
            <label for="docsFileSelected">Перенесите сюда файлы или кликните для добавления с вашего компьютера.</label>
            <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
          </div>
          <AddFile :parametrs='docFiles' 
                :typeGetFile='"getfile"'
                v-if="isChangeFolderFile" 
                @unmount='file_unmount'
                :key='keyWhenModalGenerate'
            />
        </div>
    </div>
  </div>
</template>

<script>
import AddFile from '@/components/filebase/addfile.vue'
import ModalBaseMaterial from '@/components/mathzag/modal-base-material.vue'
import TechProcess from './tech-process-modal.vue'
import { random, padStart, padEnd } from 'lodash'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      obj: {
        atricl: '',
        name: '',
        responsible: '',
        description: '',
        parametrs: {
          preTime: {ez: 'ч', znach: ''},
          helperTime: {ez: 'ч', znach: ''},
          mainTime: {ez: 'ч', znach: ''}
        },
        haracteriatic: [
          { name: 'Масса детали', ez: 'кг', znach: '48'}
        ],
        DxL: 'x',
        massZag: '',
        trash: ''
      },
      docFiles: [],
      keyWhenModalGenerate: random(10, 3e2),
      isChangeFolderFile: false,
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
      techProcessID: localStorage.getItem('tpID') || null
    }
  },
  components: {AddFile, ModalBaseMaterial, TechProcess},
  methods: {
    ...mapActions(['createNewDetal']),
    saveDetal() {
      // Проверяем введенные данные 
      if(this.obj.name.length < 3) 
        return 0

      if(!this.formData)
        this.formData = new FormData()

      this.formData.append('techProcessID', this.techProcessID || null)
      this.formData.append('name', this.obj.name)
      this.formData.append('articl', this.obj.atricl)
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
      for(let mat = 0; mat < this.materialList.length; mat++) {
        this.materialList[mat].mat = {
          id: this.materialList[mat].mat.id,
          name: this.materialList[mat].mat.name,
          kolvo: this.materialList[mat].mat.kolvo
        }
        if(mat == this.materialList.length - 1) {
          this.formData.append('materialList', JSON.stringify(this.materialList))
          this.createNewDetal(this.formData)
        }
      }

      this.$router.push('/basedetals')
      
      
    },

    unmount_tech_process(tp) {
      if(tp.id) {
        this.techProcessID = tp.id
        localStorage.setItem('tpID', this.techProcessID)
        if(tp.opers.length) {
          tp.opers.forEach(op => {
            console.log(op)
            this.obj.parametrs.preTime.znach = Number(this.obj.parametrs.preTime.znach) + Number(op.preTime)
            this.obj.parametrs.helperTime.znach = Number(this.obj.parametrs.helperTime.znach) + Number(op.helperTime)
            this.obj.parametrs.mainTime.znach = Number(this.obj.parametrs.mainTime.znach) + Number(op.mainTime)
          })
        }
      }
    },
    addDock(val) {
      val.target.files.forEach(f => {
        this.docFiles.push(f)
      })
      this.keyWhenModalGenerate = random(10, 23e4)
      this.isChangeFolderFile = true
    },
    file_unmount(e) { 
      if(!e) return 0
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
          this.obj.massZag = (Number(this.inputMassZag) * Number(dxl[1]))
          this.obj.trash = this.obj.haracteriatic[0].znach - this.obj.massZag
        }
      }
    },
    showTechProcess() {
      this.techProcessIsShow = true
      this.techProcessKey = random(1, 12e8)
    },
    calcParametr(m) {
      let oD = m.outsideDiametr
      let leng = m.length
      let aCS = m.areaCrossSectional
      console.log(m)
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
      if(aCS) {
        aCS = JSON.parse(aCS)
        if(m.material.areaCrossSectional) {
          let dxl = this.obj.DxL.split('x')
          if(dxl.length == 2) 
            this.obj.massZag = (Number(dxl[1]) * Number(aCS.znach))
          else 
            this.obj.massZag = aCS.znach
          this.obj.trash = this.obj.haracteriatic[0].znach - this.obj.massZag
          this.inputMassZag = aCS.znach
        }
      }
    },
    exit(){
      this.$router.push("/basedetals")
      localStorage.removeItem("tpID")
    }
  }
}
</script>

<style scoped>
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