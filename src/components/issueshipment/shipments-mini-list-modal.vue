<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
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
    <InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
  </div>
</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {showMessage} from '@/js/';
export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      selectedShip: null,
      tr: null,

      titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,
    }
  },
  computed: mapGetters(['getShipmentsSclad']),
  methods: {
    ...mapActions(['fetchAllShipmentsSclad', 'fetchChangeToSclad']),
    destroyModalF() {
        this.destroyModalLeft = 'left-block-modal-hidden'
        this.destroyModalRight = 'content-modal-right-menu-hidden'
        this.hiddens = 'display: none;'
        this.$emit('unmount', true)
    },
    setShipment(shipment, e) {
      if(this.tr && this.selectedShip.id == shipment.id) {
        this.tr.classList.remove('td-row-all')
        this.selectedShip = null
        return 
      }
      if(this.tr) this.tr.classList.remove('td-row-all')
      this.tr = e
      this.tr.classList.add('td-row-all')
      this.selectedShip = shipment
    },
    changeToSclad() {
      if(!this.selectedShip) return false

      this.fetchChangeToSclad(this.selectedShip.id).then(() => {
        return showMessage('', 'Заказ пернесен на склад.', 's', this)
      })
    }
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 
    
    await this.fetchAllShipmentsSclad(false)
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