<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >
        <h3>Комплектация заказа {{ shipments?.number_order }}</h3>
        <div>
          <table>
            <tr>
              <th>№</th>
              <th v-if='change_complect || is_change_komplit'>
								<unicon name="glass-tea" fill="#ee0942d0" width='20' />
							</th> 
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Кол-во</th>
            </tr>
            <tr v-for='(izd, inx) of komplect' :key='izd'
              class='td-row'>
              <td class='center'>{{ inx + 1 }}</td>
              <td v-if='change_complect || is_change_komplit'>
								<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
									<p class="checkbox_block_del" @click='delitComplect(izd)'></p>
								</div>
							</td>
              <td style='width: 10%;' 
                @click="openModal(izd.obj.id, izd.type)">{{ izd.obj.articl }}</td>
              <td style='width: 99%;' 
                @click="openModal(izd.obj.id, izd.type)">{{ izd.obj.name }}</td>
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

          <PrintComplet :shipments='shipments' v-if='print_show' @unmount_print='unmount_print' />
          <div class="btn-control">
            <button class="btn-add btn-small" @click='printComplit'>Печать</button>
          </div>
        </div>
      </div>
    </div>
    <DetalModal
      v-if='parametrs_detal'
      :key='detalModalKey'
      :id='parametrs_detal'
		/>
		<CbedModalInfo
			v-if='parametrs_cbed'
			:id='parametrs_cbed'
			:key='cbedModalKey'
		/>
  </div>
</template>
<script>
import { random } from 'lodash';
import MixModal from '@/mixins/mixmodal';
import PrintComplet from './PrintComplect'; 
import CbedModalInfo from '@/components/CbEd/CbedModal';
import DetalModal from '@/components/BaseDetal/DetalModal';

export default {
  props: {
    parametrs: {},
    change_complect: {},
    is_change_komplit: {},
    shipments: {}
  },
  data() {
    return {
      komplect: [],
      parametrs_cbed: null,
			cbedModalKey: random(1, 999),
			parametrs_detal: null,
			detalModalKey: random(1, 999),

      print_show: false,
    }
  },
  components: {
    CbedModalInfo,
    DetalModal,
    PrintComplet
  },
  mixins: [MixModal],
  methods: {
    unmount_print() {
			this.print_show = false;
      this.destroyModalRight = 'content-modal-right-menu';
		},
    printComplit() {
			this.print_show = true;
      this.destroyModalRight = 'content-modal-right-menu_90';
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
      this.komplect = this.komplect.filter(el => ((el.obj.id != obj.obj.id) && (el.type == obj.type)));
    },
    changeKolIzd(inx, el) {
      this.komplect[inx].kol = Number(el.value);
    }
  },
  mounted() {
		if (!this.parametrs) return this.destroyModalF();
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