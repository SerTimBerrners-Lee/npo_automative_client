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
              </table>
              <ModalBaseMaterial 
                :key='modalMaterialKey'
                v-if='modalMaterialIsShow'
                @unmount_material='unmount_material'
                :instanMaterial='instanMaterial'
                :getOneMaterial='getOneMaterial'
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
              </table>
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
                  <td class='td_link' @click='getMaterialForDetal' v-text='mat_zag' ></td>
                </tr>
                <tr>
                  <td>Материал заготовки(Заменитель)</td>
                  <td>шт</td>
                  <td class='td_link' @click='getMaterialForDetal("zam")' v-text='mat_zag_zam'></td>
                </tr>
              </table>
            </div>

            <h3 class="link_h3">Технологический процес</h3>
            <h3 class="link_h3">Себестоимость</h3>
            <h3 class="link_h3">История изменений</h3>
            <h3 class="link_h3">Принадлежность</h3>
          </div>
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
import { random } from 'lodash'

export default {
  data() {
    return {
      obj: {
        atricl: '',
        name: '',
        responsible: '',
        description: ''
      },
      docFiles: [],
      keyWhenModalGenerate: random(10, 384522333213313324),
      isChangeFolderFile: false,
      formData: null,
      modalMaterialKey: random(10, 213123123),
      modalMaterialIsShow: false,
      instanMaterial: 3,
      mat_zag: 'Задать',
      mat_zag_zam: 'Задать',
      getOneMaterial: false
    }
  },
  components: {AddFile, ModalBaseMaterial},
  methods: {



    addDock(val) {
      val.target.files.forEach(f => {
        this.docFiles.push(f)
      })
      this.keyWhenModalGenerate = random(10, 384522333213313324)
      this.isChangeFolderFile = true
    },
    file_unmount(e) { 
      if(!e) return 0
      this.formData = e.formData
    },
    unmount_material(mat) {
      if(this.getOneMaterial) {
        if(!this.mat_zag)
          this.mat_zag = mat.material.name || 'Задать'
        if(!this.mat_zag_zam)
          this.mat_zag_zam = mat.material.name || 'Задать'
      }
    },
    addPokMat() {
      this.instanMaterial = 3
      this.modalMaterialKey = random(10, 213123123)
      this.modalMaterialIsShow = true
      this.getOneMaterial = false
    },
    getMaterialForDetal(t = '') {
      this.instanMaterial = 1
      this.modalMaterialKey = random(10, 213123123)
      this.modalMaterialIsShow = true
      this.getOneMaterial = true
      t == 'zam' ? this.mat_zag_zam = '' : this.mat_zag = ''
    }
  }
}
</script>

<style scoped>
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