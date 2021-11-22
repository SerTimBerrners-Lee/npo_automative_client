<template>
	<div>
		<h3>Дефицит материалов</h3>
		<div>
			<DatePicterRange 
				@unmount='changeDatePicterRange'  
			/>
		</div> 

		<div style='width: max-content;'>
			<div class="scroll-table table_material" style='height: 100%;'>
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
				<table style='margin-left: 20px;'>
					<tr>
						<th style='width: 100px;'>Наименование</th>
						<th>ЕИ</th>
						<th>Остаток на дату</th>
						<th>План расход на план</th>
						<th>План остаток</th>
						<th>Среднестат. расход</th>
						<th>Мин. остаток</th>
						<th>Рек. остаток</th>
						<th>Дефицит</th>
						<th>Дефицит в рублях</th>
						<th>Рек. заказ</th>
						<th>План приход (данные по счету)</th>
						<th>Дата прихода</th>
						<th>План остаток после план прихода</th>
						<th>План дефицит/Профицит</th>
						<th>Статус</th>
					</tr>
					<tbody v-for='material of getOnePodMaterial' :key='material'>
						<tr>
							<td @click='e => setMaterial(material, e.target)'
									:rowspan="getKolvoMaterial(material).length + 1"
									class='td-row'> {{ material.name }}</td>
						</tr>
						<tr v-for='ez of getKolvoMaterial(material)' :key='ez'>
							<td>{{ez.ez}}</td>
							<td class='center min_width'>
								{{ ez.material_kolvo }}
							</td>
							<td class='center min_width'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center min_width'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center min_width'>
								{{ material.shipments_kolvo }}
							</td>	
							<td class='center min_width'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center min_width'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center min_width'>
								{{ -material.shipments_kolvo }}
							</td>
							<td class='center min_width'>
								{{ material.price }}
							</td>
							<td class='center min_width'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center min_width'>
								{{ 0 }}
							</td>
							<td class='center tooltip min_width'>
								{{ material.deliveries && material.deliveries.length ? material.deliveries[0].date_shipments : '' }}
								<div class="tooltiptext" v-if='material.deliveries.length'>
									<span v-for='dev of material.deliveries' :key='dev'>{{ dev.date_shipments }}</span>
								</div>
							</td>
							<td class='center min_width'>
								{{ returnOstatokWays(material)}}
							</td>
							<td class='center min_width'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center min_width'>
								{{ ge ? "Заказано" : 'Не заказано'}}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
				<div class='btn-control'>
					<button class="btn-small"> Выгрузка в Excel </button>
					<button class="btn-small"> Печать отчета </button>
				</div>
		</div>
		<Loader v-if='loader' />
	</div>
</template>

<script> 
import { mapGetters, mapActions, mapMutations } from 'vuex';
import DatePicterRange from '@/components/date-picter-range.vue';
import {getKolvoMaterial} from '@/js/edizm.js';
export default {
	data() {
		return {
			span: null,
			instansLet: 0,

			material: null,
			span_material: null,

			loader: false
		}
	},
	components: {DatePicterRange},
	computed: mapGetters(['getOnePodMaterial', 'alltypeM', 'allPodTypeM']),
	methods: {
		...mapActions(['fetchGetAllDeficitPPM']),
		...mapMutations(['getInstansMaterial', 'filterByNameMaterial', 'clearCascheMaterial']),
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
    },
		setMaterial(material, span) {
			if(this.material && this.material.id == material.id && this.span_material) {
				this.material = null;
				return this.span_material = null
			}
			if(this.span_material)
				this.span_material.classList.remove('td-row-all')
			this.span_material = span
			this.span_material.classList.add('td-row-all')

			this.material = material
			console.log(material)
		},
		returnOstatokWays(material) {
			if(!material.deliveries) return 0

			let count = 0
			for(let dev of material.deliveries) {
				if(!dev.product) continue;
				try { 
					let pars = JSON.parse(dev.product)
					for(let product of pars) {
						if(product.id == material.id)
							count = count + Number(product.kol)
					}
				} catch(e) {	console.error(e) 	}
			}
			if(count - material.shipments_kolvo < 0 ) return +count 
			return count - material.shipments_kolvo
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
</style>