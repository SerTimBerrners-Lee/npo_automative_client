<template>
  <div v-if='shipments'>
    <div class="block head_block">
      <p>
        <span><strong>№ Заказа: </strong> {{ number_order || '-' }} </span>
        <span><strong>Заводской №: </strong> {{ fabric_number || '-' }} </span>
      </p>
      <p>
        <span><strong>Дата заказа: </strong> {{ date_order || '-' }}</span>
        <span><strong>Транспортная компания: </strong> {{ transport || '-' }} </span>
      </p>
      <p style="width: 100%;">
        <span><strong>Дата планируемой отгрузки: </strong> {{ date_shipments || '-' }} </span>
        <span><strong>Дата фактический отгрузки: </strong> {{ date_shipments_fakt || '-' }} </span>
      </p>
      <p style="width: 100%;">
        <span><strong>ФИО сборщика: </strong> {{ creater_user ? creater_user?.initial : 'Не выбран' }} </span>
        <span><strong>ФИО контроль: </strong> {{ responsible_user ? responsible_user?.initial : 'Не выбран' }} </span>
      </p>
    </div>

    <div class="wh_50p">
      <div>
        <h3>Примечание</h3>
        <textarea maxlength='250' v-model='description'></textarea>
      </div>
      <TableDocument 
        v-if='documentsData.length' 
        :title='""' 
        :key='table_document_key'
        :documents='documentsData'/>

        <div style='margin-bottom: 50px;'>
          <h3>Добавить файлы</h3>
          <div style='height: 50px;'>
            <FileLoader 
              :typeGetFile='"getfile"'
              @unmount='file_unmount'
            />
          </div>
        </div>
      <div class="btn-control" style='margin-top: 50px;' v-if='btn_update'>
        <button class="btn-small" @click='updateShComplite'>Внести изменения</button>
      </div>
    </div>
    <KomplectModal
      v-if='parametrs_komplect'
      :key='komplect_generate_key'
      :parametrs='parametrs_komplect'
      :change_complect='change_complect'
    />
    <OpensFile 
      :parametrs='docFiles' 
      v-if="showModalFiles" 
      :key='keyWhenModalGenerateFileOpen'
    />
  </div>
</template>

<script>
import { random } from 'lodash';
import { mapActions } from 'vuex';
import { showMessage } from '@/js/';
import OpensFile from '@/components/FileBase/OpenFile';
import TableDocument from '@/components/FileBase/TableDocument';
import KomplectModal from '@/components/IssueShipment/KomplectModal';

export default {
  props: {
    sh_complit_id: {
      type: Number
    },
    ship: {}
  },
  data() {
    return {
      docFiles: [],
      keyWhenModalGenerate: random(1, 999),
      keyWhenModalGenerateFileOpen: random(1, 999),
      showModalFiles: false,
      isChangeFolderFile: false,
      formData: new FormData(),

      parametrs_komplect: null,
			komplect_generate_key: random(1, 999),
      showModalUser: false, 
      keyModalUser: random(1, 999),

      shipments: null,
      
      date_order: new Date().toLocaleDateString("ru-RU"),
      number_order: '',
      date_shipments: '',
      fabric_number: '',
      description: '',
      
      name_check: '',

      responsible_user: '',
      creater_user: '',
      typeOpen: '',
      btn_update: true,

      date_create: new Date().toLocaleDateString("ru-RU"),
      transport: '',
      childrens: [],
      lastFormData: null,
      documentsData: [],
      table_document_key: random(10, 999),
      date_shipments_fakt: new Date().toLocaleDateString("ru-RU"),
    }
  },
  components: { 
    KomplectModal,
    OpensFile,
    TableDocument
  },
  methods: {
    ...mapActions([
      'fetchShComplitById',
      'fetchDocumentsShipments',
      'fetchCreateShUpdate'
    ]),
    file_unmount(e) { 
      if (!e) return 0;

      this.formData = e.formData;
      for (const item of this.formData.getAll('document')) {
        this.documentsData.push(item)
      } 
      this.table_document_key = random(1, 999);
    },
    update(complite) {
      this.date_order = complite.date_order;
      this.number_order = complite.number_order;
      this.date_shipments = complite.date_shipments;
      this.description = complite.description;
      this.transport = complite.transport;
      this.date_shipments_fakt = complite.date_shipments_fakt;
      this.name_check = complite.name_check;
      this.documentsData = complite.documents;
    },
    openComplectation(komplect) {
			this.komplect_generate_key = random(1, 999);
			this.parametrs_komplect = komplect;
		},
    openFiles() {
      this.keyWhenModalGenerateFileOpen = random(1, 999);
      this.showModalFiles = true;
    },
    async updateShComplite() {
      if (!this.sh_complit_id) return false;
      this.formData.append('id', this.sh_complit_id);
      this.formData.append('description', this.description);

      await this.fetchCreateShUpdate(this.formData);
      showMessage('', 'Отгрузка изменена', 's');
      this.btn_update = false;
    },
    async openDocuments(shipments) {	
			if (!shipments.id) return showMessage('', 'Документов нет', 'w');
			const ships = await this.fetchDocumentsShipments(shipments.id);

			if (ships.documents && ships.documents.length) {
				for (const doc of ships.documents) {
					if (doc.name == shipments.base) {
						this.keyWhenModalGenerateFileOpen = random(1, 999);
						this.itemFiles = [doc];
					}
				}
			} else showMessage('', 'Документов нет', 'w');
    },
  },
  async mounted() {
    try {
      if (!this.sh_complit_id) return false;
      const complite = await this.fetchShComplitById(this.sh_complit_id);
      this.shipments = complite;
      this.update(complite);
    } catch (err) {
      console.error(err);
    }
  },
}
</script>

<style scoped>
.head_block * {
  margin: 5px;
}
.head_block span {
  margin-left: 10px;
}
.head_block p {
  display: flex;
}
table{ 
  width: 100%;
  font-size: 14px;
}
textarea {
  width: 100%;
  height: 140px;
}
</style>
