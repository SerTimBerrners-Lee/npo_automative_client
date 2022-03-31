<template>
	<div> 
		<h3>Комплектация сборок на план</h3>
    <div class='table_block'>
      <ShipmentList
        v-if='getShipments.length'
        @unmount_set='toSetOrders'
        @unmount_clear='unmount_clear'
        @unmount_action='unmount_action'
        :getShipments='getShipments'
      />

       <div class="table-scroll" style='margin-left: 5px;'>
        <table>
          <tr>
            <th colspan="2"></th>
            <th colspan="2">Сборочная единица</th>
            <th colspan="5"></th>
          </tr>
          <tr>
            <th>№ Заказа склада</th>
            <th>Заказчик</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Кол-во ВСЕГО по заказу склада, шт.</th>
            <th>Кол-во в т.ч. по заказу покупателя, шт.</th>
            <th>% Комплектации</th>
            <th>Комплектация </th>
            <th>Документы</th>
          </tr>
          <tr v-for='ass of getAssembles' :key='ass'>
            <td class='center'>{{ ass.number_order }}</td>
            <td class='center'>{{ ass.cbed.shipments.length || 'склад' }}</td>
            <td class='center'>{{ ass.cbed.articl }}</td>
            <td class='center'>{{ ass.cbed.name }}</td>
            <td class='center'>{{ ass.kolvo_shipments }}</td>
            <td class='center'>{{ ass.kolvo_shipments }}</td>
            <td class='center'>{{ percent(ass) }}</td>
            <td class='center'>{{ 0 }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDocuments(ass.cbed?.id)' class='link_img' atl='Показать' />
            </td>
          </tr>
        </table>
      </div> 
    </div>

     <div class="btn-control">
        <button class="btn-small btn-add" @click='addWaybill'>Создать накладную комплектации сборочного участка</button>
      </div>

      <AddWaybill 
        v-if='showAddWaybill'
        :key='keyAddWaybill'
      />
      <OpensFile 
        :parametrs='itemFiles' 
        v-if="itemFiles.length" 
        :key='keyWhenModalGenerateFileOpen'
      />
      <InformFolder  
        :title='titleMessage'
        :message = 'message'
        :type = 'type'
        v-if='message'
        :key='keyInformTip'
      />
      <Loader v-if='loader' />
	</div>
</template>
<script>
import {random} from 'lodash';
import { showMessage } from '@/js/';
import AddWaybill from './add-waybill';
import {mapGetters, mapActions} from 'vuex';
import OpensFile from '@/components/filebase/openfile';
import ShipmentList from '@/components/issueshipment/shipments-list-table';

export default {
	data() {
		return{
      showAddWaybill: false,
      keyAddWaybill: random(1, 999),

      assembles: [],
      shipments: null,
      loader: false,
      keyWhenModalGenerateFileOpen: random(1, 999),
      itemFiles: [],

      message: '',
      type: '',
      keyInformTip: random(1, 999),
		}
	},
	components: {
    AddWaybill,
    OpensFile,
    ShipmentList
  },
  computed: mapGetters([
      'getShipments',
      'getAssembles',
      'allBuyer'
    ]),
	methods: {
    ...mapActions([
      'fetchAllShipmentsAssemble',
      'fetchAllBuyers',
      'getOneCbEdField',
      'fetchAssemblePlan'
    ]),
    unmount_clear() {
      console.log('unmount_clear');
    },
    unmount_action() {
      console.log('unmount_action');
    },
    addWaybill() {
      this.showAddWaybill = true;
      this.keyAddWaybill = random(1, 999);
    },
    toSetOrders(shipments) {
      this.unmount_clear();
      console.log(shipments);
    },
    returnBuyer(buyer_id) {
      for(const buyer of this.allBuyer) {
        if(buyer.id == buyer_id) return buyer.name;
      }
    },
    percent(ass) {
      const res = ass.kolvo_shipments * (1 / ass.kolvo_create);
      return Number.isFinite(res) ? res : 0;
    },
    async openDocuments(id) {
      const cb = await this.getOneCbEdField({fields: 'documents', id});
      if (cb.documents && cb.documents.length) {
        this.keyWhenModalGenerateFileOpen = random(1, 999);
        this.itemFiles = cb.documents;
      } else showMessage('', 'Документов нет', 'w', this);
    },
	},
	async mounted() {
    this.loader = true
    await this.fetchAllShipmentsAssemble({sort: undefined, light: true});
    await this.fetchAssemblePlan();
    await this.fetchAllBuyers();
    console.log(this.getAssembles);
    this.loader = false
	}
}
</script>
<style scoped>
.block {
  padding: 5px;
}
.block .btn {
  margin: 0px;
}
</style>