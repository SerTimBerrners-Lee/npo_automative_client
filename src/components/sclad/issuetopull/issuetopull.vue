<template>
  <div>
    <h3>Задачи на отгрузку</h3>
    <div>
      <div class="block header_block">
        <span>Выбрать период, с:</span>
        <input type="text">
        <span>по: </span><input type="text">
        <button class="btn-small">Сбросить период или дату</button>
        <span>Фильтры:</span>
        <label for='z'>Не учитывать "На склад"</label><input id='z' type="checkbox">
      </div>
    </div>

    <div>
      <div class="scroll-table" style='width: 99%;'>
      <table>
          <tr>
            <th colspan="10"></th>
            <th colspan="2">Задачи склада</th>
            <th colspan="3"></th>
            <th colspan="3">Остатки</th>
            <th colspan="6"></th>
          </tr>
          <tr>
            <th>
              <unicon name="check" fill="royalblue" />
            </th>
            <th>№ Заказа </th>
            <th>Дата заказа</th>
            <th>Наименование изделия</th>
            <th>Комплектация, особенности заказа</th>
            <th>Кол-во</th>
            <th>Дата отгрузки</th>
            <th>Осталось дней</th>
            <th>Основание</th>
            <th>Покупатель</th>
            <th>Выполнение заготовительных операций, %</th>
            <th>Комплектация участка сборки покупными деталями, %</th>
            <th>Готовность к отгрузке, %</th>
            <th>Статус</th>
            <th>Потребность к отгрузке</th>
            <th>На складе</th>
            <th>На произв-ве или план. остаток</th>
            <th>Всего</th>
            <th>Заводской №</th>
            <th>Дата отгрузки</th>
            <th>ФИО сборщика</th>
            <th>ФИО контроль</th>
            <th>Документы</th>
            <th>Примечание</th>
          </tr>
      </table>
      </div>
      <div class='btn-control'>
        <button class="btn-small">Сбросить все фильтры</button>
        <button class="btn-small btn-add" @click='openShipment'>Отгрузить</button>
      </div>
    </div>
    <DescriptionModal
      v-if='showDescriptionModal'
      :key='descriptionKey'
    />
    <Shipment 
      v-if='showShipmentModal'
      :key='shipmentKey'
    />
  </div>
</template>

<script>

import DescriptionModal from '@/components/description-modal.vue';
import Shipment from './shippment.vue';
import {random} from 'lodash';

export default {
  data() {
    return {
      showDescriptionModal: false,
      descriptionKey: random(1, 999),

      showShipmentModal: false,
      shipmentKey: random(1, 999),

      description: '',
    }
  },
  components: {DescriptionModal, Shipment},
  methods: {
    openDescription() {
      this.showDescriptionModal = true
      this.descriptionKey = random(1, 999)
      this.description = 'ghghj'
    },
    openShipment() {
      this.showShipmentModal = true;
      this.shipmentKey = random(1, 999)
    }
  },
  async mounted() {

  }
}
</script>