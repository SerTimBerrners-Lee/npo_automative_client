<template>
	<div>
		<h3>Дефицит материалов</h3>
		<div class='header_block'>
			<p>
				<label for="order1">Все: </label>
				<input 
					type="radio" 
					id="order1"
					name='order'
					@click='e => filterAll(e.target.checked)'>
				<label for="order2">Заказано: </label>
				<input 
					type="radio" 
					id="order2 " 
					name='order'
					@click='e => filterOrder(e.target.checked, "yes")'>
				<label for="order3">Не Заказано: </label>
				<input 
					type="radio" 
					id="order3" 
					name='order'
					@click='e => filterOrder(e.target.checked, "no")'>
				<label for="order4">Дефицит общий: </label>
				<input 
					type="radio" 
					id="order4"
					name='order' 
					@click='e => filterOrder(e.target.checked, "def")'>
				<label for="order5">Дефицит по заказам покупателя: </label>
				<input 
					type="radio" 
					id="order5"
					name='order' 
					@click='e => filterOrder(e.target.checked, "ship")'>
				<label for="order6">Все Дефициты: </label>
				<input 
					type="radio" 
					id="order6"
					name='order' 
					@click='e => filterOrder(e.target.checked, "all_def")'>
			</p>
		</div> 
 
		<div style='width: max-content;'>
			<div class="scroll-table table_material " style='height: 100%;'>

				<TableTypeMaterial />

				<div v-if='getOnePodMaterial.length'>
					<table style='margin-left: 20px;' id='tablebody'>
						<tbody class='fixed_table_10'>
							<tr>
								<th class='center'>№</th>
								<th class='min_width-50'>Наименование</th>
								<th class='min_width-50'>Принадлежность по заказам</th>
								<th class='min_width-50'>Принадлежность по Изд. СБ. Д.</th>
								<th class='min_width-50'>ЕИ</th>
								<th class='min_width-50'>Дефицит</th>
								<th class='min_width-50'>Стоимость 1 ЕД</th>
								<th class='min_width-50'>Стоимость Дефицита</th>
								<th class='min_width-50'>Дефицит по заказ покупателя</th>
								<th class='min_width-50'>Потребность по заказам покупателя</th>
								<th class='min_width-50'>Остаток</th>
								<th class='min_width-50'>Минимальный остаток</th>
								<th class='min_width-50'>Рекомендуемый Остаток</th>
								<th class='min_width-50'>Рекомендуемый заказ</th>
								<th class='min_width-50'>Приход. кол-во</th>
								<th class='min_width-50'>Планируемая дата прихода</th>
								<th class='min_width-50'>Остаток с учетом заказов покупателя и прихода</th>
								<th class='min_width-50'>Статус</th>
								<th class='min_width-50'>Примечание</th>
							</tr>
						</tbody>
						<tbody v-for='(material, inx) of getOnePodMaterial' :key='material'>
							<tr>
								<td 
									class='center'
									:rowspan="getKolvoMaterial(material).length + 1">{{ inx+1 }}</td>
								<td 
									@click='e => setMaterial(material, e.target.parentElement)'
									:rowspan="getKolvoMaterial(material).length + 1"
									class='td-row'> {{ material.name }}
								</td>
								<td class='center' @click='openShipmentsModal(material)' :rowspan="getKolvoMaterial(material).length + 1">
									<img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
								</td>
								<td class='center' @click="showRemaningParent(material.id)" :rowspan="getKolvoMaterial(material).length + 1">
									<img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
								</td>
							</tr>

							<tr v-for='ez of getKolvoMaterial(material)' :key='ez'>
								<td class='center'>{{ez.ez}}</td>
								<td class='center min_width' style='color: red;'>
									{{ ez.material_kolvo - (ez.min_remaining+ez.shipments_kolvo) }}
								</td>
								<td class='center min_width'>
									{{ ez.price }}
								</td>
								<td class='center min_width'>
									{{ ez.price * (ez.material_kolvo - (ez.min_remaining+ez.shipments_kolvo)) }}
								</td>
								<td class='center min_width' style='color: red;'>
									{{ ez.material_kolvo - ez.shipments_kolvo  }} 
								</td>	<!-- Дефицит по заказ покупателя -->
								<td class='center min_width'>
									{{ ez.shipments_kolvo }}
								</td> <!-- Потребность по заказам покупателя -->
								<td class='center min_width'>
									{{ ez.material_kolvo }}
								</td>
								<td class='center min_width'>
									<strong>{{ ez.min_remaining }}</strong>
								</td>
								<td class='center min_width'>
									<strong>{{ ez.min_remaining * 3 }}</strong>
								</td>
								<td class='center min_width'>
									{{ (ez.min_remaining * 3 + ez.shipments_kolvo) * 2 }}
								</td> <!-- Рекомендуемый заказ -->
								<td class='center min_width'>
									{{ ez.deliveries_kolvo }}
								</td> <!-- Приход. кол-во(Заказаное количество) -->
								<td class='center tooltip min_width'> 
									{{ material.deliveries && material.deliveries.length ? material.deliveries[0].date_shipments : '-' }}
									<div class="tooltiptext" v-if='material.deliveries && material.deliveries.length'>
										<span v-for='dev of material.deliveries' :key='dev'>{{ dev.date_shipments }}</span>
									</div>
								</td>
								<td class='center min_width' style='color: red;'>
									{{ ez.material_kolvo + ez.deliveries_kolvo - ez.shipments_kolvo }}
								</td>
								<td v-if='ez.deliveries_kolvo > 0' class='center min_width-100 success_operation'>Заказано</td>
								<td v-else class='center min_width-100 work_operation'>Не заказано</td>
								<td class='center min_width'>
									<img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<h3 v-else style='margin-left: 20px;'>Нет Дефицита</h3>
			</div>
				<div class='btn-control'>
					<button class="btn-small" @click="exportExcel"> Выгрузка в Excel </button>
					<button class="btn-small" @click='printPage'> Печать отчета </button>
				</div>
		</div>
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
		<Loader v-if='loader' />
	</div>
</template>
<script> 
import XLSX from 'xlsx';
import print from 'print-js';
import {random} from 'lodash';
import { showMessage } from '@/js/';
import { eSelectSpan } from '@/js/methods.js';
import {getKolvoMaterial} from '@/js/edizm.js';
import TableTypeMaterial from './table-type-material.vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import MaterialParentModal from './material-parent-modal.vue';
import ShipmentsModal from  '@/components/sclad/shipments-to-ized.vue';

export default {
	data() {
		return {
			span: null,
			instansLet: 0,

			material: null,
			span_material: null,

			loader: false,
			filter_order: false,
			all_type_order: true,

			mat_id: null,
			materialParentKey: random(1, 999),

			shipments: [],
			showModalShipments: false,
			shipmentKey: random(1, 999),

			e_type_material: null,
			e_ptype_material: null,
		}
	},
	components: {
		MaterialParentModal,
		ShipmentsModal,
		TableTypeMaterial
	},
	computed: mapGetters(['getOnePodMaterial']),
	methods: {
		...mapActions([
			'getAllTypeMaterial',
			'getAllPodTypeMaterial',
			'fetchGetAllDeficitPPM',
			'getShipmentsForOneMaterial'
		]),
		...mapMutations([
			'clearCascheMaterial',
			'filterMaterialStatus'
		]),
		printPage() {
      print({
        printable: 'tablebody',
        type: 'html',
        targetStyles: ['*'],
        documentTitle: 'Дефицит материалов',
        ignoreElements: ['operation', 'doc', 'discription'],
        font_size: '10pt'
      })
    },
		openShipmentsModal(material) {
			this.getShipmentsForOneMaterial(material.id).then(res => {
				if(!res || !res.length) return showMessage('', 'Нет Заказов или произошла ощибка.', 'i', this);
				this.material = material;
				this.showModalShipments = true;
				this.shipments = res;
				this.shipmentKey = random(1, 999);
			})
    },
		exportExcel() {
			const workbook = XLSX.utils.table_to_book(document.getElementById('tablebody'), {
				sheet: "Дефицит Материалов"
			});

			const wscols = [ 
				{wch:1},
				{wch:40}
			];
			workbook.Sheets["Дефицит Материалов"]['!cols'] = wscols;
			workbook.Sheets["Дефицит Материалов"]['!cols'][0] = { hidden: true };
			workbook.Sheets["Дефицит Материалов"]['!cols'][2] = { hidden: true };
			workbook.Sheets["Дефицит Материалов"]['!cols'][3] = { hidden: true };
			workbook.Sheets["Дефицит Материалов"]['!cols'][17] = { wch: 15 };
			workbook.Sheets["Дефицит Материалов"]['!cols'][18] = { hidden: true };

			const wopts = {
				bookType: 'xlsx',
				bookSST: false,
				type: 'base64'
			};
			const wbout = XLSX.write(workbook, wopts);
			const mediaType = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + wbout;
			window.location.href = mediaType;

		},
		showRemaningParent(id) {
			if(!id) return false;
			this.mat_id = id;
			this.materialParentKey = random(1, 999);
		},
		filterOrder(check, val) {
			this.all_type_order = !check
			this.filterMaterialStatus({status: 'order', val});
		},
		filterAll(val) {
			this.filter_order = false
			this.filterMaterialStatus({status: 'all', val});
		},
		setMaterial(material, span) {
			if(this.material && this.material.id == material.id && this.span_material) {
				this.material = null;
				return this.span_material = null;
			}

			this.span_material = eSelectSpan(this.span_material, span);
			this.material = material;
		},
		getKolvoMaterial(mat) {
			return getKolvoMaterial(mat);
		},
	},
	async mounted() {
		this.loader = true;
		this.clearCascheMaterial();

		await this.getAllTypeMaterial();
    await this.getAllPodTypeMaterial();
		await this.fetchGetAllDeficitPPM();
		this.loader = false;
	}
} 
</script>

<style scoped>
.table_material {
	display: flex;
} 
table {
	height: fit-content;
}
.span_td {
	display:  flex;
	flex-direction: column;
}
.header_block {
	display: flex;
}
label {
	cursor: pointer;
	user-select: none;
}

</style>