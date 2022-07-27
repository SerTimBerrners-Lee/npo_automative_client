<template>
  <div>
    <h3>Дефицит Сборочных Едениц</h3>
    <div>
      <div class="block header_block">
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
    </div>
    <div class='table_block'>
      <div style='width: 400px;'> 
        <ShipmentList
          @unmount_set='toSetOrders'
          @unmount_clear='unmount_clear'
          :getShipments='getShipments'
          @unmount_set_work='toSetOrdersAss'
          :workings='assemblyWorkings'/>
      </div>
      <div style='margin-left: 5px;'>
        <table>
          <tbody class='fixed_table_85'>
            <tr>
              <th colspan="6" class='min_width-120'>Комплектация сборки</th>
              <th rowspan="3" class='min_width-120'>Дефицит</th>
              <th rowspan="3" class='min_width-120'>Дефицит по заказам покупателя </th>
              <th rowspan="3" class='min_width-120'>Потребность по Заказам покупателя</th>
              <th rowspan="3" class='min_width-120'>Остаток</th>
              <th rowspan="3" class='min_width-120'>С учетом прихода Сб. и Изд.</th>
              <th rowspan="3" class='min_width-120'>Минимальный остаток</th>
              <th rowspan="3" class='min_width-120'>Рекомендуемый остаток</th>
              <th rowspan="3" class='min_width-120'>Норма времени на одну единицу (сборка+изготовл.)</th>
              <th rowspan="3" class='min_width-120'>СВОЕ кол-во(по умолч. равно рекоменд. кол-ву)</th>
              <th rowspan="3" class='min_width-120'>Общая норма времени (сборка+изготовл.)</th>
              <th rowspan="3" class='min_width-120'>Заказано на производстве</th>
              <th rowspan="3" class='min_width-120'>Реальный остаток с учетом планируемых отгрузок и планируемого производства</th>
              <th rowspan="3" class='min_width-120'>Уровень комплектации, %</th>
              <th rowspan="3" class='min_width-120'>Статус</th>
              <th rowspan="3" class='min_width-120'>Примечание</th>
            </tr>
            <tr>
              <th class='center'>№</th>
              <th @click='selectAllItem' style='cursor: pointer;'>
                <unicon name="check" fill="royalblue" />
              </th> 
              <th>Тип</th>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Заказы</th>
            </tr>
            <tr>
              <td colspan='2'>Поиск: </td>
              <td colspan="4">
                <Search 
                  :placeholder="'Поиск СБ по Артиклу и Наименованию'"
                  @unmount='keySearchCb' 
                />
              </td>
            </tr>
          </tbody>
          <tr v-for='(cbed, inx) of allCbed' :key='cbed' 
            class='td-row'
            @click='setIzdels(cbed)'>
            <td class='center'>{{ inx+1 }}</td>
            <td>
              <div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                <p class="checkbox_block" @click='e => toProduction(cbed, e.target)'></p>
              </div>
            </td>
            <td class='center'>СБ</td>
            <td class='center'>{{ cbed.articl }}</td>
            <td class='center' @dblclick="showInformIzdel(cbed.id, 'cbed')">{{ cbed.name }}</td>
            <td class='center' @click='returnShipmentsDateModal(cbed)'>
              <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
            </td>
            <td class='center min_width-100' style='color: red;'>{{ returnDificit(cbed, cbed.cbed_kolvo) }}</td> <!-- Дефицит -->
            <td class='center min_width-100' style='color: red;'>{{ (-cbed.shipments_kolvo - cbed.cbed_kolvo) > 0 ? 0 : (-cbed.shipments_kolvo - cbed.cbed_kolvo) }}</td> <!-- Дефицит По заказам покупателя -->
            <td class='center min_width-100'>{{ cbed.shipments_kolvo }}</td> <!-- Потребность по Заказам покупателя -->
            <td class='center min_width-100'>{{ cbed.cbed_kolvo }}</td> <!-- Остаток -->
            <td class='center min_width-100'>{{ cbed.deficit - cbed.min_remaining }}</td> <!-- С учетом прихода Сб. и Изд. -->
            <td class='center min_width-100'>{{ cbed.min_remaining }}</td> <!-- Минимальный остаток -->
            <td class='center min_width-100'>{{ cbed?.min_remaining * 3 }}</td> <!-- Рекомендуемый остаток -->
            <td class='center min_width-100'>{{ cbed.parametrs ? JSON.parse(cbed.parametrs)[0].znach : '' }}</td>
            <td class='center min_width-100' contenteditable="true" @keyup='e => alt(e.target)'>{{ cbed?.my_kolvo || cbed.min_remaining * 3  }}</td> 
            <td class='center min_width-100'>{{ cbed.parametrs ? 
              Number(JSON.parse(cbed.parametrs)[0].znach) * cbed.shipments_kolvo
              : '' }}</td> <!-- Общее время выполения на сборку  -->
            <td class='center min_width-100'>{{ cbed.assemble_kolvo }}</td> <!-- Заказано на производстве --> 
            <td class='center min_width-100'>{{ cbed.cbed_kolvo + cbed.assemble_kolvo - cbed.shipments_kolvo }}</td> <!-- Реальный остаток с учетом -->
            <td class='center min_width-100'>{{  }}</td> <!-- Уровень компленктации -->
            <td v-if='cbed.assemble_kolvo > 0' class='center min_width-100 success_operation'>Заказано</td>
            <td v-else class='center min_width-100 work_operation'>Не заказано</td>
            <td class='center min_width-100'>
              <img src="@/assets/img/link.jpg" @click='openDescription(cbed.description)' class='link_img' atl='Показать' />
            </td>
          </tr>
        </table>
        <div class='btn-control out-btn-control wh_70p'>
          <button class="btn-small" @click='normTimeOperation'>Норма времени по операциям</button>
          <button class="btn-small btn-add" @click='start'>Запустить в производство</button>
        </div>
      </div>
    </div>
    <StartProduction 
      v-if='parametrs'
      :key='startProductionModalKey'
      :parametrs='parametrs'
      @unmount="unmount_start_production"
    />
    <DescriptionModal 
      v-if='showDescriptionModal'
      :key='descriptionKey'
      :parametrs='description'
    />
    <NormTimeOperation
      v-if='showNormTimeOperation'
      :key='normTimeOperationKey'
      :izdelie='select_izd'
      :type='type_norm_time'
    />
    <CbedModalInfo
      :id='parametrs_cbed'
      :key='cbedModalKey'
      v-if='parametrs_cbed'
    />
    <ShipmentsModal 
      :shipments='shipments'
      :izd='izdForSchipment'
      v-if='shipments.length'
      :key='shipmentKey'
      :scladWorking='assemblyWorkings'
    />
    <Loader v-if='loader' />
  </div>
</template>
<script>
import { random } from 'lodash';
import { showMessage, comparison } from '@/js/';
import CbedModalInfo from '@/components/CbEd/CbedModal';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DescriptionModal from '@/components/DescriptionModal';
import ShipmentsModal from  '@/components/Sclad/ShipmentsToIzed';
import StartProduction from '@/components/Sclad/StartProductionModal';
import ShipmentList from '@/components/IssueShipment/ShipmentsListTable';
import NormTimeOperation from '@/components/Sclad/NormTimeOperationModal';

export default {
  data() {
    return {
      parametrs: null,
      startProductionModalKey: random(1, 888),

      showDescriptionModal: false,
      descriptionKey: random(1, 999),
      description: '',

      shipments: [],
      toProductionArr: [],
      shipmentKey: random(1, 999),
      assemblyWorkings: [],
      
      showNormTimeOperation: false,
      normTimeOperationKey: random(1, 999),

			parametrs_cbed: null,
			cbedModalKey: random(1, 999),

      select_izd: null,

      loader: false,
      type_norm_time: 'cb',

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
    }
  },
  computed: mapGetters([
    'getWorkings',
    'allCbed',
    'getShipments'
  ]),
  components: {
    StartProduction, 
    DescriptionModal, 
    NormTimeOperation,
    ShipmentsModal,
    CbedModalInfo,
    ShipmentList
  },
  watch: {
    selectEnumStatus: function(val) {
      this.changeStatusDeficitCbed(val);
    },
    selectEnumDeficit: function(val) {
      this.changeDeficitCbed({status: val, deficit: this.returnDificit});
    }
  },
  methods: {
    ...mapActions([
      'setchDeficitCbed',
      'fetchAllShipmentsNoStatus',
      'fetchAllWorkings'
    ]),
    ...mapMutations([
      'searchCbed',
      'cbedToShipmentsSort',
      'reverseMidlevareCbed',
      'changeStatusDeficitCbed',
      'changeDeficitCbed',
    ]),
    unmount_start_production(data) {
      if (!data) return;
      this.toProductionArr.forEach(el => el.assemble_kolvo++);
    },
    returnDificit(izd, kol) {
      return kol - izd.min_remaining - izd.shipments_kolvo > 0 ? 
        0 : kol - izd.min_remaining - izd.shipments_kolvo;
    },
    keySearchCb(v) {
      this.searchCbed(String(v));
    },
    async unmount_clear() {
      this.loader = true;
      this.reverseMidlevareCbed();
      await this.fetchAllShipmentsNoStatus();
      this.loader = false;
    },
    toSetOrders(shipments) {
      this.reverseMidlevareCbed();
      this.cbedToShipmentsSort(shipments.cbeds);
    },
    start() {
      if (!this.toProductionArr.length)
        return showMessage('', 'Для начала выберите СБ и заказ', 'w');
      this.parametrs = {
        izd: this.toProductionArr,
        type: 'cbed'
      };
      this.startProductionModalKey = random(1, 999);
    },
    openDescription(description) {
      this.showDescriptionModal = true;
      this.descriptionKey = random(1, 999);
      this.description = description;
    },
    normTimeOperation() {
      if (!this.select_izd)
        return showMessage('', 'Для начала выберите СБ', 'w');
      this.showNormTimeOperation = true;
      this.normTimeOperationKey = random(1, 999);
    },
    returnShipmentsKolvo(shipments) {
      if (!shipments || shipments.length == 0) return '-'
      let end_date = shipments[0]?.number_order.split('от')[0] || '-'
      for (const ship1 of shipments) {
        for (const ship2 of shipments) {
          if (!ship1.number_order) continue;
          if (comparison(ship1.date_shipments, ship2.date_shipments, '<')) end_date = ship1.number_order.split('от')[0];
        }
      }
      return end_date;
    },
    returnShipmentsDateModal(izd) {
      const shipments = izd.shipments;
      if (!shipments || shipments.length == 0) return showMessage('', 'Нет Заказов', 'i')
      this.shipments = shipments;
      this.izdForSchipment = {izd, type: 'cbed'};
      this.shipmentKey = random(1, 999);
    },
    getTimming(param, kol = 1) {
      if (!param) return 0;
      try {
        const pars = JSON.parse(param);
        if(pars) 
          return (Number(pars.preTime.znach) + ((Number(pars.helperTime.znach) + Number(pars.mainTime.znach)) * kol)).toFixed(2);
      } catch(e) { console.error(e); }
    },
    toProduction(izd, e) {
      e.classList.toggle('checkbox_block_select');
      let check = true;
      for (const izdd of this.toProductionArr) {
        if(izdd.id == izd.id) {
          this.toProductionArr = this.toProductionArr.filter(iz => iz.id != izd.id);
          check = false;
        }
      }
      if (check) this.toProductionArr.push(izd);
    },
    setIzdels(izd) {
      this.select_izd = izd;
    },
    alt(e) {
      if (!this.select_izd)
        return showMessage('', 'Для начала выберите Изделие, иначе данные не сохранятся!', 'w');
      this.select_izd.my_kolvo = e.innerText;
    },
    selectAllItem() {
      if (this.toProductionArr.length < this.allCbed.length) {
        this.toProductionArr = this.allCbed;
        document.getElementsByClassName('checkbox_block').forEach(el => el.classList.add('checkbox_block_select'));
      } else {
        this.toProductionArr = [];
        document.getElementsByClassName('checkbox_block').forEach(el => el.classList.remove('checkbox_block_select'));
      }
    },
    showInformIzdel(id, type) {
			if (type == 'cbed') {
				if (id) {
					this.parametrs_cbed = id;
					this.cbedModalKey = random(1, 999);
				}
			}
		},
    toSetOrdersAss(work) {
      if (!work.assemble || !work.assemble.length) return false;
      const arr = [];
      for (const item of work.assemble) {
        if (item.cbed) arr.push(item.cbed);
      }
      this.cbedToShipmentsSort(arr);
      this.loader = false;
    }
  },
  async mounted() {
    this.loader = true;
    this.reverseMidlevareCbed();
    await this.setchDeficitCbed();
    await this.fetchAllShipmentsNoStatus();

    await this.fetchAllWorkings();
    this.assemblyWorkings = this.getWorkings.filter(el => el.type == 'ass');
    this.loader = false;
  }
}
</script>
<style scoped>
.table_block{
  display: flex;
}
.block {
  padding: 5px;
}
.block .btn { 
  margin: 0px;
}
.header_block {
  display: flex;
  align-items: center;
}
th {
  font-size: 11px;
}

</style>