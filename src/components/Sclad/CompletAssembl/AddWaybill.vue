<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens">
        <h3>Накладная на комплектацию сборки № от {{ dataReturn() }}</h3>
        
        <div>
          <h3>Информация по сборочной единице</h3>
            <table>
              <tr>
                <th class='th_black'>№ Заказа </th>
                <th class='th_black'>Срок отгрузки</th>
                <th class='th_black'>Заказчик</th>
                <th class='th_black'>Артикул</th>
                <th class='th_black'>Наименование</th>
                <th class='th_black'>Кол-во</th>
                <th class='th_black'>% Комплектации</th>
              </tr>
              <tr v-if='ass'>
                <td class="center">{{ ass.number_order }}</td>
                <td class="center">{{ ass.date_shipments }}</td>
                <td class="center">{{ 'склад' }}</td>
                <td class="center">{{ ass?.cbed?.articl }}</td>
                <td class="center">{{ ass?.cbed?.name }}</td>
                <td class="center">{{ ass.kolvo_shipments }}</td>
                <td class="center">{{ 0 }}</td>
              </tr>
            </table>
        </div>

        <div>
          <h3>Комплектация сборочной единицы</h3>
            <div class="table-scroll">
              <table>
                <tr>
                  <th colspan="7" class='th_black'>Сборки(СБ)</th>
                  <th colspan="3" class='th_black'>Склад</th>
                  <th class='th_black'></th>
                  <th colspan="2" class='th_black'>К выдаче</th>
                </tr>
                <tr>
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th>ЕИ</th>
                  <th>Потребность на 1 сборку</th>
                  <th>Потребность итого</th>
                  <th>Выдано</th>
                  <th>Осталось выдать</th>
                  <th>Осталось на складе</th>
                  <th>Место на складе</th>
                  <th>Дефицит на выдачу</th>
                  <th>% комп лектации</th>
                  <th>Кол-во</th>
                  <th></th>
                </tr>
                <tr v-for='cbed of listCbed' :key='cbed'>
                  <td class='center'>{{ cbed.art }}</td> <!-- Артикул -->
                  <td class='center'>{{ cbed.cb.name }}</td> <!-- Наименование -->
                  <td class='center'>{{ returnEzName(cbed.ez) }}</td> <!-- ЕИ -->
                  <td class='center'>{{ cbed.kol }}</td> <!-- Потребность на 1 сборку -->
                  <td class='center'>{{ cbed.kol }}</td> <!-- Потребность итого -->
                  <td class='center'>{{ 0 }}</td> <!-- Выдано -->
                  <td class='center'>{{ cbed.kol }}</td> <!-- Осталось выдать -->
                  <td class='center'>{{ cbed.cbed_kolvo }}</td> <!-- Осталось на складе -->
                  <td class='center'>{{ '-' }}</td> <!-- Место на складе -->
                  <td class='center'>{{ cbed.kol }}</td> <!-- Дефицит на выдачу -->
                  <td class='center'>{{ 0 }}</td> <!-- % комп лектации -->
                  <td class='center'>{{ 0 }}</td> <!-- Кол-во -->
                </tr>
              </table>

              <table>
                <tr>
                  <th colspan="7" class='th_black'>Детали(Д)</th>
                  <th colspan="3" class='th_black'>Склад</th>
                  <th class='th_black'></th>
                  <th colspan="2" class='th_black'>К выдаче</th>
                </tr>
                <tr>
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th>ЕИ</th>
                  <th>Потребность на 1 сборку</th>
                  <th>Потребность итого</th>
                  <th>Выдано</th>
                  <th>Осталось выдать</th>
                  <th>Осталось на складе</th>
                  <th>Место на складе</th>
                  <th>Дефицит на выдачу</th>
                  <th>% комп лектации</th>
                  <th>Кол-во</th>
                  <th></th>
                </tr>
                <tr v-for='det of listDetal' :key='det'>
                  <td class='center'>{{ det.art }}</td> <!-- Артикул -->
                  <td class='center'>{{ det.det.name }}</td> <!-- Наименование -->
                  <td class='center'>{{ returnEzName(det.ez) }}</td> <!-- ЕИ -->
                  <td class='center'>{{ det.kol }}</td> <!-- Потребность на 1 сборку -->
                  <td class='center'>{{ det.kol }}</td> <!-- Потребность итого -->
                  <td class='center'>{{ 0 }}</td> <!-- Выдано -->
                  <td class='center'>{{ det.kol }}</td> <!-- Осталось выдать -->
                  <td class='center'>{{ det.detal_kolvo }}</td> <!-- Осталось на складе -->
                  <td class='center'>{{ '-' }}</td> <!-- Место на складе -->
                  <td class='center'>{{ det.kol }}</td> <!-- Дефицит на выдачу -->
                  <td class='center'>{{ 0 }}</td> <!-- % комп лектации -->
                  <td class='center'>{{ 0 }}</td> <!-- Кол-во -->
                  <td class='center'></td>
                </tr>
              </table>

              <table>
                <tr>
                  <th colspan="7" class='th_black'>Покупные детали и расзодные материалы(ПД и РМ)</th>
                  <th colspan="3" class='th_black'>Склад</th>
                  <th class='th_black'></th>
                  <th colspan="8" class='th_black'>К выдаче</th>
                </tr>
                <tr>
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th>ЕИ</th>
                  <th>Потребность на 1 сборку</th>
                  <th>Потребность итого</th>
                  <th>Выдано</th>
                  <th>Осталось выдать</th>
                  <th>Осталось на складе</th>
                  <th>Место на складе</th>
                  <th>Дефицит на выдачу</th>
                  <th>% комп лектации</th>
                  <th>Кол-во</th>
                  <th>Аналог</th>
                  <th>Артикул аналога</th>
                  <th>Наименование аналога</th>
                  <th>Кол-во</th>
                  <th>Место на складе</th>
                  <th></th>
                  <th></th>
                </tr>
                <tr v-for='mat of materialList' :key='mat'>
                  <td class='center'>{{ mat.art }}</td>
                  <td class='center'>{{ mat.mat.name }}</td>
                  <td class='center'>{{ returnEzName(mat.ez) }}</td>
                  <td class='center'>{{ mat.kol }}</td>
                  <td class='center'>{{ mat.kol }}</td> <!-- Потребность итого -->
                  <td class='center'>{{ 0 }}</td> <!-- Выдано -->
                  <td class='center'>{{ mat.kol }}</td> <!-- Осталось выдать -->
                  <td class='center'>{{ mat.material_kolvo }}</td> <!-- Осталось на складе -->
                  <td class='center'>{{ '-' }}</td> <!-- Место на складе -->
                  <td class='center'>{{ mat.kol }}</td> <!-- Дефицит на выдачу -->
                  <td class='center'>{{ 0 }}</td> <!-- % комп лектации -->
                  <td class='center'>{{ mat.kol }}</td> <!-- Кол-во -->
                  <td class='center'>{{ '-' }}</td> <!-- Аналог -->
                  <td class='center'>{{ '-' }}</td> <!-- Артикул аналога -->
                  <td class='center'>{{ '-' }}</td> <!-- Наименование аналога -->
                  <td class='center'>{{ 0 }}</td> <!-- Кол-во -->
                  <td class='center'>{{ '-' }}</td> <!-- Место на складе -->
                  <td class='center'></td>
                  <td class='center'></td>
                </tr>
              </table>
            </div>
        </div>

        <div class="btn-control out-btn-control" v-if='type_open != "see"'>
          <button class="btn-status" @click='destroyModalF'>Отменить</button>
          <button class="btn-status btn-black">Сформировать накладную</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { dataFormat } from '@/js/';
import MixModal from '@/mixins/mixmodal';
import { returnEzName } from '@/js/edizm';
import { parseSpetification } from '@/js/methods';

export default { 
  props: {
    cbed: {
      type: Object
    },
    type_open: {
      type: String,
      default: "see" // "see", "add"
    }
  },
  data() {
    return {
      ass: null,
      izdels: null,

      materialList: [],
      listDetal: [],
      listCbed: [],
    }
  },
  mixins: [MixModal],
  methods: {
    ...mapActions([
      'getOneCbEdById',
      'getAllProductById',
      'getOneDetal',
      'fetchGetOnePPM'
    ]),
    dataReturn() {
      return dataFormat();
    },
    returnEzName(ez) {
      return returnEzName(ez);
    }
  },
  async mounted() {
    if (!this.type_open || !this.cbed) return this.destroyModalF();
    this.ass = this.cbed;

    if (!this.ass.type_izd || this.ass.type_izd == 'cbed')
      this.izdels = await this.getOneCbEdById(this.ass.cbed.id);
    else
      this.izdels = await this.getAllProductById(this.ass.cbed.id);

    if (!this.izdels) return this.destroyModalF();

    const res = parseSpetification(this.izdels);
    this.materialList = res.materialList.concat(res.listPokDet);
    this.listDetal = res.listDetal;
    this.listCbed = res.listCbed;

    for (let item of this.materialList) {
      const data = await this.fetchGetOnePPM(item.mat.id);
      if (data) item = {...data, ...item};
    }

    for (let item of this.listDetal) {
      const data = await this.getOneDetal(item.det.id);
      if (data) item = {...data, ...item};
    }

    for (let item of this.listCbed) {
      const data = await this.getOneCbEdById(item.cb.id);
      if (data) item = {...data, ...item};
    }
  }
}
</script>

<style scoped>
th {
  font-size: 14px;
}
.out-btn-control {
  margin-top: 100px;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  width: 90vw;
}
.left-block-modal {
  width: 10vw;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1vw;
  }
  to {
    width: 90vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 10vw;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 10vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 90vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
      opacity: 0;
}
  to {
    opacity: 0;
  }
}
</style>