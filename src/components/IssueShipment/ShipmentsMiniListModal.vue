<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Список заказов не перенесенных на склад: {{ getShipmentsSclad.length }}</h3>
			<div class="block">
				<table>
					<tr>
						<th>№</th>
						<th>Артикул изделия</th>
					</tr>
          <tr v-for='shipments of getShipmentsSclad' 
            @click='e => setShipment(shipments, e.target.parentElement)'
            @dblclick="openShipments"
            class='td-row'
            :key='shipments'>
            <td>{{ shipments.number_order }}</td>
						<td>{{ shipments.product.articl }}</td>
          </tr>
				</table>
			</div>
      <div class="btn-control">
        <button class="btn-small btn-add" @click='changeToSclad'>Переместить на склад</button>
      </div>
    </div>
  </div>
</div>
  <ShipmentsModal 
    :key='key_modal_shipments'
    v-if='show_modal_shipments && selectedShip.id'
    :id_shipments='selectedShip.id'
  />
</template>
<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import { eSelectSpan } from '@/js/methods';
import { mapGetters, mapActions } from 'vuex';
import ShipmentsModal from './ShipmentsModal';

export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      selectedShip: null,
      tr: null,

      key_modal_shipments: random(1, 999),
      show_modal_shipments: false
    }
  },
  components: {
    ShipmentsModal
  },
  computed: mapGetters(['getShipmentsSclad']),
  methods: {
    ...mapActions(['fetchAllShipmentsSclad', 'fetchChangeToSclad']),
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden';
      this.destroyModalRight = 'content-modal-right-menu-hidden';
      this.hiddens = 'display: none;';
      this.$emit('unmount', true);
    },
    openShipments() {
      if(this.selectedShip) {
				this.key_modal_shipments = random(1, 999);
				this.show_modal_shipments = true;
			}
    },
    setShipment(shipment, e) {
      if(this.selectedShip.id == shipment.id) 
        return this.selectedShip = null;
      
      this.tr = eSelectSpan(this.tr, e);
      this.selectedShip = shipment;
    },
    async changeToSclad() {
      if(!this.selectedShip) return false;

      await this.fetchChangeToSclad(this.selectedShip.id);
      return showMessage('', 'Заказ пернесен на склад.', 's');
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';
    
    await this.fetchAllShipmentsSclad(false);
  },
}
</script>
<style scoped>
.out-btn-control {
  width: 96%;
}
table{ 
  width: 100%;
  margin-bottom: 50px;
}
.block input {
  width: 50px;
}
.block * {
  margin: 3px;
}
.block {
  display: flex;
}
.block p {
  display: flex;
  align-items: center;
  font-size: 13px;
}
textarea {
  height: 130px;
}
</style>