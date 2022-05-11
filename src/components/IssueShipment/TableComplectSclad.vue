<template>
	<div class="table-scroll">
		<table id='tableshipments'> 
			<tr class='fixed_table_85'>
        <th style='cursor: pointer;' id="check">
          <unicon name="check" fill="royalblue" />
        </th> 
				<th>Заказ</th>
				<th>Артикул изделия</th>
				<th>Наименование изделия</th>
				<th style='width:100px; word-break: break-all;' id="complect">Комплектация/особенности заказа</th>
				<th>Кол-во, шт.</th>
				<th>Кол-во, дней</th>
				<th>Осталось дней</th>
				<th style='width:50px;'>Основание</th>
				<th>Покупатель</th> 
				<th>Готовность к отгрузке в %</th>
				<th>Статус</th>
				<th>Дата План. отгрузки</th>
				<th>Дата Факт. отгрузки</th>
				<th>Примечание</th>
			</tr>
			<tr v-for='shipments of shipmentsArr'
				:key='shipments'
				class='td-row'
				@click='e => toSelect(shipments, e.target.parentElement)'
				@dblclick="shipmentsModal">
        <td id="check">
          <div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
            <p class="checkbox_block" @click='e => toSetShipments(shipments, e.target)'></p>
          </div>
        </td>
				<td>{{ shipmentsNullOne(shipments.number_order) }}</td>
				<td>{{ shipments.product ? shipments.product.articl : 'Нет Изделия' }}</td>
				<td>{{ shipments.product ? shipments.product.name : 'Нет Изделия' }}</td>
				<td class='center' @click='openComplectation(shipments)' id="complect">
					<img 
						src="@/assets/img/link.jpg" 
						class='link_img' 
						atl='Показать'
						v-if='shipments.list_cbed_detal' />
					<p v-else>Нет комплектации</p>
				</td>
				<td class='center'>{{ shipments.kol }}</td>
				<td class='center'>{{ dateDifference(shipments.date_order, shipments.date_shipments) }}</td>
				<td class='center'>{{ shipments.difference }}</td>
				<td style='width:50px; word-break: break-all;' class='center active'  
					@click='openDocuments(shipments)' >
					{{ shipments.base }}
				</td>
				<td class='center'>{{ shipments.to_sklad ? 'Склад' : shipments.buyer ? shipments.buyer.name : 'нет'}}</td>
				<td class='center'>0</td>
				<td v-if='shipments.status == enumShipments[0]' class='work_operation center'>{{ shipments.status  }}</td>
				<td v-if='shipments.status == enumShipments[1]' class='delete_operation center'>{{ shipments.status  }}</td>
				<td v-if='shipments.status == enumShipments[2]' class='success_operation center'>{{ shipments.status  }}</td>
				<td v-if='shipments.status == enumShipments[3]' class='delete_operation center'>{{ shipments.status  }}</td>
				<td>{{ shipments.date_shipments }}</td>
				<td>{{ shipments?.sh_complit?.date_shipments_fakt }}</td>
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
			:key='key_modal_shipments'
			v-if='show_modal_shipments && selectShipments.id'
			:id_shipments='selectShipments.id'
			:shipment_sclad='shipment_sclad'
			@unmount_sh_complit='unmount_sh_complit'
			@unmount_shpment='unmount_shpment'
		/>
	</div>
</template>
<script>
import print from 'print-js';
import { random } from 'lodash';
import { showMessage } from '@/js/';
import { dateDifference } from '@/js/';
import { shipmentsNullOne } from '@/js/';
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
		shipment_sclad: {},
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

			arrShipmentsState: [],

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
					ignoreElements: ['complect', 'check'],
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
		...mapActions(['fetchDocumentsShipments', 'fetchAllShipmentsTo']),
		...mapMutations(['pusshAddShipments']),
		async unmount_shpment() {
			this.$emit('unmount');
			this.pusshAddShipments(this.arrShipmentsState);
		},
		unmount_sh_complit() {
			this.$emit('unmount_sh_complit');
		},
		shipmentsModal() {
			if(this.selectShipments) {
				this.arrShipmentsState = this.getShipments;
				this.key_modal_shipments = random(1, 999);
				this.show_modal_shipments = true;
			}
		},
		shipmentsNullOne(sh) {
			return shipmentsNullOne(sh);
		},
		toSelect(shipments, e) {
      this.tr = eSelectSpan(this.tr, e);
			this._select(shipments);
		},
    toSetShipments(shipments, e) {
      e.classList.toggle('checkbox_block_select');
      this._select(shipments);
      setTimeout(() => this.tr?.classList?.remove('td-row-all'), 0);
    },
    _select(shipments) {
      if(this.selectShipments && this.selectShipments.id == shipments.id);
				this.selectShipments = null;

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

			if(ships.documents && ships.documents.length) {
				for(let doc of ships.documents) {
					if(doc.name == shipments.base) {
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
</style>