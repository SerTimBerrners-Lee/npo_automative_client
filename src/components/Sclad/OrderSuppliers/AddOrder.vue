<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Создание заказа поставщика</h3>
        <div class="block header_block">
          <span>Выбор поставщика:</span>
          <input type="text" :value='provider ? provider.name : ""' >
          <button class="btn-small" @click='addProvider' v-if='!only_view'>Выбрать</button>
        </div>
        
        <div class="block two_header">
          <p>
            <span>№ Счета: </span>
            <input type="text" v-model='number_check'> 
            <span>Сумма счета, руб:</span>
            <input type="text" v-model='count'>
          </p>
          <p>
            <span>Планируемая дата прихода:</span>
            <DatePicterCustom 
              @unmount='unmount_date_picters'  
              :dateStart='date_shipments'
            />
            <span>НДС %: </span>
            <input type="text" v-model='nds'>
          </p>
        </div>

        <div class="block" style='padding: 5px;' v-if='!only_view'>
          <p style='margin: 5px;'>
            <label for="docsFileSelected" class='btn-small btn_file'>Загрузить счет</label>
            <input id="docsFileSelected" @change="e => addDock(e)" type="file" style="display:none;" required multiple>
            <span class='active' @click='openFiles()'>{{ name_check }}</span>
          </p>
        </div>

        <div>
          <h3>Дефицитный материал</h3>

          <div class="scroll-table table_material">
            <TableTypeMaterial />
            <TableMaterial :type_view='"mini"' @unmount_material='selectDeficitMaterial' />
          </div>
        </div>

        <div class="btn-control" v-if='!only_view'>
          <button 
            class="btn-small btn-add"
            @click='pushMaterial'>Добавить к поставщику </button>
        </div>

        <div class='table_material_provider scroll-table'>
          <h3>Список поставляемого поставщиком</h3>
          <TableMaterialFilter
            :id_product='id_product'
            :key='table_key'
            :is_empty='is_empty'
            @unmount_material='selectDeficitMaterial'
          />
        </div>

        <div class="btn-control" v-if='!only_view'>
          <button 
            class="btn-small btn-add"
            @click='pushMaterial'>Добавить к поставщику </button>
        </div>

        <div>
          <h3 
            class='link_h3'
            @click='newPosition'>Выбранные позиции</h3>
          <div class="table-scroll">
            <table>
              <tr>
                <th>Артикул</th>
                <th>Наименование</th>
                <th>ЕИ</th>
                <th>Кол-во</th>
                <th>Сумма, руб (за шт.)</th>
                <th>Примечание</th>
                <th>Тип</th>
              </tr>
              <tr 
                v-for='(pos, inx) of position_lists'
                :key='pos'
                class='td-row'
                @click='setSelected(pos)'>
                <td 
                  @keyup="e => editArt(inx, e.target.innerText)"
                  contenteditable="true">{{ pos.art }}</td>
                <td>{{ pos.name }}</td>
                <td class='center'>
                  <select 
                    class='select-small' 
                    v-if='!Number(pos.ez)'
                    @change='e => changeValuesEz(inx, e.target)'>
                    <option value=""></option>
                    <option :value='1' v-if='Object.values(pos.ez)[0]'>шт</option>
                    <option :value='2' v-if='Object.values(pos.ez)[1]'>л</option>
                    <option :value='3' v-if='Object.values(pos.ez)[2]'>кг</option>
                    <option :value='4' v-if='Object.values(pos.ez)[3]'>м</option>
                    <option :value='5' v-if='Object.values(pos.ez)[4]'>м.куб</option>
                  </select>
                  <p v-else @click='changeClickEz(inx)'>
                    <span :value='pos.ez' v-text='returnEzName(pos.ez)'></span>
                  </p>
                </td>
                <td
                  @keyup="e => editKol(inx, e.target.innerText)"
                  @click='editKol(inx, null)'
                  contenteditable="true">{{ pos.kol }}</td>
                <td
                  class='tooltip'>
                  <input type="number" 
                    @change="e => editSum(inx, e.target.value)"
                    @click='editSum(inx, null)'
                    min='0' :value='pos.sum'>
                  <span class="tooltiptext" contenteditable="false">{{ Number(pos.kol) * Number(pos.sum)  }}</span>
                </td>
                <td
                  @keyup="e => editDescription(inx, e.target.innerText)"
                  contenteditable="true">{{ pos.description }}</td>
                <td>{{ returnTypePosition(pos.type) }}</td>
              </tr>
            </table>
          </div>
          <div class="btn-control" v-if='!only_view'>
            <button class="btn-small" @click='clear'>Очистить</button>
            <button class="btn-small" @click='clearToSelect'>Удалить выбранное</button>
          </div>
          <h3>Примечание</h3>
          <textarea maxlength='250' class='textarea'  v-model='description'></textarea>
        </div>

        <div class="btn-control out-btn-control" v-if='!only_view'>
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status btn-black" @click='save'>Сохранить</button>
        </div>
      </div>
    </div>
    <AddFile 
      :parametrs='docFiles' 
      v-if="isChangeFolderFile" 
      @unmount='unmount'
      :typeGetFile='"getfile"'
      :key='keyWhenModalGenerate' />
    <ProviderList 
      :key='key_provider_modal'
      v-if='allProvider.length'
      :allProvider='allProvider'
      :getProvider='true'
      @unmount='unmount_provider'
    />
    <AddPosition 
      :key='key_position'
      v-if='show_position'
      @unmount='unmount_position'
    />
    <OpensFile 
      :parametrs='docFiles' 
      v-if="showModalFiles" 
      :key='keyWhenModalGenerateFileOpen'
    />
  </div>
</template>
<script>
import { showMessage } from '@/js/';
import { random, toNumber } from 'lodash';
import MixModal from '@/mixins/mixmodal'; 
import AddFile from '@/components/FileBase/AddFile';
import OpensFile from '@/components/FileBase/OpenFile';
import DatePicterCustom from '@/components/DatePicter';
import { returnSpanEz, returnEzName } from '@/js/edizm';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { posToDeliveries, returnTypePosition } from '@/js/methods';
import ProviderList from '@/components/BaseProvider/AllFieldsProvider';
import AddPosition from '@/components/Sclad/ComingToSclad/NewPosition';
import TableMaterial from '@/components/Sclad/DeficitMaterial/TableMaterial';
import TableMaterialFilter from '@/components/BaseProvider/TableMaterialFilter';
import TableTypeMaterial from '@/components/Sclad/DeficitMaterial/TableTypeMaterial';

export default {
  props: ['parametrs', 'order_parametr', 'only_view'],
  data() {
    return {
      date_shipments: new Date().toLocaleString('ru-RU').split(',')[0],
      docFiles: [],
      keyWhenModalGenerate: random(1, 999),
      keyWhenModalGenerateFileOpen: random(1, 999),
      showModalFiles: false,
      isChangeFolderFile: false,
      name_check: '',
      formData: new FormData,

      key_provider_modal: random(1, 999),
      allProvider: [],
      provider: null,
      number_check:  '',
      nds: 20,
      count: 0,
      position_lists: [],
      description: '',
      
      selected_material: null,

      select_m: null,
      key_position: random(1, 999),
      show_position: false,
      id_product: null,
      table_key: random(1, 999),
      is_empty: false
    }
  },
  computed: mapGetters(['getOnePodMaterial']),
  components: {
    DatePicterCustom, 
    AddFile, 
    ProviderList,
    AddPosition,
    TableMaterialFilter,
    OpensFile,
    TableMaterial,
    TableTypeMaterial
  },
  mixins: [MixModal],
  methods: {
    ...mapActions([
      'fetchGetProviders', 
      'fetchGetAllDeficitPPM', 
      'fetchNewDeliveries', 
      'updateDeliveries',
      'getAllTypeMaterial',
      'getAllPodTypeMaterial'
    ]),
    ...mapMutations([
      'clearCascheMaterial'
    ]),
    unmount_position(mat_l) {
      this.clearCascheMaterial();
      this.fetchGetAllDeficitPPM();
      this.getAllTypeMaterial();
      this.getAllPodTypeMaterial();

      if (mat_l && mat_l.length) {
        for (const mat of mat_l) {
          this.selected_material = mat.obj;
          this.selected_material.type = mat.type;
          this.pushMaterial();
        }
      }
    },
    unmount(e) {
      if (!e) return 0;

      this.formData = e.formData;
      if (this.formData.get('document'))
        this.name_check = this.formData.get('document').name;

      this.number_check = this.name_check;
    },
    unmount_provider(provider) {
      if (provider)
        this.provider = provider;

      this.id_product = provider.id;
      this.table_key = random(1, 999);

    },
    unmount_date_picters(val) {
      this.date_shipments = val;
    },
    returnEzName (ez) {
      return returnEzName(ez);
    },
    // Просматриваем файл-счет
    openFiles() { 
      this.keyWhenModalGenerateFileOpen = random(1, 999);
      this.showModalFiles = true;
    },
    returnTypePosition(type) {
      return returnTypePosition(type)[0];
    },
    addDock(val) {
      val.target.files.forEach(f => {
        this.docFiles.push(f);
      });

      this.keyWhenModalGenerate = random(10, 999);
      this.isChangeFolderFile = true;
    },
    async addProvider() {
      const res = await this.fetchGetProviders();
      this.allProvider = res;
      this.key_provider_modal = random(1, 999);
    },
    selectDeficitMaterial(mat) {
      this.selected_material = mat;
    },
    pushMaterial() {
      const position = posToDeliveries(this.selected_material, this.position_lists);
      this.selected_material = null;
      if (!position) return false;

      this.position_lists.push(position);
    },
    editArt(inx, val) {
      this.position_lists[inx].art = val;
    },
    editKol(inx, val) {
      const check = toNumber(val);
      if (!check || val < 1) return this.position_lists[inx].kol = 1;

      this.position_lists[inx].kol = toNumber(val);
    },
    editSum(inx, val) {
      this.position_lists[inx].sum = val;
      this.changeMainSum();
    },
    editDescription(inx, val) {
      this.position_lists[inx].description = val;
    },
    changeMainSum() {
      this.count = 0;
      if (this.position_lists.length) {
        this.position_lists.forEach(s => 
          this.count = Number(this.count) + (Number(s.sum) * Number(s.kol))
        )
      }
    },
    newPosition() {
      this.key_position = random(1, 999);
      this.show_position = true;
    },
    clear() {
      this.position_lists = [];
      this.count = 0;
    },
    clearToSelect() {
      if (!this.select_m) return 0;
      this.position_lists = this.position_lists.filter(e => e.id != this.select_m.id);
    },
    setSelected(material) {
      this.select_m = material;
    },
    checkMaterialList() {
      if (!this.position_lists.length) return false;
      for (const mat of this.position_lists) {
        console.log(mat, 'mat')
        if(!Number(mat.ez) || !mat.ez) mat.ez = 1;
      }
    },
    async save() {
      if (!this.provider) return showMessage('', 'Выберите поставщика', 'w');
      if (!this.position_lists.length) return showMessage('', 'Выберите позиции для прихода', 'w');
      if (!this.number_check) return showMessage('', 'Введите номер счета', 'w');
      this.checkMaterialList();

      this.formData.append('provider_id', this.provider.id);
      this.formData.append('number_check', this.number_check);
      this.formData.append('nds', this.nds);
      this.formData.append('count', this.count);
      this.formData.append('position_lists', JSON.stringify(this.position_lists));
      this.formData.append('date_shipments', this.date_shipments);
      this.formData.append('description', this.description);

      if (this.$props.order_parametr) {
        this.formData.append('id', this.$props.order_parametr.id);
          const res = await this.updateDeliveries(this.formData);
          if(!res) 
            return showMessage('', 'Произошла ошибка при создании поставки', 'e');
          
          showMessage('', 'Успешно!', 's', this);
          this.$emit('unmount', res);
          this.destroyModalF();
      } else {
        const res = await this.fetchNewDeliveries(this.formData);
        if (!res) 
          return showMessage('', 'Произошла ошибка при создании поставки', 'e');

        showMessage('', 'Успешно!', 's', this);
        this.$emit('unmount', res);
        this.destroyModalF();
      }
    },
    editVariables(order) {
      this.provider = order.provider;
      this.number_check = order.number_check;
      this.nds = order.nds;
      this.count = order.count;
      this.description = order.description;
      if (order.product)
        try { this.position_lists = JSON.parse(order.product) } 
          catch (e) { console.error(e) }

      if (order.documents && order.documents.length) {
        this.name_check = order.documents[0].name;
        this.docFiles = order.documents;
      }
      
      this.date_shipments = order.date_shipments;
    },
    // Выбираем Единицу измерения
    changeValuesEz(inx, val) {
      let ez_position = Number(val.value);
      this.position_lists[inx].ez = ez_position;

      const material = this.getOneMaterialById(this.position_lists[inx].id);
      if (!material) return false;
      try {
        const pars = JSON.parse(material.ez_kolvo);
        if (!pars) return;
        this.position_lists[inx].def = Object.values(pars)[ez_position--].shipments_kolvo;
      }catch(err) { console.error(err, 'changeValuesEz') }
    },
    // Сбрасываем единицу измерения
    changeClickEz(inx) {
      try {
        const ez = returnSpanEz(this.position_lists[inx].kolvo) ? 
          JSON.parse(this.position_lists[inx].kolvo) : 1;

        this.position_lists[inx].ez = ez;
      } catch (err) { console.error(err) }
    },
    getOneMaterialById(id) {
      const find_material = this.getOnePodMaterial.filter(met => met.id == id);
      if (!find_material && !find_material.length) return false;
      return find_material[0];
    }
  },
  async mounted() {
    this.fetchGetAllDeficitPPM();

    if (this.$props.order_parametr)
      this.editVariables(this.$props.order_parametr);
  },
}
</script>

<style scoped>
.textarea {
  margin: 10px;
  width: 48%;
  height: 120px;
}
.header_block * {
  margin-left: 6px;
}
.header_block input{
  width: 50%;
}
.block {
  margin-bottom: 10px;
}
table {
  width: 100%;
}
.table_material {
  height: 100%;
  width: auto;
}
.two_header * {
  margin:4px;
}
.two_header input{
  width:23%;
}
.two_header  p {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  width: 50vw;
}
.table_material {
	display: flex;
  height: 650px !important;
} 
.table_material_provider {
  height: 650px !important;
}
.left-block-modal {
  width: 50vw;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1vw;
  }
  to {
    width: 50vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 50vw;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 20vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 70vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>