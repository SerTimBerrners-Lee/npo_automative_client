<template>
  <div id='tablebody' v-if='shipments'>
    <h1>Информация о заказе</h1> 
    <table class='table_inform'>
      <tr>
        <th class='center'>Дата заказа</th>
        <td class="center">{{ shipments.date_order }}</td>
      </tr>
      <tr>
        <th class='center'>Дата отгрузки</th>
        <td class="center">{{ shipments.date_shipments }}</td>
      </tr>
      <tr>
        <th class='center'>Изделие</th>
        <td class="center">{{ shipments.select_product?.name || 'Без Изделия' }}</td>
      </tr>
      <tr>
        <th class='center'>Количество</th>
        <td class="center">{{ shipments.kol }}</td>
      </tr>
      <tr>
        <th class='center'>Бронь</th>
        <td class="center">{{ shipments.bron ? 'есть' : 'нет' }}</td>
      </tr>
      <tr>
        <th class='center'>Основание</th>
        <td class="center">{{ shipments.base }}</td>
      </tr>
      <tr>
        <th class='center'>Покупатель</th>
        <td class="center" v-if='getBuyerFilter()'>{{ getBuyerFilter(shipments.buyerId) }}</td>
      </tr>
      <tr>
        <th class='center'>Примечание</th>
        <td class="center">{{ shipments.description }}</td>
      </tr>
      <tr v-if='shipments.documents && shipments.documents.length'>
        <th class='center'>Документы</th>
        <p v-for='(doc, idx) of shipments.documents' :key='doc' class='center'>
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
      <div v-for='child of childrens' :key='child'>
        <h4>Информация о заказе {{ child.number_order }}</h4> 
        <table class='table_inform'>
          <tr>
            <th class='center'>Дата заказа</th>
            <td class="center">{{ child.date_order }}</td>
          </tr>
          <tr>
            <th class='center'>Дата отгрузки</th>
            <td class="center">{{ child.date_shipments }}</td>
          </tr>
          <tr>
            <th class='center'>Изделие</th>
            <td class="center">{{ child.select_product?.name || 'Без Изделия' }}</td>
          </tr>
          <tr>
            <th class='center'>Количество</th>
            <td class="center">{{ child.kol }}</td>
          </tr>
          <tr>
            <th class='center'>Бронь</th>
            <td class="center">{{ child.bron ? 'есть' : 'нет' }}</td>
          </tr>
          <tr>
            <th class='center'>Основание</th>
            <td class="center">{{ child.base }}</td>
          </tr>
          <tr>
            <th class='center'>Покупатель</th>
            <td class="center">{{ child?.buyer?.name || 'На склад'}}</td>
          </tr>
          <tr>
            <th class='center'>Примечание</th>
            <td class="center">{{ child.description }}</td>
          </tr>
          <tr v-if='child.documents && child.documents.length'>
            <th class='center'>Документы</th>
            <p v-for='(doc, idx) of child.documents' :key='doc' class='center'>
              <span>{{ idx + 1}}. {{ doc.name }}</span>
            </p>
          </tr>
        </table>
        <h4>Комплектация заказа для заказа {{ }}</h4>
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
    childrens: {}
  },
  data() {
    return {

    }
  },
  methods: {
    ...mapActions(['fetchAllBuyers']),
    getBuyerFilter(_id) {
      return getBuyerFilter(_id);
    }
  },
  async mounted() {
    await this.fetchAllBuyers(true);

    const emit = this.$emit;
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
  }
}
</script>