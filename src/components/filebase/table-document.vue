<template>
	<div v-if='documents && documents.length'>
		<div 
			class='scroll-table' 
			style='width:100%'>
			<h3>{{ title }}</h3>
			<table style="width: 100%;">
				<tr>
					<th>№</th>
					<th>Файл</th>
				</tr>
				<tr class="td-row" 
					v-for='(doc, inx) in sort_documents' 
					:key='doc' 
					@click='e => setDocs(doc, e.target)'
					@dblclick='openDocs(doc)'>
					<td class='center'>{{ inx + 1 }}</td>
					<td>{{ doc.name }}</td>
				</tr>
			</table>
			<OpensFile 
				:parametrs='itemFiles' 
				v-if="showModalFiles" 
				:key='keyWhenModalGenerateFileOpen'
			/>
		</div>
		<div class="btn-control">
			<button class="btn-small" 
				v-if='arhive_documents.length' 
				@click='is_archive_show = !is_archive_show'>
				{{ is_archive_show ? 'Все файлы':'Файлы в архиве' }}</button>
			<button class="btn-small" @click='printOneDoc'>Печать Выборочно</button>
			<button class="btn-small" @click='printAllDoc'>Печать Всего</button>
		</div>
		<InformFolder  
      :title='titleMessage'
      :message = 'message'
      :type = 'type'
      v-if='message'
      :key='keyInformTip'
    />
	</div>
</template>
<script>
import print from 'print-js';
import {random} from 'lodash';
import PATH_TO_SERVER from '@/js/path.js';
import {photoPreloadUrl, showMessage} from '@/js';
import OpensFile from '@/components/filebase/openfile.vue';
export default {
	props: ['documents', 'title'],
	data() {
		return {
			itemFiles: null,
			showModalFiles: false,
			keyWhenModalGenerateFileOpen: random(1, 999),
			message: '',
      type: '',
      keyInformTip: random(1, 999),

			white_documents: [],
			arhive_documents: [],
			sort_documents: [],
			is_archive_show: false,

			span_select: null
		}
	},
	watch: {
		is_archive_show: function(val) {
			val ? this.sort_documents = this.arhive_documents : 
				this.sort_documents = this.white_documents
		}
	},
	components: {OpensFile},
	methods: {
		setDocs(dc, e) {
			if(this.span_select) this.span_select.classList.remove('td-row-all')
			this.span_select = e
			this.span_select.classList.add('td-row-all')
			this.itemFiles = dc
    },
		openDocs() {
			this.showModalFiles = true
      this.keyWhenModalGenerateFileOpen = random(10, 999)
		},
		printOneDoc() {
			if(!this.itemFiles) return showMessage('', 'Выберите документ', 'w', this)
			photoPreloadUrl({name: this.itemFiles.path}, res => {
				if(!res) return false 
				let type = 'image'
				if(res.type != 'img' && res.typename != 'pdf') return false 
				if(res.typename == 'pdf') type = 'pdf'
				print({
					printable: `${PATH_TO_SERVER}${this.itemFiles.path}`, 
					type: type,
					imageStyle: 'max-height: 95vh; margin-bottom: 10px;'
				})
			}, true)
		},
		printAllDoc() {
			if(!this.white_documents.length) return showMessage('', 'Нет документов', 'w', this)
			let array_img = []
			for(let doc of this.white_documents) {
				photoPreloadUrl({name: doc.path}, res => {
					if(res.type == 'img') array_img.push(`${PATH_TO_SERVER}${doc.path}`)
				}, true)
			}

			if(!array_img.length) return showMessage('', 'Нет объектов для печати', 'w', this)
			print({
				printable: array_img, 
				type: 'image',
				imageStyle: 'max-height: 95vh; margin-bottom: 10px;'
			})
		},
	},
	async mounted() {
		if(!this.$props.documents) return false
		for(let doc of this.$props.documents) {
			if(doc.name.indexOf('_archive_v', 1) !== -1) this.arhive_documents.push(doc)
			else this.white_documents.push(doc)
		}
		this.sort_documents = this.white_documents
	}
}
</script>
