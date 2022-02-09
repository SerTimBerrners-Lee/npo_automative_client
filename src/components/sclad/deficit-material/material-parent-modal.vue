<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Принадлежность материала.</h3>
			<div class="block">
        <p><strong>Поставщики: </strong><span>{{ this.countProviders }}</span></p>
        <p><strong>Инстремент: </strong><span>{{ this.countTools }}</span></p>
        <p><strong>Оборудование: </strong><span>{{ this.countEquipment }}</span></p>
        <p><strong>Сотрудник: </strong><span>{{ this.countUsers }}</span></p>
        <div class='table_block'>
          <p><strong>Изделие</strong>: {{ products.length }}</p>
          <table v-if='products.length'>
            <tbody>
              <tr>
                <th colspan="3" rowspan="1">Изделие</th>
                <th class='tooltip' rowspan="2">Материал
                  <p class="tooltiptext">Кол-во материала на 1 ед.</p>
                </th>
              </tr>
              <tr>
                <th>Наименование</th>
                <th>Дефицит</th>
                <th class='tooltip'>Дефицит по заказам покупателя</th>
              </tr>
            </tbody>
            <tbody v-for='product of products' :key="product" >
              <tr>
                <td :rowspan='product.materialList.length +2' class='center'>{{ product.name }}</td>
                <td :rowspan='product.materialList.length +2' class='center'>{{ -(Number(product.min_remaining)+Number(product.shipments_kolvo)) }}</td>
                <td :rowspan='product.materialList.length +2' class='center'>{{ -Number(product.shipments_kolvo) }}</td>
              </tr>
              <tr v-for='mat of detal.materialList' :key='mat'>
                <td class='center'>{{ Math.round(mat.kol) + " " + returnEz(mat.ez)}} </td>
              </tr>
            </tbody>
          </table>
        </div>

       <div class='table_block'>
        <p><strong>Сборка</strong>: {{ cbeds.length }}</p>
				<table v-if='cbeds.length'>
          <tbody>
            <tr>
              <th colspan="3" rowspan="1">Сборочная единица</th>
              <th class='tooltip' rowspan="2">Изделие</th>
              <th class='tooltip' rowspan="2">Материал
                <p class="tooltiptext">Кол-во материала на 1 ед.</p>
              </th>
            </tr>
            <tr>
              <th>Наименование</th>
              <th>Дефицит</th>
              <th class='tooltip'>Дефицит по заказам покупателя</th>
            </tr>
          </tbody>
          <tbody v-for='cbed of cbeds' :key="cbed" >
            <tr>
              <td :rowspan='cbed.materialList.length +2' class='center'>{{ cbed.name }}</td>
              <td :rowspan='cbed.materialList.length +2' class='center'>{{ -(Number(cbed.min_remaining)+Number(cbed.shipments_kolvo)) }}</td>
              <td :rowspan='cbed.materialList.length +2' class='center'>{{ -Number(cbed.shipments_kolvo) }}</td>
              <td :rowspan='cbed.materialList.length +2' class='center type-issue tooltip'>Изделий: {{ cbed.products.length }}
                <p class='tooltiptext'>
                  <span v-for='(item, inx) of cbed.products' :key='item'>
                    {{ inx + 1}}.  {{item.name}}
                  </span>
                </p>
              </td>
            </tr>
            <tr v-for='mat of cbed.materialList' :key='mat'>
              <td class='center'>{{ Math.round(mat.kol) + " " + returnEz(mat.ez)}} </td>
            </tr>
          </tbody>
				</table>
       </div>
      
      <div class='table_block'>
        <p><strong>Деталь</strong>: {{ detals.length }}</p>
				<table v-if='detals.length'>
          <tbody>
            <tr>
              <th colspan="3" rowspan="1">Деталь</th>
              <th class='tooltip' rowspan="2">Изделие</th>
              <th class='tooltip' rowspan="2">Материал
                <p class="tooltiptext">Кол-во материала на 1 ед.</p>
              </th>
            </tr>
            <tr>
              <th>Наименование</th>
              <th>Дефицит</th>
              <th class='tooltip'>Дефицит по заказам покупателя</th>
            </tr>
          </tbody>
          <tbody v-for='detal of detals' :key="detal" >
            <tr>
              <td :rowspan='detal.materialList.length +2' class='center'>{{ detal.name }}</td>
              <td :rowspan='detal.materialList.length +2' class='center'>{{ -(Number(detal.min_remaining)+Number(detal.shipments_kolvo)) }}</td>
              <td :rowspan='detal.materialList.length +2' class='center'>{{ -Number(detal.shipments_kolvo) }}</td>
              <td :rowspan='detal.materialList.length +2' class='center type-issue tooltip'>Изделий: {{ detal.products.length }}
                <p class='tooltiptext'>
                  <span v-for='(item, inx) of detal.products' :key='item'>
                    {{ inx + 1}}.  {{item.name}}
                  </span>
                </p>
              </td>
            </tr>
            <tr v-for='mat of detal.materialList' :key='mat'>
              <td class='center'>{{ Math.round(mat.kol) + " " + returnEz(mat.ez)}} </td>
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
      countProviders: 0,
      countUsers: 0,
      countEquipment: 0,
      countTools: 0
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
    returnEz(ez) {
      let str = '(шт)'
      if(ez == 1) str = '(шт)';
      if(ez == 2) str = '(л)';
      if(ez == 3) str = '(кг)';
      if(ez == 4) str = '(м)';
      if(ez == 5) str = '(м.куб)';
      
      return str;
    }
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

    for(const item of this.parents) {
      if(item.type == 'provider' && item.count) 
        this.countProviders += item.count
    }
    
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
.tooltiptext {
  top: 100px;
  left: 100px;
  height: fit-content;
  width: 100px;
  display: flex;
  flex-direction: column;
}
.tooltiptext>span {
  margin-top: 5px;
}
</style>