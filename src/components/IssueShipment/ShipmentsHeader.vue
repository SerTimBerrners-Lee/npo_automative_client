<template>
  <div>
    <h3>Заказ {{ pretterNumberOrder }}</h3>
    <div class="block">
      <p class='p_flex'>
        <span>Дата заказа:</span>
        <DatePicterCustom :dateStart='getOneShipments.date_order' />
        <span>Выбранное изделие: </span>
        <span 
          v-if='select_product && !is_not_product' 
          class='select_span_href' @click='openIzd(select_product)'>{{ sliceName(select_product.name) }}</span>
        <label for='is_not_product'>Заказ без изделия:</label>
        <input id='is_not_product' type="checkbox" v-model='is_not_product' disabled>
        <span>Количество:</span>
        <input type="number" min='1' v-model='getOneShipments.kol' disabled>
      </p>
      <p class='p_flex'>
        <span>Дата План. отгрузки:</span>
        <DatePicterCustom :dateStart='getOneShipments.date_shipments' />
        <label for='bran'>Бронь:</label>
        <input id='bran' type="checkbox" v-model='getOneShipments.bron' disabled>
        <label for='file_folder' class='hover' v-if='!getOneShipments.to_sklad'>Основание:</label>
        <input id='file_folder' type="file" hidden @change="e => addDock(e.target, true)" disabled>
        <span class='active' style='margin-left: 20px; margin-right: 20px;'>{{ getOneShipments.base }}</span>
        
        <span class='hover'>Покупатель:</span>
        <span class='tooltip' v-if='buyer'>
          <select 
            class="select-small buyer_select" 
            v-model='buyer'
            disabled>
            <option v-for='buyer in allBuyer' 
              :key='buyer'
              :value="buyer.id">{{ buyer.name }}</option>
          </select>
          <span class='tooltiptext'> {{ returnObj() }}</span>
        </span>

        <span>
          <label for='to_sklad'>На склад:</label>
          <input id='to_sklad' type="checkbox" v-model='getOneShipments.to_sklad' disabled>
        </span>
      </p>
    </div>

    <ProductModalInfo
      :id='parametrs_product'
      :key='productModalKey'
      v-if='parametrs_product'
    />

  </div>
</template>

<script>
import { random } from 'lodash';
import MixShipments from '@/mixins/shipments';
import DatePicterCustom from '@/components/DatePicter';
import ProductModalInfo from '@/components/BaseProduct/ProductModal';

export default {
  data() {
    return {
      select_product: null,
      is_not_product: false,
      buyer: null,

      productModalKey: random(1, 999),
      parametrs_product: null,
    }
  },
  components: {
    DatePicterCustom,
    ProductModalInfo
  },
  computed: {
    pretterNumberOrder() {
      if (!this.getOneShipments || !this.getOneShipments.number_order) return '';
      let str = this.getOneShipments.number_order.split('/');
      if (str.length == 2) 
        str = str[0].concat([str[1].substring(2)]);
      else str = str[0];
      
      return str;
    },
  },
  mixins: [MixShipments],
  methods: {
    openIzd(izd) {
			if (!izd || !izd.id) return false;

			this.parametrs_product = izd.id;
      this.productModalKey = random(1, 999);
		},
  },
  async mounted() {
    if (this.getOneShipments.productId) {
      const res = await this.getAllProductByIdLight(this.getOneShipments.productId);
      this.select_product = res;
    } else this.is_not_product = true;

    if (this.getOneShipments?.buyer?.id)
      this.buyer = this.getOneShipments.buyer.id;
  }
}
</script>

<style scoped>
.buyer_select {
	width: fit-content;
}
.flex_direction {
	display: flex;
}
.file_content {
	width: 500px;
	padding: 40px;
}
table {
	width: 100%;
}
select {
	width: 100px;
}
label {
	margin:0px;
	padding: 0px;
	color: black;
	font-weight: bold;
	margin-left: 5px;
	font-size: 15px;
	cursor: pointer;
	user-select: none;
}
.input_kol {
	width: 20px;
}
.block p * {
	margin-left: 5px;
}
.block p input[type='text'], .block p input[type='number'] {
	width: 60px;
}
.table_block {
	display: flex;
	flex-direction: column;
}
textarea {
	height: 140px;
}
.p_flex {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-wrap: wrap;
}

.p_flex>* {
	margin-top: 5px;
}

</style>