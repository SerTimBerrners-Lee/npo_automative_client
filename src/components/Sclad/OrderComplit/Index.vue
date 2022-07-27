<template>
  <div>
    <h3>Отгруженные задачи <label style="color:black;">(всего: {{ getShComplits.length }})</label></h3>
    <div>
      <div class="block header_block">
       <DatePicterRange 
          @unmount='changeDatePicterRange'
          v-if='!loader'
        />
      </div> 
    </div>
    <div>
      <div class='pretable'>
				<table>
          <tbody class='fixed_table_85'>
            <tr>
              <th class='fix_size' style="width: 20px;">№</th>
              <th class='fix_size'>Дата факт. отгрузки</th>
              <th class='fix_size'>Номер Отгрузки</th>
              <th class='fix_size'>Покупатель</th>
              <th class='fix_size'>Номер и дата заказа</th>
              <th class='fix_size'>Артикул Изделия</th>
              <th class='fix_size'>Наименование Изделия</th>
              <th class='fix_size'>Комплектация</th>
              <th class='fix_size'>Примечание</th>
            </tr>
            <tr>
              <th colspan="9">
                <Search 
                  :placeholder="'Поиск по Номеру заказа'"
                  @unmount='keySearch'
                />
              </th>
            </tr>
          </tbody>
          <tr 
            v-for="(sh_complit, inx) of getShComplits"
            :key="sh_complit"
            class='td-row'
            @click='e => setComplit(sh_complit, e.target.parentElement)'
            @dblclick="openComplitModal(sh_complit)">
            <td class='center'>{{ inx + 1 }}</td>
            <td class='center'>{{ sh_complit.date_shipments_fakt }}</td>
            <td class='center'>{{ sh_complit.number_complit }}</td>
            <td class='center fix_size'>{{ getBuyer(sh_complit?.shipments) }}</td>
            <td class='center fix_size'>{{ getNumberShipments(sh_complit?.shipments) }}</td>
            <td class='center fix_size'>{{ getProduct(sh_complit?.shipments)?.articl }}</td>
            <td class='center fix_size'>{{ getProduct(sh_complit?.shipments)?.name }}</td>
            <td class='center fix_size' @click='openComplectation(sh_complit?.shipments)' id="complect" >
              <img 
                src="@/assets/img/link.jpg" 
                class='link_img' 
                atl='Показать'
                v-if='sh_complit?.shipments' />
              <p v-else>Нет комплектации</p>
            </td> <!-- Комплектация -->
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDescription(sh_complit.description)' class='link_img' atl='Показать' />
            </td>
          </tr>
        </table>  
      </div>
    </div>
    <DescriptionModal 
      v-if='showDescriptionModal'
      :key='descriptionKey'
      :parametrs='description'
    />
    <KomplectModal
			v-if='parametrs_komplect'
			:key='komplect_generate_key'
			:parametrs='parametrs_komplect'
			:shipments='select_shipments'
		/>
    <Shipment 
      v-if='selected_complit'
      :key='shipment_key'
      :complit='selected_complit'
      @unmount='unmount_complit_modal'
    />
    <Loader v-if='loader' />
  </div>
</template>

<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import { eSelectSpan } from '@/js/methods';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DatePicterRange from '@/components/DatePicterRange';
import DescriptionModal from '@/components/DescriptionModal';
import KomplectModal from '@/components/IssueShipment/KomplectModal';
import Shipment from '@/components/Sclad/IssueToPull/ShComlitUpdateModal';

export default {
  data() {
    return {
      showShipmentModal: false,
      shipmentKey: random(1, 999),
      select_shipments: null,
      loader: false,

			tr: null,

      showDescriptionModal: false,
      descriptionKey: random(1, 999),
      description: '',

      parametrs_komplect: null,
			komplect_generate_key: random(1, 999),

      shipment_key: random(1, 999),
      selected_complit: null,

    }
  },
  components: {
    DatePicterRange,
    DescriptionModal,
    KomplectModal,
    Shipment
  },
  computed: {
    ...mapGetters(['getShComplits']),
  },
  methods: {
    ...mapActions(['fetchShComplit']),
    ...mapMutations(['filterShComplitData', 'searchComplitSh']),
    async unmount_complit_modal() {
      this.loader = true;
      await this.fetchShComplit();
      this.loader = false;
    },
    getBuyer(ship = []) {
      if (!ship.length) return 'На склад';
      return ship[0]?.buyer?.name || 'На склад';
    },
    getNumberShipments(ship = []) {
      if (!ship.length) return 'Нет заказа';
      for (const item of ship) {
        if (item.number_order) return item.number_order;
      }
      return 'Нет номера';
    },
    getProduct(ship = []) {
      if (!ship.length) return '-';
      return {
        name: ship[0]?.product?.name || '-',
        articl: ship[0]?.product?.articl || '-'
      }
    },
    changeDatePicterRange(val) {
      this.filterShComplitData(val);
    },
    keySearch(str) {
      this.searchComplitSh(String(str));
    },
    openDescription(description) {
      this.showDescriptionModal = true;
      this.descriptionKey = random(1, 999);
      this.description = description;
    },
    setComplit(complit, e) {
      this.selected_complit = complit;
      this.tr = eSelectSpan(this.tr, e);
    },
    openComplectation(sh) {
			if (!sh || !sh.list_cbed_detal) return false;

			this.komplect_generate_key = random(1, 999);
			this.parametrs_komplect = sh.list_cbed_detal;
			this.select_shipments = sh;
		},
    openComplitModal(sh_complit) {
      if (!sh_complit) return showMessage('', 'Выберите отгрузку', 'w');
      this.selected_complit = sh_complit;
      this.shipment_key = random(1, 999);
    }
  },
  async mounted() {
    this.loader = true; 
    await this.fetchShComplit();
    this.loader = false;
  }
}
</script>

<style scoped>
.komplect_p {
  margin: 0px;
  display: flex;
  justify-content: space-between;
}
.komplect_p span {
  border-bottom: 1px solid #d3d3d3;
  border-left: 1px solid #d3d3d3;
}
.komplect_td {
  padding: 0px !important;
}
.kol {
  width: 30px;
  justify-content:center;
  align-items: center;
  display: flex;
}
.prod_name {
  width: 100px;
  height: fit-content;
  text-align: start;
}
.fix_size {
	width: 100px;
	word-break: break-all;
}
.pretable {
  width: 1100px;
}
.pretable>table {
  width: 1100px;
}
</style>