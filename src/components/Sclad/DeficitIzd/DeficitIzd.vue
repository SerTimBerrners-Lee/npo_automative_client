<template>
  <div>
    <h3>Дефицит Продукции</h3>
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
          @unmount_action='unmount_action'
          :getShipments='getShipments'
          @unmount_set_work='toSetOrdersAss'
          :workings='assemblyWorkings'
        />
      </div>
      <div style='margin-left: 5px;'>
        <table>
          <tbody class='fixed_table_85'>
            <tr>
              <th colspan="6" class='min_width-120'>Изделие</th>
              <th rowspan="3" class='min_width-120'>Дефицит</th>
              <th rowspan="3" class='min_width-120'>Дефицит по заказам покупателя </th>
              <th rowspan="3" class='min_width-120'>Потребность по Заказам покупателя</th>
              <th rowspan="3" class='min_width-120'>Остаток</th>
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
              <th>Заводской номер</th>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Заказы</th>
            </tr>
            <tr>
              <td colspan='2'>Поиск: </td>
              <td colspan="4">
                <Search 
                  :placeholder="'Поиск по Изделия'"
                  @unmount='keySearch' 
                />
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr v-for='(product, inx) of allProduct' :key='product' 
              class='td-row'
              @click='setIzdels(product)'>
              <td class='center'>{{ inx+1 }}</td>
              <td>
                <div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
                  <p class="checkbox_block" @click='e => toProduction(product, e.target)'></p>
                </div>
              </td>
              <td class='center'>{{ product.fabricNumber }}</td>
              <td class='center'>{{ product.articl }}</td>
              <td class='center' @dblclick="showInformIzdel(product.id)">{{ product.name }}</td>
              <td class='center' @click='returnShipmentsDateModal(product)'>
                <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
              </td>
              <td class='center min_width-100' style='color: red;'>{{ returnDificit(product, product.product_kolvo) }}</td> <!-- Дефицит -->
              <td class='center min_width-100' style='color: red;'>{{ -product.shipments_kolvo }}</td> <!-- Дефицит по Заказам покупател  -->
              <td class='center min_width-100'>{{ (product.shipments_kolvo - product.product_kolvo) > 0 ? 0 : product.shipments_kolvo - product.product_kolvo }}</td> <!-- Потребность по Заказам покупателя -->
              <td class='center min_width-100'>{{ product.product_kolvo }}</td> <!-- Остаток -->
              <td class='center min_width-100'>{{ product?.min_remaining }}</td> <!-- Минимальный остаток -->
              <td class='center min_width-100'>{{ product?.min_remaining * 3 }}</td> <!-- Рекомендуемый остаток -->
              <td class='center min_width-100'></td> <!-- Норма времени на одну -->
              <td class='center min_width-100' contenteditable="true" @keyup='e => alt(e.target)'>{{ product?.my_kolvo || product.min_remaining * 3  }}</td> 
              <td class='center min_width-100'>
              </td> <!-- Общая норма времени -->
              <td class='center min_width-100'>{{ product.assemble_kolvo }}</td>  <!-- Заказано на производстве -->
              <td class='center min_width-100'>{{ product.product_kolvo + product.assemble_kolvo - product.shipments_kolvo }}</td>  <!-- Реальный остаток с уч. отгрузок -->
              <td class='center min_width-100'>{{  }}</td>  <!-- Ур. комплектации -->
              <td v-if='product.assemble_kolvo > 0' class='center min_width-100 success_operation'>Заказано</td>
              <td v-else class='center min_width-100 work_operation'>Не заказано</td>
              <td class='center min_width-100'>
                <img src="@/assets/img/link.jpg" @click='openDescription(product.description)' class='link_img' atl='Показать' />
              </td>
            </tr>
          </tbody>

        </table>
        <div class='btn-control out-btn-control wh_70p'>
          <button class="btn-small" @click='normTimeOperation'>Норма времени по операциям</button>
          <button class="btn-small btn-add" @click='start'>Запустить в производство</button>
        </div>
      </div>
    </div>
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
    <ShipmentsModal 
      :shipments='shipments'
      :izd='izdForSchipment'
      v-if='shipments.length'
      :key='shipmentKey'
      :scladWorking='assemblyWorkings'
    />
    <ProductModalInfo
      :id='parametrs_product'
      :key='productModalKey'
      v-if='parametrs_product'
    />
    <StartProduction 
      v-if='parametrs'
      :key='startProductionModalKey'
      :parametrs='parametrs'
      @unmount="unmount_start_production"
    />
    <Loader v-if='loader' />
  </div>
</template>
<script>
import { random } from 'lodash';
import { showMessage, comparison } from '@/js/';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DescriptionModal from '@/components/DescriptionModal';
import ShipmentsModal from  '@/components/Sclad/ShipmentsToIzed';
import ProductModalInfo from '@/components/BaseProduct/ProductModal';
import StartProduction from '@/components/Sclad/StartProductionModal';
import ShipmentList from '@/components/IssueShipment/ShipmentsListTable';
import NormTimeOperation from '@/components/Sclad/NormTimeOperationModal';

export default {
  data() {
    return {
      showDescriptionModal: false,
      descriptionKey: random(1, 999),
      description: '',

      shipments: [],
      shipmentKey: random(1, 999),
      assemblyWorkings: [],
      
      showNormTimeOperation: false,
      normTimeOperationKey: random(1, 999),

      parametrs: null,
      startProductionModalKey: random(1, 888),

      select_izd: null,

      loader: false,
      type_norm_time: 'cb',

      izdForSchipment: null,
      toProductionArr: [],

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

      parametrs_product: null,
      productModalKey: random(1, 999)
    }
  },
  computed: mapGetters([
    'getWorkings',
    'allProduct',
    'getShipments'
  ]),
  components: {
    ProductModalInfo,
    DescriptionModal, 
    NormTimeOperation, 
    ShipmentsModal,
    ShipmentList,
    StartProduction
  },
  watch: {
    selectEnumStatus: function(val) {
      this.changeStatusDeficitProduct(val);
    },
    selectEnumDeficit: function(val) {
      this.changeKolDeficitProduct({status: val, deficit: this.returnDificit});
    }
  },
  methods: {
    ...mapActions([
      'setchDeficitProducts', 
      'fetchAllShipmentsNoStatus',
      'getAllProductShipmentsById',
      'fetchAllWorkings'
    ]),
    ...mapMutations([
      'searchProduct',
      'changeStatusDeficitProduct',
      'reverseMidlevareProduct',
      'productToShipmentsSort',
      'changeKolDeficitProduct',
    ]),
    // Меняем параметры с учетом заказа
    unmount_start_production(data) {
      if (!data) return;
      this.toProductionArr.forEach(el => el.assemble_kolvo++);
    },
    returnDificit(izd, kol) {
      return kol - izd.min_remaining - izd.shipments_kolvo  > 0 ? 
        0 : kol - izd.min_remaining - izd.shipments_kolvo;
    },
    keySearch(v) {
      this.searchProduct(String(v));
    },
    async unmount_clear() {
      this.loader = true;
      this.reverseMidlevareProduct();
      await this.fetchAllShipmentsNoStatus();
      this.loader = false;
    },
    unmount_action() {
      this.loader = true;
    },
    showInformIzdel(productId) {
      if (!productId) return false;
      this.parametrs_product = productId;
      this.productModalKey = random(1, 999);
    },
    toSetOrders(shipments) {
      this.reverseMidlevareProduct();
      this.productToShipmentsSort([shipments.product]);
      this.loader = false;
    },
    openDescription(description) {
      this.showDescriptionModal = true;
      this.descriptionKey = random(1, 999);
      this.description = description;
    },
    normTimeOperation() {
      if (!this.select_izd)
        return showMessage('', 'Для начала выберите Изделие', 'w');
      this.showNormTimeOperation = true;
      this.normTimeOperationKey = random(1, 999);
    },
    returnShipmentsKolvo(shipments) {
      if (!shipments || shipments.length == 0) return '-';
      let end_date = shipments[0]?.number_order.split('от')[0] || '-';
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
      if (shipments && shipments.length == 0) return showMessage('', 'Нет Заказов', 'i');
      if (!shipments) return;
      this.shipments = shipments;
      this.izdForSchipment = {izd, type: 'prod'};
      this.shipmentKey = random(1, 999);
    },
    getTimming(param, kol = 1) {
      if (!param) return 0;
      try {
        const pars = JSON.parse(param);
        if (pars) 
          return (Number(pars.preTime.znach) + ((Number(pars.helperTime.znach) + Number(pars.mainTime.znach)) * kol)).toFixed(2);
      } catch(e) { console.error(e); }
    },
    setIzdels(izd) {
      this.select_izd = izd;
    },
    alt(e) {
      if (!this.select_izd)
        return showMessage('', 'Для начала выберите Изделие, иначе данные не сохранятся!', 'w');
      this.select_izd.my_kolvo = e.innerText;
    },
    toProduction(izd, e) {
      e.classList.toggle('checkbox_block_select');
      let check = true;
      for (const izdd of this.toProductionArr) {
        if (izdd.id == izd.id) {
          this.toProductionArr = this.toProductionArr.filter(iz => iz.id != izd.id);
          check = false;
        }
      }
      if (check) this.toProductionArr.push(izd);
    },
    start() {
      if (!this.toProductionArr.length)
        return showMessage('', 'Для начала выберите Изделие', 'w');
      this.parametrs = {
        izd: this.toProductionArr,
        type: 'prod'
      };
      this.startProductionModalKey = random(1, 999);
    },
    toSetOrdersAss(work) {
      if (!work.assemble || !work.assemble.length) return false;
      const arr = [];
      for (const item of work.assemble) {
        if (item.cbed) arr.push(item.cbed);
      }
      this.productToShipmentsSort(arr);
      this.loader = false;
    }
  },
  async mounted() {
    this.loader = true;
    await this.setchDeficitProducts();
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