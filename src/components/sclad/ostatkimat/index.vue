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
			<div class="scroll-table table_material">
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
						<td>Инструмент</td>
					</tr>
					<tr class='td-row' @click='e => instansMaterial(3, e.target.parentElement)'>
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
				</table>
				<table>
					<tr>
						<th>Наименование</th>
						<th>ЕИ</th>
						<th>Остаток на дату</th>
						<th>План расход на план</th>
						<th>План остаток</th>
						<th>Среднестат. расход</th>
						<th>Мин. остаток</th>
						<th>Рекомендованный остаток</th>
						<th>Дефицит</th>
						<th>Дефицит в рублях</th>
						<th>Рекомендованный заказ</th>
						<th>План приход (данные по счету)</th>
						<th>Дата прихода</th>
						<th>План остаток после план прихода</th>
						<th>План дефицит/Профицит</th>
						<th>Статус</th>
					</tr>
					<tr v-for='material of getOnePodMaterial' :key='material'>
						<td 
							@click='e => setMaterial(material, e.target)'
							class='td-row'> {{ material.name }}</td>
							<td class='span_td' v-html="getKolvoMaterial(material.kolvo)">
							</td>
							<td class='center'>
								{{ material.material_kolvo }}
							</td>
							<td class='center'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center'>
								{{ material.shipments_kolvo }}
							</td>	
							<td class='center'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center'>
								{{ -material.shipments_kolvo }}
							</td>
							<td class='center'>
								{{ 0 }}
							</td>
							<td class='center'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center'>
								{{ 0 }}
							</td>
							<td class='center tooltip'>
								{{ material.deliveries.length ? material.deliveries[0].date_shipments : '' }}
								<div class="tooltiptext" v-if='material.deliveries.length'>
									<span v-for='dev of material.deliveries' :key='dev'>{{ dev.date_shipments }}</span>
								</div>
							</td>
							<td class='center'>
								{{ returnOstatokWays(material) - material.shipments_kolvo }}
							</td>
							<td class='center'>
								{{ material.shipments_kolvo }}
							</td>
							<td class='center'>
								{{ material.deliveries.length ? "Заказано" : 'Не заказано'}}
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
	computed: mapGetters(['alltypeM', 'allPodTypeM', 'getOnePodMaterial']),
	methods: {
		...mapActions(['getAllTypeMaterial',
      'bannedPPM', 
      'fetchGetOnePPM', 
      'getAllPodTypeMaterial',
      'fetchPPMNoLight'
		]),
    ...mapMutations(['filterByNameMaterialById', 'filterMatByPodType',
      'addOnePPTyep', 
      'getInstansMaterial', 
      'throwInstans',
      'searchTypeMutation', 
      'searchPTypeMutation', 
      'searchMaterialMutation', 
      'clearCascheMaterial'
		]),
		instansMaterial(instans, span) {
      if(this.span) 
				this.span.classList.remove('td-row-all')
			if(this.instansLet == instans)
				return 0

      this.span = span
			this.span.classList.add('td-row-all')
      this.instansLet = instans

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
			if(!material.deliveries) return '-'

			let count = 0
			for(let dev of material.deliveries) {
				if(!dev.product) continue;
				try { 
					let pars = JSON.parse(dev.product)
					for(let product of pars) {
						if(product.id == material.id)
							count = count + Number(product.kol)
					}
				} catch(e) {
					console.log(e)
				}
			}
			return count
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
		getKolvoMaterial(kol) {
			try {
				let pars_json = JSON.parse(kol)
				let str = ''
				if(pars_json.c1) str = '<span> шт </span>'
				if(pars_json.c2) str = str + '<span> л </span>'
				if(pars_json.c3) str = str + '<span> кг </span>'
				if(pars_json.c4) str = str + '<span> м </span>'
				if(pars_json.c5) str = str + '<span> м.куб </span>'
				return str
			} catch (e) {
				console.log(e)
			}
		},
		changeDatePicterRange(val) {
      console.log(val)
    }
	},
	async mounted() { 
		this.loader = true
    
    this.clearCascheMaterial()
    await this.getAllTypeMaterial()
    await this.getAllPodTypeMaterial()
    await this.fetchPPMNoLight()
		console.log(this.getOnePodMaterial)
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
.tooltiptext {
	display: flex;
	flex-direction: column;
}
</style>