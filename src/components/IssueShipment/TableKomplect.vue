<template>
	<div class="table-scroll" v-if='shipmentsArr && shipmentsArr.length'>
		<table id='tableshipments'>
			<tr :class='fixed_table'>
				<th v-if='cheked_show'>
					<unicon name="check" fill="royalblue" />
				</th>
				<th v-if='remove_show'>
					<unicon name="glass-tea" fill="#ee0942d0" width='20' />
				</th> 
				<th>Заказ</th>
				<th class='fix_size'>Артикул изделия</th>
				<th class='fix_size'>Наименование изделия</th>
				<th class='fix_size' id="complect">Комплектация/особенности заказа</th>
				<th>Кол-во, шт.</th>
				<th>Кол-во, дней</th>
				<th>Осталось дней</th>
				<th class='fix_size'>Основание</th>
				<th class='fix_size'>Покупатель</th>
				<th class='fix_size'>Готовность к отгрузке в %</th>
				<th>Статус</th>
				<th>Дата План. отгрузки</th>
				<th>Дата Факт. отгрузки</th>
				<th>Н/Ч требуется</th>
				<th>Н/Ч выполнено</th>
				<th>Н/Ч осталось</th>
				<th class='fix_size'>Примечание</th>
			</tr>
			<tr v-for='shipments of shipmentsArr'
				:key='shipments'
				:class='"td-row " + (shipments.id == select_sh ? "td-row-all" : "")'
				@click='e => setShipments(shipments, e.target.parentElement)'
				@dblclick="openShipmentsModal(shipments)">
				<td v-if='cheked_show'>
					<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
						<p class="checkbox_block" @click='responseShipments(shipments)'></p>
					</div>
				</td>
				<td v-if='remove_show'>
					<div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
						<p class="checkbox_block_del" @click='removeShipments(shipments)'></p>
					</div>
				</td>
				<td>{{ shipments.number_order }}</td> <!-- Заказ -->
				<td>{{ shipments.product ? shipments.product.articl : 'Нет Изделия' }}</td> <!-- Артикул Изделия -->
				<td>{{ shipments.product ? shipments.product.name : 'Нет Изделия' }}</td> <!-- Наименование Изделия -->
				<td class='center' @click='openComplectation(shipments)' id="complect" >
					<img 
						src="@/assets/img/link.jpg" 
						class='link_img' 
						atl='Показать'
						v-if='shipments.list_cbed_detal' />
					<p v-else>Нет комплектации</p>
				</td> <!-- Комплектация -->
				<td class='center'>{{ shipments.kol }}</td> <!-- Количество -->
				<td class='center'>{{ dateDifference(shipments.date_order, shipments.date_shipments) }}</td> <!-- Кол-во Дней -->
				<td class='center'>{{ shipments.difference }}</td> <!-- Осталось дней -->
				<td style='width:50px; word-break: break-all;' class='center active'  
					@click='openDocuments(shipments)' >
					{{ shipments.base }}
				</td> <!-- Основание/Счет -->
				<td class='center'>{{ shipments.to_sklad ? 'Склад' : shipments.buyer ? shipments.buyer.name : 'нет'}}</td> <!-- Покупатель -->
				<td class='center'>0</td> <!-- Готовность к отгрузки в % -->
				<td v-if='shipments.status == enumShipments[0]' class='work_operation center'>{{ shipments.status }}</td>
				<td v-if='shipments.status == enumShipments[1]' class='delete_operation center'>{{ shipments.status }}</td>
				<td v-if='shipments.status == enumShipments[2]' class='success_operation center'>{{ shipments.status }}</td>
				<td v-if='shipments.status == enumShipments[3]' class='delete_operation center'>{{ shipments.status }}</td> <!-- Статус -->
				<td>{{ shipments.date_shipments }}</td> <!-- Дата отгрузки -->
				<td>{{ shipments?.sh_complit?.date_shipments_fakt }}</td> <!-- Дата ФАКТ отгрузки -->
				<td></td>
				<td></td>
				<td></td>
				<td class='center fix_size' v-if='!description_show'>
					<img src="@/assets/img/link.jpg" @click='openDescription(shipments.description)' class='link_img' atl='Показать' />
				</td>
				<td v-else>{{ shipments.description }}</td>
			</tr>
		</table>
		<DescriptionModal 
      v-if='showDescriptionModal'
      :key='descriptionKey'
      :parametrs='description'
    />
		<OpensFile 
      :parametrs='itemFiles' 
      v-if="itemFiles.length" 
      :key='keyWhenModalGenerateFileOpen'
    />
		<KomplectModal
			v-if='parametrs_komplect'
			:key='komplect_generate_key'
			:parametrs='parametrs_komplect'
			:shipments='selectShipments'
		/>
		<ShipmentsModal 
			v-if='show_modal_shipments && selectShipments.id'
			:key='key_modal_shipments'
			:id_shipments='selectShipments.id'
		/>
	</div>
</template>
<script>
import print from 'print-js';
import { random } from 'lodash';
import { showMessage } from '@/js/';
import { dateDifference } from '@/js/';
import { dateIncrementHors } from '@/js/';
import { eSelectSpan } from '@/js/methods';
import KomplectModal from './KomplectModal';
import ShipmentsModal from './ShipmentsModal';
import OpensFile from '@/components/FileBase/OpenFile';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DescriptionModal from '@/components/DescriptionModal';

export default {
	props: {
		shipmentsArr: [],
		no_set: {},
		fixed_table: {
			type: String,
			default: 'fixed_table_85'
		},
		cheked_show: {},
		remove_show: {},
		select_sh: {},
		return_dbclick: {},
		is_print: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			selectShipments: null,
			tr: null,
			description_show: false,

			parametrs_komplect: null,
			komplect_generate_key: random(1, 999),

			showDescriptionModal: false,
      descriptionKey: random(1, 999),
      description: '',

			itemFiles: [],
      keyWhenModalGenerateFileOpen: random(1, 999),

			loader: false,

			key_modal_shipments: random(1, 999),
			show_modal_shipments: false,

			enumShipments: [				
				'Заказано',
				'Удалено',
				'Отгружено',
				'Просрочено'
			],
		}	
	},
	watch: {
		is_print: function (val) {
			if (!val) return false;
			this.description_show = true;

			setTimeout(() => {
				print({
					printable: 'tableshipments',
					type: 'html',
					targetStyles: ['*'],
					documentTitle: 'Задачи на отгрузку',
					ignoreElements: ['complect'],
					font_size: '10pt',
				});
				this.description_show = false;
			});
		}
	},
	components: {
		DescriptionModal, 
		OpensFile,
		KomplectModal,
		ShipmentsModal
	},
	computed: mapGetters(['getShipments']),
	methods: {
		...mapActions(['fetchDocumentsShipments']),
		...mapMutations(['setOneShipment']),
		openShipmentsModal(sh) {
			if (this.return_dbclick) return this.$emit('unmount_dbclick', sh.id);
			this.selectShipments = sh;

		this.key_modal_shipments = random(1, 999);
		this.show_modal_shipments = true;
		},
		responseShipments(sh) {
			this.$emit('unmount_sh', sh);
		},
		removeShipments(sh) {
			this.$emit('unmount_sh_remove', sh);
		},
		setShipments(shipments, e) {
			if (this.no_set) return false;

			if (this.selectShipments && this.selectShipments.id == shipments.id) 
				this.selectShipments = null;
			this.tr = eSelectSpan(this.tr, e);

			this.setOneShipment(shipments);
			this.selectShipments = shipments;
			this.$emit('unmount', this.selectShipments);
		},
		openDescription(description) {
      this.showDescriptionModal = true;
      this.descriptionKey = random(1, 999);
      this.description = description;
    },
		dateIncrementHors(date, day) {
      const dat = dateIncrementHors(date, day*24);
      return `${dat.day}.${dat.mount}.${dat.year}`;
    },
		dateDifference(date1, date2) {
			return dateDifference(date1, date2);
		},
		openComplectation(sh) {
			if (!sh.list_cbed_detal) return false;

			this.komplect_generate_key = random(1, 999);
			this.parametrs_komplect = sh.list_cbed_detal;
			this.selectShipments = sh;
		},	
		async openDocuments(shipments) {
			if (!shipments.id) return showMessage('', 'Документов нет', 'w');
			const ships = await this.fetchDocumentsShipments(shipments.id);

			if (ships.documents && ships.documents.length) {
				for (let doc of ships.documents) {
					if (doc.name == shipments.base) {
						this.keyWhenModalGenerateFileOpen = random(1, 999);
						this.itemFiles = [doc];
					}
				}
			} else showMessage('', 'Документов нет', 'w');
    },
	},
}
</script>

<style scoped>
.osob {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
}
.osob * {
	margin: 0px;
}
.fix_size {
	width: 100px;
	word-break: break-all;
}

table th {
	word-break: break-word;
}
</style>