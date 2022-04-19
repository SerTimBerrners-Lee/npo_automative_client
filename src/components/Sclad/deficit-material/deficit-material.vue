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
				<TableMaterial :type_view='"def"' />

			</div>
				<div class='btn-control out-btn-control wh_80p'>
					<button class="btn-small" @click="exportExcel"> Выгрузка в Excel </button>
					<button class="btn-small" @click='printPage'> Печать отчета </button>
				</div>
		</div>
		<Loader v-if='loader' />
	</div>
</template>
<script> 
import XLSX from 'xlsx';
import print from 'print-js';
import { mapMutations } from 'vuex';
import TableMaterial from './table-material';
import TableTypeMaterial from './table-type-material';

export default {
	data() {
		return {
			filter_order: false,
			all_type_order: true,
		}
	},
	components: {
		TableTypeMaterial,
		TableMaterial
	},
	methods: {
		...mapMutations([
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
		filterOrder(check, val) {
			this.all_type_order = !check
			this.filterMaterialStatus({status: 'order', val});
		},
		filterAll(val) {
			this.filter_order = false
			this.filterMaterialStatus({status: 'all', val});
		},
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

.header_block {
	display: flex;
}
label {
	cursor: pointer;
	user-select: none;
}

</style>