<template>
  <div class='main_cbed'>
    <div class='block_cb_ed'>
      <h3>База сборочных единиц</h3>
      <div class="main">
        <div class="main_table_control">
          <div class="scroll-table" >
            <table class="table-base-detal">
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
                    :placeholder="'Поиск по Артиклу'"
                    @unmount='keySearchProduct' 
                  />
                </td>
              </tr>
              <tr v-for='product in allProduct' 
                  :key='product'
                  class='td-row'
                  @click='e => setProduct(product, e.target.parentElement)'
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
          <div class="scroll-table" >
            <table class="table-base-detal">
              <tr>
                <th colspan="3" scope="col">Сборочная единица (Тип СБ)
                  <span class='exclamation tooltip' @click='sortToAttention'>
                    <unicon name="exclamation" fill="red" />
                    <span class='tooltiptext'>Соритировать по отметке</span>
                  </span> 
                </th>
              </tr>
              <tr>
                <th>Артикул</th>
                <th>Наименование</th>
                <th style='width: 50px;'>Кол-во СБ на Изделие</th>
              </tr>
              <tr>
                <td colspan="3">
                  <Search 
                    :placeholder="'Поиск по Артиклу'"
                    @unmount='keySearch' 
                  />
                </td>
              </tr>
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
      <textarea maxlength='250' style="width: 90%; height: 120px;" cols="30" rows="10" :value='selectedCbEd.description'> </textarea>
      </div>
      <div v-if='selectedCbEd.documents.length > 0'>
        <h3>Документы</h3>
        <table style="width: 100%;">
          <tr>
            <th>Файл</th>
          </tr> 
          <tr class="td-row" v-for='doc in selectedCbEd.documents' 
            :key='doc'
              @click='setDocs(doc)'>
            <td>{{ doc.name }}</td>
          </tr>
        </table>
        <div class="btn-control" style='width: 100%'>
        <button class="btn-small" @click='openDock'>Открыть</button>
        </div>
        <OpensFile 
          :parametrs='itemFiles' 
          v-if="showFile" 
          @unmount='openFile'
          :key='keyWhenModalGenerateFileOpen'
        />
      </div> 
    </div>
    </div>
    <Loader v-if='loader' />
  </div>
</template>
 
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Search from '@/components/search.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import { random } from 'lodash';
import MediaSlider from '@/components/filebase/media-slider.vue';

export default {
  data() {
    return {
      selectedCbEd: null,
      selecteProduct: null,
      tr_cb: null,
      tr_product: null,

      itemFiles: null,
      showFile: false,
      keyWhenModalGenerateFileOpen: random(1, 23123),

      loader: false
    }
  },
  computed: mapGetters(['allCbed', 'allProduct']),
  components: {Search, OpensFile, MediaSlider},
  methods: {
    ...mapActions(['getAllCbed', 'deleteCbedById', 'getAllProduct']),
    ...mapMutations([
      'setOneCbed', 
      'searchCbed', 
      'searchProduct', 
      'setOneProduct', 
      'getAllCbEdByProduct',
      'clearFilterCbedByProduct', 
      'filterToAttentionCbed'
    ]),
    setCbed(cbEd, e) {
      this.selectedCbEd = cbEd
        if(this.tr_cb) 
          this.tr_cb.classList.remove('td-row-all')
  
      this.tr_cb = e
      this.tr_cb.classList.add('td-row-all')
      this.setOneCbed(this.selectedCbEd)
    },
    sortToAttention() {
      this.filterToAttentionCbed()
    },
    setProduct(product, e) {
      if(this.selecteProduct && this.selecteProduct.id == product.id) {
        this.clearFilterCbedByProduct()
        e.classList.remove('td-row-all')
        this.selecteProduct = null
        return
      }
      this.selecteProduct = product
      if(this.tr_product) 
        this.tr_product.classList.remove('td-row-all')
  
      this.setOneProduct(product)
      this.getAllCbEdByProduct(product)

      this.tr_product = e
      this.tr_product.classList.add('td-row-all')
    },
    editCbEd() {
      if(!this.selectedCbEd)
        return 0
      this.$router.push({path: '/cbed/edit/false'})
    },
    create() {
      this.$router.push({path: '/cbed/create'})
    },
    createCopy() {
      if(!this.selectedCbEd)
        return 0

      this.$router.push({path: '/cbed/edit/true'})
    },
    keySearch(v) {
      this.searchCbed(v)
    },
    keySearchProduct(v) {
      this.searchProduct(v)
    },
    deleteCbEd() { 
      if(!this.selectedCbEd)
        return 0

      this.deleteCbedById(this.selectedCbEd.id)
    },
    setDocs(dc) {
      this.itemFiles = dc
      this.showFile = true
      this.keyWhenModalGenerateFileOpen = random(1, 999)
    },
  },
  async mounted() {
    this.loader = true

    await this.getAllProduct()
    await this.getAllCbed()
    
    this.loader = false
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