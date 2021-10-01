<template>
  <div>
    <h3>Дефицит деталей</h3>
    <div>
      <div class="block header_block">
        <span>Выбрать период, с:</span>
        <input type="text">
        <span>по: </span><input type="text">
        <button class="btn-small">Сбросить период или дату</button>
        <span>Фильтры по статусу:</span>
        <label for='z'>Заказано</label><input id='z' type="checkbox">
        <label for='zn'>Не заказано</label><input id='zn' type="checkbox">
        <label for='end'>Выполнено</label><input id='end' type='checkbox'>
      </div>

      <div>
        <div class="scroll-table" style='width: 99%;'>
          <table>
            <tr>
              <th colspan="4">Детали для сборок из комплектации</th>
              <th rowspan="2">Необх. кол-во на дефицит по комплектациям</th>
              <th rowspan="2">Остаток на складе</th>
              <th rowspan="2">Кол-во на производстве</th>
              <th rowspan="2">Дефицит деталей</th>
              <th rowspan="2">СВОЕ кол-во в производство</th>
              <th rowspan="2">ЧПУ</th>
              <th rowspan="2">Норма времени (подготовительное), ч</th>
              <th rowspan="2">Норма времени (вспомогательное), ч</th>
              <th rowspan="2">Норма времени (основное), ч</th>
              <th rowspan="2">Норма времени (общее на парт.), ч</th>
              <th rowspan="2">Уровень комплектации, %</th>
              <th rowspan="2">Статус</th>
              <th rowspan="2">Дата запуска</th>
              <th rowspan="2">№ Заказа</th>
              <th rowspan="2">Примечание</th>
              <th rowspan="2">Планируемый срок изготовления</th>
            </tr>
            <tr>
              <th>
                <unicon name="check" fill="royalblue" />
              </th> 
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Принадлежность</th>
            </tr>
          </table>
        </div>
        <div class='btn-control'>
          <button class="btn-small btn-add" @click='start'>Запустить в производство</button>
          <button class="btn-small"> Добавить заказ </button>
        </div>
      </div>
    </div>
    <StartPraduction 
      v-if='showProductionModal'
      :key='startProductionModalKey'
    />
    <DescriptionModal 
      v-if='showDescriptionModal'
      :key='descriptionKey'
      :parametrs='description'
    />
  </div>
</template>

<script>

import StartPraduction from '@/components/sclad/start-production-modal.vue';
import DescriptionModal from '@/components/description-modal.vue';
import {random} from 'lodash';

export default {
  data() {
    return {
      showProductionModal: false,
      startProductionModalKey: random(1, 888),

      showDescriptionModal: false,
      descriptionKey: random(1, 999),

      description: ''
    }
  },
  components: {StartPraduction, DescriptionModal},
  methods: {
    start() {
      this.showProductionModal = true;
      this.startProductionModalKey = random(1, 999)

      // this.showDescriptionModal = true
      // this.descriptionKey = random(1, 999)
      // this.description = 'ghghj'
    }   
  },
  async mounted() {

  }
}
</script>

<style scoped>
.scroll-table table {
  font-size: 15px;
}
</style>