<template>
	<div class="table-scroll">
		<table> 
			<tr class='fixed_table_85'>
        <th style='cursor: pointer;'>
          <unicon name="check" fill="royalblue" />
        </th> 
				<th>Заказ</th>
				<th>Артикул изделия</th>
				<th>Наименование изделия</th>
				<th style='width:100px; word-break: break-all;'>Комплектация/особенности заказа</th>
				<th>Кол-во, шт.</th>
				<th>Кол-во, дней</th>
				<th>Осталось дней</th>
				<th style='width:50px;'>Основание</th>
				<th>Покупатель</th> 
				<th>Готовность к отгрузки в %</th>
				<th>Статус</th>
				<th>Дата отгрузки</th>
				<th>Примечание</th>
			</tr>
			<tr v-for='shipments of shipmentsArr'
				:key='shipments'
				class='td-row'
				@click='e => toSelect(shipments, e.target.parentElement)'
				@dblclick="shipmentsModal">
        <td>
          <div class='center_block checkbox_parent' style='border: none; border-bottom: 1px solid #e4e4e4ce'>
            <p class="checkbox_block" @click='e => toSetShipments(shipments, e.target)'></p>
          </div>
        </td>
				<td>{{ shipments.number_order }}</td>
				<td>{{ shipments.product ? shipments.product.articl : 'Нет Изделия' }}</td>
				<td>{{ shipments.product ? shipments.product.name : 'Нет Изделия' }}</td>
				<td class='center' @click='openComplectation(shipments.list_cbed_detal)' >
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
				<td></td>
				<td v-if='shipments.status == enumShipments[0]' class='work_operation center'>{{ shipments.status  }}</td>
				<td v-if='shipments.status == enumShipments[1]' class='delete_operation center'>{{ shipments.status  }}</td>
				<td v-if='shipments.status == enumShipments[2]' class='work_operation center'>{{ shipments.status  }}</td>
				<td v-if='shipments.status == enumShipments[3]' class='success_operation center'>{{ shipments.status  }}</td>
				<td v-if='shipments.status == enumShipments[4]' class='delete_operation center'>{{ shipments.status  }}</td>
				<td>{{ shipments.date_shipments }}</td>
				<td class='center'>
					<img src="@/assets/img/link.jpg" @click='openDescription(shipments.description)' class='link_img' atl='Показать' />
				</td>
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
		<InformFolder
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
		<KomplectModal
			v-if='parametrs_komplect'
			:key='komplect_generate_key'
			:parametrs='parametrs_komplect'
		/>
		<ShipmentsModal 
			:key='key_modal_shipments'
			v-if='show_modal_shipments && selectShipments.id'
			:id_shipments='selectShipments.id'
			@unmount_shpment='unmount_shpment'
		/>
	</div>
</template>
<script>
import {random} from 'lodash';
import { showMessage } from '@/js/';
import { dateDifference } from '@/js/';
import { dateIncrementHors } from '@/js/';
import { eSelectSpan } from '@/js/methods';
import KomplectModal from './komplect-modal';
import ShipmentsModal from './shipments-modal';
import OpensFile from '@/components/filebase/openfile';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import DescriptionModal from '@/components/description-modal';

export default {
	props: ['shipmentsArr'],
	data() {
		return {
			selectShipments: null,
			tr: null,
			message: '',
      type: '',
      keyInformTip: random(1, 999),

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
				'Выполняется',
				'Отгружено',
				'Просрочено'
			],
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
		...mapMutations(['pusshAddShipments']),
		unmount_shpment() {
			this.pusshAddShipments(this.arrShipmentsState);
		},	
		shipmentsModal() {
			if(this.selectShipments) {
				this.arrShipmentsState = this.getShipments;
				this.key_modal_shipments = random(1, 999);
				this.show_modal_shipments = true;
			}
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
      if(this.selectShipments && this.selectShipments.id == shipments.id) ;
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
      let dat = dateIncrementHors(date, day*24);
      return `${dat.day}.${dat.mount}.${dat.year}`;
    },
		dateDifference(date1, date2) {
			return dateDifference(date1, date2);
		},
		openComplectation(komplect) {
			this.komplect_generate_key = random(1, 999);
			this.parametrs_komplect = komplect;
		},	
		async openDocuments(shipments) {	
			if(!shipments.id) return showMessage('', 'Документов нет', 'w', this);
			const ships = await this.fetchDocumentsShipments(shipments.id);

			if(ships.documents && ships.documents.length) {
				for(let doc of ships.documents) {
					if(doc.name == shipments.base) {
						this.keyWhenModalGenerateFileOpen = random(1, 999);
						this.itemFiles = [doc];
					}
				}
			} else showMessage('', 'Документов нет', 'w', this);
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