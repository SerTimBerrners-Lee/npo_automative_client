<template>
  <div>
    <table 
      style='margin-left: 20px;' 
      id='tablebody'
      v-if='getOnePodMaterial.length'>
      <tbody class='fixed_table_10'>
        <tr>
          <th class='center' v-if='type_view == "def" || type_view == "mini"'>№</th>
          <th class='min_width-50' v-if='type_view == "def" || type_view == "mini"'>Наименование</th>
          <th class='min_width-50' v-if='type_view == "def"'>Принадлежность по заказам</th>
          <th class='min_width-50' v-if='type_view == "def"'>Принадлежность по Изд. СБ. Д.</th>
          <th class='min_width-50' v-if='type_view == "def" || type_view == "mini"'>ЕИ</th>
          <th class='min_width-50' v-if='type_view == "def" || type_view == "mini"'>Дефицит</th>
          <th class='min_width-50' v-if='type_view == "def" || type_view == "plan"'>Дефицит на план</th>
          <th class='min_width-50' v-if='type_view == "def"'>Стоимость 1 ЕД</th>
          <th class='min_width-50' v-if='type_view == "def"'>Стоимость Дефицита</th>
          <th class='min_width-50' v-if='type_view == "def"'>Дефицит по заказ покупателя</th>
          <th class='min_width-50' v-if='type_view == "def"'>Потребность по заказам покупателя</th>
          <th class='min_width-50' v-if='type_view == "def"'>Остаток</th>
          <th class='min_width-50' v-if='type_view == "def"'>Минимальный остаток</th>
          <th class='min_width-50' v-if='type_view == "def"'>Рекомендуемый Остаток</th>
          <th class='min_width-50' v-if='type_view == "def"'>Рекомендуемый заказ</th>
          <th class='min_width-50' v-if='type_view == "def"'>Приход. кол-во</th>
          <th class='min_width-50' v-if='type_view == "def"'>Планируемая дата прихода</th>
          <th class='min_width-50' v-if='type_view == "def"'>Остаток с учетом заказов покупателя и прихода</th>
          <th class='min_width-50' v-if='type_view == "def"'>Статус</th>
          <th class='min_width-50' v-if='type_view == "def"'>Примечание</th>
        </tr>
      </tbody>
      <tbody v-for='(material, inx) of getOnePodMaterial' :key='material'>
        <tr>
          <td 
            class='center'
            :rowspan="getKolvoMaterial(material).length + 1"
            v-if='type_view == "def" || type_view == "mini"'>{{ inx+1 }}</td>
          <td 
            @click='e => setMaterial(material, e.target.parentElement)'
            :rowspan="getKolvoMaterial(material).length + 1"
            v-if='type_view == "def" || type_view == "mini"'
            class='td-row'> {{ material.name }}
          </td>
          <td 
            class='center' 
            @click='openShipmentsModal(material)' 
            :rowspan="getKolvoMaterial(material).length + 1"
            v-if='type_view == "def"'>
            <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
          </td>
          <td 
            class='center' 
            @click="showRemaningParent(material.id)"
            :rowspan="getKolvoMaterial(material).length + 1"
            v-if='type_view == "def"'>
            <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
          </td>
        </tr>

        <tr v-for='ez of getKolvoMaterial(material)' :key='ez'>
          <td class='center' v-if='type_view == "def" || type_view == "mini"'>{{ez.ez}}</td>
          <td class='center min_width' style='color: red;' v-if='type_view == "def" || type_view == "mini"'>
            {{ ez.material_kolvo - (ez.min_remaining + ez.shipments_kolvo) }}
          </td> <!-- Дефицит -->
          <td class='center min_width' style='color: red;' v-if='type_view == "def" || type_view == "plan"'>
            {{ returnDefPlan(ez, material) }}
          </td> <!-- Дефицит на план -->
          <td class='center min_width ' v-if='type_view == "def"'>
            {{ ez.price }}
          </td> <!-- Стоимость -->
          <td class='center min_width' v-if='type_view == "def"'>
            {{ ez.price * (ez.material_kolvo - (ez.min_remaining+ez.shipments_kolvo)) }}
          </td> <!-- Стоимость дефицита -->
          <td class='center min_width' style='color: red;' v-if='type_view == "def"'>
            {{ ez.material_kolvo - ez.shipments_kolvo  }} 
          </td>	<!-- Дефицит по заказ покупателя -->
          <td class='center min_width' v-if='type_view == "def"'>
            {{ ez.shipments_kolvo }}
          </td> <!-- Потребность по заказам покупателя -->
          <td class='center min_width' v-if='type_view == "def"'>
            {{ ez.material_kolvo }}
          </td>
          <td class='center min_width' v-if='type_view == "def"'>
            <strong>{{ ez.min_remaining }}</strong>
          </td>
          <td class='center min_width' v-if='type_view == "def"'>
            <strong>{{ ez.min_remaining * 3 }}</strong>
          </td>
          <td class='center min_width' v-if='type_view == "def"'>
            {{ (ez.min_remaining * 3 + ez.shipments_kolvo) * 2 }}
          </td> <!-- Рекомендуемый заказ -->
          <td class='center min_width' v-if='type_view == "def"'>
            {{ ez.deliveries_kolvo }}
          </td> <!-- Приход. кол-во(Заказаное количество) -->
          <td class='center tooltip min_width' v-if='type_view == "def"'> 
            {{ material.deliveries && material.deliveries.length ? material.deliveries[0].date_shipments : '-' }}
            <div class="tooltiptext" v-if='material.deliveries && material.deliveries.length'>
              <span v-for='dev of material.deliveries' :key='dev'>{{ dev.date_shipments }}</span>
            </div>
          </td>
          <td class='center min_width' style='color: red;' v-if='type_view == "def"'>
            {{ ez.material_kolvo + ez.deliveries_kolvo - ez.shipments_kolvo }}
          </td>
          <td v-if='ez.deliveries_kolvo > 0 && type_view == "def"' class='center min_width-100 success_operation'>Заказано</td>
          <td v-else-if='type_view == "def"' class='center min_width-100 work_operation'>Не заказано</td>
          <td class='center min_width' v-if='type_view == "def"' >
            <img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
          </td>
        </tr>
      </tbody>
    </table>

    <h3 v-else style='margin-left: 20px;'>Нет Дефицита</h3>
    <MaterialParentModal
			:mat_id='mat_id'
			v-if='mat_id'
			:key='materialParentKey'
		/>
		<ShipmentsModal 
      :shipments='shipments'
      :izd='{ izd: material, type: "material" }'
      v-if='showModalShipments && shipments.length'
      :key='shipmentKey'
    />
    <Loader v-if='loader' :description='"Получение Материала"' />
  </div>
</template>

<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import { eSelectSpan } from '@/js/methods';
import { getKolvoMaterial } from '@/js/edizm';
import MaterialParentModal from './material-parent-modal';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import ShipmentsModal from  '@/components/Sclad/shipments-to-ized';

export default {
  props: {
    type_view: {
      default: 'def' // mini, ostat
    }
  },
  data() {
    return {
      span: null,
			instansLet: 0,

			material: null,
			span_material: null,

			mat_id: null,
			materialParentKey: random(1, 999),

			shipments: [],
			showModalShipments: false,
			shipmentKey: random(1, 999),

			e_type_material: null,
			e_ptype_material: null,
      loader: false
    }
  },
  computed: mapGetters(['getOnePodMaterial']),
  components: {
		MaterialParentModal,
		ShipmentsModal
	},
  methods: {
    ...mapActions([
			'fetchGetAllDeficitPPM',
			'getShipmentsForOneMaterial'
		]),
		...mapMutations([
			'clearCascheMaterial'
		]),
    getKolvoMaterial(mat) {
			return getKolvoMaterial(mat);
		},
    setMaterial(material, span) {
			if(this.material && this.material.id == material.id && this.span_material) {
				this.material = null;
				return this.span_material = null;
			}

			this.span_material = eSelectSpan(this.span_material, span);
			this.material = material;
      this.$emit('unmount_material', this.material);
		},
    openShipmentsModal(material) {
			this.getShipmentsForOneMaterial(material.id).then(res => {
				if(!res || !res.length) return showMessage('', 'Нет Заказов или произошла ощибка.', 'i');
				this.material = material;
				this.showModalShipments = true;
				this.shipments = res;
				this.shipmentKey = random(1, 999);
			})
    },
    showRemaningParent(id) {
			if(!id) return false;
			this.mat_id = id;
			this.materialParentKey = random(1, 999);
		},
    returnDefPlan(ez, material) {
      if(!material.plan || !ez.poz) return 0;
      switch (ez.ez) {
        case 'шт':
          return ez.material_kolvo - Object.values(material.plan.ez_kolvo)[0].min_remaining;
        case 'л':
          return ez.material_kolvo - Object.values(material.plan.ez_kolvo)[1].min_remaining;
        case 'кг':
          return ez.material_kolvo - Object.values(material.plan.ez_kolvo)[2].min_remaining;
        case 'м':
          return ez.material_kolvo - Object.values(material.plan.ez_kolvo)[3].min_remaining;
        case 'м.куб':
          return ez.material_kolvo - Object.values(material.plan.ez_kolvo)[4].min_remaining;
      }
    }
  },
  async mounted() {
		this.loader = true;

    this.clearCascheMaterial();
    await this.fetchGetAllDeficitPPM();

		this.loader = false;
  }
}
</script>

<style scoped>
.table_material {
  height: 600px;
}
.table_material>table:first-child {
  height: fit-content;
}
</style>