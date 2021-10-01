<template>
    <div>
        <h3>Дефицит продукции (комплектации изделий)</h3>
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
        </div>

         <div>
            <div class="scroll-table" style='width: 99%;'>
            <table>
                <tr>
                <th>Комплектация сборки, детали</th>
                <th>Дефицит</th>
                <th>Реальный остаток с учетом планируемых отгрузок</th>
                <th>Минимальный остаток</th>
                <th>Рекомендуемый остаток</th>
                <th>Норма времени на одну единицу (сборка+изготовл.)</th>
                <th>СВОЕ кол-во(по умолч. равно рекоменд. кол-ву)</th>
                <th rowspan="2">Общая норма времени (сборка+изготовл.)</th>
                <th rowspan="2">Реальный остаток с учетом планируемых отгрузок и планируемого производства</th>
                <th rowspan="2">Уровень комплектации, %</th>
                <th rowspan="2">Статус</th>
                <th rowspan="2">Дата запуска</th>
                <th rowspan="2">№ Заказа</th>
                <th rowspan="2">Примечание</th>
                </tr>
                <tr>
                <th>
                    <unicon name="check" fill="royalblue" />
                </th> 
                <th>Тип</th>
                <th>№ Заказа</th>
                <th>Дата заказа</th>
                <th>Артикул</th>
                <th>Наименование</th>
                <th>Принадлежность</th>
                </tr>
            </table>
            </div>
            <div class='btn-control'>
                <button class="btn-small" @click='normTimeOperation'>Норма времени по операциям</button>
                <button class="btn-small btn-add" @click='start'>Запустить в производство</button>
                <button class="btn-small"> Добавить заказ </button>
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
        <NormTimeOperation
            v-if='showNormTimeOperation'
            :key='normTimeOperationKey'
        />
    </div>
</template>

<script>

import NormTimeOperation from '@/components/sclad/norm-time-operation-modal.vue'
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

      description: '',

      showNormTimeOperation: false,
      normTimeOperationKey: random(1, 888),
    }
  },
  components: {StartPraduction, DescriptionModal, NormTimeOperation},
  methods: {
    start() {
      this.showProductionModal = true;
      this.startProductionModalKey = random(1, 999)

      // this.showDescriptionModal = true
      // this.descriptionKey = random(1, 999)
      // this.description = 'ghghj'
    },
    normTimeOperation() {
      this.showNormTimeOperation = true;
      this.normTimeOperationKey = random(1, 999)
    }
  },
  async mounted() {

  }
}
</script>