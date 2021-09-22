<template>
  <div class='main-block'>
    <div class="content-left">
      <h3>{{ $route.params.type == 'create' ? 'Создать': 'Редактировать'}} материал</h3>
      <div class="block">
        <p>
            <span class='span-title'>Наименование: </span><input type="text" v-model.trim='obj.name'>
            <span class='span-title'>Материал: </span>
            <span v-if='getLinkId == 0'>Все типы</span>
            <span v-if='getLinkId == 1'>Материалы для деталей</span>
             <span v-if='getLinkId == 2'>Покупные детали </span>
              <span v-if='getLinkId == 3'>Расходные материалы</span>
        </p>
      </div>
      <h3>Выбор типа и подипа</h3>
      <div class='main-content-block'>
        <div class="left-block">
          <div>
            <TableMaterial 
              :width='"width-260"' 
              :alltypeM='alltypeM' 
              :title='"Тип (Тип профиля заготовки)"' 
              :type='"type"' 
              @search='searchTypeM'
              @clickMat='clickMat' />
            <TableMaterial 
              :width='"width-260"' 
              :alltypeM='allPodTypeM' 
              :title='"Подтип (Материал заготовки)"' 
              :type='"podM"' 
              @search='searchPT'
              @clickMat='clickMat' />
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
               дн (дни)
              </td>
              <td>
                <input type="text" class="select-small" v-model.trim='obj.deliveryTime_input'>
              </td>
            </tr>
            <tr>
              <td>Количество</td>
              <td colspan="2"> 
                  <input value='1' type="checkbox" v-model="obj.kolvo_select.c1"> шт 
                  <input value='2' type="checkbox" v-model="obj.kolvo_select.c2"> л 
                  <input value='3' type="checkbox" v-model="obj.kolvo_select.c3"> кг 
                  <input value='4' type="checkbox" v-model="obj.kolvo_select.c4"> м 
                  <input value='5' type="checkbox" v-model="obj.kolvo_select.c5"> м.куб 
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

            <tr v-if='material && material.length && JSON.parse(material.length).znach == "permanent" || this.obj.length_input'>
              <td>Длина (Д)</td>
              <td>
                <select class="select-small" v-model="obj.length_select">
                  <option>Выберите тип ЕИ</option>
                  <option value='6'>м (метр)</option>
                  <option value='7'>мм (миллиметр)</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.length_input'></td>
            </tr>

            <tr v-if='material && material.width && JSON.parse(material.width).znach == "permanent" || this.obj.width_input'>
              <td>Ширина (Ш)</td>
              <td><select class="select-small" v-model="obj.width_select">
                  <option >Выберите тип ЕИ</option>
                  <option value='6'>м (метр)</option>
                  <option value='7'>мм (миллиметр)</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.width_input'></td>
            </tr>
            
            <tr v-if='material && material.height && JSON.parse(material.height).znach == "permanent" || this.obj.height_input'>
              <td>Высота (В)</td>
              <td><select class="select-small" v-model="obj.height_select">
                  <option>Выберите тип ЕИ</option>
                  <option value='6'>м (метр)</option>
                  <option value='7'>мм (миллиметр)</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.height_input'></td>
            </tr>
          
            <tr v-if='material && material.wallThickness &&  JSON.parse(material.wallThickness).znach == "permanent" || this.obj.wallThickness_input'>
              <td>Толщина стенки (S)</td>
              <td>мм (миллиметр)</td>
              <td><input type="text" class="select-small" v-model.trim='obj.wallThickness_input'></td>
            </tr>

            <tr v-if='material && material.outsideDiametr && JSON.parse(material.outsideDiametr).znach == "permanent" || this.obj.outsideDiametr_input'>
              <td>Наружный Диаметр (D)</td>
                <td>мм (миллиметр)</td>
              <td><input type="text" class="select-small" v-model.trim='obj.outsideDiametr_input'></td>
            </tr>
           
            <tr v-if='material && material.thickness && JSON.parse(material.thickness).znach == "permanent" || this.obj.thickness_input'>
              <td>Толщина </td>
              <td><select class="select-small" v-model="obj.thickness_select">
                  <option>Выберите тип ЕИ</option>
                  <option value='6'>м (метр)</option>
                  <option value='7'>мм (миллиметр)</option>
                </select></td>
              <td><input type="text" class="select-small" v-model.trim='obj.thickness_input'></td>
            </tr>

            <tr v-if='material && material.areaCrossSectional && JSON.parse(material.areaCrossSectional).znach == "permanent" || this.obj.areaCrossSectional_input'>
              <td>Площадь сечения (A) </td>
              <td>
                метр. кв.
              </td>
              <td><input type="text" class="select-small" v-model.trim='obj.areaCrossSectional_input'></td>
            </tr>

            <tr v-if='podMaterial && podMaterial.density && JSON.parse(podMaterial.density).znach || this.obj.density_input'>
              <td>Плотность </td>
              <td>
                кг/м.куб.
              </td>
              <td><input type="text" class="select-small" v-model.trim='obj.density_input'></td>
            </tr>
          </table>
          <h3>Поставщики</h3>
          <table class="table_provider">
            <tr>
              <th>ИНН</th>
              <th>Наименование</th>
            </tr>
            <tr v-for='prov in providers' :key='prov'>
              <td>{{ prov.inn }}</td>
              <td>{{ prov.name }}</td>
            </tr>
          </table>
          <div class="btn-control" style="width: 84%;">
            <button class="btn-small btn-add" @click="addProvider">Добавить из базы</button>
          </div>
      <div class="pointer-files-to-add edit-save-material-file-folder">
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
    <div class="content-right">
    </div>
     <div class="edit-save-block block">
            <button class="btn-status" @click='$router.push("/basematerial")'>Назад</button>
            <button class="btn-status" @click='$router.push("/basematerial")'>Отменить</button>
            <button class="btn-status btn-black" @click="addItem" v-if="$route.params.type == 'create'">Сохранить</button>
            <button class="btn-status btn-black" @click="addItem(this.getOnePPT.id)" v-if="$route.params.type == 'edit'">Обновить</button>
        </div>
        <ListProvider  
          @unmount='pushProvider' 
          :key='keyWhenModalListProvider'
          v-if='showProvider'
          />
  </div>
</template>

<script>
import TableMaterial from '@/components/mathzag/table-material.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AddFile from '@/components/filebase/addfile.vue'
import ListProvider from '@/components/baseprovider/list-provider.vue';
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
      showProvider: false,
      providers: [],
      providersId: [],
      keyWhenModalGenerate: random(10, 384522333213313324),
      keyWhenModalListProvider: random(10, 384522333213313324),
      obj: {
        name: '',
        deliveryTime_select: 'Выберите тип ЕИ',
        deliveryTime_input: '',
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
        density_select: 10,
        density_input: '',
        rootParentId: null,
        kolvo_select: {
          c1: false,
          c2: false,
          c3: false,
          c4: false,
          c5: false
        }
      }
    }
  },
  components: {TableMaterial, AddFile, ListProvider},
  computed: {
    ...mapGetters(['alltypeM', 'allPodTypeM', 'getOnePodMaterial', 'allEdizm', 'getOnePPT', 'getLinkId']),
  },  
  updated() {
    if(this.$route.params.type == 'edit' && !this.getOnePPT.id)
      this.$router.push({path: '/basematerial'}) 
  },
  methods: {
    pushProvider(provider) { 
      if(!provider)
        return 0
      this.providers.push(provider)
      this.providersId.push({id: provider.id})
    },
    addProvider() {
        this.showProvider = true
        this.keyWhenModalListProvider = random(10, 384522333213313324)
      },
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
        if(this.obj.name == '' || !this.podMaterial && !this.material) 
          return 0
      }
      if(!this.obj.areaCrossSectional_input && this.podMaterial.instansMaterial == 1)   
        return 0
      let dat = this.obj
      
      if(!this.formData) 
        this.formData = new FormData()
        
      this.formData.append('id', Number(id))

      if(this.providersId)
        this.providersId = JSON.stringify(this.providersId)
      
      let podTypeId
      
      this.$route.params.type == 'edit' ? podTypeId = this.getOnePPT.materials[0].id :
      podTypeId = this.podMaterial.id

      if(this.material)
        this.formData.append('rootParentId', this.material.id)
      this.formData.append('podTypeId', podTypeId)
      this.formData.append('name', dat.name)
      let length = dat.length_select != 'Выберите тип ЕИ' &&
      dat.length_select  ? JSON.stringify({
        edizm: dat.length_select,
        znach: dat.length_input
      }) : JSON.stringify({})
      this.formData.append('length', length)
      let width = dat.width_select != 'Выберите тип ЕИ'  &&
      dat.width_select ? JSON.stringify({
        edizm: dat.width_select,
        znach: dat.width_input
      }) : JSON.stringify({})
      this.formData.append('width', width)
      let height = dat.height_select != 'Выберите тип ЕИ' &&
      dat.height_select ? JSON.stringify({
        edizm: dat.height_select,
        znach: dat.height_input
      }) : JSON.stringify({})
      this.formData.append('height', height)
      let wallThickness = dat.wallThickness_input ? JSON.stringify({
        edizm: 7,
        znach: dat.wallThickness_input
      }) : JSON.stringify({})
      this.formData.append('wallThickness', wallThickness)
      let outsideDiametr = dat.outsideDiametr_input ? JSON.stringify({
        edizm: 7,
        znach: dat.outsideDiametr_input
      }) : JSON.stringify({})
      this.formData.append('outsideDiametr', outsideDiametr)
      let thickness = dat.thickness_selecter != 'Выберите тип ЕИ'  &&
      dat.thickness_select ? JSON.stringify({
        edizm: dat.thickness_select,
        znach: dat.thickness_input
      }) : JSON.stringify({})
      this.formData.append('thickness', thickness)

      let areaCrossSectional =  JSON.stringify({
        edizm: 10,
        znach: dat.areaCrossSectional_input
      })
      this.formData.append('areaCrossSectional', areaCrossSectional)

      let density =  JSON.stringify({
        edizm: 10,
        znach: dat.density_input
      })
      
      this.formData.append('density', density)

      let deliveryTime = JSON.stringify({
        edizm: 9,
        znach: dat.deliveryTime_input
      })
      this.formData.append('deliveryTime', deliveryTime)

      let kolvo = JSON.stringify({ kolvo: dat.kolvo_select})
      this.formData.append('kolvo', kolvo)

      this.formData.append('providers', this.providersId)

      this.formData.append('description', dat.description)
      this.createNewPodPodMaterial(this.formData)
      this.$router.push('/basematerial')
    },
    ...mapActions(['getAllTypeMaterial', 
      'getOnePodType', 
      'getAllEdizm', 
      'podMaterial',
      'createNewPodPodMaterial',
      'fetchGetOnePPM',
      'getAllPodTypeMaterial'
      ]),
    ...mapMutations(['filterMatByPodType',
    'filterMaterialById',
    'filterPodMaterialById',
    'searchTypeMutation', 
    'searchPTypeMutation',]),
    clickMat(mat, type) {
      if(type == 'type') {
          this.material = mat
          this.obj.name = this.material.name
      }
      if(type == 'podM') {
          this.getOnePodType(mat.id).then((mat) => {
            if(!mat) return 0
            this.podMaterial = mat
            if(this.$route.params.type == 'create') 
              if(JSON.parse(this.podMaterial.density))
                this.obj.density_input =  JSON.parse(this.podMaterial.density).znach
            
              
            if(this.material) {
              this.obj.name = this.material.name + ' ' + this.podMaterial.name
            } else {
              this.obj.name = ''
              this.obj.name = this.obj.name + ' ' + mat.name 
            }
          })
      }
    },
    updateInputSelect(mat) {
      if(mat.length) {
        this.obj.length_select = JSON.parse(mat.length).edizm.id
        this.obj.length_input = JSON.parse(mat.length).znach
      }
      if(mat.width) {
        this.obj.width_select = JSON.parse(mat.width).edizm.id
        this.obj.width_input = JSON.parse(mat.width).znach
      }
      if(mat.height) {
        this.obj.height_select = JSON.parse(mat.height).edizm.id
        this.obj.height_input = JSON.parse(mat.height).znach
      }
      if(mat.wallThickness) {
        this.obj.wallThickness_select = JSON.parse(mat.wallThickness).edizm.id
        this.obj.wallThickness_input = JSON.parse(mat.wallThickness).znach
      }
      if(mat.outsideDiametr) {
        this.obj.outsideDiametr_select = JSON.parse(mat.outsideDiametr).edizm.id
        this.obj.outsideDiametr_input = JSON.parse(mat.outsideDiametr).znach
      }
      if(mat.thickness) {
        this.obj.thickness_select = JSON.parse(mat.thickness).edizm.id
        this.obj.thickness_input = JSON.parse(mat.thickness).znach
      }
      if(mat.areaCrossSectional) {
        this.obj.areaCrossSectional_select = JSON.parse(mat.areaCrossSectional).edizm.id
        this.obj.areaCrossSectional_input = JSON.parse(mat.areaCrossSectional).znach
      }
    },
    editGetDataPPT() {
      this.updateInputSelect(this.getOnePPT)
      this.filterMaterialById(this.getOnePPT.material.id)
      this.filterPodMaterialById(this.getOnePPT.materials[0].id)
      // Отфильтровать таблицу так чтобы показывались привязанный материал и привязанный под материал 
      this.podMaterial = this.getOnePPT
      this.obj.description = this.getOnePPT.description
      this.obj.name = this.getOnePPT.name
      if(this.getOnePPT.deliveryTime) {
        this.obj.deliveryTime_select = 9
        this.obj.deliveryTime_input = JSON.parse(this.getOnePPT.deliveryTime).znach
      }
      this.providers = this.getOnePPT.providers
      if(this.providers ) 
        this.providers.forEach(provider => {
          this.providersId.push({id: provider.id})
        })
      if(this.getOnePPT.kolvo) {
          this.obj.kolvo_select = JSON.parse(this.getOnePPT.kolvo)
      }
      if(this.getOnePPT.density) {
        this.obj.density_select = 10
        this.obj.density_input = JSON.parse(this.getOnePPT.density).znach
      }
    },
    searchTypeM(val) {
      this.searchTypeMutation(val)
    },
    searchPT(val) {
      this.searchPTypeMutation(val)
    },
  },
  async mounted() {
    this.getAllEdizm()
    if(this.$route.params.type == 'edit')
      this.editGetDataPPT()
  }
}
</script>
<style scoped>
.edit-save-material-file-folder {
  margin-right: 8 0px;
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