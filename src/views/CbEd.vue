<template>
  <div class='main_cbed'>
    <div class='block_cb_ed'>
      <h3>База сборочных единиц</h3>
      <div class="main">
        <div class="main_table_control">
          <div>
            <div class="scroll-table" >
              <table class="table-base-detal">
                <tr>
                  <th style='font-size: 12px'>Кол-во: {{allProduct.length}}</th>
                  <th style='font-size: 12px'>Без операций: {{ сolNotOperation(allProduct, productOperation) }}</th>
                  <th style='font-size: 12px'>
                    <span class='hover tooltip' @click='sortOperationProduct'>Сортировать 
                      <span class='tooltiptext'>Показать {{  allProduct.length == productOperation.length ? "все" : 'без операций' }}
                      </span>
                  </span>
                  </th>
                </tr>
                <tbody class='fixed_table_10'>
                  <tr>
                    <th colspan="3" scope="col">Изделие</th>
                  </tr> 
                  <tr> 
                    <th>Заводской номер</th>
                    <th>Артикул</th> 
                    <th>Наименование</th> 
                  </tr>
                  <tr> 
                    <td colspan="3">
                      <Search 
                        :placeholder="'Поиск по Артиклу, Наименованию и Номеру'"
                        @unmount='keySearchProduct' 
                      />
                    </td>
                  </tr>
                </tbody>
                <tr v-for='product in allProduct' 
                  :key='product'
                  class='td-row'
                  @click='e => setProduct(product, e.target.parentElement)'
                  @dblclick="infoModalProduct(product)"
                  >
                  <td>{{ product.fabricNumber }}</td>
                  <td>{{ product.articl }}</td>
                  <td>{{ product.name }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </div>
            <div class="btn-control">
              <p>
                <button class="btn-small btn-add" @click='createProduct'>Создать</button>
                <button class="btn-small btn-add" @click='createCopyProduct'>Создать копированием</button>
                <button class="btn-small" @click='editProduct'>Редактировать</button>
              </p>
            </div>
          </div>
          <div class="scroll-table">
            <QuickFilter 
              @attention='sortToAttention'
              @date_first='sortToDate'
              @my_object='sortToMyObject'
            />
            <table class="table-base-detal">
              <tr>
                <th style='font-size: 12px'>Кол-во: {{allCbed.length}}</th>
                <th style='font-size: 12px'>Без операций: {{сolNotOperation(allCbed, cbedOperation)}}</th>
                <th style='font-size: 12px'><span class='hover tooltip' @click='sortOperationCbed'>Сортировать 
                  <span class='tooltiptext'>Показать {{  allCbed.length == cbedOperation.length ? "все" : 'без операций' }}</span></span></th>
              </tr>
              <tbody class='fixed_table_10'>
                <tr>
                  <th colspan="3" scope="col">Сборочная единица (Тип СБ)</th>
                </tr>
                <tr>
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th style='width: 50px;'>Кол-во СБ на Изделие</th>
                </tr>
                <tr>
                  <td colspan="3">
                    <Search 
                      :placeholder="'Поиск по Артиклу Артиклу и Наименованию'"
                      @unmount='keySearch' 
                    />
                  </td>
                </tr>
              </tbody>
              <tr v-for='cb in allCbed' 
                :key='cb'
                class='td-row'
                @click='e => setCbed(cb, e.target.parentElement)'>
                <td>{{ cb.articl }}</td>
                <td>{{ cb.name }} <span class='exclamation_item' v-if='cb.attention'>!</span></td>
                <td class='center'>{{ cb.kolvo_for_product ? cb.kolvo_for_product : '' }}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
        <div class="btn-control">
          <p>
            <button class="btn-small btn-add" @click='create'>Создать</button>
            <button class="btn-small btn-add" @click='createCopy'>Создать копированием</button>
            <button class="btn-small" @click='editCbEd'>Редактировать</button>
          </p>
            <p>
              <button class="btn-small" @click='deleteCbEd'>В архив</button>
            </p>
        </div>
      </div>
    </div>
    
    <div class="right_info_block" v-if='selectedCbEd'>
      <h3>Краткая Информация о сборочной единице</h3>
      <div class="block">
        <p>
          <span class="title_span">Наименование: </span><span style='font-weight:bold;'>{{ selectedCbEd.name }}</span>
        </p>
        <p>
          <span class="title_span">Артикул: </span><span style='font-weight:bold;'>{{ selectedCbEd.articl }}</span>
        </p>
        <MediaSlider v-if='selectedCbEd.documents.length' :data='selectedCbEd.documents' :key='selectedCbEd.documents' />
        <button 
          style='width: 98%;'
          class="btn" 
          v-if='selectedCbEd' 
          @click='editCbEd'>Полная информация</button>
        <div>
          <h3>Спецификация Сборочной единицы</h3>
          <TableSpetification
            :listCbed='listCbed'
            :listDetal='listDetal'
            :listPokDet='listPokDet'
            :materialList='materialList'
            :izd='selectedCbEd'
            :type_izd='"cbed"'
          />
        </div>
        <div v-if='selectedCbEd.haracteriatic'>
          <h3>Характеристики</h3>
          <p v-for='har in JSON.parse(selectedCbEd.haracteriatic)' :key='har'>
            <span>{{ har.name }}({{har.ez}}): </span>
            <span style='font-weight:bold;'>{{ har.znach }} </span>
          </p>
        </div>
        <div v-if='selectedCbEd.parametrs'>
          <h3>Параметры</h3>
          <p v-for='par in JSON.parse(selectedCbEd.parametrs)' :key='par'>
            <span>{{ par.name }}({{par.ez}}): </span>
            <span style='font-weight:bold;'>{{ par.znach }} </span>
          </p>
        </div>
        <div>
        <h3>Описание / Примечание</h3>
          <textarea maxlength='250' style="width: 90%; height: 120px;" :value='selectedCbEd.description'> </textarea>
        </div>
        <h3 class="link_h3" @click='showTechProcess' v-if='selectedCbEd.techProcesses'>Технологический процес</h3>
        <TableDocument v-if='selectedCbEd.documents.length'
          :key='selectedCbEd.id'
          :documents='selectedCbEd.documents'/>
        <h3 class="link_h3" @click='showModalNode'>Принадлежность</h3>
        <NodeParent
          v-if='selectedCbEd && show_node_modal'
          :izd='selectedCbEd'
          :key='key_node_modal'
          :no_show_det='"true"'
          :css='"full"'
          :title='" "'
          />
      </div>
    </div>
    <Loader v-if='loader' /> 
    <TechProcess 
      v-if='techProcessIsShow' 
      :key='techProcessKey'
      @unmount='unmount_tech_process'
      :techProcessID='techProcessID'
    />
    <ProductModalInfo
      :id='parametrs_product'
      :key='productModalKey'
      v-if='parametrs_product'
    />
  </div>
</template>

<script>
import { random, isEmpty } from 'lodash';
import NodeParent from '@/components/MathZag/TableNode';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import MediaSlider from '@/components/FileBase/MediaSlider';
import { eSelectSpan, parseSpetification } from '@/js/methods';
import TableDocument from '@/components/FileBase/TableDocument';
import TechProcess from '@/components/BaseDetal/TechProcessModal';
import ProductModalInfo from '@/components/BaseProduct/ProductModal';
import TableSpetification from '@/components/CbEd/TableSptification';

export default {
  data() {
    return {
      selectedCbEd: null,
      selecteProduct: null,
      tr_cb: null,
      tr_product: null,

      itemFiles: null,
      showFile: false,
      keyWhenModalGenerateFileOpen: random(1, 999),
      techProcessIsShow: false, 
      techProcessKey: random(1, 999),
      techProcessID: null,
      materialList: [],
      listPokDet: [],
      listDetal: [],
      listCbed: [],
      productModalKey: random(1, 999),
      parametrs_product: null,

      show_node_modal: false,
      key_node_modal: random(1, 999),

      productOperation: [],
      cbedOperation: [],

      loader: false
    }
  },
  computed: mapGetters(['allCbed', 'allProduct', 'getAuth']),
  components: {
    MediaSlider, 
    TechProcess, 
    TableSpetification,
    ProductModalInfo,
    TableDocument,
    NodeParent,
  },
  methods: {
    ...mapActions([
      'getAllCbed', 
      'deleteCbedById', 
      'getAllProduct',
      'getAllProductById',
      'getOneCbEdById',
      'fetchAllProductOperation',
      'fetchAllCbedOperation',
    ]),
    ...mapMutations([
      'setOneCbed', 
      'searchCbed', 
      'searchProduct', 
      'getAllCbEdByProduct',
      'clearFilterCbedByProduct', 
      'filterToAttentionCbed',
      'setOneProduct',
      'sortByNonOperationProduct',
      'sortByNonOperationCbed',
      'filterCbedToDate',
      'filterCbedToMyObject'
    ]),
    showModalNode() {
      if(!this.selectedCbEd) return false;
      if(typeof this.selectedCbEd.cbed == 'string') 
        this.selectedCbEd.cbed = JSON.parse(this.selectedCbEd.cbed);
      this.show_node_modal = !this.show_node_modal;
      this.key_node_modal = random(1, 999);
    },
    async setCbed(cbed, e) {
      this.show_node_modal = false;

      const res = await this.getOneCbEdById(cbed.id);
      if(!res) return false;
      this.selectedCbEd = res;
      this.parseSpetification(res);
      this.setOneCbed(res);
  
      this.tr_cb = eSelectSpan(this.tr_cb, e);
    },
    sortToAttention() {
      this.filterToAttentionCbed();
    },
    sortToDate() {
      this.filterCbedToDate();
    },
    sortToMyObject() {
      this.filterCbedToMyObject(this.getAuth.id);
    },
    parseSpetification(obj) {
      const res = parseSpetification(obj)
      this.materialList = res.materialList;
      this.listPokDet = res.listPokDet;
      this.listDetal = res.listDetal;
      this.listCbed = res.listCbed;
    },
    infoModalProduct(product) {
      if(!product) return false;
      this.parametrs_product = product.id;
      this.productModalKey = random(1, 999);
    },
    async setProduct(product, e) {
      if(this.selecteProduct && this.selecteProduct.id == product.id) {
        this.clearFilterCbedByProduct();
        e.classList.remove('td-row-all');
        this.selecteProduct = null;
        this.parametrs_product = null;
        return;
      }

      const res = await this.getAllProductById(product.id);
      if(!res) return false;
      this.selecteProduct = res;
      this.setOneProduct(res);
      this.getAllCbEdByProduct(res);

      this.tr_product = eSelectSpan(this.tr_product, e);
    },
    editCbEd() {
      if(!this.selectedCbEd) return 0;

      this.$router.push({path: '/cbed/edit/false'});
    },
    create() {
      this.$router.push({path: '/cbed/create'});
    },
    createCopy() {
      if(!this.selectedCbEd) return 0;

      this.$router.push({path: '/cbed/edit/true'});
    },
    createProduct() {
      this.$router.push('/createproduct');
    },
    createCopyProduct() {
      if(!this.selecteProduct) return 0;

      this.$router.push({path: '/product/edit/true'});
    },
    editProduct() {
      if(!this.selecteProduct) return 0;

      this.$router.push({path: '/product/edit/false'});
    }, 
    keySearch(v) {
      this.searchCbed(v);
    },
    keySearchProduct(v) {
      this.searchProduct(v);
    },
    deleteCbEd() { 
      if(!this.selectedCbEd) return 0;

      this.deleteCbedById(this.selectedCbEd.id);
    },
    sortOperationProduct() {
      this.sortByNonOperationProduct(this.productOperation);
    },
    sortOperationCbed() {
      this.sortByNonOperationCbed(this.cbedOperation);
    },
    сolNotOperation(arr_one, arr_two) {
      let counter = 0;
      for(const item of arr_one) {
        for(const id of arr_two) {
          if(item.id == id) counter++;
        } 
      }
      return counter;
    },
    setDocs(dc) {
      this.itemFiles = dc;
      this.showFile = true;
      this.keyWhenModalGenerateFileOpen = random(1, 999);
    },
    showTechProcess() {
      if(isEmpty(this.selectedCbEd)) return false;
      if(!this.selectedCbEd.techProcesses) return false;
      this.techProcessID = this.selectedCbEd.techProcesses.id;
      this.techProcessIsShow = true;
      this.techProcessKey = random(1, 999);
    },
  },
  async mounted() {
    this.loader = true;
    await this.getAllProduct(true);
    await this.getAllCbed(true);

    this.productOperation = await this.fetchAllProductOperation();
    this.cbedOperation = await this.fetchAllCbedOperation();
    this.loader = false;
  }
}
</script>

<style scoped>
.table-base-detal {
  float: left; 
  width: 470px;
}
.main {
  width: fit-content;
}
td {
  height: 10px;
}
.scroll-table {
  height: 700px;
}
.tb-title {
  height: 50px;
  text-align: center;
}
.btn-control {
  flex-direction: column;
  align-items: flex-end;
}
.btn-control button {
  margin: 2px;
}
table {
  font-size: 14px;
}
.main_table_control {
  display: flex;
}
.right_info_block {
  width: 450px;
  margin-top: 20px;
  margin-left: 10px;
}
.main_cbed {
  display: flex;
}

</style>