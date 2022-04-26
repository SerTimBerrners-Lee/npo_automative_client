<template>
  <div>
    <div>
      <h3> Добавить технику/инвентарь </h3>
      <div class="block block_name">
        <p class="name_p">
          <span> Наименование: </span>
          <input type="text" v-model.trim="obj.name">
          <label class='label' style='margin:3px;' for='attention'>Выделить</label>
          <input 
            style='width: 10px;'
            type="checkbox" 
            id='attention' 
            v-model='attention'>
        </p>
      </div>
    </div>
    <div class="main_contents">
      <div class="left_content">
       <div>
         <h3>Выбор типа и подтипа <span class='btn-change-type' v-if='$route.params.edit != "create"' @click='changeTypeForEdit'>Изменить тип и подтип</span></h3>
          <div class='table_main'>
            <TableMaterial 
              :title='"Тип"'
              :width='"width-300"'
              :alltypeM="getTInventary" 
              :type='"T"'  
              @search='searchT'
              @clickMat="clickTInventary"/>
            <TableMaterial 
              :title='"Подтип"' 
              :width='"width-300"'
              :alltypeM="getPTInventary" 
              :type="'PT'" 
              @search='searchTP'
              @clickMat="clickPTInventary"/>
        </div>
       </div>
       <div>
         <h3>Описание / примечание</h3>
         <textarea maxlength='250' cols="30" rows="10" v-model.trim="obj.description"></textarea>
       </div>
       <h3>История изменений</h3>
       <h3>Принадлежность</h3>
      </div>
      <div class="right_content">
        <div>
          <h3>Параметра</h3>
          <div class="block inputs_block">
            <p>
              <span>Срок поставки в днях: </span>
              <input type="text" v-model.trim="obj.deliveryTime">
            </p>
            <p>
              <span>Среднестатистическое мес. потребление: </span>
               <input type="text" v-model.trim="obj.mountUsed">
            </p>
            <p>
              <span>Мин. остаток на складе: </span>
              <input type="text" v-model.trim="obj.minOstatok">
            </p>
          </div>
        </div>
        <div>
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
          <div class="btn-control">
            <button class="btn-small btn-add" @click="addProvider">Добавить из базы</button>
          </div>
        </div>
        <div v-if='docFiles.length'>
          <h3>Файлы</h3>
          <table style='width: 100%'>
            <tr>
              <th>Наименование</th>
            </tr>
            <tr class='td-row' 
              v-for='doc of docFiles' 
              :key="doc"
              @click='openDock(doc)'>
              <td >{{ doc.name }}</td>
            </tr>
          </table>
        </div>
         <div style='height: 50px;'>
          <FileLoader 
            :typeGetFile='"getfile"'
            @unmount='file_unmount'/>
        </div>
      </div>
    </div>
    <div class="edit-save-block block" v-if="getRoleAssets && getRoleAssets.assets">
      <button class="btn-status" @click='exit'>Отменить</button>
      <button class="btn-status btn-black" @click="create">Сохранить</button>
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
    <Loader v-if='loader' />
  </div>
</template>
<script>
import { showMessage } from '@/js/';
import { isEmpty, random }  from 'lodash';
import OpensFile from '@/components/FileBase/OpenFile';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import TableMaterial from '@/components/MathZag/TableMaterial';
import ListProvider from '@/components/BaseProvider/ListProvider';

export default {
  data() {
    return {
      inventaryT: null,
      inventaryPT: null,
      docFiles: [],
      formData: new FormData(),
      showProvider: false,
      keyWhenModalListProvider: random(10, 999),
      providers: [],
      providersId: [],
      obj: {
        name: '',
        deliveryTime: 0,
        mountUsed: 0,
        minOstatok: 0,
        description: '',
        id: null
      },

      loader: false,

      itemFiles: null,
      keyWhenModalGenerateFileOpen: random(1, 999),
      attention: false
    }
  },
  computed: mapGetters([
    'getRoleAssets', 
    'getTInventary', 
    'getPTInventary',
    'getOneInventary'
  ]),
  components: {TableMaterial, ListProvider, OpensFile},
  methods: {
    ...mapActions([
      'fetchAllInventary',
      'fetchAllPInventary',
      'createNewInventary',
      'fetchUpdateInventary'
    ]),
    ...mapMutations([
      'filterPTByTInvetary', 
      'resetFilterTInventary',
      'searchTInventary',
      'searchPTInventary',
      'delitPathNavigate',
      'filterByTypeInventary',
      'filterByPTypeInventary',
      'clearFilterTypeInventary',
      'clearFilterPTypeInventary',
    ]),
    async create() {
      if(this.obj.name.length < 1)
        return showMessage('', 'Укажите наименование', 'w');
      if(!this.inventaryT)
        return showMessage('', 'Выберите тип', 'w');
      if(!this.inventaryPT)
        return showMessage('', 'Выберите подтип', 'w');
      const fd = this.formData;

      fd.append('name', this.obj.name);
      fd.append('parent_t_id', this.inventaryT.id);
      fd.append('parent_pt_id', this.inventaryPT.id);
      fd.append('delivery_time', this.obj.deliveryTime);
      fd.append('mount_used', this.obj.mountUsed);
      fd.append('min_ostatok', this.obj.minOstatok);
      fd.append('description', this.obj.description);
      fd.append('providers', JSON.stringify(this.providersId));
      fd.append('attention', this.attention);

      if(this.$route.params.edit == 'edit') {
        fd.append('id', this.obj.id);
        
        await this.fetchUpdateInventary(fd);
        setTimeout(() => this.exit(), 3000);
        return showMessage('', 'Успешно обновлено. Перенаправление на главную страницу...', 's');
      }

      if(this.$route.params.edit != 'edit') {
        await this.createNewInventary(fd);
        setTimeout(() => this.exit(), 3000);
        return showMessage('', 'Успешно создан. Перенаправление на главную страницу...', 's');
      }
    },
    updateVariable() {
      const inv = this.getOneInventary;
      this.obj.name = inv.name;
      this.obj.deliveryTime = inv.delivery_time;
      this.obj.description = inv.description;
      this.obj.mountUsed = inv.mount_used;
      this.obj.minOstatok = inv.min_ostatok;
      this.inventaryT = inv.parent_type;
      this.inventaryPT = inv.parent_pt;
      this.obj.id = inv.id;
      this.attention = inv.attention;

      this.filterByTypeInventary(this.inventaryT.id);
      this.filterByPTypeInventary(this.inventaryPT.id);
      
      this.providers = inv.providers;
      for(let prov of this.providers) {
        this.providersId.push({id: prov.id});
      }
      if(this.$route.params.edit == 'edit')
        this.docFiles = inv.documents;
    },
    addProvider() {
      this.showProvider = true;
      this.keyWhenModalListProvider = random(10, 999);
    },
    pushProvider(provider) { 
      if (!provider) return 0;
      this.providers.push(provider);
      this.providersId.push({id: provider.id});
    },
    addInstrument() {
      if(!this.inventaryT)
        return showMessage('', 'Выберите Подтип', 'w', this)
      if(!this.inventaryPT)
        return showMessage('', 'Выберите тип', 'w', this)
      if(this.obj.name.length < 3)
        return showMessage('', 'Наименование должно быть длинее 3-символов', 'w');

      if(!this.formData) 
        this.formData = new FormData();

      if(this.providersId)
        this.providersId = JSON.stringify(this.providersId);

      this.formData.append('rootParentId', this.TInstrument.id);
      this.formData.append('name', this.obj.name);
      this.formData.append('deliveryTime', this.obj.deliveryTime);
      this.formData.append('mountUsed', this.obj.mountUsed);
      this.formData.append('minOstatok', this.obj.minOstatok);
      this.formData.append('description', this.obj.description);
      this.formData.append('parentId', this.PTInstrument.id);
      this.formData.append('providers', this.providersId);
      this.addNameInstrument(this.formData);
      
      this.exit()
    },
    searchT(val) {
      this.searchTInventary(val);
    },
    searchTP(val) {
      this.searchPTInventary(val);
    },
    clickTInventary(inventary) {
      if(this.inventaryT && this.inventaryT.id == inventary.id)
        return this.resetFilterTInventary()
      this.inventaryT = inventary
      this.filterPTByTInvetary(inventary)
    },
    clickPTInventary(inventary) {
      this.inventaryPT = inventary
    },
    file_unmount(e) { 
      if(!e) return 0;
      this.formData = e.formData;
    },
    exit() {
      this.$router.push("/inventary");
      this.delitPathNavigate(this.$route.path);
    },
    openDock(files) {
      this.itemFiles = files;
      this.keyWhenModalGenerateFileOpen = random(10, 999);
    },
    changeTypeForEdit() {
      this.clearFilterTypeInventary();
      this.clearFilterPTypeInventary();
    },
  },
  async mounted() {
    this.loader = true;
    await this.fetchAllInventary();
    await this.fetchAllPInventary();

    if(this.$route.params.edit 
        && (this.$route.params.edit == 'copy' 
        || this.$route.params.edit == 'edit')) {
      if(isEmpty(this.getOneInventary))
        return this.exit();
      this.updateVariable();
    }
    this.loader = false;
  }
}
</script>
<style>
.table_main {
  display: flex;
}
.instr_select {
  width: 210px;
}
.name_p{
  display: flex;
  align-items: center;
}
.name_p * {
  margin-left: 5px;
}
.name_p input {
  width: 370px;
}
.block_name {
  width: 1200px;
  padding: 5px;
}
.width-260{
  width: 260px;
}
.main_contents {
  display: flex;
  width: 100%;
  flex-direction: row;
}
.left_content {
  width: 600px;
  display: flex;
  flex-direction: column;
}
.right_content {
  width: 600px;
  margin-left: 100px;
}
textarea {
  width: 545px;
}
.inputs_block p {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table_provider {
  width: 100%;
}
.table_provider th:first-child {
  width: 30%;
}
.pointer-files-to-add {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>