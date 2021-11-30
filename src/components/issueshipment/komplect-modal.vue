<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >
        <h3>Комплектация заказа</h3>

        <div>
          <table>
            <tr>
              <th>Наименование</th>
              <th>Кол-во</th>
            </tr>
            <tr v-for='(izd, inx) of komplect' :key='izd'
              class='td-row'
              @click="openModal(izd.obj.id, izd.type)">
              <td style='width: 99%;'><b>{{ inx + 1 + '. ' }}</b> {{ izd.obj.name }}</td>
              <td class='center'>{{izd.kol}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <DetalModal
      :key='detalModalKey'
      v-if='parametrs_detal'
      :id='parametrs_detal'
		/>
		<CbedModalInfo
			:id='parametrs_cbed'
			:key='cbedModalKey'
			v-if='parametrs_cbed'
		/>
  </div>
</template>
<script>
import {random} from 'lodash';
import CbedModalInfo from '@/components/cbed/cbed-modal.vue';
import DetalModal from '@/components/basedetal/detal-modal.vue';
export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',

      komplect: [],
      parametrs_cbed: null,
			cbedModalKey: random(1, 999),
			parametrs_detal: null,
			detalModalKey: random(1, 999),
    }
  },
  components: {
    CbedModalInfo,
    DetalModal
  },
  methods: {
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'
    },
    openModal(id, type) {
			if(type == 'cbed') {
				if(id) {
					this.parametrs_cbed = id
					this.cbedModalKey = random(1, 999)
				}
			}
			if(type == 'detal') {
				if(id) {
					this.parametrs_detal = id
					this.detalModalKey = random(1, 999)
				}
			}
		},
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 

		if(!this.$props.parametrs) return this.destroyModalF()
		const complect = this.$props.parametrs

    try {
      this.komplect = JSON.parse(complect)
    } catch(e) { 
      console.error(e); 
      return this.destroyModalF()
    }
  },
}
</script>

<style scoped>
textarea {
  height: 130px;
  width: 99%;
}
</style>