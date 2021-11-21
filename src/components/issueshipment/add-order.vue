<template>
	<div>
		<h3>Создать заказ</h3>
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
					class='select_span_href'>{{ select_product.name }}</span>
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
				<label for='file_folder' class='hover'>Основание:</label>
				<input id='file_folder' type="file" hidden @change="e => addDock(e.target, true)">
				<span class='active' style='margin-left: 20px; margin-right: 20px;'>{{ base }}</span>
				<span>Покупатель:</span>
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
						<th>Наименование СБ или детали</th>
						<th>Кол-во</th>
					</tr>
					<tr 
						v-for='(obj, inx) of list_cbed_detal' 
						:key='obj'
						class='td-row' @click='e => selectTr(inx, e.target.parentElement)'>
						<td>{{ inx + 1 }}</td>
						<td>{{ obj.obj.name }}</td>
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
				</div>
			</div>
		</div>
		<div class="btn-control out-btn-control">
			<button 
				class="btn-status" 
				style="height: 0px;"
				@click="$router.push('/issueshipment')">
				Отменить 
			</button>
				<button 
				class="btn-status" 
				style="height: 0px;"
				@click="$router.push('/issueshipment')">
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
	<InformFolder  
		:title='titleMessage'
		:message = 'message'
		:type = 'type'
		v-if='message'
		:key='keyInformTip'
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
	<Loader v-if='loader' />
	</div>
</template>

<script>
import DatePicterCustom from '@/components/date-picter.vue';
import OpensFile from '@/components/filebase/openfile.vue';
import ProductList from '@/components/baseproduct/all-product-modal.vue';
import BaseProductModal from '@/components/baseproduct/base-product-all-modal.vue';
import AddFile from '@/components/filebase/addfile.vue';
import {showMessage} from '@/js/';
import {mapActions, mapGetters} from 'vuex';
import {random, isEmpty} from 'lodash';
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

			titleMessage: '',
      message: '',
      type: '',
      keyInformTip: 0,
			loader: false,

			select_tr_inx: null,
			tr: null,
			formData: new FormData,
			baseFormData: new FormData,
			docFiles: [],
			documents: [],
			itemFiles: null,
			
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
			is_not_product: false
		}
	},
	watch: {
		kol: function(znach) {
			if(!this.select_product) return 0 
			this.list_cbed_detal = []
			for(let inx = 0; inx < znach; inx++) {
				this.checkedJsonList(this.select_product)
			}
		},	
	},
	computed: mapGetters(['allBuyer', 'getOneShipments']),
	components: {
			DatePicterCustom, 
			ProductList, 
			BaseProductModal, 
			AddFile,
			OpensFile,
	},
	methods: {
		...mapActions([
			'fetchCreateShipments', 
			'fetchAllBuyers', 
			'getOneCbEdById', 
			'getOneDetal',
			'getAllProductByIdLight',
			'fetchUpdateShipments'
		]),
		unmount_base(e) {
			if(!e) return false
			const document = e.formData.getAll('document')[0]
			this.baseFormData = new FormData
			this.baseFormData.append('document', document)
			this.base = document.name
			try {	
				const docs = JSON.parse(e.formData.get('docs'))
				this.baseFormData.append('docs', JSON.stringify(docs[0]))
			} catch(e) {console.error(e)}
		},
		file_unmount(e) {
			if(!e) return 0
			this.formData = e.formData
			for(let doc of e.formData.getAll('document')) {
				this.docFiles.push(doc)
				this.documents.push(doc)
			}
		},
		addDock(val, base = false) {
			if(base && this.base) {
				this.docFiles = this.docFiles.filter(doc => doc.name != this.base.name)
				this.documents = this.documents.filter(doc => doc.name != this.base.name)
			}
      val.files.forEach(f => {
        this.docFiles.push(f)
				this.documents.push(f)
      })
      this.keyWhenModalGenerate = random(10, 999)
      this.isChangeFolderFile = true
    },
		addCbEdDetal() {
			this.showModalDetalCb = true;
			this.keyModalDetalCb = random(1, 999)
		},
		changeDatePicter(date) {
			this.date_order = date
		},
		changeDatePicterShipments(date) {
			this.date_shipments = date
		},
		selectProduct() {
			this.showProduct = true,
			this.keyProductModal = random(1, 999)
		},
		unmount_product(product) {
			if(!product) return 0
			this.list_cbed_detal = []
			
			this.select_product = product
			this.checkedJsonList(product)
		},
		setDocs(dc) {
      this.itemFiles = dc
      this.keyWhenModalGenerateFileOpen = random(10, 999)
    },
		checkedJsonList(izd) {
			if(izd.cbeds && izd.cbeds.length && izd.listCbed) {
				let list_cbed = JSON.parse(izd.listCbed)
				this.pushElement(izd.cbeds, list_cbed, 'cbed')
				for(let cb of list_cbed) {
					this.getOneCbEdById(cb.cb.id).then(res => this.parserListIzd(res, cb.kol))
				}
			}

			if(izd.detals && izd.detals.length && izd.listDetal) {
				let list_detals = JSON.parse(izd.listDetal)
				this.pushElement(izd.detals, list_detals, 'detal')
				for(let det of list_detals ) {
					this.getOneDetal(det.det.id).then(res => {
						for(let i = 0; i < det.kol; i++) {
							let mat_true = false
							let material_find
							for(let material of res.materials) {
								if(material.id == res.mat_zag) {
									mat_true = true
									material_find = material
								}
							}
							if(mat_true) {
								let parse_str
								if(res.materialList) {
									parse_str = JSON.parse(res.materialList)
									parse_str.push({art: 1, mat: {id: material_find.id, name: material_find.name }, kol: 1})
									parse_str = JSON.stringify(parse_str)
								} else
										parse_str = JSON.stringify([{art: 1, mat: {id: material_find.id, name: material_find.name }, kol: 1}])
								this.checkedJsonList({...res, materialList: parse_str})
								mat_true = false
							}
							else this.checkedJsonList(res)
						}
					}) 
				}
			}
		},
		pushElement(elements, list_pars, type) {
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
						kol = item.kol
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
						this.list_cbed_detal.push({
							type,
							obj: {id: element.id, name: element.name},
							kol
						})
					} else check = true
				}
						
			}
		},
		parserListIzd(res, kol) {
				let cbeds = res.listCbed ? JSON.parse(res.listCbed) : []
				let detals = res.listDetal ? JSON.parse(res.listDetal) : []
				if(cbeds.length) {
					for(let inx in cbeds) {
						cbeds[inx] = cbeds[inx].cb
					}
				}
				if(detals.length) {
					for(let inx in detals) {
						detals[inx] = detals[inx].det
					}
				}
				for(let i = 0; i < kol; i++) {
					this.checkedJsonList({...res, cbeds})
					this.checkedJsonList({...res, detals})
				}
		},
		responseDetalCb(res) {
			if(res && res.type == 'cbed') 
				this.parserListIzd(res.obj, 1)

			this.list_cbed_detal.push({
				...res, 
				obj: {id: res.obj.id, name: res.obj.name},
				kol: 1
			})
		},
		editKolVo(inx, val) {
			this.list_cbed_detal[inx].kol = val
		},
		deleteCbEdDetal() {
			if(this.select_tr_inx == null) return 0;

			this.list_cbed_detal = this.list_cbed_detal.filter((_, inx) => 
				inx != this.select_tr_inx
			)
			this.select_tr_inx = null
		},
		selectTr(inx, e) {
			if(this.select_tr_inx == inx && this.tr) {
				this.tr.classList.remove('td-row-all')
				return this.select_tr_inx = null
			}
			if(this.tr) 
				this.tr.classList.remove('td-row-all')
			this.tr = e
			this.tr.classList.add('td-row-all')

			this.select_tr_inx = inx
		},
		save_order() {
			if(!this.date_order || !this.date_shipments 
				|| !this.kol || !this.base 
				|| (!this.select_product && !this.is_not_product)) 
				return showMessage('', 'Все поля должны быть заполнены', 'w', this)
			if(!this.buyer && !this.to_sklad) return showMessage('', 'Выберите Покупателя или склад', 'w', this)
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
			} 
			if(this.select_product) {
				data['product'] = {
					id: this.select_product.id,
					name: this.select_product.name
				}
			}
			if(this.baseFormData.get('document') && this.baseFormData.get('docs') ) {
				this.formData.append('document', this.baseFormData.get('document'))
				try {
					let pars = this.baseFormData.get('docs')
					if(pars) this.formData.append('docs', pars)
				} catch(e) {console.error(e)}
			}
			
			if(this.$route.params.edit && this.$route.params.edit == 'true') {
				data['id'] = this.getOneShipments.id
				this.formData.append('data', JSON.stringify(data))
				this.fetchUpdateShipments(this.formData).then( res => {
					this.loader = false
					setTimeout(() => this.$router.push('/issueshipment'), 3000)
					if(res) return showMessage('', 'Заказ успешно обновлен!, Перенаправление на страницу заказов.', 's', this)
					else return showMessage('', 'Произошла ошибка при создании заказа', 'e', this)
				})
			} else {
				this.formData.append('data', JSON.stringify(data))
				this.fetchCreateShipments(this.formData).then(res => {
					this.loader = false
					setTimeout(() => this.$router.push('/issueshipment'), 3000)
					if(res) return showMessage('', 'Заказ успешно создан!, Перенаправление на страницу заказов.', 's', this)
					else return showMessage('', 'Произошла ошибка при создании заказа', 'e', this)
				})
			}
		},
		editVariable() {
			this.date_order = this.getOneShipments.date_order
			this.date_shipments = this.getOneShipments.date_shipments
			this.kol = this.getOneShipments.kol
			this.bron = this.getOneShipments.bron
			this.base = this.getOneShipments.base
			this.buyer = this.getOneShipments.id
			this.to_sklad = this.getOneShipments.to_sklad
			this.is_not_product = this.getOneShipments.is_not_product
			if(this.getOneShipments.product) {
				this.getAllProductByIdLight(this.getOneShipments.product.id)
				.then(res => this.select_product = res)
			}
			if(this.getOneShipments.documents) this.documents = this.getOneShipments.documents
			try {
				if(this.getOneShipments.list_cbed_detal)
					this.list_cbed_detal = JSON.parse(this.getOneShipments.list_cbed_detal)
			} catch(e) {console.error(e)}
			this.description = this.getOneShipments.description
		}
	},
	async mounted() {
		this.fetchAllBuyers()

		if(this.$route.params.edit && this.$route.params.edit == 'true') {
			if(isEmpty(this.getOneShipments)) return this.$router.push('/issueshipment')
			this.editVariable()
		}
		

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
</style>