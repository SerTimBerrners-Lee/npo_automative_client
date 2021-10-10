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

      <div class='table_block'>
        <div class="table-scroll">
        <table style='width: 200px;'>
          <tr>
            <th>Заказ покупателя из задач на отгрузку</th>
          </tr>
          <tr 
            v-for='shipment of getShipmentsSclad' 
            :key='shipment'
            class='td-row'
            @click='setShipment(shipment)'>
            <td> {{ shipment.number_order }} </td>
          </tr>
        </table>
      </div>
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
            <tr v-for='shipments of selectShipment.detals' :key='shipments'>
              <td class='center checkbox_parent' >
                <p class="checkbox_block" @click='e => toProduction(shipments, e.target)'></p>
              </td>
              <td class='center'>{{ shipments.articl }}</td>
              <td class='center'>{{ shipments.name }}</td>
              <td></td>
              <td class='center'>{{ getDeficitIzd('detal', shipments.id)  }}</td>
              <td class='center'>{{ 0 }}</td>
              <td class='center'>{{ 0 }}</td>
              <td class='center'>{{ getDeficitIzd('detal', shipments.id)  }}</td>
              <td class='center'>{{ getDeficitIzd('detal', shipments.id)  }}</td>
              <td class='center'>да</td>

              <td class='center'>{{ JSON.parse(shipments.parametrs).preTime.znach }}</td>
              <td class='center'>{{ JSON.parse(shipments.parametrs).helperTime.znach }}</td>
              <td class='center'>{{ JSON.parse(shipments.parametrs).mainTime.znach}}</td>
              <td class='center'>{{ parseParametrsDetal(shipments.parametrs, getDeficitIzd('detal', shipments.id) ) }}</td>
              <td class='center'></td>
              <td class='center'>Заказано</td>
              <td class='center'>{{ selectShipment.date_order }}</td>
              <td class='center'>{{ selectShipment.number_order }}</td>
              <td class='center'>{{ selectShipment.description }}</td>
              <td class='center'>{{ selectShipment.date_shipments }}</td>
          </tr>
          </table>
        </div>
      </div>
       <div class='btn-control'>
          <button class="btn-small btn-add" @click='start'>Запустить в производство</button>
          <button class="btn-small" @click='shipmentsAdd'> Добавить заказ </button>
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
    <ShipmentsMiniList
      v-if='showShipment'
      :key='shipmentKey'
    />
  </div>
</template>

<script>

import StartPraduction from '@/components/sclad/start-production-modal.vue';
import DescriptionModal from '@/components/description-modal.vue';
import {random} from 'lodash';
import {mapGetters, mapActions} from 'vuex';
import ShipmentsMiniList from '@/components/issueshipment/shipments-mini-list-modal.vue';

export default {
  data() {
    return {
      showProductionModal: false,
      startProductionModalKey: random(1, 888),

      showDescriptionModal: false,
      descriptionKey: random(1, 999),

      description: '',

      selectShipment: [],

      selected_checkbox: null,
      select_izd: null,

      showShipment: false,
      shipmentKey: random(1, 999),
    }
  },
  computed: mapGetters(['getShipmentsSclad']),
  components: {StartPraduction, DescriptionModal, ShipmentsMiniList},
  methods: {
    ...mapActions(['fetchAllShipmentsSclad']),
    start() {
      this.showProductionModal = true;
      this.startProductionModalKey = random(1, 999)
    },
    shipmentsAdd() {
      this.showShipment = true
      this.shipmentKey = random(1, 999)
    },
    setShipment(shipment) {
      let list_izd = JSON.parse(shipment.list_cbed_detal)
      this.selectShipment = {...shipment, list_cbed_detal: list_izd}
      console.log(this.selectShipment)
    },
    getDeficitIzd(type, id) {
      for(let izd of this.selectShipment.list_cbed_detal) {
        if(izd.type == type && izd.obj.id == id)
          return izd.kolvo
      }
    },
    toProduction(izd, e) {
      if(this.selected_checkbox) 
        this.selected_checkbox.classList.remove('checkbox_block_select')
      
      if(this.selected_checkbox && this.select_izd && this.select_izd.id == izd.id) {
        this.selected_checkbox = null
        return this.select_izd = null
      }
      
      this.selected_checkbox = e;
      this.selected_checkbox.classList.add('checkbox_block_select')
      this.select_izd = izd
    },
    parseParametrsDetal(parametrs, kolvo = 1) {
      try {
        let pars = JSON.parse(parametrs)
        return Number(pars.helperTime.znach) + Number(pars.mainTime.znach) * kolvo
      } catch(e) {
        console.log(e)
      }
    }
  },
  async mounted() {
    await this.fetchAllShipmentsSclad(true)
  }
}
</script>

<style scoped>
.scroll-table table {
  font-size: 15px;
}
.table_block{
  display: flex;
}
.table_block>div{
  margin: 4px;
}
.block {
  padding: 5px;
}
.block .btn {
  margin: 0px;
}
</style>