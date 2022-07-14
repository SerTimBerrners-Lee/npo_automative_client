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
                  <td class='center'>{{ obj.parametrs.preTime.ez }}</td>
                  <td class='center'>{{ obj.parametrs.preTime.znach }}</td>
                </tr>
                <tr>
                  <td>Норма времени вспомогателная</td>
                  <td class='center'>{{ obj.parametrs.helperTime.ez }}</td>
                  <td class='center'>{{ obj.parametrs.helperTime.znach }}</td>
                </tr>
                <tr>
                  <td>Норма времени основная</td>
                  <td class='center'>{{ obj.parametrs.mainTime.ez }}</td>
                  <td class='center'>{{ obj.parametrs.mainTime.znach }}</td>
                </tr>
              </table>
            </div>
            <div>
              <HaracteristicZag @unmount_har_zam='unmount_har_zam'/>
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
      <div class="btn-control">
        <button class="btn-small" @click='addFileModal' style='margin-top: 50px;'>Добавить из базы</button>
      </div>
    </div>
    <BaseFileModal 
      v-if='showModalFile'
      :key='fileModalKey'
      :fileArrModal='documentsData'
      @unmount='unmount_filemodal'
      :search='this.obj.articl'
    />
  </div>
</template>
<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import TechProcess from './TechProcessModal';
import HaracteristicZag from './HaracteristicZag';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import BaseFileModal from '@/components/FileBase/BaseFilesModal';
import ModalBaseMaterial from '@/components/MathZag/ModalBaseMaterial';

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
      formData: null,
      modalMaterialKey: random(10, 999),
      modalMaterialIsShow: false,
      mat_zag: 'Задать', 
      mat_zag_zam: 'Задать', 
      materialList: [],
      documentsData: [],
      selectHaracteristic: null,
      techProcessIsShow: false,
      techProcessKey: random(10, 999),
      inputMassZag: 0,
      variableDensity: 0,
      techProcessID: localStorage.getItem('tpID') || null,
      attention: false,

      data_arr: [],
    }
  },
  watch: {
    'obj.articl': function (val, last_val) {
      if (!last_val) return false;
      for (const art of this.data_arr) {
				if (art.articl.toLowerCase() == val.trim().toLowerCase()) 
					return showMessage('', 'Объект с такими характеристиками уже существует', 'w')
			}
    }
  },
  computed: mapGetters(['getUsers', 'getRoleAssets']),
  components: {
    ModalBaseMaterial,
    TechProcess,
    BaseFileModal,
    HaracteristicZag,
  },
  methods: {
    ...mapActions(['createNewDetal', 'getAllUsers', 'getAllDetalsArticl']),
    ...mapMutations(['delitPathNavigate']),
    unmount_filemodal(res) {
      if (res) this.documentsData = res;
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
    unmount_tech_process(tp) {
      if (tp.id) {
        this.techProcessID = tp.id;
        localStorage.setItem('tpID', this.techProcessID);
        if (tp.opers.length) {
          this.obj.parametrs.preTime.znach = 0;
          this.obj.parametrs.helperTime.znach = 0;
          this.obj.parametrs.mainTime.znach = 0;
          tp.opers.forEach(op => {
            this.obj.parametrs.preTime.znach = Number(this.obj.parametrs.preTime.znach) + Number(op.preTime);
            this.obj.parametrs.helperTime.znach = Number(this.obj.parametrs.helperTime.znach) + Number(op.helperTime);
            this.obj.parametrs.mainTime.znach = Number(this.obj.parametrs.mainTime.znach) + Number(op.mainTime);
          })
          this.obj.parametrs.preTime.znach = (this.obj.parametrs.preTime.znach / 60).toFixed(2);
          this.obj.parametrs.helperTime.znach = (this.obj.parametrs.helperTime.znach / 60).toFixed(2);
          this.obj.parametrs.mainTime.znach = (this.obj.parametrs.mainTime.znach / 60).toFixed(2);
        }
      }
    },
    file_unmount(e) { 
      if (!e) return 0;
      this.formData = e.formData;
    },
    unmount_material(mat) {
      if (mat) this.materialList = mat.materialList;
    },
    saveDetal() {
      if (this.obj.diametr == '0' || this.obj.lengt == '0' || this.obj.height == '0' || this.obj.thickness == '0' || this.obj.wallThickness == '0' || this.obj.width == '0' || this.obj.areaCS == '0') {
        return showMessage('', 'Заполните все поля для характеристик заготовки', 'w');
      }
      
      if (this.obj.name.length < 3) return 0;

      if (!this.formData) this.formData = new FormData();

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

      if (this.documentsData.length) {
        const new_array = []
        for (let inx in this.documentsData) {
          new_array.push(this.documentsData[inx].id)
        }
        this.formData.append('file_base', JSON.stringify(new_array))
      }

      this.formData.append('mat_zag', this.mat_zag != 'Задать' ?
        this.mat_zag.id : null)
      this.formData.append('mat_zag_zam', this.mat_zag_zam != 'Задать' ?
         this.mat_zag_zam.id : null)
      if (this.materialList.length > 0) {
        for (let mat = 0; mat < this.materialList.length; mat++) {
          this.materialList[mat].mat = {
            id: this.materialList[mat].mat.id,
            name: this.materialList[mat].mat.name,
            kol: this.materialList[mat].mat.kolvo
          }
          if (mat == this.materialList.length - 1) {
            this.formData.append('materialList', JSON.stringify(this.materialList))
            this.createNewDetal(this.formData).then(res => {
              if (res) 
                showMessage('', 'Деталь усешно создана. Перенаправление на главную страницу...', 's')
            })
          }
        }
      } else {
         this.createNewDetal(this.formData).then(res => {
            if (res) 
              showMessage('', 'Деталь усешно создана. Перенаправление на главную страницу...', 's')
          })
      }
      
      setTimeout(() =>  {
        this.$router.push('/basedetals');
        this.delitPathNavigate(this.$route.path);
      }, 3000)
      
    },
    addPokMat() {
      this.modalMaterialKey = random(10, 999);
      this.modalMaterialIsShow = true;
    },
    showTechProcess() {
      this.techProcessIsShow = true;
      this.techProcessKey = random(1, 999);
    },
    exit(){
      this.$router.push("/basedetals");
      this.delitPathNavigate(this.$route.path);
    },
    addFileModal() {
      this.fileModalKey = random(1, 999);
      this.showModalFile = true;
    }
  },
  async mounted() {
    await this.getAllUsers(true);
    this.data_arr = await this.getAllDetalsArticl();
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
</style>