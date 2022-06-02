<template>
<div class="right-menu-modal informat">
  <div :class='destroyModalLeft' @click="destroyModalF"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" > 
		<div>

		<ShipmentsHeader />

		<div id='tablebody'>
			<div>
				<div v-if='childrens && childrens.length && getOneShipments?.id'>
					<h4>Позиции по Счету: </h4>
					<TableShipments
						v-if='childrens.length'
						:fixed_table='"fixed_table_10"'
						:shipmentsArr='childrens'
						:cheked_show='true'
						:select_sh='getOneShipments?.id'
						@unmount_dbclick='unmount_dbclick'
						@unmount_sh='unmount_sh'
						:return_dbclick='true' 
						:no_set='true'
						:is_search="false"
					/>
					<ComplectIzd v-if='print_click' :list_cbed_detal='list_cbed_detal' />
				</div>

				<div v-if='shipment_sclad' id='tablebody_select'>
					<div v-if='selected_sh && selected_sh.length'>
						<h4>Выбранные на отгрузку	: </h4>
						<TableShipments
							:fixed_table='"fixed_table_10"'
							:shipmentsArr='selected_sh'
							:remove_show='true'
							:return_dbclick='true'
							@unmount_dbclick='unmount_dbclick'
							:select_sh='getOneShipments?.id'
							@unmount_sh_remove='unmount_sh_remove'
							:no_set='true'
							:is_search="false"
						/>
					</div>
					<ComplectIzd v-if='print_click' :list_cbed_detal='list_cbed_detal' />
				</div>

			</div>
		
		</div>

		<div class='table_block' v-if='!shipment_sclad'>
			<div>
				<h3>Комплектация изделия</h3>
				<table>
					<tr>
						<th>№</th>
						<th>Артикул</th>
						<th>Наименование СБ или детали</th>
						<th>Кол-во</th>
					</tr>
					<tr 
						v-for='(obj, inx) of list_cbed_detal' 
						:key='obj'
						class='td-row' @click='e => selectTr(inx, e.target.parentElement)'>
						<td class='center'>{{ inx + 1 }}</td>
						<td>{{ obj.obj?.articl }}</td>
						<td @click='showInformIzdel(obj.obj?.id, obj?.type)'>{{ obj.obj?.name }}</td>
						<td class='center'>
							<input 
								type="text" 
								:value='obj.kol'
								class='input_kol center'
								disabled>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div width='300px;' class='flex_direction'>
			<div>
				<h3>Примечание</h3>
				<textarea maxlength='250' v-model='getOneShipments.description' disabled></textarea>
			</div>
			<div class='file_content'>
			<h3>Документы</h3>
			<div v-if='this.getOneShipments.documents && this.getOneShipments.documents.length'>
				<table>
					<tr>
						<th>Файл</th>
					</tr>
					<tr v-for='fil of this.getOneShipments.documents' :key='fil' class='td-row' @click='setDocs(fil)'>
						<td>{{ fil.name }}</td>
					</tr>
				</table>
			</div>
		</div>
		</div>

		<div v-if='shipment_sclad && getOneShipments?.id'>

			<div class='btn-control'>
				<button class="btn-small btn-add" @click='openShipment'>Отгрузить</button>
			</div>
		</div>
		<div class='btn-control'>
			<button class="btn-small btn-add" @click='printPage("tablebody_select")' v-if='shipment_sclad'>Печать c выбранными</button>
			<button class="btn-small btn-add" @click='printPage("tablebody")'>Печать</button>
		</div>

		<h3>Информация об отгрузке</h3>
		<ShComplit v-if='sh_complit_id' :sh_complit_id='getOneShipments.sh_complit_id' :ship='getOneShipments' />
		<OpensFile
			:parametrs='itemFiles' 
			v-if="itemFiles" 
			:key='keyWhenModalGenerateFileOpen'
		/>
		<DetalModal
			:key='detalModalKey'
			v-if='parametrs_detal'
			:id='parametrs_detal'
		/>
		<CbedModalInfo
			:id='parametrs_cbed'
			:key='cbedModalKey'
			v-if='parametrs_cbed'
		/>
		<BaseFileModal 
			v-if='showModalFile'
			:key='fileModalKey'
			:fileArrModal='documentsData'
			@unmount='unmount_filemodal'
		/>
		<Shipment 
      v-if='showShipmentModal && getOneShipments'
      :key='shipmentKey'
			:selected_sh='selected_sh'
      @unmount='unmount_sh_complit'
    />
		<Loader v-if='loader' :description='"Загрузка Заказов"' />
		</div>
      
    </div>
  </div>
</div>
</template>
<script>
import print from 'print-js';
import { random } from 'lodash';
import { showMessage } from '@/js/';
import ShComplit from './ShComplit';
import ComplectIzd from './ComplectIzd';
import MixModal from '@/mixins/mixmodal';
import { eSelectSpan } from '@/js/methods';
import MixShipments from '@/mixins/shipments';
import { mapActions, mapGetters } from 'vuex';
import OpensFile from '@/components/FileBase/OpenFile';
import CbedModalInfo from '@/components/CbEd/CbedModal';
import DetalModal from '@/components/BaseDetal/DetalModal';
import BaseFileModal from '@/components/FileBase/BaseFilesModal';
import Shipment from '@/components/Sclad/IssueToPull/ShComlitModal';
import ShipmentsHeader from '@/components/IssueShipment/ShipmentsHeader';

export default {
  props: {
		id_shipments: {},
		shipment_sclad: {
			type: Boolean
		}
	},
  data() {
    return {
			keyWhenModalGenerate: random(1, 999),
			keyWhenModalGenerateFileOpen: random(1, 999),

			select_tr_inx: null,
			tr: null,
			formData: new FormData,
			baseFormData: new FormData,
			itemFiles: null,

			detalModalKey: random(1, 999),
			parametrs_detal: false,
			parametrs_cbed: null,
			cbedModalKey: random(1, 999),
			documentsData: [],

			is_not_product: false,

			showShipmentModal: false,
      shipmentKey: random(1, 999),

			showModalFile: false,
      fileModalKey: random(1, 999),
			selectedBaseProvesses: false,

			loader: false,
			selected_sh: [],
			print_click: false,
    }
  },
	beforeCreate() {
    this.$options.components.TableShipments = require('@/components/IssueShipment/TableKomplect').default;
  },
	mixins: [MixShipments, MixModal],
	computed: mapGetters(['getOneShipments']),
	components: {
		OpensFile,
		DetalModal,
		CbedModalInfo,
		BaseFileModal,
		Shipment,
		ShComplit,
		ComplectIzd,
		ShipmentsHeader
	},
	methods: {
		...mapActions(['fetchAllBuyers', 'fetchAllShipmentsTo']),
		unmount_dbclick(id) {
			this.childrenSord(id);
			this.editVariable();
		},
		unmount_sh(sh) {
			if (sh.status === "Отгружено") return showMessage('', 'Задача уже отгружена!', 'w');
			for (const item of this.selected_sh) {
				if (item.id == sh.id) return showMessage('', 'Задача уже выбранная', 'w');
			}
			this.selected_sh.push(sh);
		},
		unmount_sh_remove(sh) {
			this.selected_sh = this.selected_sh.filter(el => el.id != sh.id);
		},
		async unmount_sh_complit(is_true) {
			this.loader = true;
			if (is_true) {
				for (const item of this.selected_sh) {
					item.status = 'Отгружено';
				}
			} else this.$emit('unmount_sh_complit');
			this.loader = false;
		},
		printPage(id_name) {
			this.print_click = true;
			setTimeout(() => {
				print({
					printable: id_name,
					type: 'html',
					targetStyles: ['*'],
					documentTitle: 'Комплектация заказа',
					ignoreElements: ['complect', 'check', 'description'],
					font_size: '10pt',
					maxWidth: '10%'
				});
			})
			setTimeout(() => this.print_click = false, 1000);
    },
		setDocs(dc) {
      this.itemFiles = dc;
      this.keyWhenModalGenerateFileOpen = random(10, 999);
    },
		selectTr(inx, e) {
			if (this.select_tr_inx == inx && this.tr) 
				return this.select_tr_inx = null;

			this.tr = eSelectSpan(this.tr, e);
			this.select_tr_inx = inx;
		},
		showInformIzdel(id, type) {
			if(type == 'cbed') {
				if(id) {
					this.parametrs_cbed = id;
					this.cbedModalKey = random(1, 999);
				}
			}
			if (type == 'detal') {
				if (id) {
					this.parametrs_detal = id;
					this.detalModalKey = random(1, 999);
				}
			}
		},
		openShipment() {
      this.showShipmentModal = true;
      this.shipmentKey = random(1, 999);
    },
	},
  async mounted() {
		this.loader = true;

		try {
			if (!this.id_shipments) return this.destroyModalF('unmount_shpment');
			await this.childrenSord(this.id_shipments);
			this.editVariable();

		} catch (err) { console.error(err, 'shipments modal mounted') }

		this.loader = false;
		
  },
}
</script>

<style scoped>
.buyer_select {
	width: fit-content;
}
.file_content {
	width: 500px;
	padding: 40px;
}
table {
	width: 100%;
}
select {
	width: 100px;
}
label {
	margin:0px;
	padding: 0px;
	color: black;
	font-weight: bold;
	margin-left: 5px;
	font-size: 15px;
	cursor: pointer;
	user-select: none;
}

textarea {
	height: 140px;
}
.p_flex {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-wrap: wrap;
}

.p_flex>* {
	margin-top: 5px;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  height: 100vh;
  width: 90%;
}
.left-block-modal {
  width: 10%;
  height: 10000px;
  animation: width-right 1s 1 ease;
}
.left-block-modal-hidden {
  animation: width-right-replace 1s 1 ease;
}
.content-modal-right-menu>div {
  animation: hidden-content 1s 1 ease;
}
@keyframes width {
  from {
    width: 1%;
  }
  to {
    width: 90%;
  }
}
@keyframes width-right {
  from {
    width: 0%;
  }
  to {
    width: 10%;
  }
}
@keyframes hidden-content {
  from {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  90% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
@keyframes width-replace {
  from {
    width: 10vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 90vw;
  }
  to {
    width: 0vw;
  }
}
@keyframes hidden-content-replace {
  from {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
</style>