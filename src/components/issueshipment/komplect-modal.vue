<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >
        <h3>Комплектация заказа</h3>
        <div>
          <table>
            <tr>
              <th v-if='change_complect || is_change_komplit'>
								<unicon name="glass-tea" fill="#ee0942d0" width='20' />
							</th> 
              <th>Наименование</th>
              <th>Кол-во</th>
            </tr>
            <tr v-for='(izd, inx) of komplect' :key='izd'
              class='td-row'>
              <td v-if='change_complect || is_change_komplit'>
								<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
									<p class="checkbox_block_del" @click='delitComplect(izd)'></p>
								</div>
							</td>
              <td style='width: 99%;' 
                @click="openModal(izd.obj.id, izd.type)"><b>{{ inx + 1 + '. ' }}</b> {{ izd.obj.name }}</td>
              <td class='center'>
                <input 
                  v-if='change_complect || is_change_komplit'
                  type="number"
                  style='width: 35px;'
                  @change='e => changeKolIzd(inx, e.target)' v-model='izd.kol' min='1'>
                <span v-else>{{ izd.kol }}</span>
              </td>
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
import { random } from 'lodash';
import CbedModalInfo from '@/components/cbed/cbed-modal';
import DetalModal from '@/components/basedetal/detal-modal';

export default {
  props: {
    parametrs: {},
    change_complect: {},
    is_change_komplit: {}
  },
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
			this.destroyModalLeft = 'left-block-modal-hidden';
			this.destroyModalRight = 'content-modal-right-menu-hidden';
			this.hiddens = 'display: none;';
    },
    openModal(id, type) {
			if(type == 'cbed') {
				if(id) {
					this.parametrs_cbed = id;
					this.cbedModalKey = random(1, 999);
				}
			}
			if(type == 'detal') {
				if(id) {
					this.parametrs_detal = id;
					this.detalModalKey = random(1, 999);
				}
			}
		},
    delitComplect(obj) {
      this.komplect = this.komplect.filter(el => ((el.obj.id != obj.obj.id) && (el.type == obj.type)))
    },
    changeKolIzd(inx, el) {
      this.komplect[inx].kol = Number(el.value);
    }
  },
  mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';

		if(!this.parametrs) return this.destroyModalF();
		const complect = this.parametrs;

    if (this.change_complect) return this.komplect = this.change_complect;

    try {
      this.komplect = JSON.parse(complect);
    } catch(e) { 
      console.error(e);
      return this.destroyModalF();
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