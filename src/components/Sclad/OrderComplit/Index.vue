<template>
  <div>
    <h3>Отгруженные задачи</h3>
    <div>
      <div class="block header_block">
       <DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
      </div>
    </div>
    <div>
      <div style='width: fit-content;'>
				<table>
          <tr>
            <th>№</th>
            <th>Дата факт. отгрузки</th>
            <th class='fix_size'>Покупатель</th>
            <th>№ Заказа и дата</th>
            <th class='fix_size'>Артикул Изделия</th>
            <th class='fix_size'>Наименование Изделия</th>
            <th class='fix_size'>Комплектация</th>
            <th>Примечание</th>
          </tr>
          <tr 
            v-for="(sh_complit, inx) of getShComplits"
            :key="sh_complit"
            class='td-row'
            @click='e => setComplit(sh_complit, e.target.parentElement)'
            @dblclick="openComplitModal(sh_complit)">
            <td class='center'>{{ inx + 1 }}</td>
            <td class='center'>{{ sh_complit.date_shipments_fakt }}</td>
            <td class='center fix_size'>{{ sh_complit?.shipments?.buyer?.name || 'На склад' }}</td>
            <td class='center'>{{ sh_complit.number_complit }}</td>
            <td class='center fix_size'>{{ sh_complit?.shipments?.product?.articl }}</td>
            <td class='center fix_size'>{{ sh_complit?.shipments?.product?.name }}</td>
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
import { mapGetters, mapActions } from 'vuex';
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
  computed: mapGetters(['getShComplits']),
  methods: {
    ...mapActions(['fetchShComplit']),
    unmount_complit_modal() {
      console.log('unmount_complit_modal')
    },
    changeDatePicterRange(val) {
      console.log(val);
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
      console.log(sh_complit);
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
</style>