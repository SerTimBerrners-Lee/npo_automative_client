<template>
  <div class='main_product_block'>
    <div class='block_product'>
      <h3>Изделия</h3>
      <div class="main_table_control">
        <div class="scroll-table" >
          <QuickFilter 
            @attention='sortToAttention'
            @date_first='sortToDate'
            @my_object='sortToMyObject'
          />
          <table class="table-base-detal">
            <tr>
              <th style='font-size: 12px'>Кол-во: {{allProduct.length}}</th>
              <th style='font-size: 12px'>Без операций: {{ сolNotOperation(allProduct, productOperation) }}</th>
              <th style='font-size: 12px'><span class='hover tooltip' @click='sortOperationProduct'>Сортировать 
                <span class='tooltiptext'>Показать {{  allProduct.length == productOperation.length ? "все" : 'без операций' }}</span></span></th>
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
                    @unmount='keySearch' 
                  />
                </td>
              </tr>
            </tbody>
            <tr v-for='product in allProduct' 
              :key='product'
              class='td-row'
              @click='e => setProduct(product, e.target.parentElement)'
              >
              <td>{{ product.fabricNumber }}</td>
              <td>{{ product.articl }}</td>
              <td>{{ product.name }}<span class='exclamation_item' v-if='product.attention'>!</span></td>
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
          <button class="btn-small" @click='editProduct'>Редактировать</button>
        </p>
        <p>
          <button class="btn-small" @click='deleteProduct'>В архив</button>
        </p>
      </div>
    </div>
    
    <div class="right_info_block" v-if='selecteProduct'>
      <h3>Краткая Информация о изделии</h3>
      <div class="block">
        <p>
          <span class="title_span">Наименование: </span>
          <span style='font-weight:bold;'>{{ selecteProduct.name }}</span>
        </p>
        <p>
          <span class="title_span">Артикул: </span>
          <span style='font-weight:bold;'>{{ selecteProduct.articl }}</span>
        </p>
        <p>
          <span class="title_span">Ответственный: </span>
          <span style='font-weight:bold;'>{{ selecteProduct.user ? selecteProduct.user.login : ''  }}</span>
        </p>
        <MediaSlider  v-if='selecteProduct.documents.length' :data='selecteProduct.documents' :key='selecteProduct.documents' />
        <button 
          style='width: 98%;'
          class="btn" 
          v-if='selectedCbEd' 
          @click='editProduct'>Полная информация</button>
        <div>
          <h3>Спетификация Изделия</h3>
          <TableSpetification
            :listCbed='listCbed' 
            :listDetal='listDetal'
            :listPokDet='listPokDet'
            :materialList='materialList'
            :izd='selecteProduct'
          />
        </div>
        <div v-if='selecteProduct.haracteriatic'>
          <h3>Характеристики</h3>
          <p v-for='har in JSON.parse(selecteProduct.haracteriatic)' :key='har'>
            <span>{{ har.name }}({{har.ez}}): </span>
            <span style='font-weight:bold;'>{{ har.znach }} </span>
          </p>
        </div>
        <div v-if='selecteProduct.parametrs'>
          <h3>Параметры</h3>
          <p v-for='par in JSON.parse(selecteProduct.parametrs)' :key='par'>
            <span>{{ par.name }}({{par.ez}}): </span>
            <span style='font-weight:bold;'>{{ par.znach }} </span>
          </p>
        </div>
        <h3 class="link_h3" @click='showTechProcess' v-if='selecteProduct.techProcesses'>Технологический процес</h3>
        <div>
        <span>Описание / Примечание</span>
        <textarea maxlength='250' style="width: 90%; height: 120px;" cols="30" rows="10" :value='selecteProduct.description'> </textarea>
        </div>
        <TableDocument v-if='selecteProduct.documents.length'
          :documents='selecteProduct.documents'/>
        <h3 class="link_h3" @click='showModalNode'>Принадлежность</h3>
        <NodeParent
          v-if='selecteProduct && show_node_modal'
          :izd='selecteProduct'
          :key='key_node_modal'
          :no_show_det='"true"'
          :no_show_cb='"true"'
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
  </div>
</template>
<script>
import { random, isEmpty } from 'lodash';
import Search from '@/components/search.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import NodeParent from '@/components/mathzag/table-node.vue';
import MediaSlider from '@/components/filebase/media-slider.vue';
import TableDocument from '@/components/filebase/table-document.vue';
import TechProcess from '@/components/basedetal/tech-process-modal.vue';
import TableSpetification from '@/components/cbed/table-sptification.vue';
export default {
  data() {
    return {
      selecteProduct: null,
      tr: null,

      itemFiles: null,
      showFile: false,
      keyWhenModalGenerateFileOpen: random(1, 999),
      techProcessID: null,
      techProcessIsShow: false,
      techProcessKey: random(1, 999),
      show_node_modal: false,
      key_node_modal: random(1, 999),

      materialList: [],
      listPokDet: [],
      listDetal: [],
      listCbed: [],

      productOperation: [],

      loader: false
    }
  },
  computed: mapGetters(['allProduct', 'getAuth']),
  components: {
    Search, 
    TableDocument, 
    MediaSlider, 
    TechProcess, 
    TableSpetification,
    NodeParent
  },
  methods: {
    ...mapActions([
      'getAllProduct', 
      'getAllProductById',
      'fetchDeleteProduct',
      'fetchAllProductOperation',
    ]),
    ...mapMutations([
      'setOneProduct', 
      'searchProduct', 
      'filterToAttentionProduct',
      'sortByNonOperationProduct',
      'filterProductToDate',
      'filterProductToMyObject'
    ]),
    setProduct(product, e) {
      this.show_node_modal = false
      if(!product) return false
      this.getAllProductById(product.id).then(res => {
        if(!res) return false
        this.selecteProduct = res
        this.setOneProduct(res)
        this.parseSpetification(res)
      })
      if(this.tr) 
        this.tr.classList.remove('td-row-all')
      this.tr = e
      this.tr.classList.add('td-row-all')
    },
    showModalNode() {
      this.show_node_modal = !this.show_node_modal
      this.key_node_modal = random(1, 999)
    },
    parseSpetification(obj) {
      this.materialList = []
      this.listPokDet = []
      this.listDetal = []
      this.listCbed = []
      try {
        if(obj.materialList)
          this.materialList = JSON.parse(obj.materialList)
        if(obj.listPokDet)
          this.listPokDet = JSON.parse(obj.listPokDet)
        if(obj.listDetal)
          this.listDetal = JSON.parse(obj.listDetal)
        if(obj.listCbed)
          this.listCbed = JSON.parse(obj.listCbed)
      } catch(e) {console.error(e)}
    },
    sortToAttention() {
      this.filterToAttentionProduct()
    },
    sortToDate() {
      this.filterProductToDate()
    },
    sortToMyObject() {
      this.filterProductToMyObject(this.getAuth.id)
    },
    editProduct() {
      if(!this.selecteProduct)
        return 0

      this.$router.push({path: '/product/edit/false'})
    }, 
    createProduct() {
      this.$router.push('/createproduct')
    },
    createCopy() {
      if(!this.selecteProduct)
        return 0
      this.$router.push({path: '/product/edit/true'})
    },
    keySearch(v) {
      this.searchProduct(v)
    },
    deleteProduct() {
      if(!this.selecteProduct)
        return 0
      this.fetchDeleteProduct(this.selecteProduct.id)
    }, 
    сolNotOperation(arr_one, arr_two) {
      let counter = 0
      for(let item of arr_one) {
        for(let id of arr_two) {
          if(item.id == id) counter++
        } 
      }
      return counter
    },
    sortOperationProduct() {
      this.sortByNonOperationProduct(this.productOperation)
    },
    setDocs(dc) {
      this.itemFiles = dc
      this.showFile = true
      this.keyWhenModalGenerateFileOpen = random(1, 999)
    },
    showTechProcess() {
      if(isEmpty(this.selecteProduct)) return false
      if(!this.selecteProduct.techProcesses) return false
      this.techProcessID = this.selecteProduct.techProcesses.id
      this.techProcessIsShow = true
      this.techProcessKey = random(1, 999)
    },
  },
  async mounted() {
    this.loader = true
    await this.getAllProduct(true)
    this.productOperation = await this.fetchAllProductOperation()
    this.loader = false
  }
}
</script>

<style scoped>
.block_cb_ed {
  width: 870px;
}
.table-base-detal {
  float: left;
  width: 500px;
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
td {
  height: 10px;
}
.main_table_control {
  display: flex;
}
.block_product {
  width: 500px;
}
.right_info_block {
  width: 450px;
  margin-left: 40px;
}
.main_product_block {
  display: flex;
}

</style>