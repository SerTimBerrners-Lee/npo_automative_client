<template>
  <div class='main-block'>
    <div class="content-left">
      <h3>{{ $route.params.type == 'create' ? 'Создать': 'Редактировать' || 'Создать с копированием'}} материал</h3>
      <div class="block">
        <div>
          <span class='span-title'>Наименование: </span><input type="text" v-model.trim='obj.name'>
          <span class='span-title'>Материал: </span>
          <span v-if='getLinkId == 0'>Все типы</span>
          <span v-if='getLinkId == 1'>Материалы для деталей</span>
          <span v-if='getLinkId == 2'>Покупные детали </span>
          <span v-if='getLinkId == 3'>Расходные материалы</span>
          <p>
            <label class='label' for='attention'>Выделить</label>
            <input 
              type="checkbox" 
              id='attention' 
              v-model='attention'>
          </p>
        </div>
      </div>
      <h3>Выбор типа и подипа <span v-if='$route.params.type == "edit"' class='btn-change-type'  @click='changeTypeForEdit'>Изменить тип и подтип</span></h3> 
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
          <textarea maxlength='250' cols="30" rows="10" v-model='obj.description'></textarea>
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
              <td>мм (миллиметр)</td>
              <td><input type="text" class="select-small" v-model.trim='obj.length_input'></td>
            </tr>

            <tr v-if='material && material.width && JSON.parse(material.width).znach == "permanent" || this.obj.width_input'>
              <td>Ширина (Ш)</td>
              <td>мм (миллиметр)</td>
              <td><input type="text" class="select-small" v-model.trim='obj.width_input'></td>
            </tr>
            
            <tr v-if='material && material.height && JSON.parse(material.height).znach == "permanent" || this.obj.height_input'>
              <td>Высота (В)</td>
              <td>мм (миллиметр)</td>
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
              <td>мм (миллиметр)</td>
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
              <th style='width: 30px'><unicon name="glass-tea" fill="#ee0942d0" width='15' /></th>
              <th>ИНН</th>
              <th>Наименование</th>
            </tr>
            <tr v-for='prov in providers' :key='prov'>
              <td class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                <p class="checkbox_block_del" @click='delProvider(prov)'></p>
              </td>
              <td>{{ prov.inn }}</td>
              <td>{{ prov.name }}</td>
            </tr>
          </table>
          <div class="btn-control" style="width: 84%;">
            <button class="btn-small btn-add" @click="addProvider">Добавить из базы</button>
          </div>
          <h3>Документы</h3>
         <div style='height: 50px; width:85%;'>
            <FileLoader 
              :typeGetFile='"getfile"'
              @unmount='file_unmount'/>
          </div>
          <div>
            <MiniTableDocuments :arrFileGet='arrFileGet' @unmount='setDocs' :key='new Date().getTime()'/>
            <div class="btn-control" style='width: 83%; margin-top: 50px;'>
              <button class="btn-small" @click='addFileModal'>Добавить из базы</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-right">
    </div>
    <div class="edit-save-block block" v-if="getRoleAssets && getRoleAssets.assets.materialAssets.writeSomeone" >
      <button class="btn-status" @click='exit'>Назад</button>
      <button class="btn-status" @click='exit'>Отменить</button>
      <button class="btn-status btn-black" @click="addItem" v-if="$route.params.type != 'edit'">Сохранить</button>
      <button class="btn-status btn-black" @click="addItem(this.getOnePPT.id)" v-if="$route.params.type == 'edit'">Обновить</button>
    </div>
    <ListProvider  
      @unmount='pushProvider' 
      :key='keyWhenModalListProvider'
      v-if='showProvider'
    />
    <OpensFile 
      :parametrs='itemFiles' 
      v-if="itemFiles" 
      :key='keyWhenModalGenerateFileOpen'
    />
    <BaseFileModal 
      v-if='showModalFile'
      :key='fileModalKey'
      :fileArrModal='arrFileGet'
      @unmount='unmount_filemodal'
    />
  </div>
</template>

<script>
import { showMessage } from '@/js/';
import { random, isEmpty } from 'lodash';
import OpensFile from '@/components/FileBase/openfile';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import TableMaterial from '@/components/MathZag/table-material';
import MiniTableDocuments from '@/components/FileBase/mini-table';
import ListProvider from '@/components/BaseProvider/list-provider';
import BaseFileModal from '@/components/FileBase/base-files-modal';

export default {
  data() {
    return {
      material: null,
      podMaterial: null,
      arrFileGet: [],
      itemFiles: null, 
      nowFileType: '',
      formData: null,
      showProvider: false,
      providers: [],
      providersId: [],
      keyWhenModalListProvider: random(10, 999),
      keyWhenModalGenerateFileOpen: random(1, 999),
      attention: false,
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
      },
      click_short_t_pt: false,
      showModalFile: false,
      fileModalKey: random(1, 999),
    }
  },
  components: { 
    TableMaterial,
    ListProvider,
    OpensFile,
    BaseFileModal,
    MiniTableDocuments
  },
  computed: {
    ...mapGetters([
      'alltypeM', 
      'allPodTypeM', 
      'getOnePodMaterial', 
      'allEdizm', 
      'getOnePPT', 
      'getLinkId', 
      'getRoleAssets', 
    ]),
  },  
  methods: {
    ...mapActions([
      'getAllTypeMaterial',
      'getOnePodType', 
      'getAllEdizm', 
      'podMaterial',
      'createNewPodPodMaterial',
      'fetchGetOnePPM',
      'getAllPodTypeMaterial'
    ]),
    ...mapMutations([
      'filterMatByPodType',
      'filterMaterialById',
      'filterPodMaterialById',
      'searchTypeMutation', 
      'searchPTypeMutation',
      'delitPathNavigate',
      'setOneTypeMMytation',
      'addOnePPTyep'
    ]),
    unmount_filemodal(res) {
      if(res) this.arrFileGet = res;
    },
    pushProvider(provider) { 
      if(!provider) return 0;
      this.providers.push(provider);
      this.providersId.push({id: provider.id});
    },
    addProvider() {
        this.showProvider = true;
        this.keyWhenModalListProvider = random(10, 999);
    },
    file_unmount(e) { 
      if(!e) return 0;
      this.formData = e.formData;
    },
    addItem(id = null) {
      if(this.$route.params.type != 'edit')  {
        if(this.obj.name == '') 
          return showMessage('', 'У материала должно быть имя', 'w');
        if(!this.podMaterial)
          return showMessage('', 'Выберите Подтип для материала', 'w');
        if(!this.material)
          return showMessage('', 'Выберите Тип для материала', 'w');
      }
      const dat = this.obj;
      
      if(!this.formData) this.formData = new FormData();
        
      this.formData.append('id', Number(id));

      if(this.providersId)
        this.providersId = JSON.stringify(this.providersId);

      if(this.material)
        this.formData.append('rootParentId', this.material.id);
      this.formData.append('podTypeId', this.podMaterial.id);
      this.formData.append('name', dat.name);
      const length = JSON.stringify({
        edizm: 7,
        znach: dat.length_input
      });
      this.formData.append('length', length);
      const width = JSON.stringify({
        edizm: 7,
        znach: dat.width_input
      });
      this.formData.append('width', width);
      const height = JSON.stringify({
        edizm: 7,
        znach: dat.height_input
      });
      this.formData.append('height', height);
      const wallThickness =  JSON.stringify({
        edizm: 7,
        znach: dat.wallThickness_input
      });
      this.formData.append('wallThickness', wallThickness);
      const outsideDiametr = JSON.stringify({
        edizm: 7,
        znach: dat.outsideDiametr_input
      });
      this.formData.append('outsideDiametr', outsideDiametr);
      const thickness = JSON.stringify({
        edizm: 7,
        znach: dat.thickness_input
      });
      this.formData.append('thickness', thickness);

      const areaCrossSectional =  JSON.stringify({
        edizm: 10,
        znach: dat.areaCrossSectional_input
      });
      this.formData.append('areaCrossSectional', areaCrossSectional);

      const density =  JSON.stringify({
        edizm: 10,
        znach: dat.density_input
      });
      
      this.formData.append('density', density);

      const deliveryTime = JSON.stringify({
        edizm: 9,
        znach: dat.deliveryTime_input
      });
      this.formData.append('deliveryTime', deliveryTime);

      const kolvo = JSON.stringify(dat.kolvo_select);
      this.formData.append('kolvo', kolvo);
      this.formData.append('providers', this.providersId) ;
      this.formData.append('description', dat.description);
      this.formData.append('attention', this.attention);
      if(this.arrFileGet.length) {
        const new_array = [];
        for(const inx in this.arrFileGet) {
          new_array.push(this.arrFileGet[inx].id);
        }
        this.formData.append('file_base', JSON.stringify(new_array));
      }

      this.createNewPodPodMaterial(this.formData).then(res => {
        if(res) {
          if(this.$route.params.type == "edit") {
            showMessage('', 'Материал усешно обновлен. Перенаправление на главную страницу...', 's');
          } else {
            showMessage('', 'Материал усешно создан. Перенаправление на главную страницу...', 's');
          }
        }
        setTimeout(() => {
          this.$router.push('/basematerial');
          this.delitPathNavigate(this.$route.path);
        }, 3000);
      })
    },
    async clickMat(mat, type) {
      if(type == 'type') {
        this.material = mat;
        this.setOneTypeMMytation(mat);
        if(mat.podMaterials && mat.instansMaterial != 1) 
          this.filterMatByPodType(mat.podMaterials);
        this.obj.name = this.material.name;
      }
      if(type == 'podM') {
        const mats = await this.getOnePodType(mat.id);
        if(!mats) return 0;
        this.podMaterial = mats;
        if(JSON.parse(this.podMaterial.density))
          this.obj.density_input =  JSON.parse(this.podMaterial.density).znach;
      
        if(this.material)
          this.obj.name = this.material.name + ' ' + this.podMaterial.name;
        else {
          this.obj.name = '';
          this.obj.name = this.obj.name + ' ' + mats.name;
        }
      }
    },
    delProvider(prov) {
      this.providers = this.providers.filter(pro => pro.id != prov.id);
      this.providersId = this.providersId.filter(el => el.id != prov.id);
    },
    updateInputSelect(mat) {
      if(mat.length) {
        this.obj.length_select = JSON.parse(mat.length).edizm.id;
        this.obj.length_input = JSON.parse(mat.length).znach;
      }
      if(mat.width) {
        this.obj.width_select = JSON.parse(mat.width).edizm.id;
        this.obj.width_input = JSON.parse(mat.width).znach;
      }
      if(mat.height) {
        this.obj.height_select = JSON.parse(mat.height).edizm.id;
        this.obj.height_input = JSON.parse(mat.height).znach;
      }
      if(mat.wallThickness) {
        this.obj.wallThickness_select = JSON.parse(mat.wallThickness).edizm.id;
        this.obj.wallThickness_input = JSON.parse(mat.wallThickness).znach;
      }
      if(mat.outsideDiametr) {
        this.obj.outsideDiametr_select = JSON.parse(mat.outsideDiametr).edizm.id;
        this.obj.outsideDiametr_input = JSON.parse(mat.outsideDiametr).znach;
      }
      if(mat.thickness) {
        this.obj.thickness_select = JSON.parse(mat.thickness).edizm.id;
        this.obj.thickness_input = JSON.parse(mat.thickness).znach;
      }
      if(mat.areaCrossSectional) {
        this.obj.areaCrossSectional_select = JSON.parse(mat.areaCrossSectional).edizm.id;
        this.obj.areaCrossSectional_input = JSON.parse(mat.areaCrossSectional).znach;
      }
    },
    editGetDataPPT() {
      this.updateInputSelect(this.getOnePPT)
        if(!this.getOnePPT || !this.getOnePPT.material || !this.getOnePPT.podMaterialId) 
          return this.$router.push('/basematerial');
        
      this.filterMaterialById(this.getOnePPT.material.id);
      this.filterPodMaterialById(this.getOnePPT.podMaterialId);
      this.podMaterial = this.getOnePPT.podMaterial;
      this.material = this.getOnePPT.material;
      this.attention = this.getOnePPT.attention;

      this.obj.description = this.getOnePPT.description;
      this.obj.name = this.getOnePPT.name;
      if(this.getOnePPT.deliveryTime) {
        this.obj.deliveryTime_select = 9;
        this.obj.deliveryTime_input = JSON.parse(this.getOnePPT.deliveryTime).znach;
      }
      
      if(this.getOnePPT.kolvo) 
          this.obj.kolvo_select = JSON.parse(this.getOnePPT.kolvo);
      
      if(this.getOnePPT.density) {
        this.obj.density_select = 10;
        this.obj.density_input = JSON.parse(this.getOnePPT.density).znach;
      }

        this.providers = this.getOnePPT.providers
        if(this.providers ) 
          this.providers.forEach(provider => this.providersId.push({id: provider.id}));
      if(this.$route.params.type == 'edit') {
        if(this.getOnePPT.documents) this.arrFileGet = this.getOnePPT.documents;
      }      
    },
    changeTypeForEdit() {
      this.getAllTypeMaterial();
      this.getAllPodTypeMaterial();
    },
    searchTypeM(val) {
      this.searchTypeMutation(val);
    },
    searchPT(val) {
      this.searchPTypeMutation(val);
    },
    isEmptyForPug(obj) {
      return isEmpty(obj);
    },
    setDocs(doc) {
      this.itemFiles = doc;
      this.keyWhenModalGenerateFileOpen = random(1, 999);
    },
    addFileModal() {
      this.fileModalKey = random(1, 999);
      this.showModalFile = true;
    },
    exit() {
      this.$router.back();
      this.delitPathNavigate(this.$route.path);
    }
  },
  async mounted() {
    this.getAllEdizm();
    if(this.$route.params.type == 'edit' || this.$route.params.type == 'copy') {
      if(!this.$route.params.id) return this.exit();

      const material = await this.fetchGetOnePPM(this.$route.params.id);
      this.addOnePPTyep(material);
      this.editGetDataPPT();
    }
  }
}
</script>
<style scoped>
.hover {
  margin-left: 100px;
  font-size: 14px;
}
.edit-save-material-file-folder {
  margin-right: 8 0px;
}
.block {
  width: 1100px;
}
.block>div * {
  margin-left: 10px;
}
.block>div {
  display: flex;
  align-items: center;
}
.block input[type='text'] {
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
.btn-block button {
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