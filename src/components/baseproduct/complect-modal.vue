<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >

        <div class='table_block'>
          <h3>Комплектация</h3>
          <table>
            <tr>
              <th>№</th>
              <th>Артикул</th>
              <th>Наименование СБ или детали</th>
              <th>Кол-во</th>
            </tr>
            <tr 
              v-for='(obj, inx) of izd_arr' 
              :key='obj'
              class='td-row'>
              <td class='center'>{{ inx + 1 }}</td>
              <td>{{ obj.obj.articl }}</td>
              <td @click='showInformIzdel(obj.obj.id, obj.type)'>{{ obj.obj.name }}</td>
              <td class='center'> {{obj.kol}} </td>
            </tr>
          </table>

          <table>
            <tr>
              <th>№</th>
              <th>Артикул</th>
              <th>Наименование Материала</th>
              <th>Кол-во</th>
            </tr>
            <tr 
              v-for='(obj, inx) of material_arr' 
              :key='obj'
              class='td-row'>
              <td class='center'>{{ inx + 1 }}</td>
              <td>{{ obj.obj.articl }}</td>
              <td @click='openMaterial(obj.obj.id)'>{{ obj.obj.name }}</td>
              <td class='center'> {{obj.kol}} </td>
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
  <MaterialInformation 
		:key='material_key'
		v-if='material_id'
		:id='material_id'
	/>
  </div>
</template>
<script>
import {isEmpty, random} from 'lodash';
import CbedModalInfo from '@/components/cbed/cbed-modal.vue';
import DetalModal from '@/components/basedetal/detal-modal.vue';
import {checkedJsonList} from '@/components/issueshipment/js/index';
import MaterialInformation from '@/components/mathzag/material-information.vue';
export default {
  props: ['parametrs'],
  data() {
    return {
      destroyModalLeft: 'left-block-modal',
      destroyModalRight: 'content-modal-right-menu',
      hiddens: 'display: none;',
      list_cbed_detal: [],
      list_hidden_cbed_detal: [],
      list_material: [],

      parametrs_cbed: null,
      cbedModalKey: random(1, 999),
      parametrs_detal: null,
      detalModalKey: random(1, 999),
      material_key: random(1, 999),
      material_id: null,

      material_arr: [],
      izd_arr: []

    }
  },
  components: {
    DetalModal,
		CbedModalInfo,
    MaterialInformation
  },
  watch: {
    'list_cbed_detal.length': function() {
      this.concatArrs()
    },
    'list_hidden_cbed_detal.length': function() {
      this.concatArrs()
    }
  },
  methods: {
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'
			this.$emit('unmount')
    },
    concatArrs() {
      this.izd_arr = this.list_cbed_detal.concat(this.list_hidden_cbed_detal).filter(el => el.type != 'material')
      this.material_arr = this.list_cbed_detal.concat(this.list_hidden_cbed_detal).filter(el => el.type == 'material')
    },
    showInformIzdel(id, type) {
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
    openMaterial(id) {
			this.material_key = random(1, 999)
			this.material_id = id
		}
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal'
    this.destroyModalRight = 'content-modal-right-menu'
    this.hiddens = 'opacity: 1;' 
		if(isEmpty(this.$props.parametrs)) return this.destroyModalF()

		if(this.$props.parametrs && this.$props.parametrs.obj && this.$props.parametrs.type == 'izd') {
      checkedJsonList(this.$props.parametrs.obj, this)
		}
  },
}
</script>

<style scoped>
table, .table_block {
  width: 99%;
}
.table_block {
  flex-direction: column;
}
</style>