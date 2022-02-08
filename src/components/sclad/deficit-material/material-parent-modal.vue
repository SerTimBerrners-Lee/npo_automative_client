<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Принадлежность материала.</h3>
			<div class="block">
        <div class='table_block'>
          <p>Принадлежность к <strong>Изделиям</strong>: {{ products.length }}</p>
          <table v-if='products.length'>
            <tbody>
              <tr>
                <th>Наименование</th>
                <th>В комплектации</th>
                <th class='tooltip'>Мин. остаток
                  <p class="tooltiptext">Количество * Мин остаток * 2</p>
                </th>
                <th class='tooltip'>Потребность по заказам
                  <p class="tooltiptext">Количество * Потребность по заказам * 2</p>
                </th>
                <th>ЕИ</th>
              </tr>
            </tbody>
            <tbody v-for='product of products' :key="product" >
              <tr>
                <td rowspan='2'>{{ product.name }}</td>
              </tr>
              <tr v-for='mat of product.materialList' :key='mat'>
                <td class='center'>{{ Math.round(mat.kol) }}</td>
                <td class='center'>{{ Math.round(mat.kol) * Number(product.min_remaining) * 2 }}</td>
                <td class='center'>{{ Math.round(mat.kol) * Number(product.shipments_kolvo) * 2 }}</td>
                <td class="center" v-if='!mat.ez || mat.ez == 1'>шт</td>
                <td class="center" v-if='mat.ez == 2'>л</td>
                <td class="center" v-if='mat.ez == 3'>кг</td>
                <td class="center" v-if='mat.ez == 4'>м</td>
                <td class="center" v-if='mat.ez == 5'>м.куб</td>
              </tr>
            </tbody>
          </table>
        </div>

       <div class='table_block'>
        <p>Принадлежность к <strong>Сборкам</strong>: {{ cbeds.length }}</p>
				<table v-if='cbeds.length'>
          <tbody>
            <tr>
              <th>Наименование</th>
              <th>В комплектации</th>
              <th class='tooltip'>Мин. остаток
                <p class="tooltiptext">Количество * Мин остаток * 2</p>
              </th>
              <th class='tooltip'>Потребность по заказам
                <p class="tooltiptext">Количество * Потребность по заказам * 2</p>
              </th>
              <th>ЕИ</th>
            </tr>
          </tbody>
          <tbody v-for='cbed of cbeds' :key="cbed" >
            <tr>
              <td rowspan='2'>{{ cbed.name }}</td>
            </tr>
            <tr v-for='mat of cbed.materialList' :key='mat'>
              <td class='center'>{{ Math.round(mat.kol) }}</td>
              <td class='center'>{{ Math.round(mat.kol) * Number(cbed.min_remaining) * 2 }}</td>
              <td class='center'>{{ Math.round(mat.kol) * Number(cbed.shipments_kolvo) * 2 }}</td>
              <td class="center" v-if='!mat.ez || mat.ez == 1'>шт</td>
              <td class="center" v-if='mat.ez == 2'>л</td>
              <td class="center" v-if='mat.ez == 3'>кг</td>
              <td class="center" v-if='mat.ez == 4'>м</td>
              <td class="center" v-if='mat.ez == 5'>м.куб</td>
            </tr>
          </tbody>
				</table>
       </div>
      
      <div class='table_block'>
        <p>Принадлежность к <strong>Деталям</strong>: {{ detals.length }}</p>
				<table v-if='detals.length'>
          <tbody>
            <tr>
              <th>Наименование</th>
              <th>В комплектации</th>
              <th class='tooltip'>Мин. остаток
                <p class="tooltiptext">Количество * Мин остаток * 2</p>
              </th>
              <th class='tooltip'>Потребность по заказам
                <p class="tooltiptext">Количество * Потребность по заказам * 2</p>
              </th>
              <th>ЕИ</th>
            </tr>
          </tbody>
          <tbody v-for='detal of detals' :key="detal" >
            <tr>
              <td rowspan='2'>{{ detal.name }}</td>
            </tr>
            <tr v-for='mat of detal.materialList' :key='mat'>
              <td class='center'>{{ Math.round(mat.kol) }}</td>
              <td class='center'>{{ Math.round(mat.kol) * Number(detal.min_remaining) * 2 }}</td>
              <td class='center'>{{ Math.round(mat.kol) * Number(detal.shipments_kolvo) * 2 }}</td>
              <td class="center" v-if='!mat.ez || mat.ez == 1'>шт</td>
              <td class="center" v-if='mat.ez == 2'>л</td>
              <td class="center" v-if='mat.ez == 3'>кг</td>
              <td class="center" v-if='mat.ez == 4'>м</td>
              <td class="center" v-if='mat.ez == 5'>м.куб</td>
            </tr>
          </tbody>
				</table>
      </div>
			</div>
    </div>
  </div>
</div>
</template>
<script>
import {mapActions} from 'vuex';

export default {
  props: ['mat_id'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      parents: [],

      products: [],
      cbeds: [],
      detals: [],
    }
  },
  components: {},
  methods: {
    ...mapActions(['fetchMatRemParent']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 

    const mat_id = this.$props.mat_id
    if(!mat_id) return this.destroyModalF()
    this.parents = await this.fetchMatRemParent(mat_id)
    if(!this.parents) return this.destroyModalF()

    this.products = this.parents.filter(el => el.type =='prod')
    this.cbeds = this.parents.filter(el => el.type =='cbed')
    this.detals = this.parents.filter(el => el.type =='detal')

    console.log(this.cbeds)

    console.log(this.parents)
    
  },
}
</script>

<style scoped>
.out-btn-control {
  width: 96%;
}
table { 
  width: 100%;
  margin-bottom: 50px;
  margin-top: 100px;
}
.block * {
  margin: 3px;
}
.block {
  display: flex;
  flex-direction: column;
}
.block p {
  display: flex;
  align-items: center;
  font-size: 13px;
}
textarea {
  height: 130px;
}
.table_block {  
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>