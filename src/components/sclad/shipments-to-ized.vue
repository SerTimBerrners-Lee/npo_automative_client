<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
      <h3>Список заказов</h3>
			<div class="block">
				<table v-if='shipments.length'>
					<tr>
						<th>№ Заказа</th>
						<th>Дата Заказа</th>
					</tr>
          <tr v-for='shipment of shipments_arr' :key="shipment" 
            class='td-row'
            @click="openShipments(shipment.id)">
            <td>{{ shipment.number_order }}</td>
            <td class='center'>{{ shipment.date_order }}</td>
          </tr>
				</table>
        <span v-else>Заказов нет </span>
			</div>
    </div>
  </div>
</div>
  <ShipmentsModal 
    :key='key_modal_shipments'
    v-if='shipments_id'
    :id_shipments='shipments_id'
  />
</template>
<script>
import {random} from 'lodash';
import { comparison } from '@/js/';
import ShipmentsModal from '@/components/issueshipment/shipments-modal.vue';
export default {
  props: ['shipments'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      shipments_arr: [],

      key_modal_shipments: random(1, 999),
      shipments_id: null
    }
  },
  components: {ShipmentsModal},
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
    openShipments(id) {
      this.key_modal_shipments = random(1, 999)
      this.shipments_id = id
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 

    if(this.$props.shipments) 
      this.shipments_arr = this.$props.shipments

    let variables;
    for(let ship1 in this.shipments_arr) {
      for(let ship2 in this.shipments_arr) {
        if(comparison(this.shipments_arr[ship1].date_shipments, 
          this.shipments_arr[ship2].date_shipments, '<')) {
            variables = this.shipments_arr[ship1]
            this.shipments_arr[ship1] = this.shipments_arr[ship2]
            this.shipments_arr[ship2] = variables
          }
      }

      if(this.shipments_arr[ship1].to_sklad && this.shipments_arr[ship1].number_order.indexOf('C') == -1) {
        let char = this.shipments_arr[ship1].number_order.split('')
        char.unshift('C')
        this.shipments_arr[ship1].number_order = char.join('')
      }
    }
    
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