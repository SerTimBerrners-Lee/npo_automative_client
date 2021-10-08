<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <div>
            <h3>База сборных единиц</h3>
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
            </div>
              <div class="btn-control">
                <p>
                  <button 
                    class="btn-small btn-add"
                    @click='responsCbed'>
                    Выбрать
                  </button>
                </p>
            </div>
            <DetalModal
              :key='detalModalKey'
              v-if='detalIsShow'
            />
            <!-- Cbed List -->
            <div v-if='cbedList.length > 0'>
            <table>
              <tr>
                <th>Артикул</th>
                <th>Выбранное</th>
                <th>ЕИ</th>
                <th>Количество</th>
                <th>Действие</th>
              </tr>
              <tr v-for='cb of cbedList' :key='cb'>
                <td class='td_kolvo'>
                  <input 
                    class='inputs-small' 
                    type='text' 
                    :value='cb.art'
                    @change='e => changeArt(e.target,cb)'
                  >
                </td>
                <td>{{ cb.cb.name }}</td>
                <td>
                  <select  class='select-small' 
                      @change='e => selecter(e.target, cb)' 
                      v-model='cb.ez'>
                    <option value='1' v-if="cb.ez == 1 || cb.ez"> шт</option> 
                    <option value='2' v-if="cb.ez == 2 || cb.ez"> л </option>
                    <option value='3' v-if="cb.ez == 3 || cb.ez"> кг</option> 
                    <option value='4' v-if="cb.ez == 4 || cb.ez"> м </option>
                    <option value='5' v-if="cb.ez == 5 || cb.ez"> м.куб</option> 
                  </select>   
                </td>
                <td class='td_kolvo' >
                  <input class='inputs-small' 
                    type='text' 
                    :value='cb.kol'
                    @change='e => changeKolvo(e.target, cb)'
                    >
                </td>
                <td class='delete_span' @click='delCbed(cb.cb.id)'>удалить</td>
              </tr>
            </table>
        </div>
        </div>

        <div class="btn-control out-btn-control">
        <button 
          class="btn-status btn-black" 
          style="height: 0px;" 
          @click='returnCbedList' 
          v-if='cbedList'>
          Добавить выбранное</button>
        </div>
        
      </div>
    </div>
</div> 
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'
import DetalModal from '@/components/basedetal/detal-modal.vue';
import { random } from 'lodash';
import Search from '@/components/search.vue'

export default {

  props: ['techProcessID', 'idFile', 'getListCbed', 'listCbed'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'opacity: 1;',
      
      selectedCbed: null,
      tr: null,
      detalModalKey: random(1, 123e2),
      detalIsShow: false,

      cbedList: []
    }
  },
  computed: mapGetters([
      'allCbed', 
      'allProduct']),
  components: {DetalModal, Search},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    ...mapActions([
      'getAllCbed', 'deleteCbedById', 'getAllProduct'
    ]),
    ...mapMutations([
      'searchCbed', 
      'searchProduct', 
      'setOneProduct', 
      'getAllCbEdByProduct',
      'clearFilterCbedByProduct', 
      'setOneCbed'
    ]),
    setCbed(cbEd, e) {
      this.selectedCbEd = cbEd
      if(this.tr_cb) 
        this.tr_cb.classList.remove('td-row-all')
  
      this.selectedCbed = cbEd
      this.tr_cb = e
      this.tr_cb.classList.add('td-row-all')
      this.setOneCbed(this.selectedCbEd)
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
    keySearch(v) {
      this.searchCbed(v)
    },
    keySearchProduct(v) {
      this.searchProduct(v)
    },
    responsCbed() {
      if(!this.selectedCbed)
        return 0
      
      if(this.$props.getListCbed) {
          let add = true
          if(this.cbedList.length > 0) {
            for(let cb of this.cbedList) {
              if(cb.cb.id == this.selectedCbed.id)
                add = false
            }
          }
          if(add) {
            this.cbedList.push({ 
              art: '',
              cb: {
                name: this.selectedCbed.name,
                id: this.selectedCbed.id
              },
              kol: 1,
              ez: 1
            });
          }
          return 0
      }
      this.$emit("responsCbed", this.selectedCbed)
      this.destroyModalF()
    },
    returnCbedList() {
      this.$emit("responsCbed", this.cbedList)
      this.destroyModalF()
    },
    changeKolvo(val, cb) {
      cb.kol = val.value
    },
    changeArt(val, cb) {
      cb.art = val.value
    },
    selecter(val, cb) {
      cb.ez = val.value
    },
    delCbed(id) {
      this.cbedList = this.cbedList.filter(cb => cb.cb.id != id)
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;'

    this.getAllProduct()
    this.getAllCbed()
    if(this.$props.listCbed)
      this.cbedList = this.$props.listCbed
  }
}
</script>

<style scoped>
.delete_span {
  padding-top: 2px;
}
.out-btn-control {
  margin-top: 20px;
}
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
    
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  height: 10000px;
  width: 70%;
}
.left-block-modal {
  width: 30%;
  height: 10000px;
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
      width: 1%;
  }
  to {
      width: 70%;
  }
}
@keyframes width-right {
  from {
      width: 0%;
  }
  to {
      width: 30%;
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
      width: 30vw;
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