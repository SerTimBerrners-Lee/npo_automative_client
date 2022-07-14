<template>
  <div class='main'>
    <h3>Заказано / в пути</h3>

		<div v-if='getOnePodMaterial.length || getWorkings.length'>
			<div class="scroll-table table_material" v-if='getOnePodMaterial.length'>
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

        <table>
          <tr> 
            <th>Наименование</th>
            <th>ЕИ</th>
            <th style='width: 10px;'>Планируемый приход</th>
            <th>Дата прихода</th>
            <th style='width: 120px;'>План. остаток после план прихода и план. расхода</th>
            <th>Поставщик</th>
            <th>№ счета</th>
          </tr>
          <tr v-for='material of getOnePodMaterial' :key='material'>
						<td 
							@click='e => setMaterial(material, e.target)'
							class='td-row'> {{ material.name }}</td>
            <td
              class='center' 
              v-html='getComing(material, "ez")'></td>
            <td
              class='center'>{{ getComing(material, 'kol') }}</td>
            <td class='center'>{{ material.dev ? material.dev.date_shipments : '' }}</td>
            <td class='center'>{{ materialOstat(material) }}</td>
            <td>{{ material && material.dev ? material.dev.provider.name : '' }}</td>
            <td @click='material.dev ? openCheck(material.dev.documents) : false' class='select_span_href'>{{ material.dev ? material.dev.number_check : '' }}</td>
          </tr>
      </table>
      </div>

			<div class='scroll-table' v-if='getWorkings.length'>
				<table>
					<tr>
            <th>№ Заказа</th>
            <th>Дата создания</th>
            <th>Тип Заказа</th>
            <th>Наименование поставщика</th>
            <th>№ счета и Дата</th>
            <th>Сумма, руб.</th>
            <th>Дата прихода</th>
            <th>Статус</th>
            <th>Подробнее</th>
          </tr>
					<tbody v-for='works of getWorkings' :key='works'>
						<tr 
							class='td-row'>
							<td class='center'>{{ works.number_order }}</td> <!-- Номер заказа -->
							<td class='center'>{{ works.date_order }}</td> <!-- Дата заказа -->
							<td class='center bold'>{{ works.type == 'metall' ? 'M' : 'С'  }}</td> <!-- Тип Заказа -->
							<td class='center'>склад</td> <!-- Поставщик -->
							<td class='center'>{{ works.date_order }}</td> <!-- Номер счета и дата -->
							<td class='center'>-</td> <!-- Сумма -->
							<td class='center'>-</td> <!-- Дата прихода -->
							<td> В работе </td> <!-- Статус -->
							<td class='center tooltip'> <!-- Подробнее -->
								<div class="tooltiptext">
									<table>
										<tbody>
											<tr>
												<th>Артикул</th>
												<th>Наименование</th>
												<th>Кол-во</th>
												<th>Примечание</th>
											</tr>
										</tbody>
										<tbody v-for='obj of works.metall.length ? works.metall : works.assemble' :key='obj'>
											<tr>
												<td>{{ obj?.detal?.articl || obj?.cbed?.articl }}</td>
												<td>{{ obj?.detal?.name || obj?.cbed?.name }}</td>
												<td>{{ obj?.kolvo_shipments }}</td>
												<td>{{ obj?.description }}</td>
											</tr>
										</tbody>
									</table>
								</div>
								<img src="@/assets/img/link.jpg" class='link_img' atl='Показать' />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class='btn-control'>
					<button class="btn-small"> Печать отчета </button>
			</div>
    </div>
		<div v-else class='center'>Ничего не найдено...</div>
		<Loader v-if='loader' />

		<OpensFile 
			:parametrs='itemFiles' 
			v-if="itemFiles" 
			:key='keyWhenModalGenerateFileOpen'
    />
  </div>
</template> 

<script>
import { random } from 'lodash';
import OpensFile from '@/components/FileBase/OpenFile';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
	data() {
		return {
      span: null,
			instansLet: 0,

			material: null,
			span_material: null,

			itemFiles: null,
			keyWhenModalGenerateFileOpen: random(1, 999),

			loader: false,

			select_worker: null,
		}
	},
  computed: mapGetters([
		'getOnePodMaterial', 
		'alltypeM', 
		'allPodTypeM',
		'getWorkings'
	]),
	components: {
		OpensFile
	},
	methods: {
    ...mapActions([
			'fetchGetAllShipmentsPPM',
			'fetchAllWorkings'
		]),
    ...mapMutations([
			'getInstansMaterial', 
			'filterByNameMaterial', 
			'clearCascheMaterial',
		]),
		unmount_working(_id) {
      if(!_id) return false;
			this.select_worker = null;
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
			this.filterByNameMaterial(mat);
    },
		setMaterial(material, span) {
			if(this.material && this.material.id == material.id && this.span_material) {
				this.material = null;
				return this.span_material = null;
			}
			if(this.span_material)
				this.span_material.classList.remove('td-row-all');
			this.span_material = span;
			this.span_material.classList.add('td-row-all');

			this.material = material;
		},
    getComing(mat, type) {
      if(!mat.dev) return 0
      try {
        const pars_str = JSON.parse(mat.dev.product);
        for(let prod of pars_str) {
          if(prod.id == mat.id) {
            if(type == 'kol') 
              return prod.kol;
            if(type == 'ez')
              return prod.ez;
          }
        }
      } catch(e) { 
				console.error(e);
			}
      
    },
		materialOstat(material) {
			let res = material.shipments_kolvo - this.getComing(material, 'kol');
			return res < 0 ? -res : res;
		},
		openCheck(documents) {
			if(!documents || documents.length == 0)
				return 0;
			this.itemFiles = documents[0];
			this.keyWhenModalGenerateFileOpen = random(1, 999);
		}
	},
	async mounted() {
		this.loader = true;
    this.clearCascheMaterial();
    await this.fetchGetAllShipmentsPPM();
		await this.fetchAllWorkings();
		console.log(this.getWorkings);
		this.loader = false;
	}
}
</script>

<style scoped>
.tooltiptext {
  margin-top: 40px;
}
.table_material {
	display: flex;
}
table {
  height: fit-content;
}
.main {
	width: fit-content;
}
.else {
	font-size: 30px;
	margin: 60px;
}
</style>