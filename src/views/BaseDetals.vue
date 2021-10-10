<template>
    <div>
        <h3>База деталей</h3>
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
                    <tr v-for='product in allProduct' 
                        :key='product'
                        class='td-row'
                        @click='e => setProduct(product, e.target.parentElement)'
                        >
                        <td>{{ product.fabricNumber }}</td>
                        <td>{{ product.articl }}</td>
                        <td>{{ product.name }}</td>
                    </tr>
                    <tr v-for="item in 40" :key="item">
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <div class="scroll-table" >
                <table class="table-base-detal">
                    <tr>
                        <th colspan="3" scope="col">Сборочная единица (Тип СБ)</th>
                    </tr>
                    <tr>
                        <th>Артикул</th>
                        <th>Наименование</th>
                        <th>Кол-во СБ на Изделие</th>
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
                        @click='e => setCbed(cb, e.target.parentElement)'>
                        <td>{{ cb.articl }}</td>
                        <td>{{ cb.name }}</td>
                        <td></td>
                    </tr>
                    <tr v-for="item in 42" :key="item">
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <div class="scroll-table" >
                <table class="table-base-detal">
                    <tr>
                        <th colspan="3" scope="col">Деталь (Тип Д)</th>
                    </tr>
                    <tr>
                        <th>Артикул</th>
                        <th>Наименование</th>
                        <th>Кол-во Д на СБ</th>
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
                        >
                        <td>{{ detal.articl }}</td>
                        <td>{{ detal.name }}</td>
                        <td>...</td>
                    </tr>
                    <tr v-for="item in 42" :key="item">
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </div>
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
        <DetalModal
            :key='detalModalKey'
            v-if='detalIsShow'
        />
    </div>
</template>
 
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import DetalModal from '@/components/basedetal/detal-modal.vue';
import { random } from 'lodash';
import Search from '@/components/search.vue'

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
      detalIsShow: false
    }
  },
  computed: mapGetters(['allDetal', 'allCbed', 'allProduct']),
  components: {DetalModal, Search},
  methods: {
    ...mapActions([
        'getAllDetals', 
        'deleteDetelyId', 
        'getAllProduct', 
        'getAllCbed']),
    ...mapMutations([
        'addOneSelectDetal', 
        'filterDetalToArticle',
        'clearFilterCbedByProduct',
        'getAllCbEdByProduct',
        'searchCbed',
        'searchProduct',
        'getAllDetalByProduct',
        'clearFilterDetalByProduct']),
    setDetals(detal, e) {
      this.selectedDetal = detal
        if(this.tr) 
          this.tr.classList.remove('td-row-all')
      
      this.tr = e
      this.tr.classList.add('td-row-all')
      this.addOneSelectDetal(this.selectedDetal)

      this.detalModalKey = random(1, 34e5)
      this.detalIsShow = true
    },
    setCbed(cbEd, e) {
      if(this.selectedCbEd && this.selectedCbEd.id == cbEd.id) {
        this.clearFilterDetalByProduct()
        e.classList.remove('td-row-all')
        this.selectedCbEd = null
        return
      }
      this.selectedCbEd = cbEd
        if(this.tr_cb) 
          this.tr_cb.classList.remove('td-row-all')

        this.getAllDetalByProduct(cbEd)
  
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
    this.getAllProduct()
    this.getAllCbed()
    this.getAllDetals()
  }
}
</script>

<style scoped>
.table-base-detal {
  float: left;
  width: 400px;
}
.table-base-detal tr {
  height: 65px;
}
.scroll-table {
  height: 600px;
  
}
.tb-title {
  height: 50px;
  text-align: center;
}
.btn-control {
  width: 1260px;
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