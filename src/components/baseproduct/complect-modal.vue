<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >

        <div class='table_block'>
          <h3>Полная Спетификация
            <button class='btn-small' @click='printPage'>На печать</button>
          </h3>
          <div id='spec_table'>
            <h3>Наименование: <strong>{{ parametrs.obj.name }}</strong></h3>
            <h3>Артикул: <strong>{{ parametrs.obj.articl }}</strong></h3>
            <hr />
            <h3 class='center'>Детали</h3>
            <table>
                <tr>
                <th>№</th>
                <th>Артикул</th>
                <th>Наименование Детали</th>
                <th>Материал Заготовки</th>
                <th>Размер заготовки</th>
                <th>Кол-во</th>
              </tr>
              <tr 
                v-for='(obj, inx) of izd_detal_arr' 
                :key='obj'
                class='td-row'
                @click='showInformIzdel(obj.obj.id, obj.type)'>
                <td class='center'>{{ inx + 1 }}</td>
                <td>{{ obj.obj.articl }}</td>
                <td>{{ obj.obj.name }}</td>
                <td> {{ obj?.obj?.zag?.name }} </td>
                <td class='center'>{{ obj?.obj?.DxL }}</td>
                <td class='center'> {{obj.kol}} </td>
              </tr>
            </table>
            <h3 class='center'>Сборочная единицы</h3>
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
            <h3 class='center'>Материалы для деталей</h3>
            <table>
              <tr>
                <th>Наименование</th>
                <th>кг</th>
                <th>м</th>
              </tr>
              <tbody 
                v-for='obj of material_arr.one' 
                :key='obj'>
                <th colspan='4'> {{ obj?.name }} </th>
                <tr
                  v-for='mat of obj.material' 
                  :key='mat'
                  class='td-row'
                  @click='openMaterial(mat.obj.id)'>
                  <td>{{ mat.obj?.name }}</td>
                  <td class="center">{{ mat?.obj?.MASS?.toFixed(3) }}</td>
                  <td class="center">{{ mat?.obj?.LEN?.toFixed(3) }}</td>
                </tr>
              </tbody>
            </table>
            <h3 class='center'>Покупные материалы</h3>
            <table>
              <tr>
                <th>Наименование</th>
                <th>Кол-во</th>
              </tr>
              <tbody 
                v-for='obj of material_arr.two' 
                :key='obj'>
                <th colspan='4'> {{ obj?.name }} </th>
                <tr
                  v-for='mat of obj.material' 
                  :key='mat'
                  class='td-row'
                  @click='openMaterial(mat.obj.id)'>
                  <td>{{ mat.obj?.name }}</td>
                  <td class="center">{{ mat?.kol }}</td>
                </tr>
              </tbody>
            </table>
            <h3 class='center'>Расходные материалы</h3>
            <table>
              <tr>
                <th>Наименование</th>
                <th>Кол-во</th>
              </tr>
              <tbody 
                v-for='obj of material_arr.free' 
                :key='obj'>
                <th colspan='4'> {{ obj?.name }} </th>
                <tr
                  v-for='(mat) of obj.material' 
                  :key='mat'
                  class='td-row'
                  @click='openMaterial(mat.obj.id)'>
                  <td>{{ mat.obj?.name }}</td>
                  <td class="center">{{ mat?.kol }}</td>
                </tr>
              </tbody>
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
  <Loader v-if='loader' />
  </div>
</template>
<script>
import print from 'print-js';
import {mapActions} from 'vuex';
import {isEmpty, random} from 'lodash';
import {checkedJsonList} from '@/components/issueshipment/js/index';
import MaterialInformation from '@/components/mathzag/material-information';

export default {
  props: {
    parametrs: {}
  },
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
      izd_detal_arr: [],

    }
  },
  components: {
    MaterialInformation
  },
  beforeCreate() {
    this.$options.components.DetalModal = require('@/components/basedetal/detal-modal.vue').default;
    this.$options.components.CbedModalInfo = require('@/components/cbed/cbed-modal.vue').default;
  },
  watch: {
    'list_cbed_detal.length': function() {
      this.concatArrs();
    },
    'list_hidden_cbed_detal.length': function() {
      this.concatArrs();
    }
  },
  methods: {
    ...mapActions(['fetchGetOnePPM', 'getOneCbEdField']),
    destroyModalF() {
			this.destroyModalLeft = 'left-block-modal-hidden';
			this.destroyModalRight = 'content-modal-right-menu-hidden';
			this.hiddens = 'display: none;';
			this.$emit('unmount');
    },
    printPage() {
      print({
        printable: 'spec_table',
        type: 'html',
        targetStyles: ['*'],
        documentTitle: 'Комплектация для "' + this.parametrs?.obj?.name + '"' || '-',
        ignoreElements: ['operation', 'doc', 'discription'],
        font_size: '10pt'
      });
    },
    concatArrs() {
      this.izd_cbed_arr = this.list_cbed_detal.concat(this.list_hidden_cbed_detal).filter(el => el.type == "cbed");
      this.izd_detal_arr = this.list_cbed_detal.concat(this.list_hidden_cbed_detal).filter(el => el.type == "detal");
      this.funConcatMaterial();
    },
    funConcatMaterial() {
      this.material_arr.one = [];
      this.material_arr.two = [];
      this.material_arr.free = [];
      
      for(let item of this.list_cbed_detal.concat(this.list_hidden_cbed_detal)) {
        if(item.type != 'material') continue
        switch(item?.obj?.material?.instansMaterial || 3) {
          case '1':
            this.pushAndCheck(this.material_arr.one, item);
            break;
          case '2':
            this.pushAndCheck(this.material_arr.two, item);
            break;
          case '3':
            this.pushAndCheck(this.material_arr.free, item);
            break;
        }
      }
    },
    pushAndCheck(arr, item) {
      let check = true;
      for(let inx in arr) {
        if(arr[inx].name == item?.obj?.material?.name || '') {
          arr[inx].material.push(item);
          check = false;
        }
      }
      if(check) {
        arr.push({
          name: item?.obj?.material?.name || '',
          material: [item]
        });
      } else check = true;
    },
    showInformIzdel(id, type) {
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
    openMaterial(id) {
			this.material_key = random(1, 999);
			this.material_id = id;
		},
  },
  async mounted() {
    this.destroyModalLeft = 'left-block-modal';
    this.destroyModalRight = 'content-modal-right-menu';
    this.hiddens = 'opacity: 1;';

		if(isEmpty(this.parametrs)) return this.destroyModalF();
    const obj = this.parametrs.obj;
    console.log(this.parametrs);

    this.loader = true;

		if(obj && this.parametrs.type == 'izd' || this.parametrs.type == 'cbed') {
      if(this.parametrs.type == 'cbed') {
        // Получаем сборку 
        let izd_detals = await this.getOneCbEdField({fields: 'detals', id: obj.id});
        !izd_detals ? izd_detals = [] : izd_detals = izd_detals.detals;
        let izd_materials = await this.getOneCbEdField({fields: 'materials', id: obj.id});
        !izd_materials ? izd_materials = [] : izd_materials = izd_materials.materials;
        obj.detals = [...izd_detals];
        obj.materials = [...izd_materials];
        await checkedJsonList(obj, this);
      }
      else await checkedJsonList(obj, this);
    }

    this.loader = false;
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