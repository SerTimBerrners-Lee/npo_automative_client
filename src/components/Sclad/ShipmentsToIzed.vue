<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Список заказов</h3>
      <p v-if='izd'>Для 
        <strong v-if='izd?.type =="cbed"'>Сборки:</strong>
        <strong v-if='izd?.type =="detal"'>Детали:</strong>
        <strong v-if='izd?.type =="product"'>Изделия:</strong>
        <strong v-if='izd?.type =="material"'>Материала:</strong>
          {{ izd?.izd?.name }}</p>
			<div class="block">
				<table v-if='shipments.length'>
					<tr>
						<th>№ Заказа</th>
						<th>Дата Заказа</th>
            <th>Планируемая дата отгрузки</th> 
            <th>Кол-во Изделий на Заказ</th>
					</tr>
          <tr v-for='shipment of shipments_arr' :key="shipment" 
            class='td-row'
            @click="openShipments(shipment.id)">
            <td>{{ shipment.number_order }}</td>
            <td class='center'>{{ shipment.date_order }}</td>
            <td class='center'>{{ shipment.date_shipments }}</td>
            <td class='center'>{{ shipment.kolvoIzd }}</td>
          </tr>
				</table>
        <span v-else>Заказов нет </span>
      </div>
      <div style="margin: 10px;">
        <strong>Итого: {{ allKolvo }}</strong>
      </div>
    </div>
  </div>
</div>
  <ShipmentsModal 
    :key='key_modal_shipments'
    v-if='shipments_id'
    :id_shipments='shipments_id'
  />
</template>
<script>
import { random } from 'lodash';
import { comparison } from '@/js/';
import MixModal from '@/mixins/mixmodal';
import ShipmentsModal from '@/components/IssueShipment/ShipmentsModal';

export default {
  props: ['shipments', 'izd'],
  data() {
    return {
      shipments_arr: [],

      key_modal_shipments: random(1, 999),
      shipments_id: null,
      allKolvo: 0,
    }
  },
  components: { ShipmentsModal },
  mixins: [MixModal],
  methods: {
    openShipments(id) {
      this.key_modal_shipments = random(1, 999);
      this.shipments_id = id;
    },
    returnCountIzd(item, izd, type) {
      if (type == 'product') return item.kol || 0;
      if (type == 'material') return item.shipments_material || 0;
      try {
        let count = 0;
        const list = JSON.parse(item.list_cbed_detal);
        const listTwo = JSON.parse(item.list_hidden_cbed_detal);
        const arr = [].concat(list, listTwo);
        for (const obj of arr) {
          if (obj.type == type && obj.obj.id == izd.id) count += Number(obj.kol)  ;
        }
        return count;
      } catch (err) {console.error(err)}
    }
  },
  async mounted() {
    const izd = this.$props.izd;

    if (this.$props.shipments) {
      this.shipments_arr = this.$props.shipments;
      if (izd && izd.izd) {
        for (const item in this.shipments_arr) {
          this.shipments_arr[item].kolvoIzd = this.returnCountIzd(this.shipments_arr[item], izd.izd, izd.type);
          this.allKolvo += this.shipments_arr[item].kolvoIzd;
        }
      }
    }

    let variables;
    for (let ship1 in this.shipments_arr) {
      for (let ship2 in this.shipments_arr) {
        if (comparison(this.shipments_arr[ship1].date_shipments, 
          this.shipments_arr[ship2].date_shipments, '<')) {
            variables = this.shipments_arr[ship1];
            this.shipments_arr[ship1] = this.shipments_arr[ship2];
            this.shipments_arr[ship2] = variables;
          }
      }

      if (this.shipments_arr[ship1].to_sklad && this.shipments_arr[ship1].number_order.indexOf('C') == -1) {
        const char = this.shipments_arr[ship1].number_order.split('');
        char.unshift('C');
        this.shipments_arr[ship1].number_order = char.join('');
      }
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
}
.block input {
  width: 50px;
}
.block * {
  margin: 3px;
}
.block {
  display: flex;
}
.block p {
  display: flex;
  align-items: center;
  font-size: 13px;
}
textarea {
  height: 130px;
}
</style>