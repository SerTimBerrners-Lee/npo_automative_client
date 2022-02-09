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
				<table style="width: 200px;">
					<tr>
						<th>Категория</th>
					</tr>
					<tr class='td-row' @click='e => instansMaterial(0, e.target.parentElement)'>
						<td>Все</td>
					</tr>
					<tr class='td-row' @click='e => instansMaterial(1, e.target.parentElement)'>
						<td>Материалы </td>
					</tr>
					<tr class='td-row' @click='e => instansMaterial(2, e.target.parentElement)'>
						<td>Покупные детали</td>
					</tr>
					<tr class='td-row' @click='e => instansMaterial(3, e.target.parentElement)'>
						<td>Расходные материалы</td>
					</tr>
				</table>
				<table style="width: 150px;">
					<tr>
						<th>Тип</th>
					</tr>
					<tr 
						class='td-row' 
						v-for='typ of alltypeM' 
						:key='typ'
						@click='clickMat(typ)'>
						<td>{{ typ.name }}</td>
					</tr>
				</table>
				<table style="width: 150px;">
					<tr>
						<th>Подтип</th>
					</tr>
					<tr 
						class='td-row' 
						v-for='p_type of allPodTypeM' 
						:key='p_type'
						@click='clickMat(p_type)'>
						<td>{{ p_type.name }}</td>
					</tr>
				</table>
				<div v-if='getOnePodMaterial.length'>
					<table style='margin-left: 20px;' id='tablebody'>
						<tbody class='fixed_table_10'>
							<tr>
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
						<tbody v-for='material of getOnePodMaterial' :key='material'>
							<tr>
								<td 
									@click='e => setMaterial(material, e.target)'
									:rowspan="getKolvoMaterial(material).length + 1"
									class='td-row'> {{ material.name }}
								</td>
								<td class='center' :rowspan="6">
									<img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
								</td>
								<td class='center' @click="showRemaningParent(material.id)" :rowspan="6">
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
									<strong>{{ ez.min_remaining * 3 + ez.shipments_kolvo }}</strong>
								</td>
								<td class='center min_width'>
									{{ ez.min_remaining * 3 + ez.shipments_kolvo }}
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
								<td class='center min_width'>
									{{ ez.shipments_kolvo - ez.deliveries_kolvo }}
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
					<button class="btn-small"> Выгрузка в Excel </button>
					<button class="btn-small" @click='printPage'> Печать отчета </button>
				</div>
		</div>
		<MaterialParentModal
			:mat_id='mat_id'
			v-if='mat_id'
			:key='materialParentKey'
		/>
		<Loader v-if='loader' />
	</div>
</template>
<script> 
import print from 'print-js';
import {random} from 'lodash';
import {getKolvoMaterial} from '@/js/edizm.js';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import MaterialParentModal from './material-parent-modal.vue';

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
			materialParentKey: random(1, 999)
		}
	},
	components: {MaterialParentModal},
	computed: mapGetters(['getOnePodMaterial', 'alltypeM', 'allPodTypeM']),
	methods: {
		...mapActions(['fetchGetAllDeficitPPM']),
		...mapMutations([
			'getInstansMaterial', 
			'filterByNameMaterial', 
			'clearCascheMaterial', 
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
		showRemaningParent(id) {
			if(!id) return false;
			this.mat_id = id
			this.materialParentKey = random(1, 999)
		},
		filterOrder(check, val) {
			this.all_type_order = !check
			this.filterMaterialStatus({status: 'order', val})
		},
		filterAll(val) {
			this.filter_order = false
			this.filterMaterialStatus({status: 'all', val})
		},
		instansMaterial(instans, span) {
      if(this.span) 
				this.span.classList.remove('td-row-all')
			if(this.instansLet == instans)
				return 0

      this.span = span
			this.span.classList.add('td-row-all')

      this.getInstansMaterial(instans)
      this.instansLet = instans

    },
		clickMat(mat) {
			this.filterByNameMaterial(mat)
			console.log(mat)
    },
		setMaterial(material, span) {
			console.log(material)
			if(this.material && this.material.id == material.id && this.span_material) {
				this.material = null;
				return this.span_material = null
			}
			
			if(this.span_material)
				this.span_material.classList.remove('td-row-all')
			this.span_material = span
			this.span_material.classList.add('td-row-all')

			this.material = material
		},
		getKolvoMaterial(mat) {
			return getKolvoMaterial(mat)
		},
		changeDatePicterRange(val) {
			console.log(val)
		}
	},
	async mounted() {
		this.loader = true
		this.clearCascheMaterial()

		this.clearCascheMaterial()
		await this.fetchGetAllDeficitPPM()
		this.loader = false
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