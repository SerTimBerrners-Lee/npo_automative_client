<template>
	<div>
		<h3>Остатки материалов на складе</h3>
		<div>
			<div class="block header_block">
				<DatePicterRange 
          @unmount='changeDatePicterRange'  
        />
			</div>
		</div>

		<div>
			<div class="scroll-table table_material" style='height: 100%;'>
				<table style="width: 200px;">
					<tr>
						<th>Категория</th>
					</tr>
					<tr class='td-row' @click='e => getAllDeficit(e.target.parentElement)'>
						<td>Все</td>
					</tr>
					<tr class='td-row' @click='e => getOnlyMaterialDeficit(e.target.parentElement)'>
						<td>Материалы </td>
					</tr>
					<tr class='td-row' @click='e => getOnlyInstrumentDeficit(e.target.parentElement)'>
						<td>Инструмент</td>
					</tr>
					<tr class='td-row' @click='e => getOnlyEquipmentDeficit(e.target.parentElement)'>
						<td>Обдование</td>
					</tr>
					<tr class='td-row' @click='e => getOnlyInventarytDeficit(e.target.parentElement)'>
						<td>Техника и Инвенарь</td>
					</tr>
					<tr class='td-row'>
						<td>Склад Отходов</td>
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
						@click='clickMat(typ, "type")'> 
						<td>{{ typ.name }}</td>
					</tr>
					<tr 
						class='td-row' 
						v-for='typ of allEquipmentType' 
						:key='typ'
						@click='clickEq(typ, "type")'> 
						<td>{{ typ.name }}</td>
					</tr>
					<tr 
						class='td-row' 
						v-for='typ of allTInstrument' 
						:key='typ'
						@click='clickTools(typ, "type")'> 
						<td>{{ typ.name }}</td>
					</tr>
					<tr 
						class='td-row' 
						v-for='typ of getTInventary' 
						:key='typ'
						@click='clickInventary(typ, "type")'> 
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
						@click='clickMat(p_type, "podM")'>
						<td>{{ p_type.name }}</td>
					</tr>
					<tr 
						class='td-row' 
						v-for='p_type of allEquipmentPType' 
						:key='p_type'
						@click='clickEq(p_type, "podT")'>
						<td>{{ p_type.name }}</td>
					</tr>
					<tr 
						class='td-row' 
						v-for='p_type of allPTInstrument' 
						:key='p_type'
						@click='clickTools(p_type, "podT")'>
						<td>{{ p_type.name }}</td>
					</tr>
					<tr 
						class='td-row' 
						v-for='p_type of getPTInventary' 
						:key='p_type'
						@click='clickInventary(p_type, "podT")'>
						<td>{{ p_type.name }}</td>
					</tr>
				</table>
				<table style='margin-left: 20px;'>
					<tr>
						<th>Наименование</th>
						<th>ЕИ</th>
						<th>Остаток на дату</th>
						<th>План расход на план</th>
						<th>План остаток</th>
						<th>Среднестат. расход</th>
						<th>Мин. остаток</th>
						<th>Рек остаток</th>
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
							<td 
								style='width: 100px;'
								:rowspan="getKolvoMaterialTow(material).length + 1"
								@click='e => setMaterial(material, e.target)'
								class='td-row'> {{ material.name }}</td>
						</tr>
						<tr v-for='ez of getKolvoMaterialTow(material)' :key='ez'>
							<td>{{ez.ez}}</td>
							<td class='center min_width'>
								{{ material.material_kolvo }}
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
								{{ 0 }}
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
								{{ returnOstatokWays(material) }}
							</td>
							<td class='center min_width'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center min_width'>
								{{ material.deliveries.length ? "Заказано" : 'Не заказано'}}
							</td>
						</tr>
					</tbody>
					<!-- INSTRUMENT -->
					<tr 
						v-for='instrument of allPPTInstrument'
						:key='instrument'
					>
						<td 
							class='td-row'> {{ instrument.name }}</td>
						<td>
							шт
						</td>
						<td class='center min_width'>
							{{ instrument.instrument_kolvo }}
						</td>
						<td class='center min_width'>
							{{ instrument.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ instrument.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ instrument.shipments_kolvo }}
						</td>	
						<td class='center min_width'>
							{{ instrument.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ instrument.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ -instrument.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ 0 }}
						</td>
						<td class='center min_width'>
							{{ instrument.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ 0 }}
						</td>
						<td class='center tooltip min_width'>
							{{ instrument.deliveries && instrument.deliveries.length ? instrument.deliveries[0].date_shipments : '' }}
							<div class="tooltiptext" v-if='instrument.deliveries && instrument.deliveries.length'>
								<span v-for='dev of instrument.deliveries' :key='dev'>{{ dev.date_shipments }}</span>
							</div>
						</td>
						<td class='center min_width'>
							{{ returnOstatokWays(instrument) }}
						</td>
						<td class='center min_width'>
							{{ instrument.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ instrument.deliveries && instrument.deliveries.length ? "Заказано" : 'Не заказано'}}
						</td>
					</tr>
					<!-- EQUIPMENT -->
					<tr 
						v-for='equipment of allEquipment'
						:key='equipment'
					>
						<td 
							class='td-row'> {{ equipment.name }}</td>
						<td>
							шт
						</td>
						<td class='center min_width'>
							{{ equipment.equipment_kolvo }}
						</td>
						<td class='center min_width'>
							{{ equipment.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ equipment.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ equipment.shipments_kolvo }}
						</td>	
						<td class='center min_width'>
							{{ equipment.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ equipment.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ -equipment.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ 0 }}
						</td>
						<td class='center min_width'>
							{{ equipment.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ 0 }}
						</td>
						<td class='center tooltip min_width'>
							{{ equipment.deliveries && equipment.deliveries.length ? equipment.deliveries[0].date_shipments : '' }}
							<div class="tooltiptext" v-if='equipment.deliveries && equipment.deliveries.length'>
								<span v-for='dev of equipment.deliveries' :key='dev'>{{ dev.date_shipments }}</span>
							</div>
						</td>
						<td class='center min_width'>
							{{ returnOstatokWays(equipment) }}
						</td>
						<td class='center min_width'>
							{{ equipment.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ equipment.deliveries && equipment.deliveries.length ? "Заказано" : 'Не заказано'}}
						</td>
					</tr>
					<!-- INVENTARY -->
					<tr 
						v-for='inventary of getInventary'
						:key='inventary'
					>
						<td 
							class='td-row'> {{ inventary.name }}</td>
						<td>
							шт
						</td>
						<td class='center min_width'>
							{{ inventary.inventary_kolvo }}
						</td>
						<td class='center min_width'>
							{{ inventary.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ inventary.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ inventary.shipments_kolvo }}
						</td>	
						<td class='center min_width'>
							{{ inventary.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ inventary.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ -inventary.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ 0 }}
						</td>
						<td class='center min_width'>
							{{ inventary.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ 0 }}
						</td>
						<td class='center tooltip min_width'>
							{{ inventary.deliveries && inventary.deliveries.length ? inventary.deliveries[0].date_shipments : '' }}
							<div class="tooltiptext" v-if='inventary.deliveries && inventary.deliveries.length'>
								<span v-for='dev of inventary.deliveries' :key='dev'>{{ dev.date_shipments }}</span>
							</div>
						</td>
						<td class='center min_width'>
							{{ returnOstatokWays(inventary) }}
						</td>
						<td class='center min_width'>
							{{ inventary.shipments_kolvo }}
						</td>
						<td class='center min_width'>
							{{ inventary.deliveries && inventary.deliveries.length ? "Заказано" : 'Не заказано'}}
						</td>
					</tr>
				</table>
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
			loader: false, 

			material: null,
			span_material: null,
		}
	},
	components: {DatePicterRange},
	computed: mapGetters([
		'alltypeM', 
		'allPodTypeM', 
		'getOnePodMaterial', 
		'allTInstrument',
		'allPTInstrument',
		'allPPTInstrument',
		'allEquipmentType',
		'allEquipmentPType',
		'allEquipment',
		'getTInventary',
		'getPTInventary',
		'getInventary'
	]), 
	methods: {
		...mapActions([
			'getAllTypeMaterial',
      'bannedPPM', 
      'fetchGetOnePPM', 
      'getAllPodTypeMaterial',
      'fetchPPMNoLight',
			'fetchGetAllDeficitInsrument',
			'getAllNameInstrument',
			'fetchAllEquipment',
			'fetchAllNameInventary',
			'getAllEquipmentPType',
			'fetchAllEquipmentType',
			'getOneEquipmentPType',
			'fetchAllInstruments',
			'getPTInstrumentList',
			'getAllPTInstances',
			'fetchAllInventary',
			'fetchAllPInventary'
		]),
    ...mapMutations([
			'filterByNameMaterialById', 
			'filterMatByPodType',
      'addOnePPTyep',
      'throwInstans',
      'searchTypeMutation', 
      'searchPTypeMutation', 
      'searchMaterialMutation', 
      'clearCascheMaterial',
			'clearCascheInstrument',
			'clearCascheEquipment',
			'clearCascheInventary',
			'filterAllPTEquipment',
			'filterAllpInstrument',
			'filterNameInventaryByPT'
		]),
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
		clickMat(mat, type) {
      if(type == 'type') {
        this.material = mat
        this.filterByNameMaterialById(mat) 
        if(mat.podMaterials && mat.podMaterials.length && this.instansLet != 1) 
          this.filterMatByPodType(mat.podMaterials)
        else 
          this.getAllPodTypeMaterial(1)
      }

      if(type == 'podM') 
        this.filterByNameMaterialById(mat) 
    },
		clickEq(eq, type) {
			if(type == 'type') 
				this.filterAllPTEquipment(eq)
      if(type == 'podT') 
				this.getOneEquipmentPType(eq.id)
		},
		clickTools(tools, type) {
			if(type == 'type') 
				this.filterAllpInstrument(tools)
      if(type == 'podT') 
				this.getAllPTInstances(tools.id)
		},
		clickInventary(inventary, type) {
			if(type == 'type') 
				this.filterNameInventaryByPT(inventary.inventary)
      if(type == 'podT') 
				this.filterNameInventaryByPT(inventary.inventary)
		},
		getKolvoMaterialTow(mat) {
			return getKolvoMaterial(mat)
		},
		changeDatePicterRange(val) {
      console.log(val)
    },
		getAllDeficit() {
			this.clearAllState()

			this.getOnlyMaterialDeficit()
			this.getAllNameInstrument()
		},
		getOnlyMaterialDeficit() {
			this.clearAllState()

			this.getAllTypeMaterial()
			this.getAllPodTypeMaterial()
			this.fetchPPMNoLight()
		},
		getOnlyInstrumentDeficit() {
			this.clearAllState()
			this.getAllNameInstrument()
			this.fetchAllInstruments()
			this.getPTInstrumentList()
		},
		getOnlyEquipmentDeficit() {
			this.clearAllState()
			this.fetchAllEquipment()
			this.getAllEquipmentPType()
			this.fetchAllEquipmentType()
		},
		getOnlyInventarytDeficit() {
			this.clearAllState()
			this.fetchAllInventary()
			this.fetchAllPInventary()
			this.fetchAllNameInventary()
		},
		clearAllState() {
			this.clearCascheMaterial()
			this.clearCascheInstrument()
			this.clearCascheEquipment()
			this.clearCascheInventary()
		}
	},
	async mounted() { 
		this.loader = true
    
    this.clearCascheMaterial()
    await this.getAllTypeMaterial()
    await this.getAllPodTypeMaterial()
    await this.fetchPPMNoLight()
		// await this.fetchGetAllDeficitInsrument()
		await this.getAllNameInstrument()
		await this.fetchAllEquipment()
		await this.fetchAllNameInventary()
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
.span_td>span {
	text-align: center;
}
.tooltiptext {
	display: flex;
	flex-direction: column;
}
</style>