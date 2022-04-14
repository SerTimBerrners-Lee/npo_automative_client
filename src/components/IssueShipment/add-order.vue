<template>
	<div>
		<h4 v-if='Number(this.$route.params.parent)'>Прикрепить к заказу</h4>	
		<TableShipments  
			v-if='(getParentsShipments.length && Number(this.$route.params.parent))'
			:shipmentsArr='getParentsShipments'
			:no_set='true'/>

		<div v-if='childrens.length'>
			<h4>Остальные заказы</h4>
			<TableShipments  
				v-if='childrens.length'
				:shipmentsArr='childrens'
				:no_set='true' />
		</div>

		<h3>{{ $route.params?.edit == 'true' ? 'Изменить' : 'Создать'}} заказ {{ number_order }}</h3>
		<div class="block">
			<p class='p_flex'> 
				<span>Дата заказа:</span>
				<DatePicterCustom 
					@unmount='changeDatePicter' 
					:dateStart='date_order'
					/>
				<span>Выбрать изделие: </span>
				<span 
					v-if='select_product && !is_not_product' 
					class='select_span_href' @click='openIzd(select_product)'>{{ sliceName(select_product.name) }}</span>
				<button 
					class="btn-small btn-add" 
					@click='selectProduct' 
					:disabled='is_not_product'>Выбрать</button>
				<label for='is_not_product'>Заказ без изделия:</label>
				<input id='is_not_product' type="checkbox" v-model='is_not_product'>
				<span>Количество:</span>
				<input type="number" min='1' v-model='kol' :disabled='is_not_product'>
			</p>
			<p class='p_flex'>
				<span>Дата отгрузки:</span>
				<DatePicterCustom 
					@unmount='changeDatePicterShipments' 
					:dateStart='date_shipments'
				/>
				<label for='bran'>Бронь:</label>
				<input id='bran' type="checkbox" v-model='bron'>

				<label for='file_folder' class='hover' v-if='!to_sklad'>Основание:</label>
				<input id='file_folder' type="file" hidden @change="e => addDock(e.target, true)">
				<span class='active' style='margin-left: 20px; margin-right: 20px;'>{{ base }}</span>
				
				<span
					class='hover'
					@click='selectBuyer'>Покупатель:</span>
				<select 
					class="select-small" 
					v-model='buyer'
					:disabled='to_sklad'>
					<option v-for='buyer in allBuyer' 
						:key='buyer'
						:value="buyer.id">{{ buyer.name }}</option>
				</select>
				<span>
					<label for='to_sklad'>На склад:</label>
					<input id='to_sklad' type="checkbox" v-model='to_sklad'>
				</span>
			</p>
		</div>

		<div class='table_block'>
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
						<td>{{ inx + 1 }}</td>
						<td>{{ obj.obj.articl }}</td>
						<td @click='showInformIzdel(obj.obj.id, obj.type)'>{{ obj.obj.name }}</td>
						<td class='center'>
							<input 
								type="text" 
								:value='obj.kol'
								class='input_kol center' 
								@change="e => editKolVo(inx, e.target.value)">
						</td>
					</tr>
				</table>
				<div class="btn-control">
					<button class="btn-small" @click='deleteCbEdDetal'>Удалить</button>
					<button class="btn-small" @click='addCbEdDetal'>Добавить СБ/деталь</button>
				</div>
			</div>
			<div>
				<h3>Примечание</h3>
				<textarea maxlength='250' v-model='description'></textarea>
			</div>
			<div class='file_content'>
				<h3>Документы</h3>
				<div v-if='documents.length'>
					<table>
						<tr>
							<th>Файл</th>
						</tr>
						<tr v-for='fil of documents' :key='fil' class='td-row' @click='setDocs(fil)'>
							<td>{{ fil.name }}</td>
						</tr>
					</table>
				</div>
				<div style='height: 50px;'>
					<FileLoader 
						:typeGetFile='"getfile"'
						@unmount='file_unmount'/>
					<div class="btn-control" style='margin-top: 20px;'>
						<button class="btn-small" @click='addFileModalBase' >Добавить основание из базы</button>
						<button class="btn-small" @click='addFileModal' >Добавить из базы</button>
					</div>
				</div>
			</div>
		</div>

		<PrintComplect 
			v-if='tablebody'
			:shipments='getOneShipments'
			:childrens='childrens'
			:key='new Date().getTime()' /> 

		<div class="btn-control out-btn-control">
			<button 
				class="btn-status" 
				style="height: 0px;"
				@click="printPage()">
				Печать 
			</button>
			<button 
				class="btn-status" 
				style="height: 0px;"
				@click="$router.back()">
				Отменить 
			</button>
				<button 
				class="btn-status" 
				style="height: 0px;"
				@click="addNewPositionProduct">
				Добавить новое изделие к заказу
			</button>
			<button 
				class="btn-status btn-black" 
				style="height: 0px;"
				@click='save_order'>
				Сохранить Заказ
			</button>
		</div>

	<ProductList 
		v-if='showProduct'
		:key='keyProductModal'
		@unmount='unmount_product'
	/>
	<BaseProductModal
		v-if='showModalDetalCb'
		:key='keyModalDetalCb'
		:enum='"two"'
		@responsDetal='responseDetalCb'
  />
	<ProductModalInfo
		:id='parametrs_product'
		:key='productModalKey'
		v-if='parametrs_product'
	/>
	<AddFile 
		:parametrs='docFiles' 
		v-if="isChangeFolderFile" 
		@unmount='unmount_base'
		:typeGetFile='"getfile"'
		:key='keyWhenModalGenerate' />
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
	<BaseBuyer 
		:key='keyGenerateBuyer'
		v-if='showBuyer'
		@unmount='unmount_buyer'/>
		<BaseFileModal 
      v-if='showModalFile'
      :key='fileModalKey'
      :fileArrModal='documentsData'
      @unmount='unmount_filemodal'
    />
	<Loader v-if='loader' />
	</div>
</template>

<script>
import { showMessage } from '@/js/';
import { random, isEmpty } from 'lodash';
import { sliceName,
				eSelectSpan, 
				getBuyerFilter } from '@/js/methods';
import PrintComplect from './print_complect';
import AddFile from '@/components/FileBase/addfile';
import OpensFile from '@/components/FileBase/openfile';
import DatePicterCustom from '@/components/date-picter';
import CbedModalInfo from '@/components/CbEd/cbed-modal';
import BaseBuyer from '@/components/BaseBuyer/list-buyer';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import DetalModal from '@/components/BaseDetal/detal-modal';
import BaseFileModal from '@/components/FileBase/base-files-modal';
import ProductList from '@/components/BaseProduct/all-product-modal';
import ProductModalInfo from '@/components/BaseProduct/product-modal';
import TableShipments from '@/components/IssueShipment/table-komplect';
import BaseProductModal from '@/components/BaseProduct/base-product-all-modal';

export default {
	data() {
		return{
			showProduct: false,
			keyProductModal: random(1, 999),

			showModalDetalCb: false,
      keyModalDetalCb: random(1, 999),
			isChangeFolderFile: false, 
			keyWhenModalGenerate: random(1, 999),
			keyWhenModalGenerateFileOpen: random(1, 999),
			
			loader: false,

			select_tr_inx: null,
			tr: null,
			formData: new FormData,
			baseFormData: new FormData,
			docFiles: [],
			documents: [],
			itemFiles: null,

			detalModalKey: random(1, 999),
			parametrs_detal: false,
			parametrs_cbed: null,
			cbedModalKey: random(1, 999),
			showBuyer: false, 
			keyGenerateBuyer: random(1, 999),
			documentsData: [],
			
			date_order: new Date().toLocaleDateString("ru-RU"),
			date_shipments: new Date().toLocaleDateString("ru-RU"),
			kol: 1,
			bron: false,
			base: '',
			buyer: 0,
			to_sklad: false,
			select_product: null,
			description: '',
			list_cbed_detal: [],
			list_hidden_cbed_detal: [],
			is_not_product: false,
			parametrs_product: false,
			productModalKey: random(1, 999),

			number_order: null,

			showModalFile: false,
      fileModalKey: random(1, 999),
			selectedBaseProvesses: false,

			tablebody: false,
			childrens: []
		}
	},
	watch: {
		kol: function(znach) {
			if(!this.select_product) return 0;
			this.list_cbed_detal = [];
			this.list_hidden_cbed_detal = [];
			for(let inx = 0; inx < znach; inx++) {
				this.checkedJsonList(this.select_product);
			}
		},	
	},
	computed: mapGetters([	
		'allBuyer', 	
		'getOneShipments', 	
		'getShipments',
		'getParentsShipments'	
	]),
	components: {
			DatePicterCustom, 
			ProductList, 
			BaseProductModal, 
			AddFile,
			OpensFile,
			DetalModal,
			CbedModalInfo,
			TableShipments,
			BaseBuyer,
			BaseFileModal,
			ProductModalInfo,
			PrintComplect
	},
	updated() {
		if (!this.getOneShipments) return false;
	},
	methods: {
		...mapActions([
			'fetchCreateShipments', 
			'fetchAllBuyers', 
			'getOneCbEdById', 
			'getOneDetal',
			'getAllProductByIdLight',
			'fetchUpdateShipments',
			'getOneCbEdById',
			'fetchAllShipmentsTo',
			'fetchAllShipmentsById',
			'fetchIncludesFolderSh'
		]),
		...mapMutations([
			'setOneShipment',
			'addOneSelectDetal',
			'filterToParentShipments',
		]),
		unmount_buyer(buyer) {
			if(buyer) this.buyer = buyer.id;
		},
		unmount_base(e) {
			if(!e) return false;
			const document = e.formData.getAll('document')[0];
			this.baseFormData = new FormData;
			this.baseFormData.append('document', document);
			this.base = document.name;
			try {	
				const docs = JSON.parse(e.formData.get('docs'));
				this.baseFormData.append('docs', JSON.stringify(docs[0]));
			} catch(e) {console.error(e)}
		},
		file_unmount(e) {
			if(!e) return 0;
			this.formData = e.formData;

			for(let doc of e.formData.getAll('document')) {
				this.docFiles.push(doc);
				this.documents.push(doc); 
			}
		},
		unmount_filemodal(res) {
      if(res && !this.selectedBaseProvesses) {
				res.forEach((doc) => this.documents.push(doc));
			} else if(this.selectedBaseProvesses) {
				this.documents.push(res[0]);
				this.base = res[0].name;
				this.selectedBaseProvesses = false;
			}
    },
		printPage() {
			this.getOneShipments.buyer_name = getBuyerFilter(this.getOneShipments?.buyer?.id);
			this.tablebody = true;
			setTimeout(() => this.tablebody = false, 4000);
    },
		addFileModal() {
      this.fileModalKey = random(1, 999);
      this.showModalFile = true;
    },
		addFileModalBase() {
			this.addFileModal();
			this.selectedBaseProvesses = true;
		},
		selectBuyer() {
			this.showBuyer = true;
			this.keyGenerateBuyer = random(1, 999);
		},
		addNewPositionProduct() {
			if(this.$route.params.edit != 'true') return showMessage('', 'Сначала сохраните заказ', 'w');
			if(this.getOneShipments && this.getOneShipments.id) {
				this.$router.push(`/addorder/false/${this.getOneShipments.id}`);
				this.filterToParentShipments(this.getOneShipments.id);
			}
			else return showMessage('', 'Выберите заказ к которому хотите присвоить изделие', 'w');
		},
		addDock(val, base = false) {
			if(base && this.base) {
				this.docFiles = this.docFiles
					.filter(doc => doc.name != this.base.name);
				this.documents = this.documents
					.filter(doc => doc.name != this.base.name);
			}

      val.files.forEach(f => {
        this.docFiles.push(f)
				this.documents.push(f)
      });
      this.keyWhenModalGenerate = random(10, 999);
      this.isChangeFolderFile = true;
    },
		addCbEdDetal() {
			this.showModalDetalCb = true;
			this.keyModalDetalCb = random(1, 999);
		},
		changeDatePicter(date) {
			this.date_order = date;
		},
		changeDatePicterShipments(date) {
			this.date_shipments = date;
		},
		selectProduct() {
			this.kol = 1;
			this.showProduct = true;
			this.keyProductModal = random(1, 999);
		},
		unmount_product(product) {
			if(!product) return 0;
			this.list_cbed_detal = [];
			this.list_hidden_cbed_detal = [];
			
			this.select_product = product;
			this.checkedJsonList(product);
		},
		setDocs(dc) {
      this.itemFiles = dc;
      this.keyWhenModalGenerateFileOpen = random(10, 999);
    },
		async checkedJsonList(izd, recursive = false) {
			if(izd.listCbed) {
				const list_cbed = JSON.parse(izd.listCbed)
				if(!izd.cbeds) izd.cbeds = list_cbed.map(el => el.cb)
				this.pushElement(izd.cbeds, list_cbed, 'cbed', recursive)
				for(const cb of list_cbed) {
					const res = await this.getOneCbEdById(cb.cb.id);
					if (res) this.parserListIzd(res, cb.kol);
				}
			}
			if(izd.detals && izd.detals.length && izd.listDetal) {
				const list_detals = JSON.parse(izd.listDetal);
				this.pushElement(izd.detals, list_detals, 'detal', recursive);
				for(let det of list_detals ) {
					const res = await this.getOneDetal(det.det.id);
					if (res) this.checkedJsonList(res);
				}
			}
		},
		pushElement(elements, list_pars, type, recursive = false) {
			for(let element of elements) {
				let kol = 1;
				for(let item of list_pars) {
					let id;
					switch(type) {
						case 'cbed':
							id = item.cb.id;
							break;
						case 'detal':
							id = item.det.id
							break;
					}
					if(id == element.id)
						kol = Number(item.kol)
				}
				if(type != 'mat')  {
					let check = true
					for(let iz = 0; iz < this.list_cbed_detal.length; iz++) {
						if(element.id == this.list_cbed_detal[iz].obj.id && element.name == this.list_cbed_detal[iz].obj.name) {
							this.list_cbed_detal[iz].kol = Number(this.list_cbed_detal[iz].kol) + Number(kol)
							check = false
						}	
					}
					if(check) {
						if(!recursive)
							this.list_cbed_detal.push({
								type,
								obj: {id: element.id, name: element.name,  articl: element.articl},
								kol: Number(kol)
							})
						else {
							element.obj = {id: element.id}
							element.type = type
							const check_dublecate = this.checkDublecate(this.list_hidden_cbed_detal, element)
							if(check_dublecate != null) 
								this.list_hidden_cbed_detal[check_dublecate].kol = Number(this.list_hidden_cbed_detal[check_dublecate].kol) + Number(kol)
							else 
								this.list_hidden_cbed_detal.push({
									type,
									obj: {id: element.id, name: element.name,  articl: element.articl},
									kol: Number(kol)
								})
						}
					} else check = true;
				}
			}
		},
		/**
		 * Парсит комплектацию СБ или Д
		 */
		parserListIzd(res, kol) {
			try {
				const cbeds = res.listCbed ? JSON.parse(res.listCbed) : [];
				const detals = res.listDetal ? JSON.parse(res.listDetal) : [];
				if(cbeds.length) {
					for(let inx in cbeds) {
						cbeds[inx] = cbeds[inx].cb;
						if(res.articl) cbeds[inx].articl = res.articl;
					}
				}
				if(detals.length) {
					for(let inx in detals) {
						detals[inx] = detals[inx].det;
						if(res.articl) detals[inx].articl = res.articl;
					}
				}
				for(let i = 0; i < kol; i++) 
					this.checkedJsonList({...res, cbeds, detals}, true);
			} catch(e) {console.error(e)}
		},
		/**
		 * Добавляем СБ или Д
		 */
		responseDetalCb(res) {
			if(res && res.type == 'cbed') 
				this.parserListIzd(res.obj, 1)
		
			const check_dublecate = this.checkDublecate(this.list_cbed_detal, res)
			if(check_dublecate != null) {
				this.list_cbed_detal[check_dublecate].kol = Number(this.list_cbed_detal[check_dublecate].kol)
				this.list_cbed_detal[check_dublecate].kol++
			}
			this.list_cbed_detal.push({
				...res, 
				obj: {id: res.obj.id, name: res.obj.name, articl: res.obj.articl},
				kol: 1
			})
		},
		/**
		 * Осуществляем проверку на дублирование
		 */
		checkDublecate(arr, res) {
			for(let inx in arr) {
				if(arr[inx].obj.id == res.obj.id && arr[inx].type == res.type) return inx;
			}
			return null;
		},	
		// ТО DO: Изменение работает только для определенного элемента на детей оно не распростроняется!!!
		editKolVo(inx, val) {
			this.list_cbed_detal[inx].kol = Number(val);
		},
		deleteCbEdDetal() {
			if(this.select_tr_inx == null) return 0;

			this.list_cbed_detal = this.list_cbed_detal.filter((_, inx) => 
				inx != this.select_tr_inx
			);
			this.select_tr_inx = null;
		},
		selectTr(inx, e) {
			if(this.select_tr_inx == inx && this.tr) {
				this.tr.classList.remove('td-row-all');
				return this.select_tr_inx = null;
			}

			this.tr = eSelectSpan(this.tr, e);
			this.select_tr_inx = inx;
		},
		save_order() {
			if(!this.is_not_product && !this.select_product)
					return showMessage('', 'Выберите Изделие', 'w');
			
			if(!this.buyer && !this.to_sklad) return showMessage('', 'Выберите Покупателя или склад', 'w')
			this.loader = true
			const data = {
				date_order: this.date_order,
				date_shipments: this.date_shipments,
				kol: this.kol,
				bron: this.bron,
				base: this.base,
				buyer: this.buyer,
				to_sklad: this.to_sklad,
				is_not_product: this.is_not_product,
				description: this.description,
				list_cbed_detal: JSON.stringify(this.list_cbed_detal),
				list_hidden_cbed_detal: JSON.stringify(this.list_hidden_cbed_detal)
			}

			if(this.documentsData.length) {
				const new_arr = [];
				for(const dat of this.documentsData) {
					new_arr.push(dat.id);
				}
				data['documentsData'] = JSON.stringify(new_arr);
			}

			if(this.select_product) {
				data['product'] = {
					id: this.select_product.id,
					name: this.select_product.name
				}
			}
			if(this.baseFormData.get('document') && this.baseFormData.get('docs') ) {
				this.formData.append('document', this.baseFormData.get('document'));
				try {
					let pars = JSON.parse(this.baseFormData.get('docs')) ;
					this.formData.append('docs', JSON.stringify([pars]));
					
				} catch(e) {console.error(e)}
			}
			
			if(this.$route.params.edit && this.$route.params.edit == 'true') {
				data['id'] = this.getOneShipments.id
				this.formData.append('data', JSON.stringify(data))
				this.fetchUpdateShipments(this.formData).then( res => {
					this.loader = false
					setTimeout(() => this.$router.push('/issueshipment'), 3000)
					if(res) return showMessage('', 'Заказ успешно обновлен!, Перенаправление на страницу заказов.', 's')
					else return showMessage('', 'Произошла ошибка при создании заказа', 'e')
				})
			} else {
				if(Number(this.$route.params.parent)) data['parent_id'] = Number(this.$route.params.parent);
				this.formData.append('data', JSON.stringify(data));
				this.fetchCreateShipments(this.formData).then(res => {
					this.loader = false;
					setTimeout(() => this.$router.push('/issueshipment'), 3000);
					if(res) return showMessage('', 'Заказ успешно создан!, Перенаправление на страницу заказов.', 's');
					else return showMessage('', 'Произошла ошибка при создании заказа', 'e');
				})
			}
		},
		async editVariable() {
			this.date_order = this.getOneShipments.date_order;
			this.date_shipments = this.getOneShipments.date_shipments;
			this.kol = this.getOneShipments.kol;
			this.bron = this.getOneShipments.bron;
			this.base = this.getOneShipments.base;
			this.buyer = this.getOneShipments.buyer?.id;
			this.to_sklad = this.getOneShipments.to_sklad;
			this.number_order = this.getOneShipments.number_order;

			if(this.getOneShipments.productId) {
				const res = await this.getAllProductByIdLight(this.getOneShipments.productId);
				if (res) this.select_product = res;
			} else this.is_not_product = true;
			if(this.getOneShipments.documents) this.documents = this.getOneShipments.documents;
			try {
				if(this.getOneShipments.list_cbed_detal)
					this.list_cbed_detal = JSON.parse(this.getOneShipments.list_cbed_detal);
				if(this.getOneShipments.list_hidden_cbed_detal)
					this.list_hidden_cbed_detal = JSON.parse(this.getOneShipments.list_hidden_cbed_detal);
			} catch(e) {console.error(e)}
			this.description = this.getOneShipments.description;
		},
		showInformIzdel(id, type) {
			if(type == 'cbed') {
				if(id) {
					this.parametrs_cbed = id;
					this.cbedModalKey = random(1, 999);
				}
			}
			if(type == 'detal') {
				if(id) {
					this.parametrs_detal = id;
					this.detalModalKey = random(1, 999);
				}
			}
		},
		openIzd(izd) {
			if (!izd || !izd.id) return false;
			this.parametrs_product = izd.id;
      this.productModalKey = random(1, 999);
		},
		sliceName(str) {
			return sliceName(str, 32);
		},
	},
	async mounted() {
		this.fetchAllBuyers(true);
		await this.fetchAllShipmentsTo();

		this.list_cbed_detal = [];
		this.list_hidden_cbed_detal = [];

		if(this.$route.params.edit && this.$route.params.edit == 'true') {
			if(isEmpty(this.getOneShipments)) return this.$router.back();
			const shipments = await this.fetchAllShipmentsById({id: this.getOneShipments.id, light: true});
			if(!shipments) return this.$router.back();
			this.setOneShipment(shipments);
			this.editVariable();

			const ship_id_for_children = shipments.parent_id || shipments.id;

			const childrens = await this.fetchIncludesFolderSh({ id: ship_id_for_children, folder: 'childrens' });
			if (childrens && childrens.childrens) this.childrens = childrens.childrens.filter(el => el.id !== shipments.id);

		} else if(Number(this.$route.params.parent)) this.filterToParentShipments(Number(this.$route.params.parent));
	}
}
</script>
<style scoped>
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
.input_kol {
	width: 20px;
}
.block p * {
	margin-left: 5px;
}
.block p input[type='text'], .block p input[type='number'] {
	width: 60px;
}
.table_block {
	display: flex;
}
.table_block div {
	margin: 10px;
}
textarea {
	height: 140px;
}
.out-btn-control{
  position: fixed;
  width: 85%;
  bottom: 10px;
}
.p_flex {
	display: flex;
	align-items: center;
}
.table_inform th {
	width: 200px;
}
</style>