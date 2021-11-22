<template>
  <div>
    <h3>База деталей</h3>
    <div class='main'>
      <div class="main_table_control">
        <div>
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
              <tr >
                <td class="tb-title" colspan="3" scope="col"> Без назначенного изделия </td>
              </tr> 
              <tr>
                <td colspan="3">
                  <Search 
                    :placeholder="'Поиск по Артиклу'"
                    @unmount='keySearchProduct' 
                  />
                </td>
              </tr>
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
                <th colspan="3" scope="col">Сборочная единица (Тип СБ)</th>
              </tr>
              <tr>
                <th>Артикул</th>
                <th>Наименование</th>
                <th style='width: 50px;'>Кол-во СБ на Изделие</th>
              </tr>
                <tr>
                  <td class="tb-title" colspan="3" scope="col">Баз назначенного СБ</td>
                </tr>
              <tr>
                <td colspan="3">
                  <Search 
                    :placeholder="'Поиск по Артиклу'"
                    @unmount='keySearchCb' 
                  />
                </td>
              </tr>
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
                    :placeholder="'Поиск по Артиклу'"
                    @unmount='keySearch' 
                  />
                </td>
              </tr>
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
      v-if='detalIsShow'
    />
    <CbedModalInfo
      :parametrs='parametrs_cbed'
      :key='cbedModalKey'
      v-if='parametrs_cbed'
    />
    <ProductModalInfo
      :parametrs='parametrs_product'
      :key='productModalKey'
      v-if='parametrs_product'
    />
    <Loader v-if='loader' />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DetalModal from '@/components/basedetal/detal-modal.vue';
import { random } from 'lodash';
import Search from '@/components/search.vue';
import CbedModalInfo from '@/components/cbed/cbed-modal.vue';
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
      detalModalKey: random(1, 123e2),
      detalIsShow: false,
      cbedModalKey: random(1, 999),
      parametrs_cbed: null,
      parametrs_product: null,
      productModalKey: random(1, 999),

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
      'getAllCbed'
    ]),
    ...mapMutations([
      'addOneSelectDetal', 
      'filterDetalToArticle',
      'clearFilterCbedByProduct',
      'getAllCbEdByProduct',
      'searchCbed',
      'searchProduct',
      'getAllDetalByProduct',
      'clearFilterDetalByProduct', 
      'filterToAttention',
      'setOneProduct',
      'setOneCbed'
    ]),
    infoModalCbed(cb) {
      if(!cb) return false
      this.parametrs_cbed = cb
      this.cbedModalKey = random(1, 999)
    },
    infoModalProduct(product) {
      if(!product) return false 
      this.parametrs_product = product
      this.productModalKey = random(1, 999)
    },
    setDetals(detal, e) {
      this.selectedDetal = detal
        if(this.tr) 
          this.tr.classList.remove('td-row-all')
      
      this.tr = e
      this.tr.classList.add('td-row-all')
      this.addOneSelectDetal(this.selectedDetal)
    },
    sortToAttention() {
      this.filterToAttention()
    },
    infoDetal() {
      if(!this.selectedDetal) return false

      this.detalModalKey = random(1, 34e5)
      this.detalIsShow = true
    },
    setCbed(cbEd, e) {
      if(this.selectedCbEd && this.selectedCbEd.id == cbEd.id) {
        this.clearFilterDetalByProduct()
        e.classList.remove('td-row-all')
        return this.selectedCbEd = null
      }
      this.selectedCbEd = cbEd
      if(this.tr_cb) 
        this.tr_cb.classList.remove('td-row-all')

      this.getAllDetalByProduct(cbEd)
      this.setOneCbed(cbEd)

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

      this.selecteProduct = product
      this.setOneProduct(product)
      if(this.tr_product) 
        this.tr_product.classList.remove('td-row-all')
  
      this.getAllCbEdByProduct(product)
      this.getAllDetalByProduct(product)

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
    }

  },
  async mounted() {
    this.loader = true

    this.getAllProduct()
    this.getAllCbed()
    await this.getAllDetals()

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