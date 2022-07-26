<template>
<div class="right-menu-modal">
  <div :class='destroyModalLeft' @click="destroyModalF()"></div>
  <div :class='destroyModalRight'>
    <div :style="hiddens" >
			<h3>Информация об Отгрузке</h3>
			<div class="block head_block">
        <p>
          <span style='display: flex; align-items: center; float: left;'>
            <span>Дата фактический отгрузки: </span>
            <DatePicterCustom
              :dateStart='date_shipments_fakt'
            />
          </span>
          <span>№ Отгрузки: </span>
          <input type="text" v-model='number_complit'>
          <span>Транспортная компания: </span>
          <input type="text" v-model='transport'>
        </p>
      </div>

      <div class="flex_direction">
        <div>
          <h3>Примечание</h3>
          <textarea maxlength='250' v-model='description'></textarea>
        </div>

        <div class="wh_50p">
          <h3>Файлы</h3>
          <TableDocument 
            v-if='documentsData.length' 
            :title='""' 
            :key='table_document_key'
            :documents='documentsData' />
        </div>
      </div>

      <div class='file_div'>
        <FileLoader 
          :typeGetFile='"getfile"'
          @unmount='file_unmount'
        />
      </div>

      <div>
        <h3>Информация об отгруженном товаре</h3>
        <div class="table-scroll">
          <table>
            <tr>
              <th>№ Заказа/подзаказа</th>
              <th>Артикул заказа/подзаказа</th>
              <th>Наименование заказа/подзаказа</th>
              <th>Наименование изделия</th>
              <th>Кол-во</th>
              <th>Комплектация</th>
              <th>Заводской номер</th>
              <th>Дата факт. отгрузки</th>
              <th>ФИО сборщика</th>
              <th>ФИО контроль</th>
            </tr>
            <tr v-for='sh of child' :key='sh'>
              <td class="center">{{ sh.number_order }}</td> <!-- № Заказа/подзаказа -->
              <td class="center">{{ sh?.product?.articl }}</td> <!-- Артикул заказа/подзаказа -->
              <td class="center">{{ sh.base }}</td> <!-- Наименование заказа/подзаказа -->
              <td class='center'>{{ sh?.product?.name }}</td> <!-- Наименование изделия -->
              <td class='center'>{{ sh.kol }}</td> <!-- Кол-во -->
              <td class='center' @click='openComplectation(sh.list_cbed_detal)' >
                <img 
                  src="@/assets/img/link.jpg" 
                  class='link_img' 
                  atl='Показать'
                  v-if='sh.list_cbed_detal' />
                <p v-else>Нет комплектации</p>
              </td> <!-- Комплектация -->
              <td class='center'>{{ sh?.product?.fabricNumber }}</td> <!-- Заводской номер -->
              <td class='center'>{{ date_shipments_fakt }}</td> <!-- Дата факт. отгрузки -->
              <td class='center cursor' @click='selectUser("executor")'>
                {{ creater_user ? creater_user?.initial : 'Выбрать' }}
              </td> <!-- ФИО сборщика -->
              <td class='center cursor' @click='selectUser("controller")'>
                {{ responsible_user ? responsible_user?.initial : 'Выбрать' }}
              </td> <!-- ФИО контроль -->
            </tr>
            
          </table>
        </div>
      </div>

      <div>
        <h3>Информация о Заказе</h3>

        <ShipmentsHeader />

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
      </div>


      <div width='300px;' class='flex_direction'>
        <div>
          <h3>Примечание</h3>
          <textarea maxlength='250' v-model='description' disabled></textarea>
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

      <div class="btn-control out-btn-control">
        <button class="btn-status" @click='destroyModalF()'>Отменить</button>
        <button class="btn-status" @click='combackComplit'>Отменить отгрузку</button>
        <button class="btn-status btn-black" @click='fetchUpdate'>Внести изменения в отгрузку</button>
      </div>
    </div>
    <KomplectModal
			v-if='parametrs_komplect'
			:key='komplect_generate_key'
			:parametrs='parametrs_komplect'
      :change_complect='change_complect'
		/>
    <AddFile 
      :parametrs='docFiles' 
      v-if="isChangeFolderFile" 
      @unmount='unmount'
      :typeGetFile='"getfile"'
      :key='keyWhenModalGenerate'
    />
    <OpensFile 
      :parametrs='docFiles' 
      v-if="showModalFiles" 
      :key='keyWhenModalGenerateFileOpen'
    />
    <ModalUsersList 
      v-if='showModalUser'
      :key='keyModalUser'
      :get_one='true'
      @unmount='unmount_user_modal'
    />
    <Loader v-if='loader' />
  </div>
</div>
</template>

<script>
import { random } from 'lodash';
import { showMessage } from '@/js/';
import MixModal from '@/mixins/mixmodal';
import MixShipments from '@/mixins/shipments';
import { mapActions, mapMutations } from 'vuex';
import AddFile from '@/components/FileBase/AddFile';
import OpensFile from '@/components/FileBase/OpenFile';
import DatePicterCustom from '@/components/DatePicter';
import ModalUsersList from '@/components/Users/ModalListUser';
import TableDocument from '@/components/FileBase/TableDocument';
import KomplectModal from '@/components/IssueShipment/KomplectModal';
import ShipmentsHeader from '@/components/IssueShipment/ShipmentsHeader';

export default {
  props: {
    complit: {}
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

      child: [],

      number_complit: '',
      date_shipments: new Date().toLocaleDateString("ru-RU"),
      description: '',
      
      name_check: '',

      responsible_user: '',
      creater_user: '',
      typeOpen: '',

      loader: false,
      transport: '',
      lastFormData: null,
      documentsData: [],
      table_document_key: random(10, 999),
      date_shipments_fakt: new Date().toLocaleDateString("ru-RU"),
    }
  },
  components: { 
    KomplectModal,
    OpensFile,
    AddFile,
    ModalUsersList,
    DatePicterCustom,
    TableDocument,
    ShipmentsHeader
  },
  mixins: [MixModal, MixShipments],
  beforeCreate() {
    this.$options.components.TableShipments = require('@/components/IssueShipment/TableKomplect').default;
  },
  methods: {
    ...mapActions([
      'fetchAllShipmentsById',
      'fetchDocumentsShipments',
      'fetchCreateShUpdate',
      'fetchCombackComplit'
    ]),
    ...mapMutations(['setStatusShipments']),
    unmount_user_modal(data) {
      if (!data) return false;

      if (this.typeOpen == 'executor') this.creater_user = data;
      if (this.typeOpen == 'controller') this.responsible_user = data;
      this.typeOpen = '';
    },
    file_unmount(e) {
      if (!e) return 0;
      this.formData = e.formData;
      this.name_check = '';
      this.lastFormData = this.formData;
      this.table_document_key = random(1, 999);
      for (const fd of this.formData.getAll('document')) {
        this.documentsData.push(fd);
        this.name_check += ` ${fd.name}`;
      }
    },
    async update() { 
      this.date_shipments = this.complit.date_shipments;
      this.date_shipments_fakt = this.complit.date_shipments_fakt;
      this.transport = this.complit.transport;
      this.number_complit = this.complit.number_complit

      this.child = this.complit.shipments;

      let find = null;
      for (const item of this.child) {
        if (!item.parent_id) find = item;
      }

      if (find)
        await this.childrenSord(find.id);
      else if (this.child.length) 
        await this.childrenSord(this.child[0].id);

      //this.creater_user = this.complit.creater_user_id;
      //this.responsible_user = this.complit.responsible_user_id;

      this.description = this.complit.description;
      this.documentsData = this.complit.documents;
    },
    async combackComplit() {
      if (!this.complit.id) return showMessage('', 'Нет отгрузки', 'w');
      const result = await this.fetchCombackComplit(this.complit.id);
      if (result) showMessage('', 'Статус Задачи на загрузку изменен.', 's');
      else showMessage('', 'Не удалось поменять статус', 'e');

      return this.destroyModalF();
    },
    openComplectation(komplect) {
			this.komplect_generate_key = random(1, 999);
			this.parametrs_komplect = komplect;
		},
    openFiles() {
      this.keyWhenModalGenerateFileOpen = random(1, 999);
      this.showModalFiles = true;
    },
    selectUser(type) {
      this.typeOpen = type;

      this.showModalUser = true;
      this.keyModalUser = random(1, 999);
    },
    async fetchUpdate() {

      this.formData.append('id', this.complit.id);
      this.formData.append('description', this.description);

      const updateResult = await this.fetchCreateShUpdate(this.formData);
      if (updateResult) showMessage('', 'Обновление произошло успешно ' + this.number_complit, 's');
      else showMessage('', 'Произошла ошибка при Отгрузке!', 'e');

      return this.destroyModalF();
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
    this.loader = true;
    if (!this.complit) return this.destroyModalF();
    await this.update();

    this.loader = false;
  },
}
</script>

<style scoped>
.flex_direction {
	display: flex;
}
.flex_direction>div {
  width: 40%;
  margin: 10px;
}
.head_block * {
  margin: 5px;
}
.head_block>p {
  display: flex;
  align-items: center;
}
.head_block input {
  width: 90px;
}
.file_div>div {
  margin: 0px;
}
table{ 
  width: 100%;
  font-size: 14px;
}
textarea {
  width: 100%;
  height: 140px;
}
.out-btn-control {
  margin-top: 100px;
}
.content-modal-right-menu-hidden {
  animation: width-replace 1s 1 ease;
}
.content-modal-right-menu-hidden>div {
  animation: hidden-content-replace 1s 1 ease;
}
.content-modal-right-menu {
  animation: width 1s 1 ease;
  width: 70vw;
}
.left-block-modal {
  width: 30vw;
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
    width: 1vw;
  }
  to {
    width: 70vw;
  }
}
@keyframes width-right {
  from {
    width: 0vw;
  }
  to {
    width: 30vw;
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
    width: 70vw;
  }
  to {
    width: 00vw;
  }
}
@keyframes width-right-replace {
  from {
    width: 30vw;
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