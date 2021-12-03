<template>
  <div>
    <h3>База деталей</h3>
    <div class='main'>
      <div class="main_table_control">
        <div>
          <div class="scroll-table" >
            <table class="table-base-detal">
              <tr>
                <th style='font-size: 12px'>Кол-во: {{allProduct.length}}</th>
                <th style='font-size: 12px'>Без операций: {{ сolNotOperation(allProduct, productOperation) }}</th>
                <th style='font-size: 12px'><span class='hover tooltip' @click='sortOperationProduct'>Сортировать 
                  <span class='tooltiptext'>Показать {{  allProduct.length == productOperation.length ? "все" : 'без операций' }}</span></span></th>
              </tr>
              <tbody class='fixed_table'>
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
              <tr 
                v-for='product in allProduct' 
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
        <div>
          <div class="scroll-table" >
            <table class="table-base-detal">
              <tr>
                <th style='font-size: 12px'>Кол-во: {{allCbed.length}}</th>
                <th style='font-size: 12px'>Без операций: {{сolNotOperation(allCbed, cbedOperation)}}</th>
                <th style='font-size: 12px'><span class='hover tooltip' @click='sortOperationCbed'>Сортировать 
                  <span class='tooltiptext'>Показать {{  allCbed.length == cbedOperation.length ? "все" : 'без операций' }}</span></span></th>
              </tr>
              <tbody class='fixed_table'>
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
                      :placeholder="'Поиск по Артиклу и Наименованию'"
                      @unmount='keySearchCb' 
                    />
                  </td>
                </tr>
              </tbody>
              <tr v-for='cb in allCbed' 
                :key='cb'
                class='td-row'
                @click='e => setCbed(cb, e.target.parentElement)'
                @dblclick="infoModalCbed(cb)">
                <td>{{ cb.articl }}</td>
                <td>{{ cb.name }}</td>
                <td class='center'>{{ cb.kolvo_for_product ? cb.kolvo_for_product : '' }}</td>
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
              <button class="btn-small btn-add" @click='createCbed'>Создать</button>
              <button class="btn-small btn-add" @click='createCopyCbed'>Создать копированием</button>
              <button class="btn-small" @click='editCbEd'>Редактировать</button>
            </p>
          </div>
        </div>
        <div>
          <div class="scroll-table" >
            <table class="table-base-detal">
              <tr>
                <th style='font-size: 12px'>Кол-во: {{allDetal.length}}</th>
                <th style='font-size: 12px'>Без операций: {{сolNotOperation(allDetal, detalOperation)}}</th>
                <th style='font-size: 12px'><span class='hover tooltip' @click='sortOperationDetal'>Сортировать 
                  <span class='tooltiptext'>Показать {{  allDetal.length == detalOperation.length ? "все" : 'без операций' }}</span></span></th>
              </tr>
              <tbody class='fixed_table'>
                <tr>
                  <th colspan="3" scope="col">Деталь (Тип Д) 
                    <span class='exclamation tooltip' @click='sortToAttention'>
                      <unicon name="exclamation" fill="red" />
                      <span class='tooltiptext'>Соритировать по отметке</span>
                    </span> 
                  </th>
                </tr>
                <tr>
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th style='width: 50px;'>Кол-во Д на СБ</th>
                </tr>   
                <tr>
                  <td colspan="3">
                    <Search 
                      :placeholder="'Поиск по Артиклу и Наименованию'"
                      @unmount='keySearch' 
                    />
                  </td>
                </tr>
              </tbody>
              <tr 
                v-for='detal in allDetal' 
                :key='detal'
                class='td-row'
                @click='e => setDetals(detal, e.target.parentElement)'
                @dblclick="infoDetal"
                >
                <td>{{ detal.articl }}</td>
                <td>{{ detal.name }}
                  <span class='exclamation_item' v-if='detal.attention'>!</span></td>
                <td class='center'>{{ detal.kolvo_for_detal ? detal.kolvo_for_detal : '' }}</td>
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
              <button class="btn-small btn-add" @click='$router.push("/detal/add")'>Создать</button>
              <button class="btn-small btn-add" @click='createCopy'>Создать копированием</button>
              <button class="btn-small" @click='editDetal'>Редактировать</button>
            </p>
            <p>
              <button class="btn-small" @click='deleteDetal'>В архив</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <DetalModal
      :key='detalModalKey'
      v-if='parametrs_detal'
      :id='parametrs_detal'
    />
    <CbedModalInfo
      :id='parametrs_cbed'
      :key='cbedModalKey'
      v-if='parametrs_cbed'
    />
    <ProductModalInfo
      :id='parametrs_product'
      :key='productModalKey'
      v-if='parametrs_product'
    />
    <Loader v-if='loader' />
  </div>
</template>
<script>
import { random } from 'lodash';
import Search from '@/components/search.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import CbedModalInfo from '@/components/cbed/cbed-modal.vue';
import DetalModal from '@/components/basedetal/detal-modal.vue';
import ProductModalInfo from '@/components/baseproduct/product-modal.vue';
export default {
  data() {
    return {
      selectedCbEd: null,
      selecteProduct: null,
      tr_cb: null,
      tr_product: null,

      selectedDetal: null,
      tr: null,
      detalModalKey: random(1, 999),
      cbedModalKey: random(1, 999),
      parametrs_cbed: null,
      parametrs_detal: null,
      parametrs_product: null,
      productModalKey: random(1, 999),

      productOperation: [],
      cbedOperation: [],
      detalOperation: [],

      loader: false
    }
  },
  computed: mapGetters(['allDetal', 'allCbed', 'allProduct']),
  components: {DetalModal, Search, CbedModalInfo, ProductModalInfo},
  methods: {
    ...mapActions([
      'getAllDetals', 
      'deleteDetelyId', 
      'getAllProduct', 
      'getAllCbed',
      'getAllProductById',
      'getOneCbEdById',
      'getOneDetal',
      'fetchAllProductOperation',
      'fetchAllCbedOperation',
      'fetchAllDetalOperation'
    ]),
    ...mapMutations([
      'filterDetalToArticle',
      'clearFilterCbedByProduct',
      'getAllCbEdByProduct',
      'searchCbed',
      'searchProduct',
      'getAllDetalByProduct',
      'clearFilterDetalByProduct', 
      'filterToAttention',
      'setOneProduct',
      'setOneCbed',
      'addOneSelectDetal',
      'sortByNonOperationProduct',
      'sortByNonOperationCbed',
      'sortByNonOperationDetal'
    ]),
    infoModalCbed(cb) {
      if(!cb) return false
      this.parametrs_cbed = cb.id
      this.cbedModalKey = random(1, 999)
    },
    infoModalProduct(product) {
      if(!product) return false 
      this.parametrs_product = product.id
      this.productModalKey = random(1, 999)
    },
    setDetals(detal, e) {
      this.getOneDetal(detal.id).then(res => {
        this.selectedDetal = res
        this.addOneSelectDetal(res)
      })
      if(this.tr) 
        this.tr.classList.remove('td-row-all')
      
      this.tr = e
      this.tr.classList.add('td-row-all')
    },
    sortToAttention() {
      this.filterToAttention()
    },
    infoDetal() {
      if(!this.selectedDetal) return false

      this.detalModalKey = random(1, 999)
      this.parametrs_detal = this.selectedDetal.id
    },
    setCbed(cbed, e) {
      if(this.selectedCbEd && this.selectedCbEd.id == cbed.id) {
        this.clearFilterDetalByProduct()
        e.classList.remove('td-row-all')
        return this.selectedCbEd = null
      }
      this.selectedCbEd = cbed
      if(this.tr_cb) 
        this.tr_cb.classList.remove('td-row-all')

      this.getOneCbEdById(cbed.id).then(res => {
        if(!res) return false
        this.selectedCbEd = res
        this.getAllDetalByProduct(res)
        this.setOneCbed(res)  
      })

      this.tr_cb = e
      this.tr_cb.classList.add('td-row-all')
    },
    setProduct(product, e) {
      if(this.selecteProduct && this.selecteProduct.id == product.id) {
        this.clearFilterCbedByProduct()
        this.clearFilterDetalByProduct()
        e.classList.remove('td-row-all')
        this.selecteProduct = null
        return
      }

      this.getAllProductById(product.id).then(res => {
        if(!res) return false
        this.selecteProduct = res
        this.setOneProduct(res)
        this.getAllCbEdByProduct(res)
        this.getAllDetalByProduct(res)
      })
      if(this.tr_product) 
        this.tr_product.classList.remove('td-row-all')

      this.tr_product = e
      this.tr_product.classList.add('td-row-all')
    }, 
    editDetal() {
      if(!this.selectedDetal)
        return 0
      this.$router.push({path: '/detal/edit/false'})
    },
    createCopy() {
      if(!this.selectedDetal)
        return 0

      this.$router.push({path: '/detal/edit/true'})
    },
    createProduct() {
      this.$router.push('/createproduct')
    },
    createCopyProduct() {
      if(!this.selecteProduct)
        return 0
      this.$router.push({path: '/product/edit/true'})
    },
    editProduct() {
      if(!this.selecteProduct)
        return 0

      this.$router.push({path: '/product/edit/false'})
    }, 
    createCbed() {
      this.$router.push({path: '/cbed/create'})
    },
    createCopyCbed() {
      if(!this.selectedCbEd)  return 0
      this.$router.push({path: '/cbed/edit/true'})
    },
    editCbEd() {
      if(!this.selectedCbEd)  return 0
      this.$router.push({path: '/cbed/edit/false'})
    },
    keySearch(v) {
      this.filterDetalToArticle(v)
    },
    keySearchCb(v) {
      this.searchCbed(v)
    },
    keySearchProduct(v) {
      this.searchProduct(v)
    },
    deleteDetal() {
      if(!this.selectedDetal)
        return 0
      this.deleteDetelyId(this.selectedDetal.id)
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
    sortOperationCbed() {
      this.sortByNonOperationCbed(this.cbedOperation)
    },
    sortOperationDetal() {
      this.sortByNonOperationDetal(this.detalOperation)
    }
  },
  async mounted() {
    this.loader = true

    await this.getAllProduct(true)
    await this.getAllCbed(true)
    await this.getAllDetals(true)
    this.productOperation = await this.fetchAllProductOperation()
    this.cbedOperation = await this.fetchAllCbedOperation()
    this.detalOperation = await this.fetchAllDetalOperation()

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

</style>