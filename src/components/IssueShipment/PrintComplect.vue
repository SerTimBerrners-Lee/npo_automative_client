<template>
  <div id='tablebody2' v-if='shipments'>
    <div v-if='childrens && childrens.length'>
      <h4>Позиции по Счету: {{ getOneShipments.id }}</h4>
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

    <h4>Комплектация заказа</h4>
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
  </div>
</template>

<script>
import print from 'print-js';
import MixShipments from '@/mixins/shipments';
import { getBuyerFilter } from '@/js/methods';
import TableShipments from '@/components/IssueShipment/TableKomplect';

export default {
  props: {
    shipments: {},
  },
  components: {
    TableShipments
  },
  mixins: [MixShipments],
  methods: {
    getBuyerFilter(_id) {
      return getBuyerFilter(_id);
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
    
    this.printInit();
  }
}
</script>