<template>
  <div class="right-menu-modal">
    <div :class='destroyModalLeft' @click="destroyModalF('unmount')"></div>
    <div :class='destroyModalRight'>
      <div :style="hiddens" >

        <div class='table_block'>
          <h3>Полная Спецификация
            <button class='btn-small' @click='printPage'>На печать</button>
          </h3>
          <div id='spec_table'>
            <h3>Наименование: <strong>{{ parametrs.obj.name }}</strong></h3>
            <h3>Артикул: <strong>{{ parametrs.obj.articl }}</strong></h3>
            <hr />

            <h3 class='center'>Сборочная единицы</h3>
            <table>
              <tr>
                <th>№</th>
                <th>Фото</th>
                <th>Артикул</th>
                <th>Наименование СБ</th>
                <th>Кол-во</th>
              </tr>
              <tr 
                v-for='(obj, inx) of izd_cbed_arr' 
                :key='obj'
                class='td-row'>
                <td class='center'>{{ inx + 1 }}</td>
                <td class='center'>
                  <img class='img_preload' v-if="obj.ava_path" :src="obj.ava_path">
                  <img class='img_preload' v-else src="@/assets/img/not_fount_img.jpg">
                </td>
                <td>{{ obj.obj.articl }}</td>
                <td @click='showInformIzdel(obj.obj.id, obj.type)'>{{ obj.obj.name }}</td>
                <td class='center'> {{obj.kol}} </td>
              </tr>
            </table>

            <h3 class='center'>Детали</h3>
            <table>
                <tr>
                <th>№</th>
                <th>Фото</th>
                <th>Изображение СБ</th>
                <th>Артикул СБ</th>
                <th>Артикул</th>
                <th class='min_width-120'>Наименование Детали</th>
                <th class='min_width-120'>Материал Заготовки</th>
                <th>Размер заготовки</th>
                <th>Кол-во</th>
              </tr>
              <tr 
                v-for='(obj, inx) of izd_detal_arr' 
                :key='obj'
                class='td-row'
                @click='showInformIzdel(obj.obj.id, obj.type)'>
                <td class='center'>{{ inx + 1 }}</td>
                <td class='center'>
                  <img class='img_preload' v-if="obj.ava_path" :src="obj.ava_path">
                  <img class='img_preload' v-else src="@/assets/img/not_fount_img.jpg">                 
                </td>
                <td>
                  <img class='img_preload' v-if="obj?.CB?.ava_path" :src="obj?.CB?.ava_path">
                  <img class='img_preload' v-else src="@/assets/img/not_fount_img.jpg">
                </td>
                <td>{{ obj?.CB?.articl || 'нет' }}</td>
                <td class='min_width-120'>{{ obj.obj.articl }}</td>
                <td class='min_width-120'>{{ obj.obj.name }}</td>
                <td> {{ obj?.obj?.zag?.name }} </td>
                <td class='center'>
                  <TableZag :detal='obj.obj' :key='obj.obj.id' />
                </td>
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
  <Loader v-if='loader' :key='loader_key' />
  </div>
</template>
<script>
import print from 'print-js';
import { mapActions } from 'vuex';
import { isEmpty, random } from 'lodash';
import MixModal from '@/mixins/mixmodal';
import TableZag from '@/components/Metalloworking/TableZag';
import { checkedJsonList } from '@/components/IssueShipment/js/index';
import MaterialInformation from '@/components/MathZag/MaterialInformation';

export default {
  props: {
    parametrs: {}
  },
  data() {
    return {
      list_cbed_detal: [],
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
      loader_key: random(1, 999),
    }
  },
  components: {
    MaterialInformation,
    TableZag
  },
  mixins: [MixModal],
  beforeCreate() {
    this.$options.components.DetalModal = require('@/components/BaseDetal/DetalModal').default;
    this.$options.components.CbedModalInfo = require('@/components/CbEd/CbedModal').default;
  },
  watch: {
    'list_cbed_detal.length': function() {
      this.concatArrs();
    },
  },
  methods: {
    ...mapActions(['fetchGetOnePPM', 'getOneCbEdField']),
    printPage() {
      print({
        printable: 'spec_table',
        type: 'html',
        targetStyles: ['*'],
        documentTitle: 'Комплектация для "' + this.parametrs?.obj?.name + '"' || '-',
        font_size: '10pt',
      });
    },
    concatArrs() {
      this.izd_cbed_arr = this.list_cbed_detal.filter(el => el.type == "cbed");
      this.izd_detal_arr = this.list_cbed_detal.filter(el => el.type == "detal");
      this.funConcatMaterial();
    },
    funConcatMaterial() {
      this.material_arr.one = [];
      this.material_arr.two = [];
      this.material_arr.free = [];
      
      for (const item of this.list_cbed_detal) {
        if (item.type != 'material') continue
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
      for (let inx in arr) {
        if (arr[inx].name == item?.obj?.material?.name || '') {
          arr[inx].material.push(item);
          check = false;
        }
      }
      if (check) {
        arr.push({
          name: item?.obj?.material?.name || '',
          material: [item]
        });
      } else check = true;
    },
    showInformIzdel(id, type) {
			if (type == 'cbed') {
				if (id) {
					this.parametrs_cbed = id;
					this.cbedModalKey = random(1, 999);
				}
			}
			if (type == 'detal') {
				if (id) {
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
		if (isEmpty(this.parametrs)) return this.destroyModalF('unmount');
    const obj = this.parametrs.obj;

    this.loader = true;

		if (obj && this.parametrs.type == 'izd' || this.parametrs.type == 'cbed') {
      if (this.parametrs.type == 'cbed') {
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
    try {
      for (const item of this.izd_cbed_arr) {
        const pars = item.obj?.listDetal ? JSON.parse(item.obj.listDetal) : [];
        for (const det of this.izd_detal_arr) {
          for (const parsDetal of pars) {
            if (parsDetal.det.id == det.obj.id) {
              det.CB = {
                ava_path: item.ava_path,
                articl: item.obj.articl
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
    console.log(this.izd_detal_arr);
    this.loader_key = random(1, 999);
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
.img_preload {
  max-width: 100px;
  max-height: 100px;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  height: 100vh;
  width: 60%;
}
.left-block-modal {
  width: 40%;
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
    width: 60%;
  }
}
@keyframes width-right {
  from {
    width: 0%;
  }
  to {
    width: 40%;
  }
}
</style>