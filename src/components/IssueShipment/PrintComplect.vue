<template>
  <div id='tablebody' v-if='shipment'>
    <h1>Информация о заказе</h1> 
    <table class='table_inform'>
      <tr>
        <th class='center'>Дата заказа</th>
        <td class="center">{{ shipment.date_order }}</td>
      </tr>
      <tr>
        <th class='center'>Дата отгрузки</th>
        <td class="center">{{ shipment.date_shipments }}</td>
      </tr>
      <tr>
        <th class='center'>Изделие</th>
        <td class="center">{{ shipment.select_product?.name || 'Без Изделия' }}</td>
      </tr>
      <tr>
        <th class='center'>Количество</th>
        <td class="center">{{ shipment.kol }}</td>
      </tr>
      <tr>
        <th class='center'>Бронь</th>
        <td class="center">{{ shipment.bron ? 'есть' : 'нет' }}</td>
      </tr>
      <tr>
        <th class='center'>Основание</th>
        <td class="center">{{ shipment.base }}</td>
      </tr>
      <tr>
        <th class='center'>Статус</th>
        <td class="center">{{ shipment.status }}</td>
      </tr>
      <tr>
        <th class='center'>Покупатель</th>
        <td class="center" v-if='getBuyerFilter()'>{{ getBuyerFilter(shipment.buyerId) }}</td>
      </tr>
      <tr>
        <th class='center'>Примечание</th>
        <td class="center">{{ shipment.description }}</td>
      </tr>
      <tr v-if='shipment.documents && shipment.documents.length'>
        <th class='center'>Документы</th>
        <p v-for='(doc, idx) of shipment.documents' :key='doc' class='center'>
          <span>{{ idx + 1}}. {{ doc.name }}</span>
        </p>
      </tr>
    </table>
    <h4>Комплектация заказа</h4>
    <table>
      <tr>
        <th class='center'>№</th>
        <th class='center'>Артикул</th>
        <th class='center'>Наименование СБ или Детали</th>
        <th class='center'>Кол-во</th>
      </tr>
      <tr v-for='(ko, inx) of shipments.list_cbed_detal ? JSON.parse(shipments.list_cbed_detal) : []' :key='inx'>
        <td class="center">{{ inx + 1 }}</td>
        <td class="center">{{ ko.obj.articl }}</td>
        <td class="center">{{ ko.obj.name }}</td>
        <td class="center">{{ ko.kol }}</td>
      </tr>
    </table>

    <div v-if='childrens && childrens.length'>
      <h1>Прикрепленные заказы</h1>
      <div v-for='child of childrens_arr' :key='child'>
        <h4>Информация о заказе {{ child.number_order }}</h4> 
        <h4>Комплектация заказа для заказа {{ child.number_order }}</h4>
        <table>
          <tr>
            <th class='center'>№</th>
            <th class='center'>Артикул</th>
            <th class='center'>Наименование СБ или Детали</th>
            <th class='center'>Кол-во</th>
          </tr>
          <tr v-for='(ko, inx) of child.list_cbed_detal ? JSON.parse(child.list_cbed_detal) : []' :key='inx'>
            <td class="center">{{ inx + 1 }}</td>
            <td class="center">{{ ko.obj.articl }}</td>
            <td class="center">{{ ko.obj.name }}</td>
            <td class="center">{{ ko.kol }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import print from 'print-js';
import { mapActions } from 'vuex';
import { getBuyerFilter } from '@/js/methods';

export default {
  props: {
    shipments: {},
    childrens: []
  },
  data() {
    return {
      childrens_arr: [],
      shipment: null,
    }
  },
  methods: {
    ...mapActions(['fetchAllBuyers']),
    getBuyerFilter(_id) {
      return getBuyerFilter(_id);
    },
    printInit() {
      const emit = this.$emit;
      setTimeout(() => {
        print({
          printable: 'tablebody',
          type: 'html',
          targetStyles: ['*'],
          documentTitle: 'Комплектация заказа',
          font_size: '10pt',
          onLoadingEnd() {
            emit('unmount_print');
          }
        });
      })
    }
  },
  async mounted() {
    try {
      await this.fetchAllBuyers(true);
      if (!this.childrens || !this.childrens.length) {
        this.shipment = this.shipments; 
        return this.printInit();
      }
      
      let findParent = false;
      for (const item of this.childrens) {
        if (!item.parent_id) {
          findParent = true;
          this.childrens_arr.push(this.shipments);
          this.shipment = item;
          continue;
        }
        this.childrens_arr.push(item);
      }

      if (!findParent) this.shipment = this.shipments; 
      this.printInit();
    } catch (err) { console.log(err, 'printComplect') }
  }
}
</script>