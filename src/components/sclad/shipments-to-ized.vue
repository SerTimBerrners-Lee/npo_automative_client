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
          <tr v-for='shipment of shipments' :key="shipment">
            <td>{{ shipment.number_order }}</td>
            <td class='center'>{{ shipment.date_order }}</td>
          </tr>
				</table>
        <span v-else>Заказов нет </span>
			</div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: ['shipments'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
    }
  },
  methods: {
    destroyModalF() {
      this.destroyModalLeft = 'left-block-modal-hidden'
      this.destroyModalRight = 'content-modal-right-menu-hidden'
      this.hiddens = 'display: none;'
    },
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 
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