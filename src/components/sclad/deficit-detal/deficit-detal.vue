<template>
  <div>
    <h3>Дефицит деталей</h3>
    <div>
      <div class="block header_block">
        <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
        <span>Статусы: </span>
        <div>
          <select 
            class='select-small' 
            v-model='selectEnumStatus'>
            <option 
              v-for='item of enumStatus' 
              :key='item' 
              :value='item'>{{ item }}</option>
          </select>
        </div>
        <span>Дефициты: </span>
        <div>
          <select 
            class='select-small' 
            v-model='selectEnumDeficit'>
            <option 
              v-for='item of enumDeficit' 
              :key='item' 
              :value='item'>{{ item }}</option>
          </select>
        </div>
      </div>
      <div class='table_block'> 
        <div style='width: 400px;'>
          <ShipmentList
            v-if='getShipments.length'
            @unmount_set='toSetOrders'
            @unmount_clear='unmount_clear'
            :getShipments='getShipments'/>
        </div>
        <div style='width: 99%;'> 
          <table>
            <tbody class='fixed_table_85'>
              <tr>
                <th colspan="5" class='min_width-100'>Детали для сборок из комплектации</th>
                <th rowspan="3" class='min_width-120'>Дефицит</th>
                <th rowspan="3" class='min_width-120'>Дефицит по заказам покупателя </th>
                <th rowspan="3" class='min_width-120'>Потребность по Заказам покупателя</th>
                <th rowspan="3" class='min_width-120'>Остаток</th>
                <th rowspan="3" class='min_width-120'>Минимальный остаток</th>
                <th rowspan="3" class='min_width-120'>Рекомендуемый остаток</th>
                <th rowspan="3" class='min_width-100'>ЧПУ</th>
                <th rowspan="3" class='min_width-100'>Норма времени (подготовительное), ч</th> 
                <th rowspan="3" class='min_width-100'>Норма времени (вспомогательное), ч</th> 
                <th rowspan="3" class='min_width-100'>Норма времени (основное), ч</th> 
                <th rowspan="3" class='min_width-100'>Норма времени (общее на парт.), ч</th> 
                <th rowspan="3" class='min_width-100'>СВОЕ кол-во (по ум. = рекомендуемому. кол-ву)</th>
                <th rowspan="3" class='min_width-120'>Заказано на производстве</th> 
                <th rowspan="3" class='min_width-120'>Реальный остаток с учетом планируемых отгрузок и планируемого производства</th> <!-- остаток с учетом -->
                <th rowspan="3" class='min_width-100'>Статус</th>
                <th rowspan="3" class='min_width-100'>Техпроцесс</th>
                <th rowspan="3" class='min_width-100'>Примечание</th> 
              </tr>
              <tr>
                <th class='center'>№</th>
                <th @click='selectAllItem' style='cursor: pointer;'>
                  <unicon name="check" fill="royalblue" />
                </th> 
                <th>Артикул</th>
                <th>Наименование</th>
                <th>Принадлежность</th>
              </tr>
              <tr>
                <td colspan='1'>Поиск: </td>
                <td colspan="4">
                  <Search 
                    :placeholder="'Поиск по Артиклу и Наименованию'"
                    @unmount='keySearch' 
                  />
                </td>
              </tr>
            </tbody>
            <tr v-for='(detal, inx) of allDetal' :key='detal'
              class='td-row'
              @click='setIzdels(detal)'>
              <td class='center'>{{ inx+1 }}</td>
              <td>
                <div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                  <p class="checkbox_block" @click='e => toProduction(detal, e.target)'></p>
                </div>
              </td>
              <td class='center'>{{ detal.articl }}</td>
              <td class='center' @dblclick="showInformIzdel(detal.id)">{{ detal.name }}</td>
              <td class='center' @click='returnShipmentsDateModal(detal, "detal")'>
                <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
              </td>

              <td class='center' style='color: red;'>{{ returnDificit(detal, detal.detal_kolvo) }}</td> <!-- Дефицит -->
              <td class='center min_width-100' style='color: red;'>{{ -detal.shipments_kolvo }}</td> <!-- Дефицит По заказам покупателя -->
              <td class='center min_width-100'>{{ detal.shipments_kolvo }}</td> <!-- Потребность по Заказам покупателя -->
              <td class='center'>{{ detal.detal_kolvo }}</td> <!-- Количество деталей -->
              <td class='center'>{{ detal?.min_remaining }}</td> <!-- Минимальный остаток -->
              <td class='center'>{{ detal?.min_remaining * 3 }}</td> <!-- Рекомендуемый остаток -->
              <td class='center'>{{ returnZnachCPU(detal) }}</td> <!-- ЧПУ --->
              <td class='center'>{{ detal.parametrs ? JSON.parse(detal.parametrs).preTime.znach : ''}}</td> <!-- Норма времени (подготовительное) -->
              <td class='center'>{{ detal.parametrs ? JSON.parse(detal.parametrs).helperTime.znach : '' }}</td><!-- Норма времени (вспомогательное) -->
              <td class='center'>{{ detal.parametrs ? JSON.parse(detal.parametrs).mainTime.znach : ''}}</td><!-- Норма времени (основное) -->
              <td class='center'>{{ getTimming(detal.parametrs, detal.shipments_kolvo) }}</td><!-- Норма времени (общее на парт.) -->
              <td class='center' contenteditable="true" @keyup='e => alt(e.target)'>
                  {{ detal?.my_kolvo || detal.min_remaining * 3  }}
              </td> <!-- СВОЕ кол-во -->
              <td class='center'>{{ detal.metalloworking_kolvo }}</td><!-- Заказано на производстве -->
              <td class='center'>{{ detal.detal_kolvo + detal.metalloworking_kolvo - detal.shipments_kolvo }}</td> <!-- Реальный остаток с учетом -->
              <td v-if='detal.metalloworking_kolvo > 0' class='center min_width-100 success_operation'>Заказано</td>
              <td v-else class='center min_width-100 work_operation'>Не заказано</td> <!-- Статус -->
              <td class='center'>
                <img src="@/assets/img/link.jpg" @click='showTechProcess(detal)' class='link_img' atl='Показать' />
              </td><!-- Техпроцесс -->
              <td class='center'>
                <img src="@/assets/img/link.jpg" @click='openDescription(detal.description)' class='link_img' atl='Показать' />
              </td><!-- Примечание -->
          </tr>
          </table>

          <div class='btn-control'>
            <button class="btn-small btn-add" @click='start'>Запустить в производство</button>
            <button class="btn-small" @click='shipmentsAdd'> Добавить заказ </button>
          </div>
        </div>
      </div>
    </div>
    <StartPraduction 
      v-if='parametrs'
      :key='startProductionModalKey'
      :parametrs='parametrs'
    />
    <DescriptionModal 
      v-if='showDescriptionModal'
      :key='descriptionKey'
      :parametrs='description'
    />
    <ShipmentsMiniList
      v-if='showShipment'
      :key='shipmentKey'
      @unmount='unmount_sh_list'
    />
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
    <DetalModal
      :key='detalModalKey'
      v-if='parametrs_detal'
      :id='parametrs_detal'
    />
    <ShipmentsModal 
      :shipments='shipments'
      :izd='izdForSchipment'
      v-if='shipments.length'
      :key='shipmentKey'
    />
    <TechProcess 
      v-if='techProcessID'
      :key='techProcessKey'
      @unmount='unmount_tech_process'
      :techProcessID='techProcessID'
    />

    <Loader v-if='loader' />
  </div>
</template>

<script>
import {random} from 'lodash';
import { showMessage } from '@/js/';
import Search from '@/components/search.vue';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import DetalModal from '@/components/basedetal/detal-modal.vue';
import DatePicterRange from '@/components/date-picter-range.vue';
import DescriptionModal from '@/components/description-modal.vue';
import ShipmentsModal from  '@/components/sclad/shipments-to-ized.vue';
import TechProcess from '@/components/basedetal/tech-process-modal.vue';
import StartPraduction from '@/components/sclad/start-production-modal.vue';
import ShipmentList from '@/components/issueshipment/shipments-list-table.vue';
import ShipmentsMiniList from '@/components/issueshipment/shipments-mini-list-modal.vue';
export default {
  data() {
    return {
      showProductionModal: false,
      startProductionModalKey: random(1, 999),

      showDescriptionModal: false,
      descriptionKey: random(1, 999),

      message: '',
      type: '',
      keyInformTip: random(1, 999),

      parametrs: null,

      description: '',

      selectShipment: [],
      toProductionArr: [],

      select_izd: null,
 
      showShipment: false,
      shipmentKey: random(1, 999),
      detalModalKey: random(1, 999),
			parametrs_detal: false,

      shipments: [],

      kolvo_all: 0,
      loader: false,
      izdForSchipment: null,
      
      selectEnumStatus: 'Все',
      selectEnumDeficit: 'Все',
      enumStatus: [
        'Все',
        'Заказано',
        'Не заказано'
      ],
      enumDeficit: [
        'Все',
        'Общий',
        'По заказам покупателя'
      ],

      techProcessKey: random(1, 999),
      techProcessID: null
    }
  },
  computed: mapGetters(['allDetal', 'getShipments']),
  components: { 
    DatePicterRange, 
    StartPraduction, 
    DescriptionModal, 
    ShipmentsMiniList,
    DetalModal,
    Search,
    ShipmentList,
    ShipmentsModal,
    TechProcess
  },
  watch: {
    selectEnumStatus: function(val) {
      this.changeStatusDeficitDetal(val)
    },
    selectEnumDeficit: function(val) {
      this.changeDeficitDetal({status: val, deficit: this.returnDificit})
    }
  }, 
  methods: {
    ...mapActions(['setchDeficitDeficit', 'fetchAllShipments']),
    ...mapMutations([
      'filterDetalToArticle',
      'detalToShipmentsSort',
      'reverseMidlevareDetal',
      'changeStatusDeficitDetal',
      'changeDeficitDetal',
    ]),
    unmount_clear() {
      this.reverseMidlevareDetal()
    },
    returnZnachCPU(detal) {
      if(!detal?.techProcesses?.operations?.length) return 'нет'
      let op = detal.techProcesses.operations
      for(let item of op) {
        if(item?.typeOperation?.cpu) return 'да'
      }
      return 'нет'
    },
    returnDificit(izd, kol) {
      return kol - izd.min_remaining - izd.shipments_kolvo > 0 ? 
        0 : kol - izd.min_remaining - izd.shipments_kolvo
    },
    toSetOrders(shipments) {
      this.unmount_clear()
      this.detalToShipmentsSort(shipments.detals)
    },
    keySearch(v) {
      this.filterDetalToArticle(v)
    },
    unmount_sh_list(res) {
      if(res) this.fetchAllShipmentsSclad(true)
    },
    unmount_tech_process() {
      this.techProcessID = null
    },
    returnShipmentsDateModal(izd, type) {
      let shipments = izd.shipments
      if(!shipments || shipments.length == 0) return showMessage('', 'Нет Заказов', 'i', this)
      this.shipments = shipments
      this.izdForSchipment = {izd, type}
      this.shipmentKey = random(1, 999)
    },
    start() {
      if(!this.toProductionArr.length)
        return showMessage('', 'Для начала выберите Д и заказ', 'w', this)
      this.parametrs = {
        izd: this.toProductionArr,
        type: 'det'
      }
      this.startProductionModalKey = random(1, 999)
    },
    shipmentsAdd() {
      this.showShipment = true
      this.shipmentKey = random(1, 999)
    },
    toProduction(izd, e) {
      e.classList.toggle('checkbox_block_select')
      let check = true
      for(let izdd of this.toProductionArr) {
        if(izdd.id == izd.id) {
          this.toProductionArr = this.toProductionArr.filter(iz => iz.id != izd.id)
          check = false
        }
      }
      if(check) this.toProductionArr.push(izd)
    },
    setIzdels(izd) {
      this.select_izd = izd
    },
    selectAllItem() {
      if(this.toProductionArr.length < this.allDetal.length) {
        this.toProductionArr = this.allDetal
        document.getElementsByClassName('checkbox_block').forEach(el => el.classList.add('checkbox_block_select'))
      } else {
        this.toProductionArr = []
        document.getElementsByClassName('checkbox_block').forEach(el => el.classList.remove('checkbox_block_select'))
      }
    },
    getTimming(param, kol = 1) {
      if(!param) return 0
      try {
        let pars = JSON.parse(param)
        if(pars) 
          return (Number(pars.preTime.znach) + ((Number(pars.helperTime.znach) + Number(pars.mainTime.znach)) * kol)).toFixed(2)
      } catch(e) {
        console.error(e)
      }
    },
    openDescription(description) {
      this.showDescriptionModal = true
      this.descriptionKey = random(1, 999)
      this.description = description
    },
    alt(e) {
      if(!this.select_izd)
        return showMessage('', 'Для начала выберите Деталь, иначе данные не сохранятся!', 'w', this)
      this.select_izd.my_kolvo = Number(e.innerText)
    },
    showInformIzdel(id) {
      if(!id) return false 
      this.parametrs_detal = id
      this.detalModalKey = random(1, 999)
		},
    changeDatePicterRange(val) {
      console.log(val)
    },
    showTechProcess(detal) {
      if(!detal.techProcesses) return showMessage('', 'Нет Технологического процесса', 'w', this)
      this.techProcessID = detal.techProcesses.id
      this.techProcessKey = random(1, 999)
    },
  },
  async mounted() {
    this.loader = true
    this.reverseMidlevareDetal()
    await this.setchDeficitDeficit()
    await this.fetchAllShipments({sort: undefined, light: true})
    this.loader = false
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
th {
  font-size: 13px;
}
</style>