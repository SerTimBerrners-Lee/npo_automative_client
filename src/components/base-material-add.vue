<template>
  <div class='main-block'>
    <div class="content-left">
      <h3>{{ $route.params.type == 'create' ? 'Создать': 'Редактировать'}} материал</h3>
      <div class="block">
        <p>
            <span class='span-title'>Наименование: </span><input type="text" v-model.trim='obj.name'>
            <span class='span-title'>Материал: </span>
            <span>Материалы для деталей</span>
        </p>
      </div>
      <h3>Выбор типа и подипа</h3>
      <div class='main-content-block'>
        <div class="left-block">
          <div>
            <TableMaterial :width='"width-260"' :alltypeM='alltypeM' :title='"Тип (Тип профиля заготовки)"' :type='"type"' @clickMat='clickMat' />
            <TableMaterial :width='"width-260"' :alltypeM='allPodTypeM' :title='"Подтип (Материал заготовки)"' :type='"podM"' @clickMat='clickMat' />
          </div>
          <h3>Описание / Примечание</h3>
          <textarea cols="30" rows="10" v-model='obj.description'></textarea>
          <h3>История изменений</h3>
          <h3>Принадлежность</h3>
        </div>
        <div class='right-block'>
          <h3>Параметры</h3>
          <table>
            <tr>
              <th>Наименование</th>
              <th>ЕИ</th>
              <th>Значение</th>
            </tr>
            <tr>
              <td>Срок поставки</td>
              <td>
                <select class="select-small" v-model="obj.deliveryTime_select">
                  <option>Выберите тип ЕИ</option>
                  <option v-for='edizm in allEdizm' :key="edizm" :value='edizm.id'>{{ edizm.short_name }}</option>
                </select>
              </td>
              <td>
                <input type="text" class="select-small" v-model.trim='obj.deliveryTime_input'>
              </td>
            </tr>
            <tr>
              <td colspan="2" scope='col'>Единица измерения</td>
              <td>
                <select class="select-small" v-model="obj.edizmId_select">
                  <option>Выберите тип ЕИ</option>
                  <option v-for='edizm in allEdizm' :key="edizm" :value='edizm.id'>{{ edizm.short_name }}</option>
                </select>
              </td>
            </tr>
          </table>
          <h3>Характеристики</h3>
          <table>
            <tr>
              <th>Наименование</th>
              <th>ЕИ</th>
              <th>Значение</th>
            </tr>
            <tr>
              <td>Масса погонного метра </td>
              <td><select class="select-small" v-model="obj.metrMass_select">
                  <option>Выберите тип ЕИ</option>
                  <option v-for='edizm in allEdizm' :key="edizm"  :value='edizm.id'>{{ edizm.short_name }}</option>
                </select></td>
              <td> <input type="text" class="select-small" v-model.trim='obj.metrMass_input'></td>
            </tr>
            <tr v-if='podMaterial && podMaterial.length'>
              <td>Длина (Д)</td>
              <td><select class="select-small" v-model="obj.length_select">
                  <option>Выберите тип ЕИ</option>
                  <option v-for='edizm in allEdizm' :key="edizm" :value='edizm.id'>{{ edizm.short_name }}</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.length_input'></td>
            </tr>
            <tr v-if='podMaterial && podMaterial.width'>
              <td>Ширина (Ш)</td>
              <td><select class="select-small" v-model="obj.width_select">
                  <option >Выберите тип ЕИ</option>
                  <option v-for='edizm in allEdizm' :key="edizm"  :value='edizm.id'>{{ edizm.short_name }}</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.width_input'></td>
            </tr>
            <tr v-if='podMaterial && podMaterial.height'>
              <td>Высота (В)</td>
              <td><select class="select-small" v-model="obj.height_select">
                  <option>Выберите тип ЕИ</option>
                  <option v-for='edizm in allEdizm' :key="edizm"  :value='edizm.id'>{{ edizm.short_name }}</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.height_input'></td>
            </tr>
            <tr v-if='podMaterial && podMaterial.wallThickness'>
              <td>Толщина стенки (S)</td>
              <td><select class="select-small" v-model="obj.wallThickness_select">
                  <option>Выберите тип ЕИ</option>
                  <option v-for='edizm in allEdizm' :key="edizm" :value='edizm.id'>{{ edizm.short_name }}</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.wallThickness_input'></td>
            </tr>
            <tr v-if='podMaterial && podMaterial.outsideDiametr'>
              <td>Наружный Диаметр (D)</td>
              <td><select class="select-small" v-model="obj.outsideDiametr_select">
                  <option>Выберите тип ЕИ</option>
                  <option v-for='edizm in allEdizm' :key="edizm" :value='edizm.id'>{{ edizm.short_name }}</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.outsideDiametr_input'></td>
            </tr>
            <tr v-if='podMaterial && podMaterial.thickness'>
              <td>Толщина </td>
              <td><select class="select-small" v-model="obj.thickness_select">
                  <option>Выберите тип ЕИ</option>
                  <option v-for='edizm in allEdizm' :key="edizm" :value='edizm.id'>{{ edizm.short_name }}</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.thickness_input'></td>
            </tr>
            <tr v-if='podMaterial && podMaterial.areaCrossSectional'>
              <td>Площадь сечения (A) </td>
              <td><select class="select-small" v-model="obj.areaCrossSectional_select">
                  <option>Выберите тип ЕИ</option>
                  <option v-for='edizm in allEdizm' :key="edizm" :value='edizm.id'>{{ edizm.short_name }}</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.areaCrossSectional_input'></td>
            </tr>
          </table>
          <h3>Поставщики</h3>
          <table>
              <tr>
                <th>ИНН</th>
                <th>Наименование</th>
              </tr>
              <tr>
                <th>...</th>
                <th>...</th>
              </tr>
          </table>
          <div class="btn-block">
            <button class="btn-small btn-add">Добавить из базы</button>
            <button class="btn-small btn-add">Создать нового</button>
          </div>
      <div class="pointer-files-to-add">
        <label for="docsFileSelected">Перенесите сюда файлы или кликните для добавления с вашего компьютера.</label>
        <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
      </div>
      <AddFile :parametrs='docFiles' 
                v-if="isChangeFolderFile" 
                @unmount='file_unmount'
                :key='keyWhenModalGenerate'
                :return_files='getfile' />
        </div>
      </div>
    </div>
    <div class="content-right">
    </div>
     <div class="edit-save-block block">
            <button class="btn-status" @click='$router.push("/basematerial")'>Назад</button>
            <button class="btn-status">Отменить</button>
            <button class="btn-status btn-black" @click="addItem" v-if="$route.params.type == 'create'">Сохранить</button>
            <button class="btn-status btn-black" @click="addItem(this.getOnePPT.id)" v-if="$route.params.type == 'edit'">Обновить</button>
        </div>
  </div>
</template>

<script>
import TableMaterial from '@/components/mathzag/table-material.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AddFile from '@/components/filebase/addfile.vue'
import { random }  from 'lodash'

export default {
  data() {
    return {
      material: null,
      podMaterial: null,
      arrFileGet: [],
      nowFileType: '',
      docFiles: [],
      formData: null,
      isChangeFolderFile: false,
      keyWhenModalGenerate: random(10, 384522333213313324),
      obj: {
        name: '',
        deliveryTime_select: 'Выберите тип ЕИ',
        deliveryTime_input: '',
        edizmId_select: 'Выберите тип ЕИ', // число
        metrMass_select: 'Выберите тип ЕИ',
        metrMass_input: '',
        description: '',
        length_select: 'Выберите тип ЕИ',
        length_input: '',
        width_select: 'Выберите тип ЕИ',
        width_input: '',
        height_select: 'Выберите тип ЕИ',
        height_input: '',
        wallThickness_select: 'Выберите тип ЕИ',
        wallThickness_input: '',
        outsideDiametr_select: 'Выберите тип ЕИ',
        outsideDiametr_input: '',
        thickness_select: 'Выберите тип ЕИ',
        thickness_input: '',
        areaCrossSectional_select: 'Выберите тип ЕИ',
        areaCrossSectional_input: '',
      }
    }
  },
  components: {TableMaterial, AddFile},
  computed: {
    ...mapGetters(['alltypeM', 'allPodTypeM', 'getOnePodMaterial', 'allEdizm', 'getOnePPT']),
  },  
  updated() {
    if(this.$route.params.type == 'edit' && !this.getOnePPT.id)
      this.$router.push({path: '/basematerial'}) 
  },
  methods: {
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
    },
    addDock(val) {
      val.target.files.forEach(f => {
          this.docFiles.push(f)
      })
      this.keyWhenModalGenerate = random(10, 384522333213313324)
      this.isChangeFolderFile = true
    },
    addItem(id = null) {
      if(this.$route.params.type != 'edit')  {
         if(this.obj.name == '' || !this.podMaterial) return 0
      }
      let dat = this.obj
      
      if(!this.formData) 
        this.formData = new FormData()
        
      this.formData.append('id', Number(id))
      
      let podTypeId = this.$route.params.type == 'edit' ? this.getOnePPT.materials[0].id : this.podMaterial.MatPodMat.id 
      this.formData.append('podTypeId', podTypeId)
      this.formData.append('name', dat.name)
      let length = dat.length_select != 'Выберите тип ЕИ' &&
      dat.length_select  ? JSON.stringify({
        edizmId: dat.length_select,
        znach: dat.length_input
      }) : JSON.stringify({})
      this.formData.append('length', length)
      let width = dat.width_select != 'Выберите тип ЕИ'  &&
      dat.width_select ? JSON.stringify({
        edizmId: dat.width_select,
        znach: dat.width_input
      }) : JSON.stringify({})
      this.formData.append('width', width)
      let height = dat.height_select != 'Выберите тип ЕИ' &&
      dat.height_select ? JSON.stringify({
        edizmId: dat.height_select,
        znach: dat.height_input
      }) : JSON.stringify({})
      this.formData.append('height', height)
      let wallThickness = dat.wallThickness_select != 'Выберите тип ЕИ' &&
      dat.wallThickness_select ? JSON.stringify({
        edizmId: dat.wallThickness_select,
        znach: dat.wallThickness_input
      }) : JSON.stringify({})
      this.formData.append('wallThickness', wallThickness)
      let outsideDiametr = dat.outsideDiametr_select != 'Выберите тип ЕИ'  &&
      dat.outsideDiametr_select  ? JSON.stringify({
        edizmId: dat.outsideDiametr_select,
        znach: dat.outsideDiametr_input
      }) : JSON.stringify({})
      this.formData.append('outsideDiametr', outsideDiametr)
      let thickness = dat.thickness_selecter != 'Выберите тип ЕИ'  &&
      dat.thickness_select ? JSON.stringify({
        edizmId: dat.thickness_select,
        znach: dat.thickness_input
      }) : JSON.stringify({})
      this.formData.append('thickness', thickness)
      let areaCrossSectional = dat.areaCrossSectional_select != 'Выберите тип ЕИ'  &&
      dat.areaCrossSectional_select ? JSON.stringify({
        edizmId: dat.areaCrossSectional_select,
        znach: dat.areaCrossSectional_input
      }) : JSON.stringify({})
      this.formData.append('areaCrossSectional', areaCrossSectional)
      let deliveryTime = dat.deliveryTime_select != 'Выберите тип ЕИ' ? JSON.stringify({
        edizmId: dat.deliveryTime_select,
        znach: dat.deliveryTime_input
      }) : JSON.stringify({})
      this.formData.append('deliveryTime', deliveryTime)
      let edizmId = dat.edizmId_select != 'Выберите тип ЕИ' ? dat.edizmId_select : null
      this.formData.append('edizmId', edizmId)
      let metrMass = dat.metrMass_select != 'Выберите тип ЕИ' ? JSON.stringify({
        edizmId: dat.metrMass_select,
        znach: dat.metrMass_input
      }) : JSON.stringify({})
      this.formData.append('metrMass', metrMass) 
      this.formData.append('description', dat.description)
      this.createNewPodPodMaterial(this.formData)
      this.$router.push('/basematerial')
    },
    ...mapActions(['getAllTypeMaterial', 
      'getOnePodType', 
      'getAllEdizm', 
      'podMaterial',
      'createNewPodPodMaterial',
      'fetchGetOnePPM'
      ]),
    ...mapMutations(['filterMatByPodType']),
    clickMat(mat, type) {
      if(type == 'type') {
          this.material = mat
          this.filterMatByPodType(this.material.id)
      }
      if(type == 'podM') {
          this.getOnePodType(mat.id).then((mat) => {
            mat ? this.podMaterial = mat :
            this.podMaterial = null
            if(!mat.materials) return 0
            mat = mat.materials[0]
            this.podMaterial = mat
            this.updateInputSelect(mat)
          })
      }
    },
    updateInputSelect(mat) {
      if(mat.length) {
        this.obj.length_select = JSON.parse(mat.length).edizmId.id
        this.obj.length_input = JSON.parse(mat.length).znach
      }
      if(mat.width) {
        this.obj.width_select = JSON.parse(mat.width).edizmId.id
        this.obj.width_input = JSON.parse(mat.width).znach
      }
      if(mat.height) {
        this.obj.height_select = JSON.parse(mat.height).edizmId.id
        this.obj.height_input = JSON.parse(mat.height).znach
      }
      if(mat.wallThickness) {
        this.obj.wallThickness_select = JSON.parse(mat.wallThickness).edizmId.id
        this.obj.wallThickness_input = JSON.parse(mat.wallThickness).znach
      }
      if(mat.outsideDiametr) {
        this.obj.outsideDiametr_select = JSON.parse(mat.outsideDiametr).edizmId.id
        this.obj.outsideDiametr_input = JSON.parse(mat.outsideDiametr).znach
      }
      if(mat.thickness) {
        this.obj.thickness_select = JSON.parse(mat.thickness).edizmId.id
        this.obj.thickness_input = JSON.parse(mat.thickness).znach
      }
      if(mat.areaCrossSectional) {
        this.obj.areaCrossSectional_select = JSON.parse(mat.areaCrossSectional).edizmId.id
        this.obj.areaCrossSectional_input = JSON.parse(mat.areaCrossSectional).znach
      }
    },
    editGetDataPPT() {
      this.updateInputSelect(this.getOnePPT)
      this.podMaterial = this.getOnePPT
      this.obj.description = this.getOnePPT.description
      this.obj.name = this.getOnePPT.name
      if(this.getOnePPT.deliveryTime) {
        this.obj.deliveryTime_select = JSON.parse(this.getOnePPT.deliveryTime).edizmId.id
        this.obj.deliveryTime_input = JSON.parse(this.getOnePPT.deliveryTime).znach
      }
      if(this.getOnePPT.metrMass) {
        this.obj.metrMass_select = JSON.parse(this.getOnePPT.metrMass).edizmId.id
        this.obj.metrMass_input = JSON.parse(this.getOnePPT.metrMass).znach
      }
    }
  },
  async mounted() {
    this.getAllTypeMaterial()
    this.getAllEdizm()
    if(this.$route.params.type == 'edit')
      this.editGetDataPPT()
  }
}
</script>
<style scoped>
.pointer-files-to-add {
  margin-top: 30px;
}
.block {
  width: 1100px;
}
.block>p * {
  margin-left: 10px;
}
.block input {
  width: 400px;
}
.left-block, .right-block {
  width: 600px;
}
.left-block {
  display: flex;
  flex-direction: column;
}
.main-content-block {
  display: flex;
  width: max-content;
  padding-bottom: 100px;
}
textarea {
  width: 500px;
}
table {
  width: 500px;
}
.btn-block {
  margin: 10px;
  display: flex;
  justify-content: center;
}
.btn-block  button {
  margin: 5px;
}
.span-title {
  font-weight: bold;
}
.content-left {
  float: left;
}
.content-right {
  margin-top: 20px;
  margin-left: 10px;
  width: 400px;
}
.main-block {
  width: 1600px;
  display: flex;
}
.width-260 {
  width: 260px;
}
.select-small {
  width: 100%;
  margin: 0px;
  height: 34px;
  border: none;
}
</style>