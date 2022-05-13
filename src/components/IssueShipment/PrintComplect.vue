<template>
  <div id='tablebody2' v-if='shipments'>
    
    <div class="block" v-if='getOneShipments'>
      <p class='p_flex'>
        <span>Дата заказа:</span>
        <DatePicterCustom :dateStart='getOneShipments.date_order' />
        <span>Выбранное изделие: </span>
        <span 
          v-if='select_product && !is_not_product' 
          class='select_span_href' @click='openIzd(select_product)'>{{ sliceName(select_product.name) }}</span>
        <label for='is_not_product'>Заказ без изделия:</label>
        <input id='is_not_product' type="checkbox" v-model='is_not_product' disabled>
        <span>Количество: {{ getOneShipments.kol }}</span>
      </p>
      <p class='p_flex'>
        <span>Дата План. отгрузки:</span>
        <DatePicterCustom :dateStart='getOneShipments.date_shipments' />
        <label for='bran'>Бронь:</label>
        <input id='bran' type="checkbox" v-model='getOneShipments.bron' disabled>
        <label for='file_folder' class='hover' v-if='!getOneShipments.to_sklad'>Основание:</label>
        <input id='file_folder' type="file" hidden @change="e => addDock(e.target, true)" disabled>
        <span class='active' style='margin-left: 20px; margin-right: 20px;'>{{ getOneShipments.base }}</span>
        
        <span class='hover'>Покупатель: {{ getOneShipments.buyerId }} </span>
        <span v-if='getOneShipments?.buyer?.name'>{{ getOneShipments?.buyer?.name }}</span>
        <span class='tooltip' v-else>
          <select 
            class="select-small buyer_select" 
            v-model='getOneShipments.buyerId'
            disabled>
            <option v-for='buyer in allBuyer' 
              :key='buyer'
              :value="buyer.id">{{ buyer.name }}</option>
          </select>
          <span class='tooltiptext'> {{ returnObj() }}</span>
        </span>

        <span>
          <label for='to_sklad'>На склад:</label>
          <input id='to_sklad' type="checkbox" v-model='to_sklad' disabled>
        </span>
      </p>
    </div>

    <div v-if='childrens && childrens.length'>
      <h4>Позиции по Счету: </h4>
      <TableShipments
        v-if='childrens.length'
        :fixed_table='"fixed_table_10"'
        :shipmentsArr='childrens'
        :cheked_show='true'
        :select_sh='getOneShipments.id'
        :return_dbclick='true'
        :no_set='true'
      />
    </div>

    <h4>Комплектация для заказа {{ shipmentsNullOne(getOneShipments.number_order) }}</h4>
    <table>
      <tr>
        <th class='center'>№</th>
        <th class='center'>Артикул</th>
        <th class='center'>Наименование СБ или Детали</th>
        <th class='center'>Кол-во</th>
      </tr>
      <tr v-for='(ko, inx) of list_cbed_detal' :key='inx'>
        <td class="center">{{ inx + 1 }}</td>
        <td class="center">{{ ko.obj.articl }}</td>
        <td class="center">{{ ko.obj.name }}</td>
        <td class="center">{{ ko.kol }}</td>
      </tr>
    </table>
    <ProductModalInfo
      :id='parametrs_product'
      :key='productModalKey'
      v-if='parametrs_product'
    />
  </div>
</template>

<script>
import random from 'lodash';
import print from 'print-js';
import { shipmentsNullOne } from '@/js/';
import MixShipments from '@/mixins/shipments';
import { getBuyerFilter } from '@/js/methods';
import TableShipments from '@/components/IssueShipment/TableKomplect';

export default {
  props: {
    shipments: {},
  },
  data() {
    return {
      parametrs_product: false,
      productModalKey: random(1, 999),
      is_not_product: false,
      select_product: null,

    }
  },
  components: {
    TableShipments
  },
  beforeCreate() {
    this.$options.components.ProductModalInfo = require('@/components/BaseProduct/ProductModal').default;
  },
  mixins: [MixShipments],
  methods: {
    getBuyerFilter(_id) {
      return getBuyerFilter(_id);
    },
    shipmentsNullOne(str) {
      return shipmentsNullOne(str);
    },
    openIzd(izd) {
			if (!izd || !izd.id) return false;
			this.parametrs_product = izd.id;
      this.productModalKey = random(1, 999);
		},
    printInit() {
      const emit = this.$emit;
      setTimeout(() => {
        print({
          printable: 'tablebody2',
          type: 'html',
          targetStyles: ['*'],
          documentTitle: 'Комплектация заказа',
          ignoreElements: ['complect', 'check', 'description'],
					font_size: '10pt',
					maxWidth: '100%',
          onLoadingEnd() {
            emit('unmount_print');
          }
        });
      })
    }
  },
  async mounted() {
    if (this.shipments && this.shipments.id) await this.childrenSord(this.shipments.id);

    if(this.getOneShipments.productId) {
      const res = await this.getAllProductByIdLight(this.getOneShipments.productId);
      if (res) this.select_product = res;
    } else this.is_not_product = true;
    
    this.printInit();
  }
}
</script>