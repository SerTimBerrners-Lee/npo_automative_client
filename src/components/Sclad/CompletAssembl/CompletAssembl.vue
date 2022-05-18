<template>
	<div> 
		<h3>Комплектация сборок на план</h3>
    <div class='table_block'>
      <ShipmentList
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
          <tr 
            v-for='ass of getAssembles'
            :key='ass'
            @click="e => setTr(ass, e.target.parentElement)"
            class='td-row'>
            <td class='center'>{{ ass.number_order }}</td>
            <td class='center'>{{ ass.cbed.shipments.length || 'склад' }}</td>
            <td class='center'>{{ ass.cbed.articl }}</td>
            <td class='center'>{{ ass.cbed.name }}</td>
            <td class='center'>{{ ass.kolvo_shipments }}</td>
            <td class='center'>{{ ass.kolvo_shipments }}</td>
            <td class='center'>{{ percent(ass) }}</td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='addWaybill("see")' class='link_img' atl='Показать' />
            </td>
            <td class='center'>
              <img src="@/assets/img/link.jpg" @click='openDocuments(ass)' class='link_img' atl='Показать' />
            </td>
          </tr>
        </table>
      <div class="btn-control" v-if='span'>
        <button class="btn-small btn-add" @click='addWaybill()'>Создать накладную комплектации сборочного участка</button>
      </div>
      </div> 
    </div>
      <AddWaybill 
        v-if='showAddWaybill'
        :key='keyAddWaybill'
        :type_open='type_open'
        :cbed='selectedAss'
      />
      <OpensFile 
        :parametrs='itemFiles' 
        v-if="itemFiles.length" 
        :key='keyWhenModalGenerateFileOpen'
      />
      <Loader v-if='loader' />
	</div>
</template>
<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import AddWaybill from './AddWaybill';
import { eSelectSpan } from '@/js/methods';
import { mapGetters, mapActions } from 'vuex';
import OpensFile from '@/components/FileBase/OpenFile';
import ShipmentList from '@/components/IssueShipment/ShipmentsListTable';

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

      selectedAss: null,
      span: null,
      type_open: 'open'
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
    ]),
	methods: {
    ...mapActions([
      'fetchAllShipmentsAssemble',
      'getOneCbEdField',
      'fetchAssemblePlan',
      'getAllProductById'
    ]),
    unmount_clear() {
      console.log('unmount_clear');
    },
    unmount_action() {
      console.log('unmount_action');
    },
    addWaybill(to = 'add') {
      this.showAddWaybill = true;
      this.keyAddWaybill = random(1, 999);
      console.log(to)
      this.type_open = to;
    },
    toSetOrders() {
      this.unmount_clear();
    },
    percent(ass) {
      const res = ass.kolvo_shipments * (1 / ass.kolvo_create);
      return Number.isFinite(res) ? res : 0;
    },
    async openDocuments(ass) {
      if (!ass?.cbed) return false;
      if (ass.type_izd !== 'cbed') return false;

      const cb = ass.type_izd == 'prod' ? 
        await this.getAllProductById(ass.cbed.id) :
        await this.getOneCbEdField({fields: 'documents', id: ass.cbed.id});

      if (cb.documents && cb.documents.length) {
        this.keyWhenModalGenerateFileOpen = random(1, 999);
        this.itemFiles = cb.documents;
      } else showMessage('', 'Документов нет', 'w');
    },
    setTr(ass, span) {
      this.span = eSelectSpan(this.span, span);
      this.selectedAss = ass;
    }
	},
	async mounted() {
    this.loader = true
    await this.fetchAllShipmentsAssemble({sort: undefined, light: true});
    await this.fetchAssemblePlan();
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