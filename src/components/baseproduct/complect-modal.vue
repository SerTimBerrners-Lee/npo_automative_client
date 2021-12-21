<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >

        <div class='table_block'>
          <h3>Комплектация 
            <button class='btn-small' @click='printPage'>На печать</button>
          </h3>
          <div id='spec_table'>
             <table>
                <tr>
                  <th>№</th>
                  <th>Артикул</th>
                  <th>Наименование СБ</th>
                  <th>Кол-во</th>
                </tr>
                <tr 
                  v-for='(obj, inx) of izd_cbed_arr' 
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
                  <th>DxL</th>
                  <th>Материал Заготовки</th>
                  <th>Наименование Детали</th>
                  <th>Кол-во</th>
                </tr>
                <tr 
                  v-for='(obj, inx) of izd_detal_arr' 
                  :key='obj'
                  class='td-row'>
                  <td class='center'>{{ inx + 1 }}</td>
                  <td>{{ obj.obj.articl }}</td>
                  <td class='center'>{{ obj?.obj?.DxL }}</td>
                  <td> {{ obj?.obj?.zag?.name }} </td>
                  <td @click='showInformIzdel(obj.obj.id, obj.type)'>{{ obj.obj.name }}</td>
                  <td class='center'> {{obj.kol}} </td>
                </tr>
              </table>

              <table>
                <tr>
                  <th>№</th>
                  <th>Тип</th>
                  <th>Подтип</th>
                  <th>Наименование Материала</th>
                  <th>Кол-во</th>
                </tr>
                <th colspan='6' v-if='material_arr.one.length'>Материалы для деталей</th>
                <tr 
                  v-for='(obj, inx) of material_arr.one' 
                  :key='obj'
                  class='td-row'
                  @click='openMaterial(obj.obj.id)'>
                  <td class='center'>{{ inx + 1 }}</td>
                  <td>{{ obj.obj?.material?.name }}</td>
                  <td>{{ obj.obj?.podMaterial?.name }}</td>
                  <td>{{ obj.obj.name }}</td>
                  <td class='center'> {{obj.kol}} </td>
                </tr>
                <th colspan='6' v-if='material_arr.two.length'>Покупные детали</th>
                <tr 
                  v-for='(obj, inx) of material_arr.two' 
                  :key='obj'
                  class='td-row'
                  @click='openMaterial(obj.obj.id)'>
                  <td class='center'>{{ inx + 1 }}</td>
                  <td>{{ obj.obj?.material?.name }}</td>
                  <td>{{ obj.obj?.podMaterial?.name }}</td>
                  <td>{{ obj.obj.name }}</td>
                  <td class='center'> {{obj.kol}} </td>
                </tr>
                <th colspan='6' v-if='material_arr.free.length'>Расходные материалы</th>
                <tr 
                  v-for='(obj, inx) of material_arr.free' 
                  :key='obj'
                  class='td-row'
                  @click='openMaterial(obj.obj.id)'>
                  <td class='center'>{{ inx + 1 }}</td>
                  <td>{{ obj.obj?.material?.name }}</td>
                  <td>{{ obj.obj?.podMaterial?.name }}</td>
                  <td>{{ obj.obj.name }}</td>
                  <td class='center'> {{obj.kol}} </td>
                </tr>
              </table>
          </div>
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
import print from 'print-js';
import {mapActions} from 'vuex';
import {isEmpty, random} from 'lodash';
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

      material_arr: {
        one: [],
        two: [],
        free: [],
      },
      izd_cbed_arr: [],
      izd_detal_arr: []

    }
  },
  components: {
    MaterialInformation
  },
  beforeCreate() {
    this.$options.components.DetalModal = require('@/components/basedetal/detal-modal.vue').default
    this.$options.components.CbedModalInfo = require('@/components/cbed/cbed-modal.vue').default
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
    ...mapActions(['fetchGetOnePPM']),
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden'
			this.destroyModalRight = 'content-modal-right-menu-hidden'
			this.hiddens = 'display: none;'
			this.$emit('unmount')
    },
    printPage() {
      print({
        printable: 'spec_table',
        type: 'html',
        targetStyles: ['*'],
        documentTitle: 'Комплектация для "' + this.$props?.parametrs?.obj?.name + '"' || '-',
        ignoreElements: ['operation', 'doc', 'discription'],
        font_size: '10pt'
      })
    },
    concatArrs() {
      this.izd_cbed_arr = this.list_cbed_detal.concat(this.list_hidden_cbed_detal).filter(el => el.type == "cbed")
      this.izd_detal_arr = this.list_cbed_detal.concat(this.list_hidden_cbed_detal).filter(el => el.type == "detal")

      this.material_arr.one = this.list_cbed_detal.concat(this.list_hidden_cbed_detal).filter(el => el.type == 'material' && el?.obj?.material?.instansMaterial == 1)
      this.material_arr.two = this.list_cbed_detal.concat(this.list_hidden_cbed_detal).filter(el => el.type == 'material' && el?.obj?.material?.instansMaterial == 2)
      this.material_arr.free = this.list_cbed_detal.concat(this.list_hidden_cbed_detal).filter(el => el.type == 'material' && el?.obj?.material?.instansMaterial == 3)
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

.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  height: 100vh;
  width: 50%;
}
.left-block-modal {
  width: 50%;
  height: 10000px;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1%;
  }
  to {
    width: 50%;
  }
}
@keyframes width-right {
  from {
    width: 0%;
  }
  to {
    width: 50%;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 50vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 50vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>